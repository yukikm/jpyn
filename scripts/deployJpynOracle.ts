import { ethers } from "ethers";
import JpynOracle from "../artifacts/contracts/JpynOracle.sol/JpynOracle.json";
import * as dotenv from "dotenv";
dotenv.config();

type DeploymentTransaction = { hash: string } | null;

async function main() {
  const privateKey: string = process.env.PRIVATE_KEY ?? "";
  console.log("privatekey", privateKey);
  if (privateKey === "") {
    throw new Error("No value set for environment variable PRIVATE_KEY");
  }

  const rpcUrl: string = process.env.URL ?? "";
  console.log("rpcUrl", rpcUrl);
  if (rpcUrl === "") {
    throw new Error("No value set for environment variable SEPOLIA_URL");
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const signer = new ethers.Wallet(privateKey, provider);
  const factory = new ethers.ContractFactory(
    JpynOracle.abi,
    JpynOracle.bytecode,
    signer
  );

  const contract = await factory.deploy();
  const getAddress = await contract.getAddress();
  console.log(getAddress);
  const deploymentTransaction: DeploymentTransaction =
    await contract.deploymentTransaction();
  const hash: string = deploymentTransaction?.hash ?? "";
  console.log(`JpynOracle contract deploy address ${getAddress}`);
  console.log(
    `Transaction URL: https://explorer.testnet.japanopenchain.org/tx/${hash}`
  );
  await contract.waitForDeployment();
  console.log("deploy completed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
