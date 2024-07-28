// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Imprint is ERC1155, Ownable, ERC1155Burnable {
    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => string) private _encryptionKeys;

    constructor()
        ERC1155("ipfs://QmNzZ29BEKykCQoXXXFeb6w2UwmDyQv9GTJBZTjUbJ4gsS/{id}.json")
        Ownable(msg.sender)
    {
        //transferOwnership(initialOwner);
        _mint(msg.sender, 1, 15, "");
        _mint(msg.sender, 2, 10, "");
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function contractURI() public pure returns (string memory) {
        return "ipfs://QmNzZ29BEKykCQoXXXFeb6w2UwmDyQv9GTJBZTjUbJ4gsS/metadata.json";
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return _tokenURIs[tokenId];
    }

    function mint(address account, uint256 id, uint256 amount, bytes memory data) public onlyOwner {
        _mint(account, id, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) public onlyOwner {
        _mintBatch(to, ids, amounts, data);
    }

    function setTokenURI(uint256 tokenId, string memory tokenURI) public onlyOwner {
        _tokenURIs[tokenId] = tokenURI;
    }

    function setEncryptionKey(uint256 tokenId, string memory key) public onlyOwner {
        _encryptionKeys[tokenId] = key;
    }

    function getEncryptionKey(uint256 tokenId, address user) public view returns (string memory) {
        require(balanceOf(user, tokenId) > 0, "You do not own the required token");
        return _encryptionKeys[tokenId];
    }

    function _update(address from, address to, uint256[] memory ids, uint256[] memory values) internal virtual override {
        super._update(from, to, ids, values);
        require(msg.sender == owner() || to == address(0), "Token cannot be transferred, only burned");
    }
}