import Web3 from 'web3';

const web3 = new Web3(Web3.givenProvider || "https://rinkeby.infura.io/v3/bfaa72602e8f4e4aa183874c9c667d35")

export default web3;