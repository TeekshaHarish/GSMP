// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MyNFT is ERC721 {
    uint256 public tokenId;
    mapping(uint256 => string) public transactionIds;

    constructor() ERC721("MyNFT", "MNFT") {}

    function mint(string memory _transactionId) public returns (uint256) {
        tokenId++;
        _safeMint(msg.sender, tokenId);
        transactionIds[tokenId] = _transactionId;
        return tokenId;
    }
}