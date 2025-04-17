import fs from 'fs';

interface PatternMatch {
  startLine: number;
  endLine: number;
  lines: string[];
}

function findPush1Patterns(fileContent: string): PatternMatch[] {
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

    if (instruction1 === 'PUSH1' && instruction2 === 'PUSH1' && instruction3 === 'MSTORE') {
      patterns.push({
        startLine: i + 1,
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

    if (instruction1 === 'PUSH4' && instruction2 === 'EQ' && 
        instruction3 === 'PUSH2' && instruction4 === 'JUMPI') {
      patterns.push({
        startLine: i + 1,
        endLine: i + 4,
        lines: [line1, line2, line3, line4]
      });
    }
  }
  return patterns;
}

function analyzeAndWriteResults(inputPath: string, outputPath: string): void {
  try {
    const fileContent = fs.readFileSync(inputPath, 'utf-8');
    const allLines = fileContent.split('\n');
    const push1Patterns = findPush1Patterns(fileContent);
    let outputContent = '';

    outputContent += `Found ${push1Patterns.length} contract initialization patterns\n\n`;
    
    for (let i = 0; i < push1Patterns.length; i++) {
      const currentPattern = push1Patterns[i];
      const nextPatternStart = i < push1Patterns.length - 1 
        ? push1Patterns[i + 1].startLine - 1 
        : allLines.length;

      outputContent += `=== Contract Initialization at lines ${currentPattern.startLine}-${currentPattern.endLine} ===\n`;
      currentPattern.lines.forEach(line => outputContent += `${line}\n`);
      outputContent += '\n';

      // Analyze the section between this pattern and the next one
      const sectionStart = currentPattern.endLine;
      const sectionEnd = nextPatternStart;
      
      outputContent += `=== Function Dispatchers between lines ${sectionStart} and ${sectionEnd} ===\n`;
      
      const jumpPatterns = findJumpPatternsInSection(allLines, sectionStart - 1, sectionEnd - 1);
      
      if (jumpPatterns.length > 0) {
        jumpPatterns.forEach(pattern => {
          outputContent += `\nFunction selector at lines ${pattern.startLine}-${pattern.endLine}:\n`;
          pattern.lines.forEach(line => outputContent += `${line}\n`);
        });
      } else {
        outputContent += 'No function dispatchers found in this section\n';
      }
      
      outputContent += '\n';
    }

    fs.writeFileSync(outputPath, outputContent);
    console.log(`Results successfully written to ${outputPath}`);
  } catch (error) {
    console.error('Error analyzing file:', error);
  }
}

// Usage
analyzeAndWriteResults(
  './result/opcode.USDT',
  './result/unionResult'
);