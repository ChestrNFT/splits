/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import type { Splitter } from "../Splitter";

export class Splitter__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(overrides?: Overrides): Promise<Splitter> {
    return super.deploy(overrides || {}) as Promise<Splitter>;
  }
  getDeployTransaction(overrides?: Overrides): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): Splitter {
    return super.attach(address) as Splitter;
  }
  connect(signer: Signer): Splitter__factory {
    return super.connect(signer) as Splitter__factory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Splitter {
    return new Contract(address, _abi, signerOrProvider) as Splitter;
  }
}

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    name: "TransferETH",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "currentWindow",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "fundsAvailable",
        type: "uint256",
      },
    ],
    name: "WindowIncremented",
    type: "event",
  },
  {
    inputs: [],
    name: "IID_IROYALTY",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "PERCENTAGE_SCALE",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "balanceForWindow",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "window",
        type: "uint256",
      },
      {
        internalType: "uint32",
        name: "tokenId",
        type: "uint32",
      },
      {
        internalType: "uint256",
        name: "scaledPercentageAllocation",
        type: "uint256",
      },
      {
        internalType: "bytes32[]",
        name: "merkleProof",
        type: "bytes32[]",
      },
    ],
    name: "claim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "tokenId",
        type: "uint32",
      },
      {
        internalType: "uint256",
        name: "percentageAllocation",
        type: "uint256",
      },
      {
        internalType: "bytes32[]",
        name: "merkleProof",
        type: "bytes32[]",
      },
    ],
    name: "claimForAllWindows",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "currentWindow",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "royaltyAmount",
        type: "uint256",
      },
    ],
    name: "incrementWindow",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "window",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "membershipContract",
        type: "address",
      },
      {
        internalType: "uint32",
        name: "tokenId",
        type: "uint32",
      },
    ],
    name: "isClaimed",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "membershipContract",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "merkleRoot",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "scaledPercent",
        type: "uint256",
      },
    ],
    name: "scaleAmountByPercentage",
    outputs: [
      {
        internalType: "uint256",
        name: "scaledAmount",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50610f25806100206000396000f3fe608060405234801561001057600080fd5b50600436106100c95760003560e01c806381e580d311610081578063bc4fec321161005b578063bc4fec32146101bb578063e67868ab146101de578063f2ec3412146101f157600080fd5b806381e580d31461018c5780638ffb5c971461019f578063ba0bafb4146101b257600080fd5b80633f26479e116100b25780633f26479e146100ff57806351ec8d1e146101095780637da130931461013457600080fd5b80630ec3767f146100ce5780632eb4a7ab146100e3575b600080fd5b6100e16100dc366004610d03565b610204565b005b6100ec60005481565b6040519081526020015b60405180910390f35b6100ec620f424081565b60075461011c906001600160a01b031681565b6040516001600160a01b0390911681526020016100f6565b61015b7f17d378750000000000000000000000000000000000000000000000000000000081565b6040517fffffffff0000000000000000000000000000000000000000000000000000000090911681526020016100f6565b6100ec61019a366004610d03565b6103d5565b6100ec6101ad366004610d70565b6103f6565b6100ec60015481565b6101ce6101c9366004610d33565b610421565b60405190151581526020016100f6565b6100e16101ec366004610d91565b61044e565b6100e16101ff366004610df7565b61071f565b6002546040517f70a0823100000000000000000000000000000000000000000000000000000000815230600482015260009182916001600160a01b03909116906370a082319060240160206040518083038186803b15801561026557600080fd5b505afa158015610279573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061029d9190610d1b565b9050829150818110156102f75760405162461bcd60e51b815260206004820152601260248201527f496e73756666696369656e742066756e6473000000000000000000000000000060448201526064015b60405180910390fd5b600082116103475760405162461bcd60e51b815260206004820152601e60248201527f4e6f206164646974696f6e616c2066756e647320666f722077696e646f77000060448201526064016102ee565b600480546001818101835560009283527f8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b90910184905580549091829161038f908390610e4f565b909155505060015460408051918252602082018490527ff0840b82b46c1dc7df62cae652baa1b5588ce37b6a1236ed1dcf4caf34d738ac910160405180910390a1505050565b600481815481106103e557600080fd5b600091825260209091200154905081565b6000610406620f42406064610e87565b6104108385610e87565b61041a9190610e67565b9392505050565b600060056000610432868686610943565b815260208101919091526040016000205460ff16949350505050565b846001541161049f5760405162461bcd60e51b815260206004820181905260248201527f63616e6e6f7420636c61696d20666f722061206675747572652077696e646f7760448201526064016102ee565b6007546104b79086906001600160a01b031686610421565b1561052a5760405162461bcd60e51b815260206004820152602860248201527f4e46542068617320616c726561647920636c61696d656420746865206769766560448201527f6e2077696e646f7700000000000000000000000000000000000000000000000060648201526084016102ee565b6007546105429086906001600160a01b0316866109bb565b61059782828080602002602001604051908101604052809392919081815260200183836020028082843760009201829052505460075490935061059292506001600160a01b031690508888610a0e565b610a68565b6105e35760405162461bcd60e51b815260206004820152600d60248201527f496e76616c69642070726f6f660000000000000000000000000000000000000060448201526064016102ee565b6007546040517f6352211e00000000000000000000000000000000000000000000000000000000815263ffffffff861660048201526000916001600160a01b031690636352211e9060240160206040518083038186803b15801561064657600080fd5b505afa15801561065a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061067e9190610cc7565b90506001600160a01b03811633146106d85760405162461bcd60e51b815260206004820152601260248201527f496e76616c6964204d656d62657273686970000000000000000000000000000060448201526064016102ee565b610716816107116004898154811061070057634e487b7160e01b600052603260045260246000fd5b9060005260206000200154876103f6565b610b25565b50505050505050565b61076f82828080602002602001604051908101604052809392919081815260200183836020028082843760009201829052505460075490935061059292506001600160a01b031690508888610a0e565b6107bb5760405162461bcd60e51b815260206004820152600d60248201527f496e76616c69642070726f6f660000000000000000000000000000000000000060448201526064016102ee565b6007546040517f6352211e00000000000000000000000000000000000000000000000000000000815263ffffffff8616600482015260009182916001600160a01b0390911690636352211e9060240160206040518083038186803b15801561082257600080fd5b505afa158015610836573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061085a9190610cc7565b90506001600160a01b03811633146108b45760405162461bcd60e51b815260206004820152601260248201527f496e76616c6964204d656d62657273686970000000000000000000000000000060448201526064016102ee565b60005b600154811015610938576007546108d99082906001600160a01b031689610421565b610926576007546108f59082906001600160a01b0316896109bb565b6109196004828154811061070057634e487b7160e01b600052603260045260246000fd5b6109239084610e4f565b92505b8061093081610ea6565b9150506108b7565b506107168183610b25565b60408051602081018590526bffffffffffffffffffffffff19606085901b16918101919091527fffffffff0000000000000000000000000000000000000000000000000000000060e083901b1660548201526000906058015b6040516020818303038152906040528051906020012090509392505050565b6001600560006109cc868686610943565b8152602081019190915260400160002080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016911515919091179055505050565b6040516bffffffffffffffffffffffff19606085901b1660208201527fffffffff0000000000000000000000000000000000000000000000000000000060e084901b1660348201526038810182905260009060580161099c565b600081815b8551811015610b1a576000868281518110610a9857634e487b7160e01b600052603260045260246000fd5b60200260200101519050808311610ada576040805160208101859052908101829052606001604051602081830303815290604052805190602001209250610b07565b60408051602081018390529081018490526060016040516020818303038152906040528051906020012092505b5080610b1281610ea6565b915050610a6d565b509092149392505050565b6002546040517fa9059cbb0000000000000000000000000000000000000000000000000000000081526001600160a01b03848116600483015260248201849052600092169063a9059cbb90604401602060405180830381600087803b158015610b8d57600080fd5b505af1158015610ba1573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610bc59190610ce3565b905080610c145760405162461bcd60e51b815260206004820152601660248201527f4661696c656420746f207472616e73666572204554480000000000000000000060448201526064016102ee565b604080516001600160a01b0385168152602081018490528215158183015290517fdbd5389f52533f4cbd998e752125a5a4eaa0b813b399ad15f775ec0e8438620d9181900360600190a192915050565b60008083601f840112610c75578182fd5b50813567ffffffffffffffff811115610c8c578182fd5b6020830191508360208260051b8501011115610ca757600080fd5b9250929050565b803563ffffffff81168114610cc257600080fd5b919050565b600060208284031215610cd8578081fd5b815161041a81610ed7565b600060208284031215610cf4578081fd5b8151801515811461041a578182fd5b600060208284031215610d14578081fd5b5035919050565b600060208284031215610d2c578081fd5b5051919050565b600080600060608486031215610d47578182fd5b833592506020840135610d5981610ed7565b9150610d6760408501610cae565b90509250925092565b60008060408385031215610d82578182fd5b50508035926020909101359150565b600080600080600060808688031215610da8578081fd5b85359450610db860208701610cae565b935060408601359250606086013567ffffffffffffffff811115610dda578182fd5b610de688828901610c64565b969995985093965092949392505050565b60008060008060608587031215610e0c578384fd5b610e1585610cae565b935060208501359250604085013567ffffffffffffffff811115610e37578283fd5b610e4387828801610c64565b95989497509550505050565b60008219821115610e6257610e62610ec1565b500190565b600082610e8257634e487b7160e01b81526012600452602481fd5b500490565b6000816000190483118215151615610ea157610ea1610ec1565b500290565b6000600019821415610eba57610eba610ec1565b5060010190565b634e487b7160e01b600052601160045260246000fd5b6001600160a01b0381168114610eec57600080fd5b5056fea26469706673582212206b7a68ee63846c368790f284de1bbd009c7b1847990043014aa5f3e9358db81b64736f6c63430008040033";
