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
        internalType: "address",
        name: "account",
        type: "address",
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
        internalType: "address",
        name: "account",
        type: "address",
      },
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
    inputs: [],
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
        name: "account",
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
  "0x608060405234801561001057600080fd5b50610c31806100206000396000f3fe608060405234801561001057600080fd5b50600436106100a35760003560e01c806381e580d311610076578063ba0bafb41161005b578063ba0bafb414610111578063bc4fec321461011a578063c35d605f1461013d57600080fd5b806381e580d3146100eb5780638ffb5c97146100fe57600080fd5b80632eb4a7ab146100a8578063338b1d31146100c4578063345d732a146100ce5780633f26479e146100e1575b600080fd5b6100b160005481565b6040519081526020015b60405180910390f35b6100cc610150565b005b6100cc6100dc3660046109fc565b61024c565b6100b1620f424081565b6100b16100f9366004610a89565b610371565b6100b161010c366004610b52565b610392565b6100b160015481565b61012d610128366004610aa1565b6103bd565b60405190151581526020016100bb565b6100cc61014b366004610adc565b6103ea565b600060015460001415610164575047610169565b506006545b6000600655806101c05760405162461bcd60e51b815260206004820152601e60248201527f4e6f206164646974696f6e616c2066756e647320666f722077696e646f77000060448201526064015b60405180910390fd5b600480546001818101835560009283527f8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b909101839055805490918291610208908390610b73565b909155505060015460408051918252602082018390527ff0840b82b46c1dc7df62cae652baa1b5588ce37b6a1236ed1dcf4caf34d738ac910160405180910390a150565b610295828280806020026020016040519081016040528093929190818152602001838360200280828437600092018290525054925061029091508990508888610581565b6105f6565b6102e15760405162461bcd60e51b815260206004820152600d60248201527f496e76616c69642070726f6f660000000000000000000000000000000000000060448201526064016101b7565b6000805b60015481101561035d576102fa8188886103bd565b61034b576103098188886106b3565b61033e6004828154811061032d57634e487b7160e01b600052603260045260246000fd5b906000526020600020015486610392565b6103489083610b73565b91505b8061035581610bca565b9150506102e5565b506103688682610706565b50505050505050565b6004818154811061038157600080fd5b600091825260209091200154905081565b60006103a2620f42406064610bab565b6103ac8385610bab565b6103b69190610b8b565b9392505050565b6000600560006103ce8686866108a8565b815260208101919091526040016000205460ff16949350505050565b856001541161043b5760405162461bcd60e51b815260206004820181905260248201527f63616e6e6f7420636c61696d20666f722061206675747572652077696e646f7760448201526064016101b7565b6104468686866103bd565b156104b95760405162461bcd60e51b815260206004820152602860248201527f4163636f756e7420616c726561647920636c61696d656420746865206769766560448201527f6e2077696e646f7700000000000000000000000000000000000000000000000060648201526084016101b7565b6104c48686866106b3565b610508828280806020026020016040519081016040528093929190818152602001838360200280828437600092018290525054925061029091508990508888610581565b6105545760405162461bcd60e51b815260206004820152600d60248201527f496e76616c69642070726f6f660000000000000000000000000000000000000060448201526064016101b7565b6103688561057c6004898154811061032d57634e487b7160e01b600052603260045260246000fd5b610706565b6040516bffffffffffffffffffffffff19606085901b1660208201527fffffffff0000000000000000000000000000000000000000000000000000000060e084901b166034820152603881018290526000906058015b6040516020818303038152906040528051906020012090509392505050565b600081815b85518110156106a857600086828151811061062657634e487b7160e01b600052603260045260246000fd5b60200260200101519050808311610668576040805160208101859052908101829052606001604051602081830303815290604052805190602001209250610695565b60408051602081018390529081018490526060016040516020818303038152906040528051906020012092505b50806106a081610bca565b9150506105fb565b509092149392505050565b6001600560006106c48686866108a8565b8152602081019190915260400160002080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016911515919091179055505050565b60006107128383610905565b90508061084b57600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663d0e30db0836040518263ffffffff1660e01b81526004016000604051808303818588803b15801561078357600080fd5b505af1158015610797573d6000803e3d6000fd5b50506002546040517fa9059cbb00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff888116600483015260248201889052909116935063a9059cbb92506044019050602060405180830381600087803b15801561081157600080fd5b505af1158015610825573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108499190610a69565b505b6040805173ffffffffffffffffffffffffffffffffffffffff85168152602081018490528215158183015290517fdbd5389f52533f4cbd998e752125a5a4eaa0b813b399ad15f775ec0e8438620d9181900360600190a192915050565b60408051602081018590526bffffffffffffffffffffffff19606085901b16918101919091527fffffffff0000000000000000000000000000000000000000000000000000000060e083901b1660548201526000906058016105d7565b6000808373ffffffffffffffffffffffffffffffffffffffff168361753090604051600060405180830381858888f193505050503d8060008114610965576040519150601f19603f3d011682016040523d82523d6000602084013e61096a565b606091505b509095945050505050565b803573ffffffffffffffffffffffffffffffffffffffff8116811461099957600080fd5b919050565b60008083601f8401126109af578182fd5b50813567ffffffffffffffff8111156109c6578182fd5b6020830191508360208260051b85010111156109e157600080fd5b9250929050565b803563ffffffff8116811461099957600080fd5b600080600080600060808688031215610a13578081fd5b610a1c86610975565b9450610a2a602087016109e8565b935060408601359250606086013567ffffffffffffffff811115610a4c578182fd5b610a588882890161099e565b969995985093965092949392505050565b600060208284031215610a7a578081fd5b815180151581146103b6578182fd5b600060208284031215610a9a578081fd5b5035919050565b600080600060608486031215610ab5578283fd5b83359250610ac560208501610975565b9150610ad3604085016109e8565b90509250925092565b60008060008060008060a08789031215610af4578081fd5b86359550610b0460208801610975565b9450610b12604088016109e8565b935060608701359250608087013567ffffffffffffffff811115610b34578182fd5b610b4089828a0161099e565b979a9699509497509295939492505050565b60008060408385031215610b64578182fd5b50508035926020909101359150565b60008219821115610b8657610b86610be5565b500190565b600082610ba657634e487b7160e01b81526012600452602481fd5b500490565b6000816000190483118215151615610bc557610bc5610be5565b500290565b6000600019821415610bde57610bde610be5565b5060010190565b634e487b7160e01b600052601160045260246000fdfea264697066735822122004bd9f81bac42887b229b05161fdfe1d6b230045b0bba1192ff94d2898f4ee5e64736f6c63430008040033";
