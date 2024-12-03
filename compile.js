const path = require('path');
const fs = require('fs');
const solc = require('solc');

// Path to the Solidity contract
const contractPath = path.resolve(__dirname, 'contracts', 'TeaProduct.sol');
const source = fs.readFileSync(contractPath, 'utf8');

// Compile the contract
const input = {
  language: 'Solidity',
  sources: {
    'TeaProduct.sol': {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['abi', 'evm.bytecode.object'],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

// Save ABI and Bytecode
const contract = output.contracts['TeaProduct.sol']['TeaProduct'];
const buildPath = path.resolve(__dirname, 'build');
if (!fs.existsSync(buildPath)) {
  fs.mkdirSync(buildPath);
}
fs.writeFileSync(path.resolve(buildPath, 'TeaProductABI.json'), JSON.stringify(contract.abi, null, 2));
fs.writeFileSync(path.resolve(buildPath, 'TeaProductBytecode.txt'), contract.evm.bytecode.object);

console.log('Contract compiled successfully.');
