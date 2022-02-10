import MerkleTree from "./merkle-tree";
import { BigNumber, utils } from "ethers";

export default class BalanceTree {
  private readonly tree: MerkleTree;
  constructor(balances: { account: string; tokenId:number, allocation: BigNumber }[]) {
    this.tree = new MerkleTree(
      balances.map(({ account,tokenId, allocation }, index) => {
        return BalanceTree.toNode(account,tokenId,allocation);
      })
    );
  }

  public static verifyProof(
    account: string,
    tokenId: number,
    allocation: BigNumber,
    proof: Buffer[],
    root: Buffer
  ): boolean {
    let pair = BalanceTree.toNode(account,tokenId,allocation);
    for (const item of proof) {
      pair = MerkleTree.combinedHash(pair, item);
    }

    return pair.equals(root);
  }

  public static toNode(account: string,tokenId:number, allocation: BigNumber): Buffer {
    return Buffer.from(
      utils
        .solidityKeccak256(["address","uint32", "uint256"], [account, tokenId, allocation])
        .substr(2),
      "hex"
    );
  }

  public getHexRoot(): string {
    return this.tree.getHexRoot();
  }

  // returns the hex bytes32 values of the proof
  public getProof(
    account: string,
    tokenId: number,
    allocation: BigNumber
  ): string[] {
    return this.tree.getHexProof(BalanceTree.toNode(account,tokenId,allocation));
  }
}
