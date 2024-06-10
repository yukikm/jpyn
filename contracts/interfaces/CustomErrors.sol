// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface CustomErrors {
    error OnlyAdmin();
    error ExistingAdmin();
    error NotExistingAdmin();
    error NotEnoughAdmins();
    error AlreadyVotedProposedTransferFee();
    error AlreadyVotedProposedBlackListAddress();
    error AlreadyVotedProposedRemoveBlackListAddress();
    error AlreadyVotedProposedBankBlackList();
    error AlreadyVotedProposedRemoveBankBlackList();
    error AlreadyVotedProposedAdmin();
    error AlreadyVotedProposedRemovedAdmin();
    error BlackListAddress();
    error BankBlackList();
    error AlreadyRegistered();
    error NotRegistered();
    error BankAccountFalse();
    error NotYourAddress();
}