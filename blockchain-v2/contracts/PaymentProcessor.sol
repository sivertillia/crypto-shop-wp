// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract PaymentProcessor {
    address public owner;
    address payable[] public players;

    event PaymentDone(
        address payer,
        uint orderId,
        uint date
    );

    event FallBackEvent(
        address payer,
        uint date
    );

    event ReceiveEvent(
        address payer,
        uint date
    );



    constructor() public {
        owner = msg.sender;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function pay(uint orderId) public payable {
//        require(msg.value > .01 ether);

        emit PaymentDone(msg.sender, orderId, block.timestamp);
    }

    fallback() external payable {
        // custom function code
        emit FallBackEvent(msg.sender, block.timestamp);
    }

    receive() external payable {
        // custom function code
        emit ReceiveEvent(msg.sender, block.timestamp);
        emit PaymentDone(msg.sender, 2, block.timestamp);
    }
}