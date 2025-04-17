import fs from "fs";

interface FunctionBlock {
    startLine: number;
    endLine: number;
    lines: string[];
    terminator: "RETURN" | "REVERT" | "STOP" | "JUMP" | "INVALID";
    address: string;
}

interface PatternMatch {
    startLine: number;
    endLine: number;
    lines: string[];
}

function findFunctionBlocks(lines: string[], start: number, end: number): FunctionBlock[] {
    const addressRegex = /^([0-9a-fA-F]{8}):/;
    const functions: FunctionBlock[] = [];
    let currentFunction: FunctionBlock | null = null;

    for (let i = start; i < Math.min(end, lines.length); i++) {
        const line = lines[i].trim();
        const addressMatch = line.match(addressRegex);
        const address = addressMatch ? addressMatch[1] : "";
        const instruction = line.replace(addressRegex, "").trim().split(/\s+/)[0];

        if (instruction === "JUMPDEST" && !currentFunction) {
            currentFunction = {
                startLine: i + 1,
                endLine: i + 1,
                lines: [line],
                terminator: "JUMP",
                address: address
            };
            continue;
        }

        if (currentFunction) {
            currentFunction.lines.push(line);
            currentFunction.endLine = i + 1;

            if (["RETURN", "REVERT", "STOP", "INVALID", "JUMP"].includes(instruction)) {
                currentFunction.terminator = instruction as any;
                functions.push(currentFunction);
                currentFunction = null;
            }
        }
    }

    if (currentFunction) {
        functions.push(currentFunction);
    }

    return functions;
}

function findPatterns(fileContent: string, patternType: "MSTORE" | "SSTORE"): PatternMatch[] {
    const lines = fileContent.split("\n");
    const addressRegex = /^[0-9a-fA-F]{8}:/;
    const patterns: PatternMatch[] = [];

    for (let i = 0; i < lines.length - 2; i++) {
        const line1 = lines[i].trim();
        const line2 = lines[i + 1].trim();
        const line3 = lines[i + 2].trim();

        const instruction1 = line1.replace(addressRegex, "").trim().split(/\s+/)[0];
        const instruction2 = line2.replace(addressRegex, "").trim().split(/\s+/)[0];
        const instruction3 = line3.replace(addressRegex, "").trim().split(/\s+/)[0];

        if (instruction1 === "PUSH1" && 
            instruction2 === "PUSH1" && 
            instruction3 === patternType) {
            patterns.push({
                startLine: i + 1,
                endLine: i + 3,
                lines: [line1, line2, line3]
            });
        }
    }
    return patterns;
}

