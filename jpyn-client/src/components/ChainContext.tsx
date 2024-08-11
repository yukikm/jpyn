"use client";
import { useState, createContext } from "react";
import type React from "react";
import { ethers } from "ethers";
import type { Signer, Contract } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";
import JpynOracle from "../../artifacts/contracts/JpynOracle.sol/JpynOracle.json";
import JPYN from "../../artifacts/contracts/JPYN.sol/JPYN.json";
import * as dotenv from "dotenv";
import { get } from "http";
import { stat } from "fs";
dotenv.config();

declare global {
  interface Window {
    ethereum: any;
  }
}

type Chain = any;
export const ChainContext = createContext<Chain>({});

type ChainContextProviderProps = { children: React.ReactNode };

const JPYN_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_JPYN_CONTRACT_ADDRESS;
const ORACLE_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_ORACLE_CONTRACT_ADDRESS;

export const ChainContextProvider = ({
  children,
}: ChainContextProviderProps) => {
  const [currentAccount, setCurrentAccount] = useState<string>();
  const [signer, setSigner] = useState<Signer>();
  const [admin, setAdmin] = useState<boolean>(false);
  const [oracle, setOracle] = useState<boolean>(false);
  const [transferFee, setTransferFee] = useState<number>(0);
  const [gTotalSupply, setGTotalSupply] = useState<number>(0);
  const [isJpynSafe, setIsJpynSafe] = useState({
    isSafe: true,
    timestamp: new Date(),
    status: 0,
  });
  async function connectWallet() {
    const provider = await detectEthereumProvider({ silent: true });
    if (provider) {
      const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
      window.ethereum.enable();
      const signer = ethersProvider.getSigner();
      setSigner(signer);
      await signer.signMessage("Hello");
      const _walletAddress = await signer.getAddress();

      setCurrentAccount(_walletAddress);
      // signer
      const isAdmin = await _isAdmin(signer, _walletAddress);
      setAdmin(isAdmin);
      const isOracle = await _isOracle(signer, _walletAddress);
      setOracle(isOracle);
      const transferFee = await _getTransferFee(signer);
      setTransferFee(transferFee);
      const totalSupply = await _getTotalSupply(signer);
      setGTotalSupply(totalSupply);
      const isJpynSafe = await isSafeEvent(signer);
      setIsJpynSafe(isJpynSafe);
      provider.on("accountsChanged", () => {
        window.location.reload();
      });
    } else {
      alert("Please install Metamask Wallet");
    }
  }

  async function isSafeEvent(signer: any) {
    const contract = new ethers.Contract(
      JPYN_CONTRACT_ADDRESS!,
      JPYN.abi,
      signer!
    );
    const filter = contract.filters.isSafe();
    const events = await contract.queryFilter(filter);
    // return events[events.length - 1].args?.isSafe;
    if (events.length > 0) {
      const latestEvent = events[events.length - 1];
      const blockNumber = latestEvent.blockNumber;
      const block = await signer.provider.getBlock(blockNumber);
      const eventTimestamp = block.timestamp;

      // タイムスタンプをDateオブジェクトに変換
      const eventDate = new Date(eventTimestamp * 1000);

      return {
        isSafe: latestEvent.args?.isSafe,
        timestamp: eventDate,
        status: 1,
      };
    } else {
      return {
        isSafe: true,
        timestamp: new Date(),
        status: 0,
      };
    }
  }

  async function _addOracle(signer: any, address: string) {
    const contract = new ethers.Contract(
      ORACLE_CONTRACT_ADDRESS!,
      JpynOracle.abi,
      signer!
    );
    await contract.addOracle(address);
  }

  async function addOracle(signer: any, address: string) {
    await _addOracle(signer, address);
  }

  async function _removeOracle(signer: any, address: string) {
    const contract = new ethers.Contract(
      ORACLE_CONTRACT_ADDRESS!,
      JpynOracle.abi,
      signer!
    );
    await contract.removeOracle(address);
  }

  async function removeOracle(signer: any, address: string) {
    await _removeOracle(signer, address);
  }

  async function _isOracle(signer: any, address: string): Promise<boolean> {
    const contract = new ethers.Contract(
      ORACLE_CONTRACT_ADDRESS!,
      JpynOracle.abi,
      signer!
    );
    const res = await contract.isOracle(address);
    return res;
  }

  async function isOracle(signer: any, address: string): Promise<boolean> {
    const res = await _isOracle(signer, address);
    return res;
  }

  async function _getminOracleQuorum(signer: any): Promise<number> {
    const contract = new ethers.Contract(
      ORACLE_CONTRACT_ADDRESS!,
      JpynOracle.abi,
      signer!
    );
    const res = Number(await contract.getMinQuorum());
    return res;
  }

  async function getminOracleQuorum(signer: any): Promise<number> {
    const res = await _getminOracleQuorum(signer);
    return res;
  }

  async function _getTotalOracleCount(signer: any): Promise<number> {
    const contract = new ethers.Contract(
      ORACLE_CONTRACT_ADDRESS!,
      JpynOracle.abi,
      signer!
    );
    const res = Number(await contract.getTotalOracleCount());
    return res;
  }

  async function getTotalOracleCount(signer: any): Promise<number> {
    const res = await _getTotalOracleCount(signer);
    return res;
  }
  // --------------------------------------------------------- JPYN
  async function _getTotalVoters(signer: any): Promise<number> {
    const contract = new ethers.Contract(
      JPYN_CONTRACT_ADDRESS!,
      JPYN.abi,
      signer!
    );
    const res = Number(await contract.getTotalVoters());
    return res;
  }

  async function getTotalVoters(signer: any): Promise<number> {
    const res = await _getTotalVoters(signer);
    return res;
  }

  async function _getMinApproval(signer: any): Promise<number> {
    const contract = new ethers.Contract(
      JPYN_CONTRACT_ADDRESS!,
      JPYN.abi,
      signer!
    );
    const res = Number(await contract.getMinApproval());
    return res;
  }

  async function getMinApproval(signer: any): Promise<number> {
    const res = await _getMinApproval(signer);
    return res;
  }

  async function _getTransferFee(signer: any): Promise<number> {
    const contract = new ethers.Contract(
      JPYN_CONTRACT_ADDRESS!,
      JPYN.abi,
      signer!
    );
    const res = await contract.getTransferFee();
    return res;
  }

  async function getTransferFee(signer: any): Promise<number> {
    const res = await _getTransferFee(signer);
    return res;
  }

  async function _getTotalSupply(signer: any): Promise<number> {
    const contract = new ethers.Contract(
      JPYN_CONTRACT_ADDRESS!,
      JPYN.abi,
      signer!
    );
    const res = await contract.totalSupply();
    return res;
  }

  async function getTotalSupply(signer: any): Promise<number> {
    const res = await _getTotalSupply(signer);
    return res;
  }

  async function _isAdmin(signer: any, address: string): Promise<boolean> {
    const contract = new ethers.Contract(
      JPYN_CONTRACT_ADDRESS!,
      JPYN.abi,
      signer!
    );
    const res = await contract.isAdmin(address);
    return res;
  }

  async function isAdmin(signer: any, address: string): Promise<boolean> {
    const res = await _isAdmin(signer, address);
    return res;
  }

  async function _proposeTransferFee(
    signer: any,
    newTransferFee: number
  ): Promise<void> {
    const contract = new ethers.Contract(
      JPYN_CONTRACT_ADDRESS!,
      JPYN.abi,
      signer!
    );
    await contract.proposeTransferFee(newTransferFee);
  }

  async function proposeTransferFee(signer: any, newTransferFee: number) {
    await _proposeTransferFee(signer, newTransferFee);
  }

  async function _getCurrentProposedTransferFeeId(
    signer: any
  ): Promise<number> {
    const contract = new ethers.Contract(
      JPYN_CONTRACT_ADDRESS!,
      JPYN.abi,
      signer!
    );
    const res = await contract.getCurrentProposedTransferFeeId();
    return res;
  }

  async function getCurrentProposedTransferFeeId(signer: any): Promise<number> {
    const res = await _getCurrentProposedTransferFeeId(signer);
    return res;
  }

  async function _getProposedTransferFee(
    signer: any,
    id: number
  ): Promise<{
    transferFee: number;
    proposer: string;
    approvalCount: number;
    rejectCount: number;
    status: number;
  }> {
    const contract = new ethers.Contract(
      JPYN_CONTRACT_ADDRESS!,
      JPYN.abi,
      signer!
    );
    const res = await contract.getProposedTransferFee(id);
    return res;
  }

  async function getProposedTransferFee(
    signer: any,
    id: number
  ): Promise<{
    transferFee: number;
    proposer: string;
    approvalCount: number;
    rejectCount: number;
    status: number;
  }> {
    const res = await _getProposedTransferFee(signer, id);
    return res;
  }

  async function _voteProposedTransferFee(
    signer: any,
    id: number,
    vote: boolean
  ): Promise<void> {
    const contract = new ethers.Contract(
      JPYN_CONTRACT_ADDRESS!,
      JPYN.abi,
      signer!
    );
    await contract.voteProposedTransferFee(id, vote);
  }

  async function voteProposedTransferFee(
    signer: any,
    id: number,
    vote: boolean
  ) {
    await _voteProposedTransferFee(signer, id, vote);
  }

  async function _isVoteProposedTransferFee(
    signer: any,
    id: number,
    address: string
  ): Promise<boolean> {
    const contract = new ethers.Contract(
      JPYN_CONTRACT_ADDRESS!,
      JPYN.abi,
      signer!
    );
    const res = await contract.isVoteProposedTransferFee(id, address);
    return res;
  }

  async function isVoteProposedTransferFee(
    signer: any,
    id: number,
    address: string
  ): Promise<boolean> {
    const res = await _isVoteProposedTransferFee(signer, id, address);
    return res;
  }

  async function _proposeAdmin(signer: any, address: string, type: number) {
    const contract = new ethers.Contract(
      JPYN_CONTRACT_ADDRESS!,
      JPYN.abi,
      signer!
    );
    await contract.proposeAdmin(address, type);
  }

  async function proposeAdmin(signer: any, address: string, type: number) {
    await _proposeAdmin(signer, address, type);
  }

  async function _getCurrentProposedAdminId(
    signer: any,
    type: number
  ): Promise<number> {
    const contract = new ethers.Contract(
      JPYN_CONTRACT_ADDRESS!,
      JPYN.abi,
      signer!
    );
    const res = await contract.getCurrentProposedAdminId(type);
    return res;
  }

  async function getCurrentProposedAdminId(
    signer: any,
    type: number
  ): Promise<number> {
    const res = await _getCurrentProposedAdminId(signer, type);
    return res;
  }

  async function _getProposedAdmin(
    signer: any,
    id: number
  ): Promise<{
    admin: string;
    proposer: string;
    approvalCount: number;
    rejectCount: number;
    status: number;
  }> {
    const contract = new ethers.Contract(
      JPYN_CONTRACT_ADDRESS!,
      JPYN.abi,
      signer!
    );
    const res = await contract.getProposedAdmin(id);
    return res;
  }

  async function getProposedAdmin(
    signer: any,
    id: number
  ): Promise<{
    admin: string;
    proposer: string;
    approvalCount: number;
    rejectCount: number;
    status: number;
  }> {
    const res = await _getProposedAdmin(signer, id);
    return res;
  }

  async function _getProposedRemovedAdmin(
    signer: any,
    id: number
  ): Promise<{
    admin: string;
    proposer: string;
    approvalCount: number;
    rejectCount: number;
    status: number;
  }> {
    const contract = new ethers.Contract(
      JPYN_CONTRACT_ADDRESS!,
      JPYN.abi,
      signer!
    );
    const res = await contract.getProposedRemovedAdmin(id);
    return res;
  }

  async function getProposedRemovedAdmin(
    signer: any,
    id: number
  ): Promise<{
    admin: string;
    proposer: string;
    approvalCount: number;
    rejectCount: number;
    status: number;
  }> {
    const res = await _getProposedRemovedAdmin(signer, id);
    return res;
  }

  async function _voteProposedAdmin(
    signer: any,
    id: number,
    vote: boolean,
    type: number
  ): Promise<void> {
    const contract = new ethers.Contract(
      JPYN_CONTRACT_ADDRESS!,
      JPYN.abi,
      signer!
    );
    await contract.voteProposedAdmin(id, vote, type);
  }

  async function voteProposedAdmin(
    signer: any,
    id: number,
    vote: boolean,
    type: number
  ) {
    await _voteProposedAdmin(signer, id, vote, type);
  }

  async function _isVoteProposedAdmin(
    signer: any,
    id: number,
    address: string,
    type: number
  ): Promise<boolean> {
    const contract = new ethers.Contract(
      JPYN_CONTRACT_ADDRESS!,
      JPYN.abi,
      signer!
    );
    const res = await contract.isVoteProposedAdmin(id, address, type);
    return res;
  }

  async function isVoteProposedAdmin(
    signer: any,
    id: number,
    address: string,
    type: number
  ): Promise<boolean> {
    const res = await _isVoteProposedAdmin(signer, id, address, type);
    return res;
  }

  async function _proposeBlackListAddress(
    signer: any,
    address: string,
    type: number
  ): Promise<void> {
    const contract = new ethers.Contract(
      JPYN_CONTRACT_ADDRESS!,
      JPYN.abi,
      signer!
    );
    await contract.proposeBlackListAddress(address, type);
  }

  async function proposeBlackListAddress(
    signer: any,
    address: string,
    type: number
  ) {
    await _proposeBlackListAddress(signer, address, type);
  }

  async function _getCurrentProposedBlackListAddressId(
    signer: any,
    type: number
  ): Promise<number> {
    const contract = new ethers.Contract(
      JPYN_CONTRACT_ADDRESS!,
      JPYN.abi,
      signer!
    );
    const res = await contract.getCurrentBlackListAddressId(type);
    return res;
  }

  async function getCurrentProposedBlackListAddressId(
    signer: any,
    type: number
  ): Promise<number> {
    const res = await _getCurrentProposedBlackListAddressId(signer, type);
    return res;
  }

  async function _getProposedBlackListAddress(
    signer: any,
    id: number
  ): Promise<{
    address: string;
    proposer: string;
    approvalCount: number;
    rejectCount: number;
    status: number;
  }> {
    const contract = new ethers.Contract(
      JPYN_CONTRACT_ADDRESS!,
      JPYN.abi,
      signer!
    );
    const res = await contract.getProposedBlackListAddress(id);
    return res;
  }

  async function getProposedBlackListAddress(
    signer: any,
    id: number
  ): Promise<{
    address: string;
    proposer: string;
    approvalCount: number;
    rejectCount: number;
    status: number;
  }> {
    const res = await _getProposedBlackListAddress(signer, id);
    return res;
  }

  async function _getProposedRemoveBlackListAddress(
    signer: any,
    id: number
  ): Promise<{
    address: string;
    proposer: string;
    approvalCount: number;
    rejectCount: number;
    status: number;
  }> {
    const contract = new ethers.Contract(
      JPYN_CONTRACT_ADDRESS!,
      JPYN.abi,
      signer!
    );
    const res = await contract.getProposedRemoveBlackListAddress(id);
    return res;
  }

  async function getProposedRemoveBlackListAddress(
    signer: any,
    id: number
  ): Promise<{
    address: string;
    proposer: string;
    approvalCount: number;
    rejectCount: number;
    status: number;
  }> {
    const res = await _getProposedRemoveBlackListAddress(signer, id);
    return res;
  }

  async function _voteProposedBlackListAddress(
    signer: any,
    id: number,
    vote: boolean,
    type: number
  ): Promise<void> {
    const contract = new ethers.Contract(
      JPYN_CONTRACT_ADDRESS!,
      JPYN.abi,
      signer!
    );
    await contract.voteProposedBlackListAddress(id, vote, type);
  }

  async function voteProposedBlackListAddress(
    signer: any,
    id: number,
    vote: boolean,
    type: number
  ) {
    await _voteProposedBlackListAddress(signer, id, vote, type);
  }

  async function _isVoteProposedBlackListAddress(
    signer: any,
    id: number,
    address: string,
    type: number
  ): Promise<boolean> {
    const contract = new ethers.Contract(
      JPYN_CONTRACT_ADDRESS!,
      JPYN.abi,
      signer!
    );
    const res = await contract.isVoteProposedBlackListAddress(
      id,
      address,
      type
    );
    return res;
  }

  async function isVoteProposedBlackListAddress(
    signer: any,
    id: number,
    address: string,
    type: number
  ): Promise<boolean> {
    const res = await _isVoteProposedBlackListAddress(
      signer,
      id,
      address,
      type
    );
    return res;
  }

  async function _proposeBankBlackList(
    signer: any,
    address: string,
    type: number
  ): Promise<void> {
    const contract = new ethers.Contract(
      JPYN_CONTRACT_ADDRESS!,
      JPYN.abi,
      signer!
    );
    console.log("contract", address);
    await contract.proposeBankBlackList(address, type);
  }

  async function proposeBankBlackList(
    signer: any,
    address: string,
    type: number
  ) {
    await _proposeBankBlackList(signer, address, type);
  }

  async function _getCurrentBankBlackListId(
    signer: any,
    type: number
  ): Promise<number> {
    const contract = new ethers.Contract(
      JPYN_CONTRACT_ADDRESS!,
      JPYN.abi,
      signer!
    );
    const res = await contract.getCurrentBankBlackListId(type);
    return res;
  }

  async function getCurrentBankBlackListId(
    signer: any,
    type: number
  ): Promise<number> {
    const res = await _getCurrentBankBlackListId(signer, type);
    return res;
  }

  async function _getProposedBankBlackList(
    signer: any,
    id: number
  ): Promise<{
    address: string;
    proposer: string;
    approvalCount: number;
    rejectCount: number;
    status: number;
  }> {
    const contract = new ethers.Contract(
      JPYN_CONTRACT_ADDRESS!,
      JPYN.abi,
      signer!
    );
    const res = await contract.getProposedBankBlackList(id);
    return res;
  }

  async function getProposedBankBlackList(
    signer: any,
    id: number
  ): Promise<{
    address: string;
    proposer: string;
    approvalCount: number;
    rejectCount: number;
    status: number;
  }> {
    const res = await _getProposedBankBlackList(signer, id);
    return res;
  }

  async function _getProposedRemoveBankBlackList(
    signer: any,
    id: number
  ): Promise<{
    address: string;
    proposer: string;
    approvalCount: number;
    rejectCount: number;
    status: number;
  }> {
    const contract = new ethers.Contract(
      JPYN_CONTRACT_ADDRESS!,
      JPYN.abi,
      signer!
    );
    const res = await contract.getProposedRemoveBankBlackList(id);
    return res;
  }

  async function getProposedRemoveBankBlackList(
    signer: any,
    id: number
  ): Promise<{
    address: string;
    proposer: string;
    approvalCount: number;
    rejectCount: number;
    status: number;
  }> {
    const res = await _getProposedRemoveBankBlackList(signer, id);
    return res;
  }

  async function _voteProposedBankBlackList(
    signer: any,
    id: number,
    vote: boolean,
    type: number
  ): Promise<void> {
    const contract = new ethers.Contract(
      JPYN_CONTRACT_ADDRESS!,
      JPYN.abi,
      signer!
    );
    await contract.voteProposedBankBlackList(id, vote, type);
  }

  async function voteProposedBankBlackList(
    signer: any,
    id: number,
    vote: boolean,
    type: number
  ) {
    await _voteProposedBankBlackList(signer, id, vote, type);
  }

  async function _isVoteProposedBankBlackList(
    signer: any,
    id: number,
    address: string,
    type: number
  ): Promise<boolean> {
    const contract = new ethers.Contract(
      JPYN_CONTRACT_ADDRESS!,
      JPYN.abi,
      signer!
    );
    const res = await contract.isVoteProposedBankBlackList(id, address, type);
    return res;
  }

  async function isVoteProposedBankBlackList(
    signer: any,
    id: number,
    address: string,
    type: number
  ): Promise<boolean> {
    const res = await _isVoteProposedBankBlackList(signer, id, address, type);
    return res;
  }

  async function _totalSupply(signer: any): Promise<number> {
    const contract = new ethers.Contract(
      JPYN_CONTRACT_ADDRESS!,
      JPYN.abi,
      signer!
    );
    const res = await contract.totalSupply();
    return res;
  }

  async function totalSupply(signer: any): Promise<number> {
    const res = await _totalSupply(signer);
    return res;
  }

  async function _balanceOf(signer: any): Promise<number> {
    const contract = new ethers.Contract(
      JPYN_CONTRACT_ADDRESS!,
      JPYN.abi,
      signer!
    );
    const res = await contract.balanceOf(signer._address);
    return res;
  }

  async function balanceOf(signer: any): Promise<number> {
    const res = await _balanceOf(signer);
    return res;
  }

  async function _transfer(signer: any, to: string, amount: number) {
    const contract = new ethers.Contract(
      JPYN_CONTRACT_ADDRESS!,
      JPYN.abi,
      signer!
    );
    await contract.transfer(to, amount);
  }

  async function transfer(signer: any, to: string, amount: number) {
    await _transfer(signer, to, amount);
  }

  async function _allowance(signer: any, owner: string, spender: string) {
    const contract = new ethers.Contract(
      JPYN_CONTRACT_ADDRESS!,
      JPYN.abi,
      signer!
    );
    await contract.approve(owner, spender);
  }

  async function allowance(signer: any, owner: string, spender: string) {
    await _allowance(signer, owner, spender);
  }

  async function _approve(signer: any, spender: string, amount: number) {
    const contract = new ethers.Contract(
      JPYN_CONTRACT_ADDRESS!,
      JPYN.abi,
      signer!
    );
    await contract.approve(spender, amount);
  }

  async function approve(signer: any, spender: string, amount: number) {
    await _approve(signer, spender, amount);
  }

  async function _transferFrom(
    signer: any,
    from: string,
    to: string,
    amount: number
  ) {
    const contract = new ethers.Contract(
      JPYN_CONTRACT_ADDRESS!,
      JPYN.abi,
      signer!
    );
    await contract.transferFrom(from, to, amount);
  }

  async function transferFrom(
    signer: any,
    from: string,
    to: string,
    amount: number
  ) {
    await _transferFrom(signer, from, to, amount);
  }

  async function _registerAddressToBank(
    signer: any,
    hashedBankAccount: string
  ) {
    const contract = new ethers.Contract(
      JPYN_CONTRACT_ADDRESS!,
      JPYN.abi,
      signer!
    );
    await contract.registerAddressToBank(hashedBankAccount);
  }

  async function registerAddressToBank(signer: any, hashedBankAccount: string) {
    await _registerAddressToBank(signer, hashedBankAccount);
  }

  async function _requestIsSafeTotalSupply(signer: any) {
    const contract = new ethers.Contract(
      JPYN_CONTRACT_ADDRESS!,
      JPYN.abi,
      signer!
    );
    const res = await contract.requestIsSafeTotalSupply();
    return res;
  }

  async function requestIsSafeTotalSupply(signer: any) {
    const res = await _requestIsSafeTotalSupply(signer);
    return res;
  }

  async function _isSafeTotalSupply(signer: any) {
    const contract = new ethers.Contract(
      JPYN_CONTRACT_ADDRESS!,
      JPYN.abi,
      signer!
    );
    const res = await contract.isSafeTotalSupply();
    return res;
  }

  async function isSafeTotalSupply(signer: any) {
    const res = await _isSafeTotalSupply(signer);
    return res;
  }

  async function _mint(signer: any, hashedBankAccount: number) {
    const contract = new ethers.Contract(
      JPYN_CONTRACT_ADDRESS!,
      JPYN.abi,
      signer!
    );
    await contract.mint(hashedBankAccount);
  }

  async function mint(signer: any, hashedBankAccount: number) {
    await _mint(signer, hashedBankAccount);
  }

  async function _burn(signer: any, amount: number) {
    const contract = new ethers.Contract(
      JPYN_CONTRACT_ADDRESS!,
      JPYN.abi,
      signer!
    );
    await contract.burn(amount);
  }

  async function burn(signer: any, amount: number) {
    await _burn(signer, amount);
  }

  return (
    <ChainContext.Provider
      value={{
        currentAccount,
        signer,
        oracle,
        connectWallet,
        addOracle,
        removeOracle,
        isOracle,
        getminOracleQuorum,
        getTotalOracleCount,
        // JPYN
        transferFee,
        gTotalSupply,
        admin,
        isJpynSafe,
        isAdmin,
        proposeTransferFee,
        getCurrentProposedTransferFeeId,
        getProposedTransferFee,
        voteProposedTransferFee,
        isVoteProposedTransferFee,
        proposeAdmin,
        getCurrentProposedAdminId,
        getProposedAdmin,
        getProposedRemovedAdmin,
        voteProposedAdmin,
        isVoteProposedAdmin,
        proposeBlackListAddress,
        getCurrentProposedBlackListAddressId,
        getProposedBlackListAddress,
        getProposedRemoveBlackListAddress,
        voteProposedBlackListAddress,
        isVoteProposedBlackListAddress,
        proposeBankBlackList,
        getCurrentBankBlackListId,
        getProposedBankBlackList,
        getProposedRemoveBankBlackList,
        voteProposedBankBlackList,
        isVoteProposedBankBlackList,
        totalSupply,
        balanceOf,
        transfer,
        allowance,
        approve,
        transferFrom,
        registerAddressToBank,
        requestIsSafeTotalSupply,
        isSafeTotalSupply,
        mint,
        burn,
        getTotalVoters,
        getMinApproval,
      }}
    >
      {children}
    </ChainContext.Provider>
  );
};
