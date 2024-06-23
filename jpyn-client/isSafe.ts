import { abi } from "../artifacts/contracts/JPYN.sol/JPYN.json";
import * as dotenv from "dotenv";
import { ethers } from "ethers";
import log4js from "log4js";

dotenv.config();
const logger = log4js.getLogger();
logger.level = "all";
log4js.configure({
  appenders: {
    out: { type: "stdout" },
    app: { type: "file", filename: "application.log" },
  },
  categories: {
    default: { appenders: ["out", "app"], level: "debug" },
  },
});

const prisma = new PrismaClient();
const privateKey: any = process.env.PRIVATE_KEY;
const contractAddress: any = process.env.NEXT_PUBLIC_JPYN_CONTRACT_ADDRESS;

const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URL);
const wallet = new ethers.Wallet(privateKey, provider);

const contract = new ethers.Contract(contractAddress, abi, wallet);

async function requestIsSafe() {
  await contract.requestIsSafeTotalSupply();
}

async function execIsSafeTotalSupply() {
  await contract.isSafeTotalSupply();
}

requestIsSafe();
