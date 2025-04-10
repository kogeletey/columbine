import fs from 'fs';

function findPatternInFile(filePath: string): void {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        
        const lines = fileContent.split('\n');
        
        const addressRegex = /^[0-9a-fA-F]{8}:/;
        
        for (let i = 0; i < lines.length - 2; i++) {
            const line1 = lines[i].trim();
            const line2 = lines[i + 1].trim();
            const line3 = lines[i + 2].trim();
            
            // Extract just the instruction part (remove address if present)
            const instruction1 = line1.replace(addressRegex, '').trim().split(/\s+/)[0];
            const instruction2 = line2.replace(addressRegex, '').trim().split(/\s+/)[0];
            const instruction3 = line3.replace(addressRegex, '').trim().split(/\s+/)[0];
            
            // Check if the pattern matches
            if (instruction1 === 'PUSH1' && instruction2 === 'PUSH1' && instruction3 === 'MSTORE') {
                // Get the addresses if they exist
                const address1 = line1.match(addressRegex)?.[0] || 'unknown';
                const address2 = line2.match(addressRegex)?.[0] || 'unknown';
                const address3 = line3.match(addressRegex)?.[0] || 'unknown';
                
                console.log(`Found pattern at:`);
                console.log(`${address1} ${line1.replace(addressRegex, '').trim()}`);
                console.log(`${address2} ${line2.replace(addressRegex, '').trim()}`);
                console.log(`${address3} ${line3.replace(addressRegex, '').trim()}`);
                console.log('---');
            }

            
        }
    } catch (error) {
        console.error('Error reading file:', error);
    }
}

//parser.test
findPatternInFile('./result/opcode.USDT');