import { ethers } from "ethers";

const bankAccountToByte = ethers.toUtf8Bytes("xxxx");
const hashedAccount = ethers.keccak256(bankAccountToByte);

console.log(hashedAccount);
