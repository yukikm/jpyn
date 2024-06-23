import { abi } from "../artifacts/contracts/JPYN.sol/JPYN.json";
import * as dotenv from "dotenv";
import { ethers } from "ethers";
import log4js from "log4js";

dotenv.config();
const logger = log4js.getLogger();
logger.level = "all";
log4js.configure({
  appenders: {
    app: { type: "file", filename: "application.log" },
  },
  categories: {
    default: { appenders: ["app"], level: "debug" },
  },
});

const privateKey: any = process.env.PRIVATE_KEY;
const contractAddress: any = process.env.JPYN_CONTRACT_ADDRESS;

const provider = new ethers.JsonRpcProvider(process.env.PROVIDER_URL);
const wallet = new ethers.Wallet(privateKey, provider);

const contract = new ethers.Contract(contractAddress, abi, wallet);

async function execIsSafeTotalSupply() {
  await contract.isSafeTotalSupply();
}

execIsSafeTotalSupply();
