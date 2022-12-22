// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
pragma abicoder v2;

import "./NonblockingLzApp.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title A LayerZero example sending a cross chain message from a source chain to a destination chain to increment a counter
contract PaymentGateway is NonblockingLzApp {
    IERC20 public paymentToken;
    uint price;

    constructor(
        address _lzEndpoint,
        IERC20 _paymentToken,
        uint _price
    ) NonblockingLzApp(_lzEndpoint) {
        paymentToken = _paymentToken;
        price = _price;
    }

    function _nonblockingLzReceive(
        uint16,
        bytes memory,
        uint64,
        bytes memory
    ) internal override {}

    function crossmint(uint16 _dstChainId) public payable {
        // TODO: missing checking
        paymentToken.transferFrom(msg.sender, address(this), price);

        // encode the payload with the address of minter
        bytes memory payload = abi.encode(msg.sender);

        _lzSend(_dstChainId, payload, payable(msg.sender), address(0x0), bytes(""), msg.value);
    }
}
