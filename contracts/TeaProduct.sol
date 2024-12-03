// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TeaProduct {
    struct Product {
        string batchId;
        string supplierName;
        uint256 timestamp;
    }

    mapping(string => Product) public products;

    // Function to add sensitive data to the blockchain
    function addSensitiveData(
        string memory _batchId,
        string memory _supplierName
    ) public {
        products[_batchId] = Product(_batchId, _supplierName, block.timestamp);
    }

    // Function to retrieve product details
    function getProduct(string memory _batchId)
        public
        view
        returns (string memory, string memory, uint256)
    {
        Product memory product = products[_batchId];
        return (product.batchId, product.supplierName, product.timestamp);
    }
}
