const express = require('express');
const { TronWeb } = require('tronweb');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

const tronWeb = new TronWeb({
  fullHost: 'https://api.trongrid.io',
  headers: { 'TRON-PRO-API-KEY': '04c0491c-961e-45c4-a3af-eedde8416cea' },
  privateKey: '5656eef6ee2b555ef8a961b0d82ae1db188f443cd423bb0f5c9fa4c20079a95d'
});

const contractABIs = {};

function convertToTron(internalTxs) {
  return internalTxs.map(tx => ({
    hash: tx.hash,
    caller_address: tx.caller_address ? tronWeb.address.fromHex(tx.caller_address) : undefined,
    transferTo_address: tx.transferTo_address ? tronWeb.address.fromHex(tx.transferTo_address) : undefined,
    callValueInfo: tx.callValueInfo,
    note: tx.note
  }));
}

function hexToString(hex) {
  if (!hex) return '';
  hex = hex.startsWith('0x') ? hex.slice(2) : hex;
  let str = '';
  for (let i = 0; i < hex.length; i += 2) {
    const byte = parseInt(hex.substr(i, 2), 16);
    if (byte) str += String.fromCharCode(byte);
  }
  return str;
}

async function getContractAbi(address) {
  try {
    const contract = await tronWeb.trx.getContract(address);
    if (!contract.abi || !contract.abi.entrys) return;
    contractABIs[address] = contract.abi.entrys;
  } catch (error) {
    console.error(`Failed to fetch ABI for ${address}:`, error);
  }
}

async function buildCallGraph(internalTransactions) {
  const calls = {};
  const callMap = new Map();
  
  for (const tx of internalTransactions) {
    await getContractAbi(tx.caller_address);
    await getContractAbi(tx.transferTo_address);
    
    const callValue = tx.callValueInfo?.reduce((sum, info) => sum + (parseInt(info.callValue) || 0), 0) || 0;
    
    callMap.set(tx.hash, {
      hash: tx.hash,
      caller: tx.caller_address,
      callee: tx.transferTo_address,
      note: tx.note ? hexToString(tx.note) : '',
      value: callValue,
      children: []
    });
  }
  
  for (const tx of internalTransactions) {
    const currentCall = callMap.get(tx.hash);
    for (const [hash, call] of callMap) {
      if (call.callee === currentCall.caller && hash !== tx.hash) {
        call.children.push(currentCall);
        break;
      }
    }
  }
  
  callMap.forEach((call, hash) => {
    let isRoot = true;
    callMap.forEach(parentCall => {
      if (parentCall.children.includes(call)) isRoot = false;
    });
    if (isRoot) {
      calls[hash] = {
        hash: call.hash,
        caller: call.caller,
        callee: call.callee,
        note: call.note,
        value: call.value,
        children: call.children.map(child => ({
          hash: child.hash,
          caller: child.caller,
          callee: child.callee,
          note: child.note,
          value: child.value,
          children: child.children
        }))
      };
    }
  });
  
  return calls;
}

async function decodeEvent(log) {
  const contractAddress = tronWeb.address.fromHex(log.address);
  const abi = contractABIs[contractAddress];
  
  if (abi) {
    try {
      const eventInterface = abi.find(e => e.type === 'event' && e.signature === log.topics[0]);
      if (eventInterface) {
        return {
          _type: 'abi_decoded',
          event: eventInterface.name,
          ...tronWeb.utils.abi.decodeLog(eventInterface.inputs, log.data, log.topics.slice(1))
        };
      }
    } catch (error) {
      console.error('ABI decoding failed:', error);
    }
  }
  return decodeEventWithoutABI(log);
}

