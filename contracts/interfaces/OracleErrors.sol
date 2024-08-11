// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface OracleErrors {
    error OnlyAdmin(address sender);
    error OnlyOracle(address sender);
    error ExistingOracle(address sender);
    error ExistingAdmin(address sender);
    error NotExistingOrracle(address sender);
    error NotExistingAdmin(address sender);
    error NotEnoughAdmins(uint256 totalAdminCount, uint256 minAdminCount, address sender);
    error NotEnoughOracles(uint256 totalOracleCount, uint256 minOracleCount, address sender);
}