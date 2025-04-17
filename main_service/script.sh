#!/bin/bash

echo "Installing bytecode analyzer..."

bun ./parser/Bytecode.ts

echo "Converting bytecode to opcode..."

type ./result/USDT.bytecode.txt | python -m pyevmasm -d --output ./result/opcode.USDT

echo "Analyzing contract structure..."

bun ./parser/UNION-parseContractStart-functionDispatcher-variableInit-functionBody-modifiers.ts

echo "Analysis completed successfully! todo"

echo "Compile from opcode to solidity"
