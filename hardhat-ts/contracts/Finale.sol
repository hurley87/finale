// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';

contract Finale is ERC721, ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private currentTokenId;

    struct Collector {
        uint256 tokenId;
        string name;
        string email;
        string addres;
        string items;
        address collectorAddress;
    }

    Collector[] public collectors;

    mapping(address => bool) public allowlist;
    mapping(address => uint256) private _mintedCounts;
    address public owner;
    uint256 mintPrice = 0.023 ether;

    constructor(address[] memory _addresses) ERC721("Finale NFT", "Finale") {
        owner = msg.sender;
        for (uint256 i = 0; i < _addresses.length; i++) {
            allowlist[_addresses[i]] = true;
        }
    }

    function addToAllowlist(address[] calldata _addresses) external {
        require(msg.sender == owner, "Only owner can add to allowlist");
        for (uint256 i = 0; i < _addresses.length; i++) {
            allowlist[_addresses[i]] = true;
        }
    }

    function removeFromAllowlist(address[] calldata _addresses) external {
        require(msg.sender == owner, "Only owner can remove from allowlist");
        for (uint256 i = 0; i < _addresses.length; i++) {
            allowlist[_addresses[i]] = false;
        }
    }

    function isAllowed(address _address) external view returns (bool) {
        return allowlist[_address];
    }


    function _baseURI() internal view virtual override returns (string memory) {
        return 'https://ipfs.io/ipfs/';
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
    return super.tokenURI(tokenId);
    }

    function mint(address recipient, string memory tokenURI, string memory name, string memory email, string memory shippingAddress, string memory items)
        public
        virtual
        payable
        returns (uint256)
    {
        require(msg.value >= mintPrice, "Not enough ETH sent; check price!"); 
        require(allowlist[msg.sender], "Address not on allowlist");
        require(_mintedCounts[msg.sender] < 1, "Maximum mint per address reached");
        currentTokenId.increment();
        uint256 tokenId = currentTokenId.current();
        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, tokenURI);

        collectors.push(Collector(tokenId, name, email, shippingAddress, items, recipient));
        _mintedCounts[msg.sender]++;

        return tokenId;
    }

    function getTotalSupply() public view returns (uint256) {
        return currentTokenId.current();
    }

    function getCollectors() public view returns (Collector[] memory) {
        return collectors;
    }

    function collectorExistsFromAddress(address _address) public view returns (bool) {
        for (uint256 i = 0; i < collectors.length; i++) {
            if (collectors[i].collectorAddress == _address) {
                return true;
            }
        }
        return false;
    }

    function getCollectorTokenIdFromAddress(address _address) public view returns (uint256) {
        for (uint256 i = 0; i < collectors.length; i++) {
            if (collectors[i].collectorAddress == _address) {
                return collectors[i].tokenId;
            }
        }
        return 0;
    }
}