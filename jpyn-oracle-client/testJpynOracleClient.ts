import { ethers } from "ethers";
import { abi } from "../artifacts/contracts/JpynOracle.sol/JpynOracle.json";
import * as dotenv from "dotenv";
dotenv.config();

// Connect to the Ethereum network
const provider = new ethers.JsonRpcProvider(
  "https://rpc-1.testnet.japanopenchain.org:8545"
);

const contractAddress = "0x5077518BbCef691ff01beF5c94dA7d96A27Ef4A7";

const privateKey: any = process.env.PRIVATE_KEY;
console.log("privateKey: ", privateKey);

const wallet = new ethers.Wallet(privateKey, provider);

// Create a new contract instance
const contract = new ethers.Contract(contractAddress, abi, wallet);

const createRequest = (hashedAccount: string) => {
  return contract.createRequest(hashedAccount);
};

async function getRequest() {
  const filter = contract.filters.NewRequest;
  const events = await contract.queryFilter(filter);
  console.log("event: ", events);
  const event: any = events[1];
  console.log("event: ", event.args[1]);
}
async function addOracle(sender: string) {
  const a = await contract.getTotalOracleCount();
  console.log("a: ", a);
  return contract.addOracle(sender);
}

// addOracle("0xEE8b59794Ee3A6aeeCE9aa09a118bB6ba1029e3c");
// addOracle("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
// addOracle("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
// createRequest("kkkkkkkkkkkkkk");
createRequest("333333333");
getRequest();

// console.log(abi);
// const newRequest = (id: number, hashedAccount: string) => {
//   console.log("_currentRequestId: ", id);
//   console.log("_hashedAccount: ", hashedAccount);
// };

// contract.on(filter(), (id: number, hashedAccount: string) => {});
// getRequest();
// provider.once("block", () => {
//   contract.on(filter(), newRequest);
// });
// provider.on("NewRequest", (log, evt) => {
//   console.log(log);
// });
