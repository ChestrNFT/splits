/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
} from "ethers";
import {
  Contract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "@ethersproject/contracts";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";

interface SplitterInterface extends ethers.utils.Interface {
  functions: {
    "IID_IROYALTY()": FunctionFragment;
    "PERCENTAGE_SCALE()": FunctionFragment;
    "balanceForWindow(uint256)": FunctionFragment;
    "claim(uint256,uint32,uint256,bytes32[])": FunctionFragment;
    "claimForAllWindows(uint32,uint256,bytes32[])": FunctionFragment;
    "currentWindow()": FunctionFragment;
    "incrementWindow(uint256)": FunctionFragment;
    "isClaimed(uint256,address,uint32)": FunctionFragment;
    "membershipContract()": FunctionFragment;
    "merkleRoot()": FunctionFragment;
    "scaleAmountByPercentage(uint256,uint256)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "IID_IROYALTY",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "PERCENTAGE_SCALE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "balanceForWindow",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "claim",
    values: [BigNumberish, BigNumberish, BigNumberish, BytesLike[]]
  ): string;
  encodeFunctionData(
    functionFragment: "claimForAllWindows",
    values: [BigNumberish, BigNumberish, BytesLike[]]
  ): string;
  encodeFunctionData(
    functionFragment: "currentWindow",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "incrementWindow",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "isClaimed",
    values: [BigNumberish, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "membershipContract",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "merkleRoot",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "scaleAmountByPercentage",
    values: [BigNumberish, BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "IID_IROYALTY",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "PERCENTAGE_SCALE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "balanceForWindow",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "claim", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "claimForAllWindows",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "currentWindow",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "incrementWindow",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "isClaimed", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "membershipContract",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "merkleRoot", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "scaleAmountByPercentage",
    data: BytesLike
  ): Result;

  events: {
    "TransferETH(address,uint256,bool)": EventFragment;
    "WindowIncremented(uint256,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "TransferETH"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "WindowIncremented"): EventFragment;
}

export class Splitter extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  on(event: EventFilter | string, listener: Listener): this;
  once(event: EventFilter | string, listener: Listener): this;
  addListener(eventName: EventFilter | string, listener: Listener): this;
  removeAllListeners(eventName: EventFilter | string): this;
  removeListener(eventName: any, listener: Listener): this;

  interface: SplitterInterface;

  functions: {
    IID_IROYALTY(overrides?: CallOverrides): Promise<[string]>;

    "IID_IROYALTY()"(overrides?: CallOverrides): Promise<[string]>;

    PERCENTAGE_SCALE(overrides?: CallOverrides): Promise<[BigNumber]>;

    "PERCENTAGE_SCALE()"(overrides?: CallOverrides): Promise<[BigNumber]>;

    balanceForWindow(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    "balanceForWindow(uint256)"(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    claim(
      window: BigNumberish,
      tokenId: BigNumberish,
      scaledPercentageAllocation: BigNumberish,
      merkleProof: BytesLike[],
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "claim(uint256,uint32,uint256,bytes32[])"(
      window: BigNumberish,
      tokenId: BigNumberish,
      scaledPercentageAllocation: BigNumberish,
      merkleProof: BytesLike[],
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    claimForAllWindows(
      tokenId: BigNumberish,
      percentageAllocation: BigNumberish,
      merkleProof: BytesLike[],
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "claimForAllWindows(uint32,uint256,bytes32[])"(
      tokenId: BigNumberish,
      percentageAllocation: BigNumberish,
      merkleProof: BytesLike[],
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    currentWindow(overrides?: CallOverrides): Promise<[BigNumber]>;

    "currentWindow()"(overrides?: CallOverrides): Promise<[BigNumber]>;

    incrementWindow(
      royaltyAmount: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "incrementWindow(uint256)"(
      royaltyAmount: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    isClaimed(
      window: BigNumberish,
      membershipContract: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    "isClaimed(uint256,address,uint32)"(
      window: BigNumberish,
      membershipContract: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    membershipContract(overrides?: CallOverrides): Promise<[string]>;

    "membershipContract()"(overrides?: CallOverrides): Promise<[string]>;

    merkleRoot(overrides?: CallOverrides): Promise<[string]>;

    "merkleRoot()"(overrides?: CallOverrides): Promise<[string]>;

    scaleAmountByPercentage(
      amount: BigNumberish,
      scaledPercent: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { scaledAmount: BigNumber }>;

    "scaleAmountByPercentage(uint256,uint256)"(
      amount: BigNumberish,
      scaledPercent: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { scaledAmount: BigNumber }>;
  };

  IID_IROYALTY(overrides?: CallOverrides): Promise<string>;

  "IID_IROYALTY()"(overrides?: CallOverrides): Promise<string>;

  PERCENTAGE_SCALE(overrides?: CallOverrides): Promise<BigNumber>;

  "PERCENTAGE_SCALE()"(overrides?: CallOverrides): Promise<BigNumber>;

  balanceForWindow(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "balanceForWindow(uint256)"(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  claim(
    window: BigNumberish,
    tokenId: BigNumberish,
    scaledPercentageAllocation: BigNumberish,
    merkleProof: BytesLike[],
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "claim(uint256,uint32,uint256,bytes32[])"(
    window: BigNumberish,
    tokenId: BigNumberish,
    scaledPercentageAllocation: BigNumberish,
    merkleProof: BytesLike[],
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  claimForAllWindows(
    tokenId: BigNumberish,
    percentageAllocation: BigNumberish,
    merkleProof: BytesLike[],
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "claimForAllWindows(uint32,uint256,bytes32[])"(
    tokenId: BigNumberish,
    percentageAllocation: BigNumberish,
    merkleProof: BytesLike[],
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  currentWindow(overrides?: CallOverrides): Promise<BigNumber>;

  "currentWindow()"(overrides?: CallOverrides): Promise<BigNumber>;

  incrementWindow(
    royaltyAmount: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "incrementWindow(uint256)"(
    royaltyAmount: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  isClaimed(
    window: BigNumberish,
    membershipContract: string,
    tokenId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<boolean>;

  "isClaimed(uint256,address,uint32)"(
    window: BigNumberish,
    membershipContract: string,
    tokenId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<boolean>;

  membershipContract(overrides?: CallOverrides): Promise<string>;

  "membershipContract()"(overrides?: CallOverrides): Promise<string>;

  merkleRoot(overrides?: CallOverrides): Promise<string>;

  "merkleRoot()"(overrides?: CallOverrides): Promise<string>;

  scaleAmountByPercentage(
    amount: BigNumberish,
    scaledPercent: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "scaleAmountByPercentage(uint256,uint256)"(
    amount: BigNumberish,
    scaledPercent: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  callStatic: {
    IID_IROYALTY(overrides?: CallOverrides): Promise<string>;

    "IID_IROYALTY()"(overrides?: CallOverrides): Promise<string>;

    PERCENTAGE_SCALE(overrides?: CallOverrides): Promise<BigNumber>;

    "PERCENTAGE_SCALE()"(overrides?: CallOverrides): Promise<BigNumber>;

    balanceForWindow(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "balanceForWindow(uint256)"(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    claim(
      window: BigNumberish,
      tokenId: BigNumberish,
      scaledPercentageAllocation: BigNumberish,
      merkleProof: BytesLike[],
      overrides?: CallOverrides
    ): Promise<void>;

    "claim(uint256,uint32,uint256,bytes32[])"(
      window: BigNumberish,
      tokenId: BigNumberish,
      scaledPercentageAllocation: BigNumberish,
      merkleProof: BytesLike[],
      overrides?: CallOverrides
    ): Promise<void>;

    claimForAllWindows(
      tokenId: BigNumberish,
      percentageAllocation: BigNumberish,
      merkleProof: BytesLike[],
      overrides?: CallOverrides
    ): Promise<void>;

    "claimForAllWindows(uint32,uint256,bytes32[])"(
      tokenId: BigNumberish,
      percentageAllocation: BigNumberish,
      merkleProof: BytesLike[],
      overrides?: CallOverrides
    ): Promise<void>;

    currentWindow(overrides?: CallOverrides): Promise<BigNumber>;

    "currentWindow()"(overrides?: CallOverrides): Promise<BigNumber>;

    incrementWindow(
      royaltyAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "incrementWindow(uint256)"(
      royaltyAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    isClaimed(
      window: BigNumberish,
      membershipContract: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    "isClaimed(uint256,address,uint32)"(
      window: BigNumberish,
      membershipContract: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    membershipContract(overrides?: CallOverrides): Promise<string>;

    "membershipContract()"(overrides?: CallOverrides): Promise<string>;

    merkleRoot(overrides?: CallOverrides): Promise<string>;

    "merkleRoot()"(overrides?: CallOverrides): Promise<string>;

    scaleAmountByPercentage(
      amount: BigNumberish,
      scaledPercent: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "scaleAmountByPercentage(uint256,uint256)"(
      amount: BigNumberish,
      scaledPercent: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {
    TransferETH(account: null, amount: null, success: null): EventFilter;

    WindowIncremented(currentWindow: null, fundsAvailable: null): EventFilter;
  };

  estimateGas: {
    IID_IROYALTY(overrides?: CallOverrides): Promise<BigNumber>;

    "IID_IROYALTY()"(overrides?: CallOverrides): Promise<BigNumber>;

    PERCENTAGE_SCALE(overrides?: CallOverrides): Promise<BigNumber>;

    "PERCENTAGE_SCALE()"(overrides?: CallOverrides): Promise<BigNumber>;

    balanceForWindow(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "balanceForWindow(uint256)"(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    claim(
      window: BigNumberish,
      tokenId: BigNumberish,
      scaledPercentageAllocation: BigNumberish,
      merkleProof: BytesLike[],
      overrides?: Overrides
    ): Promise<BigNumber>;

    "claim(uint256,uint32,uint256,bytes32[])"(
      window: BigNumberish,
      tokenId: BigNumberish,
      scaledPercentageAllocation: BigNumberish,
      merkleProof: BytesLike[],
      overrides?: Overrides
    ): Promise<BigNumber>;

    claimForAllWindows(
      tokenId: BigNumberish,
      percentageAllocation: BigNumberish,
      merkleProof: BytesLike[],
      overrides?: Overrides
    ): Promise<BigNumber>;

    "claimForAllWindows(uint32,uint256,bytes32[])"(
      tokenId: BigNumberish,
      percentageAllocation: BigNumberish,
      merkleProof: BytesLike[],
      overrides?: Overrides
    ): Promise<BigNumber>;

    currentWindow(overrides?: CallOverrides): Promise<BigNumber>;

    "currentWindow()"(overrides?: CallOverrides): Promise<BigNumber>;

    incrementWindow(
      royaltyAmount: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "incrementWindow(uint256)"(
      royaltyAmount: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    isClaimed(
      window: BigNumberish,
      membershipContract: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "isClaimed(uint256,address,uint32)"(
      window: BigNumberish,
      membershipContract: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    membershipContract(overrides?: CallOverrides): Promise<BigNumber>;

    "membershipContract()"(overrides?: CallOverrides): Promise<BigNumber>;

    merkleRoot(overrides?: CallOverrides): Promise<BigNumber>;

    "merkleRoot()"(overrides?: CallOverrides): Promise<BigNumber>;

    scaleAmountByPercentage(
      amount: BigNumberish,
      scaledPercent: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "scaleAmountByPercentage(uint256,uint256)"(
      amount: BigNumberish,
      scaledPercent: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    IID_IROYALTY(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "IID_IROYALTY()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    PERCENTAGE_SCALE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "PERCENTAGE_SCALE()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    balanceForWindow(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "balanceForWindow(uint256)"(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    claim(
      window: BigNumberish,
      tokenId: BigNumberish,
      scaledPercentageAllocation: BigNumberish,
      merkleProof: BytesLike[],
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "claim(uint256,uint32,uint256,bytes32[])"(
      window: BigNumberish,
      tokenId: BigNumberish,
      scaledPercentageAllocation: BigNumberish,
      merkleProof: BytesLike[],
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    claimForAllWindows(
      tokenId: BigNumberish,
      percentageAllocation: BigNumberish,
      merkleProof: BytesLike[],
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "claimForAllWindows(uint32,uint256,bytes32[])"(
      tokenId: BigNumberish,
      percentageAllocation: BigNumberish,
      merkleProof: BytesLike[],
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    currentWindow(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "currentWindow()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    incrementWindow(
      royaltyAmount: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "incrementWindow(uint256)"(
      royaltyAmount: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    isClaimed(
      window: BigNumberish,
      membershipContract: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "isClaimed(uint256,address,uint32)"(
      window: BigNumberish,
      membershipContract: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    membershipContract(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "membershipContract()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    merkleRoot(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "merkleRoot()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    scaleAmountByPercentage(
      amount: BigNumberish,
      scaledPercent: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "scaleAmountByPercentage(uint256,uint256)"(
      amount: BigNumberish,
      scaledPercent: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