function decodeEventWithoutABI(log) {
  const TRANSFER_SIGNATURE = 'ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
  const SWAP_SIGNATURE = 'd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822';
  const MINT_SIGNATURE = '1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1';

  const toAddress = (hex) => hex?.length >= 40 ? tronWeb.address.fromHex('41' + hex.slice(-40)) : null;
  const toNumber = (hex) => parseInt(hex, 16) || 0;

  if (log.topics[0] === TRANSFER_SIGNATURE && log.topics.length >= 3) {
    return {
      event: 'Transfer',
      from: toAddress(log.topics[1]),
      to: toAddress(log.topics[2]),
      value: toNumber(log.data)
    };
  }

  if (log.topics[0] === SWAP_SIGNATURE && log.topics.length >= 3) {
    return {
      event: 'Swap',
      sender: toAddress(log.topics[1]),
      to: toAddress(log.topics[2]),
      amount0In: toNumber(log.data.slice(0, 66)),
      amount1In: toNumber(log.data.slice(66, 130)),
      amount0Out: toNumber(log.data.slice(130, 194)),
      amount1Out: toNumber(log.data.slice(194, 258))
    };
  }

  if (log.topics[0] === MINT_SIGNATURE && log.data.length >= 130) {
    return {
      event: 'Mint',
      amount0: toNumber(log.data.slice(0, 66)),
      amount1: toNumber(log.data.slice(66, 130))
    };
  }

  return {
    signature: log.topics[0],
    rawTopics: log.topics.slice(1),
    rawData: log.data,
    possibleAddresses: log.topics.slice(1).filter(t => t?.length >= 40).map(toAddress).filter(Boolean)
  };
}

async function analyzeEventLogs(logs) {
  if (!logs?.length) return [];
  
  const results = [];
  for (const log of logs) {
    try {
      const contractAddr = tronWeb.address.fromHex(log.address.startsWith('41') ? log.address : '41' + log.address);
      const decoded = await decodeEvent(log);
      
      const eventData = {
        contract: contractAddr,
        eventType: decoded.event || 'unknown'
      };

      if (decoded._type === 'raw_data') {
        eventData.signature = decoded.signature;
        eventData.rawData = log.data;
        if (decoded.possibleAddresses?.length) eventData.possibleAddresses = decoded.possibleAddresses;
      } else {
        Object.entries(decoded).forEach(([key, value]) => {
          if (!key.startsWith('_') && key !== 'event') eventData[key] = value;
        });
      }
      
      results.push(eventData);
    } catch (error) {
      results.push({ error: `Failed to process event`, details: error.message });
    }
  }
  return results;
}

app.get('/api/analyze-transaction/:txHash', async (req, res) => {
  try {
    const txId = req.params.txHash;
    
    if (!txId || !/^[a-fA-F0-9]{64}$/.test(txId)) {
      return res.status(400).json({ error: 'Invalid transaction hash format' });
    }

    const [txInfo, tx] = await Promise.all([
      tronWeb.trx.getTransactionInfo(txId),
      tronWeb.trx.getTransaction(txId)
    ]);

    const response = {
      transactionHash: txId,
      timestamp: txInfo.blockTimeStamp ? new Date(txInfo.blockTimeStamp).toISOString() : null,
      blockNumber: txInfo.blockNumber,
      result: txInfo.result,
      resultMessage: txInfo.resMessage
    };

    if (!txInfo.internal_transactions) {
      response.analysis = tx.raw_data.contract[0].type === 'TransferAssetContract' ? {
        type: 'TRC10',
        message: 'TRC10 token transfer'
      } : {
        type: 'SIMPLE',
        message: 'No internal transactions',
        possibleTypes: ['TRX transfer', 'Contract creation', 'Simple contract call']
      };
    } else {
      response.analysis = {
        type: 'SMART_CONTRACT',
        mainContract: txInfo.contract_address ? tronWeb.address.fromHex(txInfo.contract_address) : null,
        callHierarchy: await buildCallGraph(convertToTron(txInfo.internal_transactions)),
        eventLogs: await analyzeEventLogs(txInfo.log)
      };
    }

    res.json(response);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Transaction analysis failed',
      details: error.message,
      suggestion: 'Verify the transaction hash exists on the TRON network'
    });
  }
});

