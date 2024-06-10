"use client";
import { useState, createContext } from "react";
import type React from "react";
import { ethers, Eip1193Provider } from "ethers";
import type { Signer, Contract } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";
import JpynOracle from "../../../artifacts/contracts/JpynOracle.sol/JpynOracle.json";
import JPYN from "../../../artifacts/contracts/JPYN.sol/JPYN.json";
import * as dotenv from "dotenv";
import { get } from "http";
dotenv.config();

declare global {
  interface Window {
    ethereum: Eip1193Provider;
  }
}

type Chain = any;
export const ChainContext = createContext<Chain>({});

type ChainContextProviderProps = { children: React.ReactNode };

export const ChainContextProvider = ({
  children,
}: ChainContextProviderProps) => {
  const [currentAccount, setCurrentAccount] = useState<string>();
  const [signer, setSigner] = useState<Signer>();
  const [jpynAddress, setJpynAddress] = useState<string>();
  const [jpynOracleAddress, setJpynOracleAddress] = useState<string>();
  async function connectWallet() {
    const provider = await detectEthereumProvider({ silent: true });
    if (provider) {
      const ethersProvider = new ethers.BrowserProvider(window.ethereum);
      // account
      const signer = await ethersProvider.getSigner();
      const _walletAddress = await signer.getAddress();
      setCurrentAccount(_walletAddress);
      // signer
      setSigner(signer);
      setJpynAddress(process.env.JPYN_CONTRACT_ADDRESS);
      setJpynOracleAddress(process.env.JPYN_ORACLE_CONTRACT_ASSRESS);
    } else {
      alert("Please install Metamask Wallet");
    }
  }

  async function addOracle(address: string) {
    const contract = new ethers.Contract(
      jpynOracleAddress!,
      JpynOracle.abi,
      signer!.provider
    );
    await contract.addOracle(address);
  }

  async function removeOracle(address: string) {
    const contract = new ethers.Contract(
      jpynOracleAddress!,
      JpynOracle.abi,
      signer!.provider
    );
    await contract.removeOracle(address);
  }

  async function addOracleAdmin(address: string) {
    const contract = new ethers.Contract(
      jpynOracleAddress!,
      JpynOracle.abi,
      signer!.provider
    );
    await contract.addAdmin(address);
  }

  async function removeOracleAdmin(address: string) {
    const contract = new ethers.Contract(
      jpynOracleAddress!,
      JpynOracle.abi,
      signer!.provider
    );
    await contract.removeAdmin(address);
  }

  async function isOracle(address: string): Promise<boolean> {
    const contract = new ethers.Contract(
      jpynOracleAddress!,
      JpynOracle.abi,
      signer!.provider
    );
    return await contract.isOracle(address);
  }

  async function isOracleAdmin(address: string): Promise<boolean> {
    const contract = new ethers.Contract(
      jpynOracleAddress!,
      JpynOracle.abi,
      signer!.provider
    );
    return await contract.isAdmin(address);
  }

  async function getminOracleQuorum(address: string): Promise<number> {
    const contract = new ethers.Contract(
      jpynOracleAddress!,
      JpynOracle.abi,
      signer!.provider
    );
    return Number(await contract.getMinQuorum(address));
  }

  async function getTotalOracleCount(address: string): Promise<number> {
    const contract = new ethers.Contract(
      jpynOracleAddress!,
      JpynOracle.abi,
      signer!.provider
    );
    return Number(await contract.getTotalOracleCount(address));
  }

  return (
    <ChainContext.Provider
      value={{
        currentAccount,
        signer,
        jpynAddress,
        jpynOracleAddress,
        connectWallet,
        addOracle,
        removeOracle,
        addOracleAdmin,
        removeOracleAdmin,
        isOracle,
        isOracleAdmin,
        getminOracleQuorum,
        getTotalOracleCount,
      }}
    >
      {children}
    </ChainContext.Provider>
  );
};
