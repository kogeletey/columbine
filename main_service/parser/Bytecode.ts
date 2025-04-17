import { Contract } from "sevm";
const TronWeb = require('tronweb');
import fs from "fs";
import path from "path";

const tronWeb = new TronWeb({
    fullHost: "https://api.trongrid.io"
});

async function extractContractCode(address: string, outputPath: string) {
    try {
        const contractInfo = await tronWeb.trx.getContract(address);
        const bytecode = contractInfo.bytecode;
        
        if (!bytecode || bytecode === "0x") {
            console.warn(`⚠️ Contract at ${address} has no bytecode`);
            return;
        }

        const contract = new Contract(bytecode);
        const opcodes = contract.opcodes();
        const simplifiedOpcodes = opcodes.map(op => op.format());
        
        fs.writeFileSync(
            path.resolve("./result/opcode.USDT"),
            simplifiedOpcodes.join("\n"),
            "utf8"
        );

        fs.writeFileSync(path.resolve(outputPath), bytecode, "utf8");
        console.log("success");
    } catch (err) {
        console.error(`❌ Failed to fetch bytecode for ${address}:`, err);
    }
}

(async () => {
    const contractAddress = "TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR";
    await extractContractCode(contractAddress, "./result/USDT.bytecode.txt");
})();