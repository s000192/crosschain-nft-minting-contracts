// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./NonblockingLzApp.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// for mock purposes only, no limit on minting functionality
contract CrossmintNFT is ERC721, NonblockingLzApp {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor(
        address _lzEndpoint,
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) NonblockingLzApp(_lzEndpoint) {}

    string public baseTokenURI;

    function mint(address to) public {
        uint newItemId = _nextId();
        _safeMint(to, newItemId, "");
    }

    function transfer(address to, uint tokenId) public {
        _safeTransfer(msg.sender, to, tokenId, "");
    }

    function _nonblockingLzReceive(
        uint16, /*_srcChainId*/
        bytes memory, /*_srcAddress*/
        uint64, /*_nonce*/
        bytes memory _payload
    ) internal override {
        // decode the number of pings sent thus far
        address minter = abi.decode(_payload, (address));
        uint newItemId = _nextId();
        _safeMint(minter, newItemId, "");
    }

    function isApprovedOrOwner(address spender, uint tokenId) public view virtual returns (bool) {
        return _isApprovedOrOwner(spender, tokenId);
    }

    function _nextId() internal returns (uint) {
        _tokenIds.increment();
        return _tokenIds.current();
    }
}
