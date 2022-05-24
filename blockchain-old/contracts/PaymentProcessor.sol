// SPDX-License-Identifier: MIT
pragma solidity ^0.6.2;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract PaymentProcessor {
  address public admin; // First Account | Admin account | 0xE833C4107048BCC92C797595BBed3ecB36E2e227
  IERC20 public dai;
  constructor(address adminAddress, address daiAddress) public {
    admin = adminAddress;
    dai = IERC20(daiAddress);
  }
  enum Status {
    Pending,
    Open,
    Close,
    Claimable
  }
  struct Game {
    Status status;
    uint startTime;
    uint endTime;
    uint[] id;
  }

  struct UserSave {
    address payable payer;
    uint amount;
    uint id;
    uint gameId;
    uint date;
  }

  struct UserStruct {
    address payer;
    uint amount;
    uint codePay;
    address index;
  }

  uint[] id;
  address[] AddressUsers;
  UserSave[] userSave;
  uint public currentGameId;
  uint public currentWinId;
  mapping(address => UserStruct) private userStructs;
  mapping(uint => Game) private _games;

  event GameOpen(
    uint indexed gameId,
    uint startTime,
    uint endTime,
    uint[] id
  );


  event GameClose(
    uint indexed gameId,
    uint currentWinId
  );

  event PaymentDone(
    address payer,
    uint amount,
    uint paymentId,
    uint date
  );

  event PaymentTest(
    address payer,
    uint amount,
    uint codePay
  );

  event UsersSend(
    address payer,
    address[] users,
    uint codePay,
    address admim
  );

  function pay(uint amount, uint paymentId) external {
    dai.transferFrom(msg.sender, admin, amount);
    emit PaymentDone(msg.sender, amount, paymentId, block.timestamp);
  }

  function clearContract() external {
    delete userStructs[msg.sender];
    delete AddressUsers;
    currentGameId++;
  }

  function isUser(address addressUser) public returns (bool isIndeed) {
    if (AddressUsers.length == 0) return false;
    if (userStructs[addressUser].index == addressUser) return true;
    return false;
  }

  function startGame(
    uint _endTimeSec
  ) external {
    if (currentGameId > 0) {
      require(_games[currentGameId].status == Status.Close, "Game not close");
    }
    currentGameId++;
    id.push(123456789);
    id.push(987654321);

    _games[currentGameId] = Game({
    status : Status.Open,
    startTime : block.timestamp,
    endTime : _endTimeSec,
    id : id
    });
    emit GameOpen(currentGameId, block.timestamp, _endTimeSec, id);
  }

  function payGame(uint amount, uint idUser) external {
    require(_games[currentGameId].status == Status.Open, "Game not open");
    //    msg.sender.send();
    dai.transferFrom(msg.sender, address(this), amount);
    //    dai.transferFrom(msg.sender, admin, amount);
    userSave.push(UserSave({
    payer : msg.sender,
    amount : amount,
    id : idUser,
    gameId: currentGameId,
    date : block.timestamp
    }));
    emit PaymentDone(msg.sender, amount, idUser, block.timestamp);
  }

  function closeGame() external {
    require(_games[currentGameId].status == Status.Open, "Game not open");
    require(block.timestamp > _games[currentGameId].endTime, "Game not over");

    _games[currentGameId].status = Status.Close;
    currentWinId = 123456789;

    for (uint i = 0; i < userSave.length; i++) {
      if (userSave[i].id == currentWinId && userSave[i].gameId == currentGameId) {
        uint amount10;
        //        dai.approve(admin, userSave[i].amount);
        //        dai.transferFrom(admin, userSave[i].payer, userSave[i].amount);
//        amount10 = userSave[i].amount + (userSave[i].amount/100*10);
        amount10 = userSave[i].amount;
        dai.approve(address(this), amount10);
        dai.transferFrom(address(this), userSave[i].payer, amount10);


        //        address(userSave[i].payer).transfer(userSave[i].amount);
        //        dai.transfer(userSave[i].payer, userSave[i].amount);
        //        admin.transfer(userSave[i].payer, userSave[i].amount);
        //        dai.balanceOf()
        //        userSave[i].payer.transfer(userSave[i].amount);
        //        userSave[i].payer.send(userSave[i].amount);

      }

    }

    emit GameClose(currentGameId, currentWinId);
  }


  function saveUser(uint amount, uint codePay) external {
    if (isUser(msg.sender)) return;
    userStructs[msg.sender].payer = msg.sender;
    userStructs[msg.sender].amount = amount;
    userStructs[msg.sender].codePay = codePay;
    userStructs[msg.sender].index = msg.sender;
    AddressUsers.push(msg.sender);
    //    dai.transferFrom(admin, msg.sender, 100000000000000000000);
    emit PaymentTest(msg.sender, amount, codePay);
  }

  function sendUsers() external {
    emit UsersSend(msg.sender, AddressUsers, userStructs[msg.sender].codePay, admin);
  }
}