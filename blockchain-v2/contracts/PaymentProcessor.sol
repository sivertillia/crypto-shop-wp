// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract PaymentProcessor {
    address public owner;
    address payable[] public players;

    event PaymentDone(
        address payer,
        uint amount,
        uint paymentId,
        uint date
    );

    constructor() public {
        owner = msg.sender;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function pay(uint amount, uint paymentId) public payable {
//        require(msg.value > .01 ether);

        emit PaymentDone(msg.sender, amount, paymentId, block.timestamp);
    }
}