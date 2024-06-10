// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IERC20} from "./interfaces/IERC20.sol";
import {ERC20Errors} from "./interfaces/IERC6093.sol";
import {CustomErrors} from "./interfaces/CustomErrors.sol";

interface IJpynOracle {
    function createRequest(string calldata _hashedAccount) external returns (uint256);
    function getRequest(uint256 _id) external returns (GetRequest memory);
    struct GetRequest{
        uint256 id;
        uint256 accountStatus;
        uint256 accountBalance;
    }
}

contract JPYN is IERC20, ERC20Errors, CustomErrors {
    IJpynOracle private _jpynOracle;

    mapping(address account => uint256) private _balances;
    mapping(address account => mapping(address spender => uint256)) private _allowances;
    mapping(address => bool) private _admins;
    mapping(uint256 => address) private _adminIds;

    mapping(uint256 => ProposedTransferFee) private _proposedTransferFees;
    uint256 private _currentProposedTransferFeeId;

    mapping(uint256 => ProposedBlackListAddress) private _proposedBlackListAddress;
    uint256 private _currentProposedBlackListAddressId;

    mapping(uint256 => ProposedRemoveBlackListAddress) private _proposedRemoveBlackListAddress;
    uint256 private _currentProposedRemoveBlackListAddressId;

    mapping(uint256 => ProposedBankBlackList) private _proposedBankBlackList;
    uint256 private _currentProposedBankBlackListId;

    mapping(uint256 => ProposedRemoveBankBlackList) private _proposedRemoveBankBlackList;
    uint256 private _currentProposedRemoveBankBlackListId;

    mapping(uint256 => ProposedAdmin) private _proposedAdmin;
    uint256 private _currentProposedAdminId;

    mapping(uint256 => ProposedRemovedAdmin) private _proposedRemovedAdmin;
    uint256 private _currentProposedRemovedAdminId;

    mapping(address => bool) private _blackListAddresses;
    mapping(string => bool) private _bankBlackList;
    mapping(string => address) private _addressToBank;
    mapping(string => uint256) private _bankAccountBalanceRequestIds;
    mapping(uint256 => string) private _hashedBankAccountIds;

    uint256 private _totalSupply;
    string private _name;
    string private _symbol;
    uint8 private _decimals;

    uint256 private _totalAdminCount;
    uint256 private _minAdminCount;
    uint256 private _minApprovalCount; // majority of totalAdminCount
    uint256 private _currentAdminId;
    uint256 private _currentHashedBankAccountId;

    uint256 private _nextReceiveFeeAddressId;
    
    uint256 private _transferFee; // exp: 1 yen
    uint256 private _proposedTransferFee; // exp: 1 yen

    struct ProposedTransferFee {
        uint256 proposedTransferFee;
        address proposer;
        uint256 approvalCount;
        uint256 rejectCount;
        uint256 status; // 0 = voting, 1 = approved propose, 2 = rejected propose
        mapping(address => bool) voted;
    }

    struct ReturnProposedTransferFee{
        uint256 proposedTransferFee;
        address proposer;
        uint256 approvalCount;
        uint256 rejectCount;
        uint256 status;
    }

    struct ProposedBlackListAddress {
        address proposedBlackListAddress;
        address proposer;
        uint256 approvalCount;
        uint256 rejectCount;
        uint256 status; // 0 = voting, 1 = approved propose, 2 = rejected propose
        mapping(address => bool) voted;
    }

    struct ReturnBlackListAddress{
        address proposedBlackListAddress;
        address proposer;
        uint256 approvalCount;
        uint256 rejectCount;
        uint256 status;
    }

    struct ProposedRemoveBlackListAddress {
        address proposedRemoveBlackListAddress;
        address proposer;
        uint256 approvalCount;
        uint256 rejectCount;
        uint256 status; // 0 = voting, 1 = approved propose, 2 = rejected propose
        mapping(address => bool) voted;
    }

    struct ReturnRemoveBlackListAddress{
        address proposedRemoveBlackListAddress;
        address proposer;
        uint256 approvalCount;
        uint256 rejectCount;
        uint256 status;
    }

    struct ProposedBankBlackList {
        string proposedBankBlackList;
        address proposer;
        uint256 approvalCount;
        uint256 rejectCount;
        uint256 status; // 0 = voting, 1 = approved propose, 2 = rejected propose
        mapping(address => bool) voted;
    }

    struct ReturnBankBlackList{
        string proposedBankBlackList;
        address proposer;
        uint256 approvalCount;
        uint256 rejectCount;
        uint256 status;
    }

    struct ProposedRemoveBankBlackList {
        string proposedRemoveBankBlackList;
        address proposer;
        uint256 approvalCount;
        uint256 rejectCount;
        uint256 status; // 0 = voting, 1 = approved propose, 2 = rejected propose
        mapping(address => bool) voted;
    }

    struct ReturnRemoveBankBlackList {
        string proposedRemoveBankBlackList;
        address proposer;
        uint256 approvalCount;
        uint256 rejectCount;
        uint256 status;
    }

    struct ProposedAdmin {
        address proposedAdmin;
        address proposer;
        uint256 approvalCount;
        uint256 rejectCount;
        uint256 status; // 0 = voting, 1 = approved propose, 2 = rejected propose
        mapping(address => bool) voted;
    }

    struct ReturnProposedAdmin{
        address proposedAdmin;
        address proposer;
        uint256 approvalCount;
        uint256 rejectCount;
        uint256 status;
    }

    struct ProposedRemovedAdmin {
        address proposedRemovedAdmin;
        address proposer;
        uint256 approvalCount;
        uint256 rejectCount;
        uint256 status; // 0 = voting, 1 = approved propose, 2 = rejected propose
        mapping(address => bool) voted;
    }

    struct ReturnProposedRemovedAdmin{
        address proposedRemovedAdmin;
        address proposer;
        uint256 approvalCount;
        uint256 rejectCount;
        uint256 status;
    }

    constructor(
        address admin1,
        address admin2,
        address admin3,
        address _jpynOracleAddress
    ) {
        _name = "JPYN";
        _symbol = "JPYN";
        _decimals = 6;

         _totalAdminCount = 3;
        _minAdminCount = 3;
        _minApprovalCount = 2;
        _currentAdminId = 3;

        _transferFee = 0;
        _proposedTransferFee = 0;

        _admins[admin1] = true;
        _admins[admin2] = true;
        _admins[admin3] = true;
        _adminIds[0] = admin1;
        _adminIds[1] = admin2;
        _adminIds[2] = admin3;

        _nextReceiveFeeAddressId = 0;

        _jpynOracle = IJpynOracle(_jpynOracleAddress);
    }

    modifier onlyAdmin() {
        if (!_admins[_msgSender()]) revert OnlyAdmin();
        _;
    }

    modifier blackListAddress() {
        if (_blackListAddresses[_msgSender()]) revert BlackListAddress();
        _;
    }

    modifier notEnoughAdmins() {
        if (_totalAdminCount < _minAdminCount) revert NotEnoughAdmins();
        _;
    }


    /**
    * @dev Check if the sender is an admin.
    * @param sender The address of the sender to check.
    */
    function isAddmin(address sender) public blackListAddress view returns (bool) {
        return _admins[sender];
    }

    /**
    * @dev Propose a new transfer fee
    * @param _newTransferFee The new transfer fee to propose
    */
    function proposeTransferFee(uint256 _newTransferFee) public onlyAdmin blackListAddress {
        if (_totalAdminCount < _minAdminCount) revert NotEnoughAdmins();
        ProposedTransferFee storage ptf = _proposedTransferFees[_currentProposedTransferFeeId];
        ptf.proposedTransferFee = _newTransferFee;
        ptf.proposer = _msgSender();
        unchecked {
            _currentProposedTransferFeeId++;
        }
    }

    /**
    * @dev Get the current propose transfer fee id
    */
    function getCurrentProposedTransferFeeId() public view blackListAddress returns (uint256) {
        return _currentProposedTransferFeeId;
    }

    /**
    * @dev Get the propose transfer fee by id
    * @param _id The id of the propose transfer fee to get
    */
    function getProposedTransferFee(uint256 _id) public view blackListAddress returns (ReturnProposedTransferFee memory) {
        ProposedTransferFee storage ptf = _proposedTransferFees[_id];
        return ReturnProposedTransferFee(ptf.proposedTransferFee, ptf.proposer, ptf.approvalCount, ptf.rejectCount, ptf.status);
    }

    /**
    * @dev Vote on a proposed transfer fee
    * @param _id The id of the proposed transfer fee to vote on
    * @param _vote The vote to cast. True for approval, false for rejection.
    */
    function voteProposedTransferFee(uint256 _id, bool _vote) public onlyAdmin blackListAddress notEnoughAdmins {
        ProposedTransferFee storage ptf = _proposedTransferFees[_id];
        if (ptf.voted[_msgSender()]) revert AlreadyVotedProposedTransferFee();
        
        if (_vote) {
            unchecked {
                ptf.approvalCount++;
            }
        } else {
            unchecked {
                ptf.rejectCount++;
            }
        }
        ptf.voted[_msgSender()] = true;

        if (ptf.approvalCount >= _minApprovalCount) {
            _transferFee = ptf.proposedTransferFee;
            ptf.status = 1;
        } else if (ptf.rejectCount >= _minApprovalCount) {
            ptf.status = 2;
        }
    }

    /**
    * @dev Check if the sender has voted on a proposed transfer fee
    * @param _id The id of the proposed transfer fee to check
    * @param _sender The address of the sender to check
    */
    function isVoteProposedTransferFee(uint256 _id, address _sender) public view blackListAddress returns (bool) {
        return _proposedTransferFees[_id].voted[_sender];
    }

    /**
    * @dev Propose admin
    * @param _address The new admin to propose
    * @param _type Function type. 0 = add admin, 1 = remove admin
    */
    function proposeAdmin(address _address, uint256 _type) public onlyAdmin blackListAddress notEnoughAdmins {
        if (_type == 0){
            if (_admins[_address]) revert ExistingAdmin();
            ProposedAdmin storage pa = _proposedAdmin[_currentProposedAdminId];
            pa.proposedAdmin = _address;
            pa.proposer = _msgSender();
            unchecked {
                _currentProposedAdminId++;
            }
        } else {
            ProposedRemovedAdmin storage pra = _proposedRemovedAdmin[_currentProposedRemovedAdminId];
            pra.proposedRemovedAdmin = _address;
            pra.proposer = _msgSender();
            unchecked {
                _currentProposedRemovedAdminId++;
            }
        }
    }

    /**
    * @dev Get the current propose admin id
    * @param _type Function type. 0 = add admin, 1 = remove admin
    */
    function getCurrentProposedAdminId(uint256 _type) public view blackListAddress returns (uint256) {
        if (_type == 0) {
            return _currentProposedAdminId;
        } else {
            return _currentProposedRemovedAdminId;
        }
    }

    /**
    * @dev Get the propose admin address by id
    * @param _id The id of the propose admin address to get
    */
    function getProposedAdmin(uint256 _id) public view blackListAddress returns (ReturnProposedAdmin memory) {
        ProposedAdmin storage pa = _proposedAdmin[_id];
        return ReturnProposedAdmin(pa.proposedAdmin, pa.proposer, pa.approvalCount, pa.rejectCount, pa.status);
    }

    /**
    * @dev Get the propose admin by id
    * @param _id The id of the propose admin to get
    */
    function getProposedRemovedAdmin(uint256 _id) public view blackListAddress returns (ReturnProposedRemovedAdmin memory) {
        ProposedRemovedAdmin storage pra = _proposedRemovedAdmin[_id];
        return ReturnProposedRemovedAdmin(pra.proposedRemovedAdmin, pra.proposer, pra.approvalCount, pra.rejectCount, pra.status);
    }

    /**
    * @dev Vote on a proposed admin
    * @param _id The id of the proposed admin to vote on
    * @param _vote The vote to cast. True for approval, false for rejection.
    * @param _type Function type. 0 = add admin, 1 = remove admin
    */
    function voteProposedAdmin(uint256 _id, bool _vote, uint256 _type) public onlyAdmin blackListAddress notEnoughAdmins {
        if (_type == 0) {
            ProposedAdmin storage pa = _proposedAdmin[_id];
            if (pa.voted[_msgSender()]) revert AlreadyVotedProposedAdmin();
            
            if (_vote) {
                unchecked {
                    pa.approvalCount++;
                }
            } else {
                unchecked {
                    pa.rejectCount++;
                }
            }
            pa.voted[_msgSender()] = true;

            if (pa.approvalCount >= _minApprovalCount) {
                _addAdmin(pa.proposedAdmin);
                pa.status = 1;
            } else if (pa.rejectCount >= _minApprovalCount) {
                pa.status = 2;
            }
        } else {
            ProposedRemovedAdmin storage pra = _proposedRemovedAdmin[_id];
            if (pra.voted[_msgSender()]) revert AlreadyVotedProposedRemovedAdmin();
            
            if (_vote) {
                unchecked {
                    pra.approvalCount++;
                }
            } else {
                unchecked {
                    pra.rejectCount++;
                }
            }
            pra.voted[_msgSender()] = true;

            if (pra.approvalCount >= _minApprovalCount) {
                _removeAdmin(pra.proposedRemovedAdmin);
                pra.status = 1;
            } else if (pra.rejectCount >= _minApprovalCount) {
                pra.status = 2;
            }
        }
    }

    /**
    * @dev Check if the sender has voted on a proposed admin
    * @param _id The id of the proposed admin to check
    * @param _sender The address of the sender to check
    * @param _type Function type. 0 = add admin, 1 = remove admin
    */
    function isVoteProposedAdmin(uint256 _id, address _sender, uint256 _type) public view blackListAddress returns (bool) {
        if (_type == 0) {
            return _proposedAdmin[_id].voted[_sender];
        } else {
            return _proposedRemovedAdmin[_id].voted[_sender];
        }
    }

    /**
    * @dev Propose a new black list address
    * @param _blackListAddress The new black list address to propose
    * @param _type Function type. 0 = add black list address, 1 = remove black list address
    */
    function proposeBlackListAddress(address _blackListAddress, uint256 _type) public onlyAdmin blackListAddress notEnoughAdmins {
        if (_type == 0) {
            ProposedBlackListAddress storage pbla = _proposedBlackListAddress[_currentProposedBlackListAddressId];
            pbla.proposedBlackListAddress = _blackListAddress;
            pbla.proposer = _msgSender();
            unchecked {
                _currentProposedBlackListAddressId++;
            }
        } else {
            ProposedRemoveBlackListAddress storage prbla = _proposedRemoveBlackListAddress[_currentProposedRemoveBlackListAddressId];
            prbla.proposedRemoveBlackListAddress = _blackListAddress;
            prbla.proposer = _msgSender();
            unchecked {
                _currentProposedRemoveBlackListAddressId++;
            }
        }
    }

    /**
    * @dev Get the current propose black list address id
    * @param _type Function type. 0 = add black list address, 1 = remove black list address
    */
    function getCurrentBlackListAddressId(uint256 _type) public view blackListAddress returns (uint256) {
        if (_type == 0) {
            return _currentProposedBlackListAddressId;
        } else {
            return _currentProposedRemoveBlackListAddressId;
        }
    }

    /**
    * @dev Get the propose black list address by id
    * @param _id The id of the propose black list address to get
    */
    function getProposedBlackListAddress(uint256 _id) public view blackListAddress returns (ReturnBlackListAddress memory) {
        ProposedBlackListAddress storage pbla = _proposedBlackListAddress[_id];
        return ReturnBlackListAddress(pbla.proposedBlackListAddress, pbla.proposer, pbla.approvalCount, pbla.rejectCount, pbla.status);
    }

    /**
    * @dev Get the propose black list address by id
    * @param _id The id of the propose black list addressto get
    */
    function getProposedRemoveBlackListAddress(uint256 _id) public view blackListAddress returns (ReturnRemoveBlackListAddress memory) {
        ProposedRemoveBlackListAddress storage prbla = _proposedRemoveBlackListAddress[_id];
        return ReturnRemoveBlackListAddress(prbla.proposedRemoveBlackListAddress, prbla.proposer, prbla.approvalCount, prbla.rejectCount, prbla.status);
    }

    /**
    * @dev Vote on a proposed black list address
    * @param _id The id of the proposed black list address to vote on
    * @param _vote The vote to cast. True for approval, false for rejection.
    * @param _type Function type. 0 = add black list address, 1 = remove black list address
    */
    function voteProposedBlackListAddress(uint256 _id, bool _vote, uint256 _type) public onlyAdmin blackListAddress notEnoughAdmins {
        if (_type == 0) {
            ProposedBlackListAddress storage pbla = _proposedBlackListAddress[_id];
            if (pbla.voted[_msgSender()]) revert AlreadyVotedProposedBlackListAddress();
            
            if (_vote) {
                unchecked {
                    pbla.approvalCount++;
                }
            } else {
                unchecked {
                    pbla.rejectCount++;
                }
            }
            pbla.voted[_msgSender()] = true;

            if (pbla.approvalCount >= _minApprovalCount) {
                _blackListAddresses[pbla.proposedBlackListAddress] = true;
                pbla.status = 1;
            } else if (pbla.rejectCount >= _minApprovalCount) {
                pbla.status = 2;
            }
        } else {
            ProposedRemoveBlackListAddress storage prbla = _proposedRemoveBlackListAddress[_id];
            if (prbla.voted[_msgSender()]) revert AlreadyVotedProposedRemoveBlackListAddress();
            
            if (_vote) {
                unchecked {
                    prbla.approvalCount++;
                }
            } else {
                unchecked {
                    prbla.rejectCount++;
                }
            }
            prbla.voted[_msgSender()] = true;

            if (prbla.approvalCount >= _minApprovalCount) {
                _blackListAddresses[prbla.proposedRemoveBlackListAddress] = false;
                prbla.status = 1;
            } else if (prbla.rejectCount >= _minApprovalCount) {
                prbla.status = 2;
            }
        }
    }

    /**
    * @dev Check if the sender has voted on a proposed black list address
    * @param _id The id of the proposed black list address to check
    * @param _sender The address of the sender to check
    * @param _type Function type. 0 = add black list address, 1 = remove black list address
    */
    function isVoteProposedBlackListAddress(uint256 _id, address _sender, uint256 _type) public view blackListAddress returns (bool) {
        if (_type == 0) {
            return _proposedBlackListAddress[_id].voted[_sender];
        } else {
            return _proposedRemoveBlackListAddress[_id].voted[_sender];
        }
    }

    /**
    * @dev Propose a new bank black list
    * @param _pBankBlackList The new bank black list address to propose
    * @param _type Function type. 0 = add bank black list, 1 = remove bank black list
    */
    function proposeBankBlackList(string memory _pBankBlackList, uint256 _type) public onlyAdmin blackListAddress notEnoughAdmins {
        if (_type == 0){
            ProposedBankBlackList storage pbbl = _proposedBankBlackList[_currentProposedBankBlackListId];
            pbbl.proposedBankBlackList = _pBankBlackList;
            pbbl.proposer = _msgSender();
            unchecked {
                _currentProposedBankBlackListId++;
            }
        } else {
            ProposedRemoveBankBlackList storage prbbl = _proposedRemoveBankBlackList[_currentProposedRemoveBankBlackListId];
            prbbl.proposedRemoveBankBlackList = _pBankBlackList;
            prbbl.proposer = _msgSender();
            unchecked {
                _currentProposedRemoveBankBlackListId++;
            }
        }
    }

    /**
    * @dev Get the current propose bank black list id
    * @param _type Function type. 0 = add bank black list, 1 = remove bank black list
    */
    function getCurrentBankBlackListId(uint256 _type) public view blackListAddress returns (uint256) {
        if (_type == 0) {
            return _currentProposedBankBlackListId;
        } else {
            return _currentProposedRemoveBankBlackListId;
        }
    }

    /**
    * @dev Get the propose bank black list by id
    * @param _id The id of the propose bank black list to get
    */
    function getProposedBankBlackList(uint256 _id) public view blackListAddress returns (ReturnBankBlackList memory) {
        ProposedBankBlackList storage pbbl = _proposedBankBlackList[_id];
        return ReturnBankBlackList(pbbl.proposedBankBlackList, pbbl.proposer, pbbl.approvalCount, pbbl.rejectCount, pbbl.status);
    }

    /**
    * @dev Get the propose removed bank black list by id
    * @param _id The id of the propose removed bank black list to get
    */
    function getProposedRemoveBankBlackList(uint256 _id) public view blackListAddress returns (ReturnRemoveBankBlackList memory) {
        ProposedRemoveBankBlackList storage prbbl = _proposedRemoveBankBlackList[_id];
        return ReturnRemoveBankBlackList(prbbl.proposedRemoveBankBlackList, prbbl.proposer, prbbl.approvalCount, prbbl.rejectCount, prbbl.status);
    }

    /**
    * @dev Vote on a proposed bank black list
    * @param _id The id of the proposed bank black list to vote on
    * @param _vote The vote to cast. True for approval, false for rejection.
    * @param _type Function type. 0 = add bank black list, 1 = remove bank black list
    */
    function voteProposedBankBlackList(uint256 _id, bool _vote, uint256 _type) public onlyAdmin blackListAddress notEnoughAdmins {
        if (_type == 0) {
            ProposedBankBlackList storage pbbl = _proposedBankBlackList[_id];
            if (pbbl.voted[_msgSender()]) revert AlreadyVotedProposedBankBlackList();
            
            if (_vote) {
                unchecked {
                    pbbl.approvalCount++;
                }
            } else {
                unchecked {
                    pbbl.rejectCount++;
                }
            }
            pbbl.voted[_msgSender()] = true;

            if (pbbl.approvalCount >= _minApprovalCount) {
                _bankBlackList[pbbl.proposedBankBlackList] = true;
                pbbl.status = 1;
            } else if (pbbl.rejectCount >= _minApprovalCount) {
                pbbl.status = 2;
            }
        } else {
            ProposedRemoveBankBlackList storage prbbl = _proposedRemoveBankBlackList[_id];
            if (prbbl.voted[_msgSender()]) revert AlreadyVotedProposedRemoveBankBlackList();
            
            if (_vote) {
                unchecked {
                    prbbl.approvalCount++;
                }
            } else {
                unchecked {
                    prbbl.rejectCount++;
                }
            }
            prbbl.voted[_msgSender()] = true;

            if (prbbl.approvalCount >= _minApprovalCount) {
                _bankBlackList[prbbl.proposedRemoveBankBlackList] = false;
                prbbl.status = 1;
            } else if (prbbl.rejectCount >= _minApprovalCount) {
                prbbl.status = 2;
            }
        }
    }

    /**
    * @dev Check if the sender has voted on a proposed bank black list
    * @param _id The id of the proposed bank black list to check
    * @param _sender The address of the sender to check
    * @param _type Function type. 0 = add bank black list, 1 = remove bank black list
    */
    function isVoteProposedBankBlackList(uint256 _id, address _sender, uint256 _type) public view blackListAddress returns (bool) {
        if (_type == 0) {
            return _proposedBankBlackList[_id].voted[_sender];
        } else {
            return _proposedRemoveBankBlackList[_id].voted[_sender];
        }
    }

    /**
     * @dev See {IERC20-totalSupply}.
     */
    function totalSupply() public view virtual returns (uint256) {
        return _totalSupply;
    }

    /**
     * @dev See {IERC20-balanceOf}.
     */
    function balanceOf(address account) public view virtual returns (uint256) {
        return _balances[account];
    }

    /**
     * @dev See {IERC20-transfer}.
     *
     * Requirements:
     *
     * - `to` cannot be the zero address.
     * - the caller must have a balance of at least `value`.
     */
    function transfer(address to, uint256 value) public virtual blackListAddress returns (bool) {
        if (_transferFee != 0) {
            _transfer(_msgSender(), _adminIds[_nextReceiveFeeAddressId], _transferFee);
            unchecked {
                _nextReceiveFeeAddressId++;
            }
            if (_nextReceiveFeeAddressId == _currentAdminId) {
                _nextReceiveFeeAddressId = 0;
            }
        }
        address owner = _msgSender();
        _transfer(owner, to, value);
        return true;
    }

    /**
     * @dev See {IERC20-allowance}.
     */
    function allowance(address owner, address spender) public view virtual returns (uint256) {
        return _allowances[owner][spender];
    }

    /**
     * @dev See {IERC20-approve}.
     *
     * NOTE: If `value` is the maximum `uint256`, the allowance is not updated on
     * `transferFrom`. This is semantically equivalent to an infinite approval.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     */
    function approve(address spender, uint256 value) public virtual returns (bool) {
        address owner = _msgSender();
        _approve(owner, spender, value);
        return true;
    }

    /**
     * @dev See {IERC20-transferFrom}.
     *
     * Skips emitting an {Approval} event indicating an allowance update. This is not
     * required by the ERC. See {xref-ERC20-_approve-address-address-uint256-bool-}[_approve].
     *
     * NOTE: Does not update the allowance if the current allowance
     * is the maximum `uint256`.
     *
     * Requirements:
     *
     * - `from` and `to` cannot be the zero address.
     * - `from` must have a balance of at least `value`.
     * - the caller must have allowance for ``from``'s tokens of at least
     * `value`.
     */
    function transferFrom(address from, address to, uint256 value) public virtual returns (bool) {
        if (_transferFee != 0) {
            _transfer(_msgSender(), _adminIds[_nextReceiveFeeAddressId], _transferFee);
            unchecked {
                _nextReceiveFeeAddressId++;
            }
            if (_nextReceiveFeeAddressId == _currentAdminId) {
                _nextReceiveFeeAddressId = 0;
            }
        }
        address spender = _msgSender();
        _spendAllowance(from, spender, value);
        _transfer(from, to, value);
        return true;
    }

    /**
     * @dev Registers a hashed bank account to an address.
     */
    function registerAddressToBank(string memory _hashedBankAccount) public blackListAddress {
        if (_bankBlackList[_hashedBankAccount]) revert BankBlackList();
        if (_addressToBank[_hashedBankAccount] != address(0)) revert AlreadyRegistered();
        _addressToBank[_hashedBankAccount] = _msgSender();
        _hashedBankAccountIds[_currentHashedBankAccountId] = _hashedBankAccount;
        unchecked {
            _currentHashedBankAccountId++;
        }
        uint256 id = _jpynOracle.createRequest(_hashedBankAccount);
        _bankAccountBalanceRequestIds[_hashedBankAccount] = id;
    }

    /**
     * @dev Request the total supply of the bank accounts.
     */
    function requestIsSafeTotalSupply() public blackListAddress {
        for (uint256 i = 0; i < _currentHashedBankAccountId; i++) {
            uint256 id = _jpynOracle.createRequest(_hashedBankAccountIds[i]);
            _bankAccountBalanceRequestIds[_hashedBankAccountIds[i]] = id;
        }
    }

    /**
     * @dev Check if the total supply is safe. false is unsafe, true is safe.
     */
    function isSafeTotalSupply() public blackListAddress returns(bool) {
        uint256 balance = 0;
        for (uint256 i = 0; i < _currentHashedBankAccountId; i++) {
            IJpynOracle.GetRequest memory res = _jpynOracle.getRequest(_bankAccountBalanceRequestIds[_hashedBankAccountIds[i]]);
            balance = balance + res.accountBalance;
        }
        if (balance < _totalSupply) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * @dev Moves a `value` amount of tokens from `from` to `to`.
     *
     * This internal function is equivalent to {transfer}, and can be used to
     * e.g. implement automatic token fees, slashing mechanisms, etc.
     *
     * Emits a {Transfer} event.
     *
     * NOTE: This function is not virtual, {_update} should be overridden instead.
     */
    function _transfer(address from, address to, uint256 value) internal {
        if (from == address(0)) {
            revert ERC20InvalidSender(address(0));
        }
        if (to == address(0)) {
            revert ERC20InvalidReceiver(address(0));
        }
        _update(from, to, value);
    }

    /**
     * @dev Transfers a `value` amount of tokens from `from` to `to`, or alternatively mints (or burns) if `from`
     * (or `to`) is the zero address. All customizations to transfers, mints, and burns should be done by overriding
     * this function.
     *
     * Emits a {Transfer} event.
     */
    function _update(address from, address to, uint256 value) internal virtual {
        if (from == address(0)) {
            _totalSupply += value;
        } else {
            uint256 fromBalance = _balances[from];
            if (fromBalance < value) {
                revert ERC20InsufficientBalance(from, fromBalance, value);
            }
            unchecked {
                _balances[from] = fromBalance - value;
            }
        }

        if (to == address(0)) {
            unchecked {
                _totalSupply -= value;
            }
        } else {
            unchecked {
                _balances[to] += value;
            }
        }

        emit Transfer(from, to, value);
    }

    /**
     * @dev Creates a `value` amount of tokens and assigns them to `account`, by transferring it from address(0).
     * Relies on the `_update` mechanism
     *
     * Emits a {Transfer} event with `from` set to the zero address.
     *
     * NOTE: This function is not virtual, {_update} should be overridden instead.
     */
    function mint(string memory _hashedBankAccount) public {
        if (_bankBlackList[_hashedBankAccount]) revert BankBlackList();
        if (_addressToBank[_hashedBankAccount] == address(0)) revert NotRegistered();
        if (_addressToBank[_hashedBankAccount] != msg.sender) revert NotYourAddress();
        uint256 _id = _bankAccountBalanceRequestIds[_hashedBankAccount];
        IJpynOracle.GetRequest memory res = _jpynOracle.getRequest(_id);
        if (res.accountStatus == 0 || res.accountStatus == 2) revert BankAccountFalse();
        _update(address(0), _addressToBank[_hashedBankAccount], res.accountBalance);
    }

    /**
     * @dev Destroys a `value` amount of tokens from `account`, lowering the total supply.
     * Relies on the `_update` mechanism.
     *
     * Emits a {Transfer} event with `to` set to the zero address.
     *
     * NOTE: This function is not virtual, {_update} should be overridden instead
     */
    function burn(address account, uint256 value) public {
        if (account == address(0)) {
            revert ERC20InvalidSender(address(0));
        }
        _update(account, address(0), value);
    }

    /**
     * @dev Sets `value` as the allowance of `spender` over the `owner` s tokens.
     *
     * This internal function is equivalent to `approve`, and can be used to
     * e.g. set automatic allowances for certain subsystems, etc.
     *
     * Emits an {Approval} event.
     *
     * Requirements:
     *
     * - `owner` cannot be the zero address.
     * - `spender` cannot be the zero address.
     *
     * Overrides to this logic should be done to the variant with an additional `bool emitEvent` argument.
     */
    function _approve(address owner, address spender, uint256 value) internal {
        _approve(owner, spender, value, true);
    }

    /**
     * @dev Variant of {_approve} with an optional flag to enable or disable the {Approval} event.
     *
     * By default (when calling {_approve}) the flag is set to true. On the other hand, approval changes made by
     * `_spendAllowance` during the `transferFrom` operation set the flag to false. This saves gas by not emitting any
     * `Approval` event during `transferFrom` operations.
     *
     * Anyone who wishes to continue emitting `Approval` events on the`transferFrom` operation can force the flag to
     * true using the following override:
     *
     * ```solidity
     * function _approve(address owner, address spender, uint256 value, bool) internal virtual override {
     *     super._approve(owner, spender, value, true);
     * }
     * ```
     *
     * Requirements are the same as {_approve}.
     */
    function _approve(address owner, address spender, uint256 value, bool emitEvent) internal virtual {
        if (owner == address(0)) {
            revert ERC20InvalidApprover(address(0));
        }
        if (spender == address(0)) {
            revert ERC20InvalidSpender(address(0));
        }
        _allowances[owner][spender] = value;
        if (emitEvent) {
            emit Approval(owner, spender, value);
        }
    }

    /**
     * @dev Updates `owner` s allowance for `spender` based on spent `value`.
     *
     * Does not update the allowance value in case of infinite allowance.
     * Revert if not enough allowance is available.
     *
     * Does not emit an {Approval} event.
     */
    function _spendAllowance(address owner, address spender, uint256 value) internal virtual {
        uint256 currentAllowance = allowance(owner, spender);
        if (currentAllowance != type(uint256).max) {
            if (currentAllowance < value) {
                revert ERC20InsufficientAllowance(spender, currentAllowance, value);
            }
            unchecked {
                _approve(owner, spender, currentAllowance - value, false);
            }
        }
    }

    /**
     * @dev Returns the current `msg.sender`.
     */
    function _msgSender() internal view returns (address) {
        return msg.sender;
    }

    /**
    * @dev Add an admin to the list of trusted admins.
    * @param sender The address of the admin to add.
    */
    function _addAdmin(address sender) private onlyAdmin blackListAddress{
        if (_admins[sender]) revert ExistingAdmin();
        _admins[sender] = true;
        _adminIds[_currentAdminId] = sender;
        unchecked {
            _totalAdminCount++;
        }
        unchecked {
            _currentAdminId++;
        }
        unchecked {
            if (_totalAdminCount <= _minAdminCount) {
                _minApprovalCount = 2;
            }else{
                _minApprovalCount = _totalAdminCount / 2 + 1;
            }
        }
    }

    /**
    * @dev Remove an admin from the list of trusted admins.
    * @param sender The address of the admin to remove.
    */
    function _removeAdmin(address sender) private onlyAdmin blackListAddress notEnoughAdmins{
        if (!_admins[sender]) revert NotExistingAdmin();
        _admins[sender] = false;
        unchecked {
            _totalAdminCount--;
        }
        unchecked {
            if (_totalAdminCount < _minAdminCount) {
                _minApprovalCount = 2;
            }else{
                _minApprovalCount = _totalAdminCount / 2 + 1;
            }
        }
    }
}