async function analyzeEventLogs(logs) {
    if (!logs?.length) return [];
    
    const results = [];
    for (const log of logs) {
      try {
        const contractAddr = tronWeb.address.fromHex(log.address.startsWith('41') ? log.address : '41' + log.address);
        const decoded = await decodeEvent(log);
        
        const formatValue = (val) => {
          if (typeof val === 'number' && val > 1e6) {
            return {
              raw: val,
              formatted: `${val.toExponential()}`,
              trx: tronWeb.fromSun(val)
            };
          }
          return val;
        };
  
        const eventData = {
          contract: contractAddr,
          eventType: decoded.event || 'unknown',
          decoded: true,
          signature: log.topics[0]
        };
  
        if (decoded._type === 'abi_decoded') {
          eventData.name = decoded.event;
          eventData.parameters = {};
          
          Object.entries(decoded).forEach(([key, value]) => {
            if (!key.startsWith('_') && key !== 'event') {
              eventData.parameters[key] = formatValue(value);
            }
          });
        } else {
          eventData.decoded = false;
          eventData.possibleEvent = decoded.event || 'unknown';
          
          if (decoded.signature) {
            eventData.signature = decoded.signature;
          }
          
          if (decoded.rawData) {
            eventData.rawData = decoded.rawData;
          }
          
          if (decoded.possibleAddresses?.length) {
            eventData.possibleAddresses = decoded.possibleAddresses;
          }
          
          Object.entries(decoded).forEach(([key, value]) => {
            if (!['_type', 'signature', 'rawData', 'possibleAddresses'].includes(key)) {
              eventData[key] = formatValue(value);
            }
          });
        }
        
        results.push(eventData);
      } catch (error) {
        results.push({ 
          error: 'Failed to process event',
          details: error.message,
          rawLog: log
        });
      }
    }
    return results;
  }
  
  app.get('/api/analyze-transaction/:txHash', async (req, res) => {
    try {
      const txId = req.params.txHash;
      
      if (!txId || !/^[a-fA-F0-9]{64}$/.test(txId)) {
        return res.status(400).json({ error: 'Invalid transaction hash format' });
      }
  
      const [txInfo, tx] = await Promise.all([
        tronWeb.trx.getTransactionInfo(txId),
        tronWeb.trx.getTransaction(txId)
      ]);
  
      const response = {
        transactionHash: txId,
        timestamp: txInfo.blockTimeStamp ? new Date(txInfo.blockTimeStamp).toISOString() : null,
        blockNumber: txInfo.blockNumber,
        result: txInfo.result,
        resultMessage: txInfo.resMessage,
        fee: txInfo.fee ? tronWeb.fromSun(txInfo.fee) : null,
        contractAddress: txInfo.contract_address ? tronWeb.address.fromHex(txInfo.contract_address) : null
      };
  
      if (!txInfo.internal_transactions) {
        response.analysis = tx.raw_data.contract[0].type === 'TransferAssetContract' ? {
          type: 'TRC10',
          message: 'TRC10 token transfer'
        } : {
          type: 'SIMPLE',
          message: 'No internal transactions',
          possibleTypes: ['TRX transfer', 'Contract creation', 'Simple contract call']
        };
      } else {
        response.analysis = {
          type: 'SMART_CONTRACT',
          mainContract: txInfo.contract_address ? tronWeb.address.fromHex(txInfo.contract_address) : null,
          callHierarchy: await buildCallGraph(convertToTron(txInfo.internal_transactions)),
          eventLogs: await analyzeEventLogs(txInfo.log)
        };
      }
  
      if (txInfo.log?.length) {
        response.eventStatistics = {
          totalEvents: txInfo.log.length,
          eventTypes: txInfo.log.reduce((acc, log) => {
            const eventType = log.topics[0];
            acc[eventType] = (acc[eventType] || 0) + 1;
            return acc;
          }, {}),
          decodedEvents: (await analyzeEventLogs(txInfo.log)).filter(e => e.decoded).length
        };
      }
  
      res.json(response);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ 
        error: 'Transaction analysis failed',
        details: error.message,
        suggestion: 'Verify the transaction hash exists on the TRON network'
      });
    }
  });

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`TRON Analyzer API running at http://localhost:${port}`);
});