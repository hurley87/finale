// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';

contract Finale is ERC721, ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private currentTokenId;

    uint256 mintPrice = 0.025 ether;

    constructor() ERC721("Finale NFT", "Finale") {}

    function _baseURI() internal view virtual override returns (string memory) {
        return 'https://ipfs.io/ipfs/';
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
    return super.tokenURI(tokenId);
    }

    function mint(address recipient, string memory tokenURI)
        public
        virtual
        payable
        returns (uint256)
    {
        require(msg.value >= mintPrice, "Not enough ETH sent; check price!"); 
        currentTokenId.increment();
        uint256 tokenId = currentTokenId.current();
        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, tokenURI);

        return tokenId;
    }
}