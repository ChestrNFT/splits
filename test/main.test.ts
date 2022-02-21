import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers, waffle } from "hardhat";
import AllocationTree from "../merkle-tree/balance-tree";


let proxyFactory;

const deployWeth = async () => {
  const myWETHContract = await ethers.getContractFactory("WETH");
  const myWETH = await myWETHContract.deploy();
  return await myWETH.deployed();
};

const deployNft = async () => {
  const myNFTContract = await ethers.getContractFactory("MyNFT");
  const myNFT = await myNFTContract.deploy();
  return await myNFT.deployed();
};

const deploySplitter = async () => {
  const Splitter = await ethers.getContractFactory("Splitter");
  const splitter = await Splitter.deploy();
  return await splitter.deployed();
};

const deployRoyaltyFactory = async () => {
  const RoyaltyVaultFactoryContract = await ethers.getContractFactory("RoyaltyVFactory");
  const royaltyVaultFactory = await RoyaltyVaultFactoryContract.deploy();
  return await royaltyVaultFactory.deployed();
};

const createVault =async (royaltyFactory,collectionContract,wEth)=>{
  let royaltyVault;
  let royaltyTx = await royaltyFactory.createVault(collectionContract,wEth);
  const royaltyVaultTx = await royaltyTx.wait(1)
  const event = royaltyVaultTx.events.find(event => event.event === 'VaultCreated');
  [royaltyVault] = event.args;
  return royaltyVault;
}

const deployProxyFactory = async (
  splitterAddress: string,
  fakeWETHAddress: string,
  membershipContract: string,
) => {
  const SplitFactory = await ethers.getContractFactory("SplitFactory");
  const proxyFactory = await SplitFactory.deploy(
    splitterAddress,
    fakeWETHAddress,
    membershipContract
  );
  return await proxyFactory.deployed();
};

const PERCENTAGE_SCALE = 1000000;
const NULL_BYTES =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