function analyzeAndWriteToFile(inputPath: string, outputPath: string): void {
    try {
        const fileContent = fs.readFileSync(inputPath, "utf-8");
        const allLines = fileContent.split("\n");
        let outputContent = "";
        
        const mstorePatterns: PatternMatch[] = findPatterns(fileContent, "MSTORE");
        outputContent += `Found ${mstorePatterns.length} contract initialization patterns\n\n`;

        const sstorePatterns: PatternMatch[] = findPatterns(fileContent, "SSTORE");
        const seenFunctions = new Set<string>();
        
        for (let i = 0; i < mstorePatterns.length; i++) {
            const currentMStore = mstorePatterns[i];
            const nextMStoreStart = i < mstorePatterns.length - 1 
                ? mstorePatterns[i + 1].startLine - 1 
                : allLines.length;

            outputContent += `=== Contract Initialization at lines ${currentMStore.startLine}-${currentMStore.endLine} ===\n`;
            currentMStore.lines.forEach(line => outputContent += `${line}\n`);
            outputContent += "\n";

            seenFunctions.clear();

            const sstoreInSection: PatternMatch[] = sstorePatterns.filter((p: PatternMatch) => 
                p.startLine >= currentMStore.endLine && 
                p.startLine <= nextMStoreStart
            );
            
            if (sstoreInSection.length > 0) {
                outputContent += "=== Storage Operations in this section ===\n";
                sstoreInSection.forEach((pattern: PatternMatch) => {
                    outputContent += `\nSSTORE operation at lines ${pattern.startLine}-${pattern.endLine}:\n`;
                    pattern.lines.forEach(line => outputContent += `${line}\n`);
                });
                outputContent += "\n";
            }

            const jumpPatterns: PatternMatch[] = findJumpPatternsInSection(
                allLines, 
                currentMStore.endLine - 1,
                nextMStoreStart - 1
            );
            
            if (jumpPatterns.length > 0) {
                outputContent += "=== Function Dispatchers in this section ===\n";
                jumpPatterns.forEach((pattern: PatternMatch) => {
                    outputContent += `\nFunction selector at lines ${pattern.startLine}-${pattern.endLine}:\n`;
                    pattern.lines.forEach(line => outputContent += `${line}\n`);
                    
                    const functions: FunctionBlock[] = findFunctionBlocks(
                        allLines,
                        pattern.endLine - 1,
                        nextMStoreStart - 1
                    );
                    
                    if (functions.length > 0) {
                        outputContent += `\nFound ${functions.length} unique functions after this dispatcher:\n`;
                        functions.forEach((fn: FunctionBlock) => {
                            if (seenFunctions.has(fn.address)) {
                                return;
                            }
                            seenFunctions.add(fn.address);
                            
                            outputContent += `\nFunction at ${fn.address} (lines ${fn.startLine}-${fn.endLine}, ends with ${fn.terminator}):\n`;
                            
                            const modifiers = findModifierPatternsInFunction(fn.lines);
                            
                            fn.lines.forEach((line: string, index: number) => {
                                const modifierStart = modifiers.find(m => m.start === index);
                                if (modifierStart) outputContent += "\n// ----- MODIFIER STARTS -----\n";
                                
                                outputContent += `${line}\n`;
                                
                                const modifierEnd = modifiers.find(m => m.end === index);
                                if (modifierEnd) outputContent += "// ----- MODIFIER ENDS -----\n";
                            });

                            if (fn.lines.some(line => line.includes("CALLVALUE") && line.includes("ISZERO"))) {
                                outputContent += "\n[This function contains value check (payable/non-payable)]\n";
                            }
                            if (fn.lines.some(line => line.includes("CALLDATASIZE") && line.includes("LT"))) {
                                outputContent += "\n[This function contains calldata size check]\n";
                            }
                            
                            outputContent += `\n${"-".repeat(80)}\n`;
                        });
                    }
                });
            } else {
                outputContent += "No function dispatchers found in this section\n";
            }
            
            outputContent += "\n----------------------------------------\n\n";
        }

        fs.writeFileSync(outputPath, outputContent);
        console.log(`Analysis results successfully written to ${outputPath}`);

    } catch (error) {
        console.error("Error analyzing file:", error);
    }
}

function findModifierPatternsInFunction(lines: string[]): {start: number, end: number}[] {
    const addressRegex = /^[0-9a-fA-F]{8}:/;
    const modifiers: {start: number, end: number}[] = [];
    let inModifier = false;
    let modifierStart = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        const instruction = line.replace(addressRegex, "").trim().split(/\s+/)[0];

        if (instruction === "CALLER" && !inModifier) {
            inModifier = true;
            modifierStart = i;
        } else if (instruction === "JUMPI" && inModifier) {
            modifiers.push({start: modifierStart, end: i});
            inModifier = false;
        }
    }

    return modifiers;
}

function findJumpPatternsInSection(lines: string[], start: number, end: number): PatternMatch[] {
    const patterns: PatternMatch[] = [];
    const addressRegex = /^[0-9a-fA-F]{8}:/;
  
    for (let i = start; i < Math.min(end, lines.length - 3); i++) {
        const line1 = lines[i].trim();
        const line2 = lines[i + 1].trim();
        const line3 = lines[i + 2].trim();
        const line4 = lines[i + 3].trim();
  
        const instruction1 = line1.replace(addressRegex, "").trim().split(/\s+/)[0];
        const instruction2 = line2.replace(addressRegex, "").trim().split(/\s+/)[0];
        const instruction3 = line3.replace(addressRegex, "").trim().split(/\s+/)[0];
        const instruction4 = line4.replace(addressRegex, "").trim().split(/\s+/)[0];
  
        if (instruction1 === "PUSH4" && 
            instruction2 === "EQ" && 
            instruction3 === "PUSH2" && 
            instruction4 === "JUMPI") {
            patterns.push({
                startLine: i + 1,
                endLine: i + 4,
                lines: [line1, line2, line3, line4]
            });
        }
    }
    return patterns;
}

analyzeAndWriteToFile(
    "./result/opcode.USDT",
    "./result/union-result"
);