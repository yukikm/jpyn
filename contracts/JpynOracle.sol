// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {OracleErrors} from "./interfaces/OracleErrors.sol";

contract JpynOracle is OracleErrors{
  mapping(uint256 => Request) private _requests;
  mapping(address => bool) private _oracles;
  mapping(uint256 => address) private _oracleIds;
  uint256 private _currentRequestId; 
  uint256 private _currentOracleId;
  uint256 private _minQuorum; 
  uint256 private _totalOracleCount;
  uint256 private _minOracleCount;

  constructor() {
    _currentRequestId = 0;
    _currentOracleId = 0;
    _minQuorum = 0;
    _totalOracleCount = 0;
    _minOracleCount = 3;
  }

  modifier onlyOracle() {
    if (!_oracles[_msgSender()]) revert OnlyOracle(_msgSender());
    _;
  }

  struct Request {
    string hashedAccount;              
    uint256 agreedAccountStatus;
    uint256 agreedAccountBalance;        
    mapping(uint256 => uint256) accountStatusAnswers; // 0 = undefined 1 = status true, 2 = status false   
    mapping(uint256 => uint256) accountBalanceAnswers;    
    mapping(address => uint256) quorum;    //oracles which will query the answer (1=oracle hasn't voted, 2=oracle has voted)
  }

  struct GetRequest{
    uint256 id;
    uint256 accountStatus;
    uint256 accountBalance;
  }

  event NewRequest (
    uint256 id,
    string hashedAccount
  );

  event UpdatedRequest (
    uint256 id,
    string hashedAccount,
    uint256 agreedAccountStatus,
    uint256 agreedAccountBalance
  );

  /**
  * @dev Add an oracle to the list of trusted oracles.
  * @param sender The address of the oracle to add.
  */
  function addOracle(address sender) public {
    if (_oracles[sender]) revert ExistingOracle(sender);
    _oracles[sender] = true;
    _oracleIds[_currentOracleId] = sender;
    _addOracleId();
    _addTotalOracleCount(); 
    _calcurateMinQuorum();
  }

  /**
  * @dev Remove an oracle from the list of trusted oracles.
  * @param sender The address of the oracle to remove.
  */
  function removeOracle(address sender) public {
    if (_totalOracleCount<=_minOracleCount) revert NotEnoughOracles(_totalOracleCount, _minOracleCount, sender);
    if (!_oracles[sender]) revert NotExistingOrracle(sender);
    _oracles[sender] = false;
    _minusTotalOracleCount();
    _calcurateMinQuorum();
  }

  /**
  * @dev Add an oracle id to the list of trusted oracles.
  */
  function _addOracleId () private {
    unchecked {
      _currentOracleId++;
    }
  }

  /**
  * @dev Calculate the minimum quorum required for a request to be considered valid.
  */
  function _calcurateMinQuorum () private {
    unchecked {
      _minQuorum = (_totalOracleCount / 2) + 1;
    }
  }

  /**
  * @dev Add total oracle count.
  */
  function _addTotalOracleCount () private {
    unchecked {
      _totalOracleCount++;
    }
  }

  /**
  * @dev Subtract total oracle count.
  */
  function _minusTotalOracleCount () private {
    unchecked {
      _totalOracleCount--;
    }
  }

  /**
  * @dev Add current request id.
  */
  function _addCurrentRequestId () private{
    unchecked {
      _currentRequestId++;
    }
  }

  /**
  * @dev Get request by id.
  * @param _id The id of the request to get.
  */
  function getRequest(uint256 _id) public view returns (GetRequest memory) {
    Request storage req = _requests[_id];
    uint256 accountStatus = req.agreedAccountStatus;
    uint256 accountBalance = req.agreedAccountBalance;
    return GetRequest({
      id: _id,
      accountStatus: accountStatus,
      accountBalance: accountBalance
    });
  }

  /**
  * @dev Check if an address is an oracle.
  * @param _sender The address to check.
  */
  function isOracle(address _sender) public view returns (bool) {
    return _oracles[_sender];
  }

  /**
  * @dev Get the minimum quorum required for a request to be considered valid.
  */
  function getMinQuorum() public view returns (uint256) {
    return _minQuorum;
  }

  /**
  * @dev Get the total oracle count.
  */
  function getTotalOracleCount() public view returns (uint256) {
    return _totalOracleCount;
  }

  /**
  * @dev Get the current request id.
  */
  function getCurrentRequestId() public view returns (uint256) {
    return _currentRequestId;
  }

  /**
  * @dev Get the current oracle id.
  */
  function getCurrentOracleId() public view returns (uint256) {
    return _currentOracleId;
  }

  /**
  * @dev Create a request to be voted on by oracles.
  * @param _hashedAccount The hashed account to be voted on.
  */
  function createRequest (
    string memory _hashedAccount
  )
  public returns (uint256)
  {
    if (_totalOracleCount < _minOracleCount) revert NotEnoughOracles(_totalOracleCount, _minOracleCount, _msgSender());
    Request storage r = _requests[_currentRequestId];
    r.hashedAccount = _hashedAccount;
    r.agreedAccountStatus = 0;
    r.agreedAccountBalance = 0;

    for (uint256 i = 0; i < _currentOracleId; i++) {
      if (_oracles[_oracleIds[i]]) {
        r.quorum[_oracleIds[i]] = 1;
      }
    }
    
    // launch an event to be detected by oracle outside of blockchain
    emit NewRequest (
      _currentRequestId,
      _hashedAccount
    );

    _addCurrentRequestId();
    return _currentRequestId - 1;
  }

  /**
  * @dev Update a request with the answer provided by an oracle.
  * @param _id The id of the request to update.
  * @param _valueAccountStatus The value of the account status.
  * @param _valueAccountBalance The value of the account balance.
  */
  function updateRequest (
    uint256 _id,
    uint256 _valueAccountStatus,
    uint256 _valueAccountBalance
  ) public onlyOracle{

    Request storage currRequest = _requests[_id];

    //check if oracle is in the list of trusted oracles
    //and if the oracle hasn't voted yet
    if(currRequest.quorum[address(_msgSender())] == 1){

      //marking that this address has voted
      currRequest.quorum[_msgSender()] = 2;

      //iterate through "array" of answers until a position if free and save the retrieved value
      uint256 tmpI = 0;
      bool found = false;
      while(!found) {
        //find first empty slot
        if(currRequest.accountStatusAnswers[tmpI] == 0 && currRequest.accountBalanceAnswers[tmpI] == 0){
          found = true;
          currRequest.accountStatusAnswers[tmpI] = _valueAccountStatus;
          currRequest.accountBalanceAnswers[tmpI] = _valueAccountBalance;
        }
        tmpI++;
      }

      uint256 currentQuorum = 0;

      //iterate through oracle list and check if enough oracles(minimum quorum)
      //have voted the same answer has the current one
      for(uint256 i = 0; i < _totalOracleCount; i++){
        if(currRequest.accountStatusAnswers[i] == _valueAccountStatus && currRequest.accountBalanceAnswers[i] == _valueAccountBalance){
          currentQuorum++;
          if(currentQuorum >= _minQuorum){
            currRequest.agreedAccountStatus = _valueAccountStatus;
            currRequest.agreedAccountBalance = _valueAccountBalance;
            emit UpdatedRequest (
              _currentRequestId,
              currRequest.hashedAccount,
              currRequest.agreedAccountStatus,
              currRequest.agreedAccountBalance
            );
          }
        }
      }
    }
  }

  /**
    * @dev Returns the current `_msgSender()`.
    */
  function _msgSender() internal view returns (address) {
      return msg.sender;
  }
}