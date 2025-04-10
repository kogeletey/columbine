import { Contract } from "sevm";

const TronWeb = require('tronweb');
const fs = require('fs');
const path = require('path');

// --- Setup TronWeb instance ---
const tronWeb = new TronWeb({
    fullHost: 'https://api.trongrid.io'
});

// --- Fetch and save bytecode ---
async function extractContractCode(address: string, outputPath: string) {
    try {
        const contractInfo = await tronWeb.trx.getContract(address);

        const bytecode = contractInfo.bytecode;
        if (!bytecode || bytecode === '0x') {
            console.warn(`⚠️ Contract at ${address} has no bytecode (maybe it's not deployed?)`);
            return;
        }

        const contract = new Contract(bytecode);
        const opcodes = contract.opcodes();
        const simplifiedOpcodes = opcodes.map(op => op.format());
        fs.writeFileSync(
            path.resolve('./result/opcode.USDT'),
            simplifiedOpcodes.join('\n'),
            'utf8'
        );


        fs.writeFileSync(path.resolve(outputPath), bytecode, 'utf8');
        console.log('success')
    } catch (err) {
        console.error(`❌ Failed to fetch bytecode for ${address}:`, err);
    }
}

// --- Run ---
(async () => {

    //https://medium.com/@hardikksavaliya/understanding-opcodes-in-solidity-a-deep-dive-into-ethereums-low-level-operations-c2cbb4ab788a
    const contractAddress = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'; // USDT on Tron
    await extractContractCode(contractAddress, './result/USDT.bytecode.txt');
})();
