import web3 from "./web3";
import Factory from "./build/contracts/Factory.json";

const instance = new web3.eth.Contract(
  Factory.abi,
  "0xbD4E0b9abE6F4964f0A428384C2c7F22a5f11d6f"
);
export default instance;
