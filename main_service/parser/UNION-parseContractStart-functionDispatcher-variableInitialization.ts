import fs from 'fs';

interface PatternMatch {
  startLine: number;
  endLine: number;
  lines: string[];
}

function findPatterns(fileContent: string, patternType: 'MSTORE' | 'SSTORE'): PatternMatch[] {
  const lines = fileContent.split('\n');
  const addressRegex = /^[0-9a-fA-F]{8}:/;
  const patterns: PatternMatch[] = [];

  for (let i = 0; i < lines.length - 2; i++) {
    const line1 = lines[i].trim();
    const line2 = lines[i + 1].trim();
    const line3 = lines[i + 2].trim();

    const instruction1 = line1.replace(addressRegex, '').trim().split(/\s+/)[0];
    const instruction2 = line2.replace(addressRegex, '').trim().split(/\s+/)[0];
    const instruction3 = line3.replace(addressRegex, '').trim().split(/\s+/)[0];

    if (instruction1 === 'PUSH1' && 
        instruction2 === 'PUSH1' && 
        instruction3 === patternType) {
      patterns.push({
        startLine: i + 1, // 1-based line numbering
        endLine: i + 3,
        lines: [line1, line2, line3]
      });
    }
  }
  return patterns;
}

function findJumpPatternsInSection(lines: string[], start: number, end: number): PatternMatch[] {
  const patterns: PatternMatch[] = [];
  const addressRegex = /^[0-9a-fA-F]{8}:/;

  for (let i = start; i < Math.min(end, lines.length - 3); i++) {
    const line1 = lines[i].trim();
    const line2 = lines[i + 1].trim();
    const line3 = lines[i + 2].trim();
    const line4 = lines[i + 3].trim();

    const instruction1 = line1.replace(addressRegex, '').trim().split(/\s+/)[0];
    const instruction2 = line2.replace(addressRegex, '').trim().split(/\s+/)[0];
    const instruction3 = line3.replace(addressRegex, '').trim().split(/\s+/)[0];
    const instruction4 = line4.replace(addressRegex, '').trim().split(/\s+/)[0];

    if (instruction1 === 'PUSH4' && 
        instruction2 === 'EQ' && 
        instruction3 === 'PUSH2' && 
        instruction4 === 'JUMPI') {
      patterns.push({
        startLine: i + 1,
        endLine: i + 4,
        lines: [line1, line2, line3, line4]
      });
    }
  }
  return patterns;
}

function analyzeAndWriteToFile(inputPath: string, outputPath: string): void {
  try {
    const fileContent = fs.readFileSync(inputPath, 'utf-8');
    const allLines = fileContent.split('\n');
    let outputContent = '';
    
    // Find all PUSH1 PUSH1 MSTORE patterns (contract initializations)
    const mstorePatterns = findPatterns(fileContent, 'MSTORE');
    outputContent += `Found ${mstorePatterns.length} contract initialization patterns\n\n`;

    // Find all PUSH1 PUSH1 SSTORE patterns (storage operations)
    const sstorePatterns = findPatterns(fileContent, 'SSTORE');
    
    for (let i = 0; i < mstorePatterns.length; i++) {
      const currentMStore = mstorePatterns[i];
      const nextMStoreStart = i < mstorePatterns.length - 1 
        ? mstorePatterns[i + 1].startLine - 1 
        : allLines.length;

      outputContent += `=== Contract Initialization at lines ${currentMStore.startLine}-${currentMStore.endLine} ===\n`;
      currentMStore.lines.forEach(line => outputContent += `${line}\n`);
      outputContent += '\n';

      // Find all SSTORE patterns in this section
      const sstoreInSection = sstorePatterns.filter(p => 
        p.startLine >= currentMStore.endLine && 
        p.startLine <= nextMStoreStart
      );
      
      if (sstoreInSection.length > 0) {
        outputContent += '=== Storage Operations in this section ===\n';
        sstoreInSection.forEach(pattern => {
          outputContent += `\nSSTORE operation at lines ${pattern.startLine}-${pattern.endLine}:\n`;
          pattern.lines.forEach(line => outputContent += `${line}\n`);
        });
        outputContent += '\n';
      }

      // Find all JUMPI patterns in this section
      const jumpPatterns = findJumpPatternsInSection(
        allLines, 
        currentMStore.endLine - 1, 
        nextMStoreStart - 1
      );
      
      if (jumpPatterns.length > 0) {
        outputContent += '=== Function Dispatchers in this section ===\n';
        jumpPatterns.forEach(pattern => {
          outputContent += `\nFunction selector at lines ${pattern.startLine}-${pattern.endLine}:\n`;
          pattern.lines.forEach(line => outputContent += `${line}\n`);
        });
      } else {
        outputContent += 'No function dispatchers found in this section\n';
      }
      
      outputContent += '\n----------------------------------------\n\n';
    }

    // Write all results to file
    fs.writeFileSync(outputPath, outputContent);
    console.log(`Analysis results successfully written to ${outputPath}`);

  } catch (error) {
    console.error('Error analyzing file:', error);
  }
}

// Usage
analyzeAndWriteToFile(
  './result/opcode.USDT',
  './result/unionResult'
);