import { createReadStream } from 'fs';
import { Readable } from 'stream';

interface PatternMatch {
  startLine: number;
  endLine: number;
  lines: string[];  // Now storing the actual lines
}

function findBytecodePatterns(filePath: string): Promise<PatternMatch[]> {
  return new Promise((resolve, reject) => {
    const matches: PatternMatch[] = [];
    let currentPatternLines: string[] = [];
    let matchStartLine: number | null = null;
    let lineNumber = 0;
    let allLines: string[] = [];  // Store all lines for reference

    const stream = createReadStream(filePath, {
      encoding: 'utf-8',
      highWaterMark: 1024
    });

    stream.on('data', (chunk: string | Buffer) => {
      const chunkStr = typeof chunk === 'string' ? chunk : chunk.toString();
      const lines = chunkStr.split('\n');
      allLines = [...allLines, ...lines];  // Accumulate all lines

      lines.forEach((line: string) => {
        lineNumber++;
        const trimmedLine = line.trim();

        // Check for CALLDATALOAD - start of potential sequence
        if (trimmedLine.includes('CALLDATALOAD')) {
          if (currentPatternLines.length > 0) {
            currentPatternLines = [];
          }
          matchStartLine = lineNumber;
          currentPatternLines.push(line);
        }

        // Check for PUSH4
        if (trimmedLine.includes('PUSH4')) {
          currentPatternLines.push(line);
          
          // Look ahead for EQ
          for (let i = lineNumber; i < allLines.length; i++) {
            if (allLines[i].includes('EQ')) {
              currentPatternLines.push(allLines[i]);
              
              // Look ahead for PUSH2 followed by JUMPI
              for (let j = i + 1; j < allLines.length; j++) {
                if (allLines[j].includes('PUSH2')) {
                  currentPatternLines.push(allLines[j]);
                  
                  if (j + 1 < allLines.length && allLines[j + 1].includes('JUMPI')) {
                    currentPatternLines.push(allLines[j + 1]);
                    
                    matches.push({
                      startLine: matchStartLine!,
                      endLine: j + 1,
                      lines: [...currentPatternLines]
                    });
                    
                    currentPatternLines = [];
                    matchStartLine = null;
                    break;
                  }
                }
              }
              break;
            }
          }
        }
      });
    });

    stream.on('end', () => {
      resolve(matches);
    });

    stream.on('error', (err) => {
      reject(err);
    });
  });
}

// Usage example
async function scanFile(filePath: string) {
  try {
    const matches = await findBytecodePatterns(filePath);
    console.log('Found patterns:');
    
    matches.forEach(match => {
      console.log(`\nPattern found between lines ${match.startLine} and ${match.endLine}:`);
      match.lines.forEach(line => {
        console.log(line);  // Now prints the original line with address and opcode
      });
    });
    
  } catch (error) {
    console.error('Error scanning file:', error);
  }
}

scanFile('./result/opcode.USDT');