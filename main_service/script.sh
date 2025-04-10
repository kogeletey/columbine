#!/bin/bash

echo "Installing bytecode analyzer..."
npx ts-node ./parser/Bytecode.ts

echo "Converting bytecode to opcode..."

type USDT.bytecode.txt | python -m pyevmasm -d --output opcode.USDT

echo "Analyzing contract structure..."

npx ts-node ./parser/UNION_parseContractStart_functionDispatcher_variableInitialization.ts

echo "Analysis completed successfully! todo"

echo "Compile from opcode to solidity"