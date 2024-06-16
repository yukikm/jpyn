import { abi } from "../artifacts/contracts/JpynOracle.sol/JpynOracle.json";
import * as dotenv from "dotenv";
import { ethers } from "ethers";
dotenv.config();

const privateKey: any = process.env.PRIVATE_KEY;
const contractAddress: any = process.env.ORACLE_CONTRACT_ADDRESS;

const provider = new ethers.JsonRpcProvider(process.env.PROVIDER_URL);
const wallet = new ethers.Wallet(privateKey, provider);

const contract = new ethers.Contract(contractAddress, abi, wallet);

const createRequest = (hashedAccount: string) => {
  return contract.createRequest(hashedAccount);
};

const getRequest = async () => {
  return await contract.getRequest(1);
};

async function addOracle(sender: string) {
  return contract.addOracle(sender);
}

async function getTotalOracleCount() {
  const a = await contract.getTotalOracleCount();
  console.log("a: ", a);
}

// addOracle("");

// getTotalOracleCount();

// createRequest(
//   ""
// );
const main = async () => {
  const a = await getRequest();
  console.log(a);
};

main();