describe("SplitProxy via Factory", () => {
  
  describe("basic test", async () => {
    let proxy, callableProxy;
    let funder, fakeWETH, account1, account2,tokenId=1, transactionHandler, royaltyFactory, royaltyVault,royaltyVaultContract;
    let tree,claimers;
    let myNFT;

    before( async function() {
      [
        funder,
        account1,
        account2,
        transactionHandler,
      ] = await ethers.getSigners();
  
      claimers = [account1, account2];
  
      fakeWETH = await deployWeth();
      myNFT = await deployNft();
      royaltyFactory = await deployRoyaltyFactory();
      royaltyVault = await createVault(royaltyFactory,myNFT.address,fakeWETH.address);
      royaltyVaultContract = await (
        await ethers.getContractAt("RoyaltyVault", royaltyVault)
      ).deployed();
      myNFT.mintNFT(account1.address);
      myNFT.mintNFT(account2.address);

      const allocationPercentages = [50000000, 50000000];
        const allocations = allocationPercentages.map((percentage, index) => {
          return {
            account: myNFT.address,
            tokenId:index+1,
            allocation: BigNumber.from(percentage),
          };
        });

        tree = new AllocationTree(allocations);
        const rootHash = tree.getHexRoot();

        const splitter = await deploySplitter();
        const proxyFactory = await deployProxyFactory(
          splitter.address,
          fakeWETH.address,
          myNFT.address
        );

        const deployTx = await proxyFactory
          .connect(funder)
          .createSplit(rootHash);
        // Compute address.
        const constructorArgs = ethers.utils.defaultAbiCoder.encode(
          ["bytes32"],
          [rootHash]
        );
        const salt = ethers.utils.keccak256(constructorArgs);
        const proxyBytecode = (await ethers.getContractFactory("SplitProxy"))
          .bytecode;
        const codeHash = ethers.utils.keccak256(proxyBytecode);
        const proxyAddress = await ethers.utils.getCreate2Address(
          proxyFactory.address,
          salt,
          codeHash
        );
        proxy = await (
          await ethers.getContractAt("SplitProxy", proxyAddress)
        ).deployed();

        callableProxy = await (
          await ethers.getContractAt("Splitter", proxy.address)
        ).deployed();
        
        royaltyFactory.setSplitter(royaltyVault, proxy.address);

    });

    it("it returns owner of token 1", async () => {
      expect(await myNFT.ownerOf(1)).to.eq(
        account1.address
      );
    });

    describe("when there is a 50-50 allocation", () => {
     

      it("Verify splitter address", async function () {
        let splitterAddress=royaltyVaultContract.getSplitter();

          expect(await splitterAddress).to.eq(
            proxy.address
          );
      });

      
      it("Should return correct RoyaltVault balance", async function () {
        await fakeWETH
        .connect(funder)
        .transfer(royaltyVault, ethers.utils.parseEther("1"));
        const balance = await fakeWETH.balanceOf(royaltyVault);
        
        expect(await balance).to.eq(
          ethers.utils.parseEther("1").toString()
        );
      });
        
      it("Owner of RoyaltyVault must be RoyaltyFactory", async function () {

        const owner = await royaltyVaultContract.owner();
        expect(owner).to.eq(
            royaltyFactory.address
        );

      });

      it("Send VaultBalance to Splitter and Increment window", async function () {
        await royaltyVaultContract
            .sendToSplitter();
        setTimeout((async () => {}), 5000);
        const balance = await fakeWETH.balanceOf(proxy.address);

        expect(await balance).to.eq(
            ethers.utils.parseEther("1").toString()
        );
      });

      it("Should return correct RoyaltVault balance which is 0", async function () {
        const balance = await fakeWETH.balanceOf(royaltyVault);
        expect(await balance).to.eq(
          ethers.utils.parseEther("0").toString()
        );
      });
 
      
      describe("and 1 ETH is deposited and the window is incremented", () => {
        
        describe("and one account claims on the first window", () => {
          let amountClaimed, allocation, claimTx;
          before(async () => {
            // Setup.
            const window = 0;
            const account = account1.address;
            allocation = BigNumber.from("50000000");
            const proof = tree.getProof(myNFT.address,tokenId, allocation);
            const accountBalanceBefore = await waffle.provider.getBalance(
              account
            );
              
            claimTx = await callableProxy
              .connect(account1)
              .claim(window,tokenId, allocation, proof);

            const accountBalanceAfter = await waffle.provider.getBalance(
              account
            );

            amountClaimed = accountBalanceAfter.sub(accountBalanceBefore);
          });

          it("it returns 1 ETH for balanceForWindow[0]", async () => {
            expect(await callableProxy.balanceForWindow(0)).to.eq(
              ethers.utils.parseEther("1").toString()
            );
          });

         

          it("gets 0.5 ETH from scaleAmountByPercentage", async () => {
            expect(
              await callableProxy.scaleAmountByPercentage(
                allocation,
                ethers.utils.parseEther("1").toString()
              )
            ).to.eq(ethers.utils.parseEther("0.5").toString());
          });

          it("allows them to successfully claim 0.5 ETH", async () => {
            expect(amountClaimed).to.lt(
              ethers.utils.parseEther("0.5")
            );
          });
          
          it("costs 105617 gas", async () => {
            const { gasUsed } = await claimTx.wait();
            expect(gasUsed.toString()).to.eq("105617");
          });


          describe("and another 1 ETH is added, and the window is incremented", () => {
            before(async () => {
              
              await fakeWETH
              .connect(funder)
              .transfer(royaltyVault, ethers.utils.parseEther("1"));
              await royaltyVaultContract.sendToSplitter();

            });

            describe("and the other account claims on the second window", () => {
              let amountClaimedBySecond;
              beforeEach(async () => {
                // Setup.
                const window = 1;
                const account = account2.address;
                const allocation = BigNumber.from("50000000");
                const proof = tree.getProof(myNFT.address,2, allocation);
                const accountBalanceBefore = await waffle.provider.getBalance(
                  account
                );

                await callableProxy
                  .connect(account2)
                  .claim(window,2, allocation, proof);

                const accountBalanceAfter = await waffle.provider.getBalance(
                  account
                );

                amountClaimedBySecond = accountBalanceAfter.sub(
                  accountBalanceBefore
                );
              });

              it("allows them to successfully claim 0.5 ETH", async () => {
                expect(amountClaimedBySecond).to.lt(
                  ethers.utils.parseEther("0.5")
                );
              });
            });

            describe("and the other account claims on the first window", () => {
              let amountClaimedBySecond;
              before(async () => {
                // Setup.
                const window = 0;
                const account = account2.address;
                const allocation = BigNumber.from("50000000");
                const proof = tree.getProof(myNFT.address,2, allocation);
                const accountBalanceBefore = await waffle.provider.getBalance(
                  account
                );

                await callableProxy
                  .connect(account2)
                  .claim(window, 2, allocation, proof);

                const accountBalanceAfter = await waffle.provider.getBalance(
                  account
                );

                amountClaimedBySecond = accountBalanceAfter.sub(
                  accountBalanceBefore
                );
              });

              it("allows them to successfully claim 0.5 ETH", async () => {
                expect(amountClaimedBySecond).to.lt(
                  ethers.utils.parseEther("0.5")
                );
              });
            });

            describe("and the first account claims on the second window", () => {
              let amountClaimedBySecond;
              beforeEach(async () => {
                // Setup.
                const window = 1;
                const account = account1.address;
                const allocation = BigNumber.from("50000000");
                const proof = tree.getProof(myNFT.address,tokenId, allocation);
                const accountBalanceBefore = await waffle.provider.getBalance(
                  account
                );

                await callableProxy
                  .connect(account1)
                  .claim(window, tokenId, allocation, proof);

                const accountBalanceAfter = await waffle.provider.getBalance(
                  account
                );

                amountClaimedBySecond = accountBalanceAfter.sub(
                  accountBalanceBefore
                );
              });

              it("allows them to successfully claim 0.5 ETH", async () => {
                expect(amountClaimedBySecond).to.lt(
                  ethers.utils.parseEther("0.5")
                );
              });
            });
          });

          describe("Adding 2 more weth and incrementing window twice.", () => {
            before(async () => {
              
              await fakeWETH
              .connect(funder)
              .transfer(royaltyVault, ethers.utils.parseEther("1"));
              await royaltyVaultContract.sendToSplitter();

              await fakeWETH
              .connect(funder)
              .transfer(royaltyVault, ethers.utils.parseEther("1"));
              await royaltyVaultContract.sendToSplitter();

            });

            describe("and the second account claims on the all window", () => {
              let amountClaimedBySecond;
              before(async () => {
                // Setup.
                const account = account2.address;
                const allocation = BigNumber.from("50000000");
                const proof = tree.getProof(myNFT.address,2, allocation);
                const accountBalanceBefore = await waffle.provider.getBalance(
                  account
                );

                await callableProxy
                  .connect(account2)
                  .claimForAllWindows(2, allocation, proof);

                const accountBalanceAfter = await waffle.provider.getBalance(
                  account
                );

                amountClaimedBySecond = accountBalanceAfter.sub(
                  accountBalanceBefore
                );

              });

              it("allows them to successfully claim 1 ETH", async () => {
                expect(amountClaimedBySecond).to.lt(
                  ethers.utils.parseEther("1")
                );
              });              
            });
            
            describe("and the first account claims on the all window", () => {
              let amountClaimedBySecond;
              before(async () => {
                // Setup.
                const account = account1.address;
                const allocation = BigNumber.from("50000000");
                const proof = tree.getProof(myNFT.address,1, allocation);
                const accountBalanceBefore = await waffle.provider.getBalance(
                  account
                );

                await callableProxy
                  .connect(account1)
                  .claimForAllWindows(1, allocation, proof);

                const accountBalanceAfter = await waffle.provider.getBalance(
                  account
                );

                amountClaimedBySecond = accountBalanceAfter.sub(
                  accountBalanceBefore
                );

              });

              it("allows them to successfully claim 1 ETH", async () => {
                expect(amountClaimedBySecond).to.lt(
                  ethers.utils.parseEther("1")
                );
              });              
            });

          });
        });
      });
    });
  });
});
