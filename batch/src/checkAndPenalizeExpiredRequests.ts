import { abi } from "../../artifacts/contracts/JpynOracle.sol/JpynOracle.json";
import * as dotenv from "dotenv";
import { ethers } from "ethers";

dotenv.config();

const privateKey: any = process.env.PRIVATE_KEY;
const contractAddress: any = process.env.JPYN_ORACLE_CONTRACT_ADDRESS;

const provider = new ethers.JsonRpcProvider(process.env.PROVIDER_URL);
const wallet = new ethers.Wallet(privateKey, provider);

const contract = new ethers.Contract(contractAddress, abi, wallet);

async function checkAndPenalizeExpiredRequests() {
  await contract.checkAndPenalizeExpiredRequests();
}

checkAndPenalizeExpiredRequests();
