import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { ethers, waffle } from 'hardhat';
import AllocationTree from '../merkle-tree/balance-tree';

const deployWeth = async () => {
  const myWETHContract = await ethers.getContractFactory('WETH');
  const myWETH = await myWETHContract.deploy();
  return await myWETH.deployed();
};

const deployNft = async () => {
  const myNFTContract = await ethers.getContractFactory('MyNFT');
  const myNFT = await myNFTContract.deploy();
  return await myNFT.deployed();
};

const deploySplitter = async () => {
  const Splitter = await ethers.getContractFactory('Splitter');
  const splitter = await Splitter.deploy();
  return await splitter.deployed();
};

const deployMockCollection = async () => {
  const MockCollection = await ethers.getContractFactory('MockCollection');
  const mockCollection = await MockCollection.deploy();
  return await mockCollection.deployed();
};

const createSplit = async (
  proxyFactory,
  merkleRoot,
  wEth,
  membershipContract,
  mockCollection,
  splitId,
) => {
  let royaltyVault, splittProxy, splitTx;

  if (mockCollection) {
    splitTx = await proxyFactory[
      'createSplit(bytes32,address,address,address,string)'
    ](merkleRoot, wEth, membershipContract, mockCollection, splitId);
  } else {
    splitTx = await proxyFactory['createSplit(bytes32,address,address,string)'](
      merkleRoot,
      wEth,
      membershipContract,
      splitId,
    );
  }

  const splitTxn = await splitTx.wait(1);

  let eventVault = splitTxn.events.find(
    (event) => event.event === 'VaultCreated',
  );
  [royaltyVault] = eventVault.args;

  let eventSplit = splitTxn.events.find(
    (event) => event.event === 'SplitCreated',
  );
  [splittProxy] = eventSplit.args;

  return [royaltyVault, splittProxy];
};

const deployRoyaltyVault = async () => {
  const deployRoyaltyVaultContract = await ethers.getContractFactory(
    'MockRoyaltyVault',
  );
  const deployRoyaltyVault = await deployRoyaltyVaultContract.deploy();
  return await deployRoyaltyVault.deployed();
};

const getTree = async (allocationPercentages, membershipContract) => {
  const allocations = allocationPercentages.map((percentage, index) => {
    return {
      account: membershipContract.address,
      tokenId: index + 1,
      allocation: BigNumber.from(percentage),
    };
  });

  let tree = new AllocationTree(allocations);
  return tree;
};

const deployProxyFactory = async (
  splitterAddress: string,
  royaltyVaultAddress: string,
) => {
  const SplitFactory = await ethers.getContractFactory('SplitFactory');
  const SplitFactoryContract = await SplitFactory.deploy(
    splitterAddress,
    royaltyVaultAddress,
  );
  return await SplitFactoryContract.deployed();
};

const PERCENTAGE_SCALE = 1000000;
const NULL_BYTES =
  '0x0000000000000000000000000000000000000000000000000000000000000000';

describe('SplitProxy via Factory', () => {
  describe('basic test', async () => {
    let splitProxyAddress, splitProxy, callableProxy, proxyFactory;
    let splitProxyAddress2;
    let royaltyVaultProxy, royaltyVaultProxyContract, royaltyFactory;
    let royaltyVaultProxy2, royaltyVaultProxyContract2, royaltyFactory2;
    let royaltyVault, royaltyVaultContract;
    let mockCollection;
    let tokenId = 1;
    let funder, fakeWETH, account1, account2, platformOwner;

    let tree, tree2, claimers;
    let myNFT, myNFT2;

    before(async function() {
      [funder, account1, account2, platformOwner] = await ethers.getSigners();

      claimers = [account1, account2];

      fakeWETH = await deployWeth();
      myNFT = await deployNft();
      myNFT2 = await deployNft();
      mockCollection = await deployMockCollection();
      mockCollection = await deployMockCollection();

      myNFT.mintNFT(account1.address);
      myNFT.mintNFT(account2.address);
      myNFT2.mintNFT(account2.address);
      myNFT2.mintNFT(account2.address);

      const allocationPercentages = [5000, 5000];
      tree = await getTree(allocationPercentages, myNFT);
      tree2 = await getTree(allocationPercentages, myNFT2);

      // const allocations = allocationPercentages.map((percentage, index) => {
      //   return {
      //     account: myNFT.address,
      //     tokenId: index + 1,
      //     allocation: BigNumber.from(percentage),
      //   };
      // });

      const rootHash = tree.getHexRoot();
      const rootHash2 = tree2.getHexRoot();

      const royaltyVaultContract = await deployRoyaltyVault();
      const splitter = await deploySplitter();
      proxyFactory = await deployProxyFactory(
        splitter.address,
        royaltyVaultContract.address,
      );

      [royaltyVaultProxy, splitProxyAddress] = await createSplit(
        proxyFactory,
        rootHash,
        fakeWETH.address,
        myNFT.address,
        mockCollection.address,
        '1',
      );

      [royaltyVaultProxy2, splitProxyAddress2] = await createSplit(
        proxyFactory,
        rootHash2,
        fakeWETH.address,
        myNFT2.address,
        mockCollection.address,
        '2',
      );

      //Compute address.
      // const constructorArgs = ethers.utils.defaultAbiCoder.encode(
      //   ["bytes32"],
      //   [rootHash]
      // );
      // const salt = ethers.utils.keccak256(constructorArgs);
      // const proxyBytecode = (await ethers.getContractFactory("SplitProxy"))
      //   .bytecode;
      // const codeHash = ethers.utils.keccak256(proxyBytecode);
      // const proxyAddress = await ethers.utils.getCreate2Address(
      //   proxyFactory.address,
      //   salt,
      //   codeHash
      // );

      // let vaultProxy = await (
      //   await ethers.getContractAt("MockProxyVault", royaltyVaultProxy)
      // ).deployed();

      royaltyVaultProxyContract = await (
        await ethers.getContractAt('MockRoyaltyVault', royaltyVaultProxy)
      ).deployed();

      splitProxy = await (
        await ethers.getContractAt('Splitter', splitProxyAddress)
      ).deployed();

      await proxyFactory.setPlatformFeeRecipient(
        royaltyVaultProxyContract.address,
        platformOwner.address,
      );
      await proxyFactory.setPlatformFee(
        royaltyVaultProxyContract.address,
        1000,
      );
    });

    it('it returns owner of token 1', async () => {
      expect(await myNFT.ownerOf(1)).to.eq(account1.address);
    });

    describe('when there is a 50-50 allocation', () => {
      it('Verify splitter address', async function() {
        let splitterAddress = await royaltyVaultProxyContract.getSplitter();
        expect(await splitterAddress).to.eq(splitProxy.address);
      });

      it('Should return correct RoyaltVault balance', async function() {
        await fakeWETH
          .connect(funder)
          .transfer(royaltyVaultProxy, ethers.utils.parseEther('1'));
        const balance = await fakeWETH.balanceOf(royaltyVaultProxy);

        expect(balance.toString()).to.eq(
          ethers.utils.parseEther('1').toString(),
        );
      });

      it('Owner of RoyaltyVault must be SplitFactory', async function() {
        const owner = await royaltyVaultProxyContract.owner();
        expect(owner).to.eq(proxyFactory.address);
      });

      it('Send VaultBalance to Splitter and Increment window', async function() {
        await royaltyVaultProxyContract.sendToSplitter();
        setTimeout(async () => {}, 5000);
        const balance = await fakeWETH.balanceOf(splitProxy.address);
        expect(await balance).to.eq(ethers.utils.parseEther('0.90').toString());
      });

      it('Check for platform fee added to owner address', async function() {
        const balance = await fakeWETH.balanceOf(platformOwner.address);
        expect(await balance).to.eq(ethers.utils.parseEther('0.10').toString());
      });

      describe('and 1 ETH is deposited and the window is incremented', () => {
        describe('and one account claims on the first window', () => {
          let amountClaimed, allocation, claimTx;
          before(async () => {
            // Setup.
            const window = 0;
            const account = account1.address;
            allocation = BigNumber.from('5000');
            const proof = tree.getProof(myNFT.address, tokenId, allocation);
            const accountBalanceBefore = await fakeWETH.balanceOf(account);

            claimTx = await splitProxy
              .connect(account1)
              .claim(window, tokenId, allocation, proof);

            const accountBalanceAfter = await fakeWETH.balanceOf(account);
            amountClaimed = accountBalanceAfter.sub(accountBalanceBefore);
          });

          it('it returns 0.9 ETH for balanceForWindow[0]', async () => {
            expect(await splitProxy.balanceForWindow(0)).to.eq(
              ethers.utils.parseEther('0.9').toString(),
            );
          });

          it('gets 0.45 ETH from scaleAmountByPercentage', async () => {
            expect(
              await splitProxy.scaleAmountByPercentage(
                allocation,
                ethers.utils.parseEther('0.9').toString(),
              ),
            ).to.eq(ethers.utils.parseEther('0.45').toString());
          });

          it('allows them to successfully claim 0.45 ETH', async () => {
            expect(amountClaimed).to.eq(ethers.utils.parseEther('0.45'));
          });

          it('costs 105514 gas', async () => {
            const { gasUsed } = await claimTx.wait();
            expect(gasUsed.toString()).to.eq('105514');
          });

          describe('and another 1 ETH is added, and the window is incremented', () => {
            before(async () => {
              await fakeWETH
                .connect(funder)
                .transfer(royaltyVaultProxy, ethers.utils.parseEther('1'));
              await royaltyVaultProxyContract.sendToSplitter();
            });

            describe('and the other account claims on the second window', () => {
              let amountClaimedBySecond;
              beforeEach(async () => {
                // Setup.
                const window = 1;
                const account = account2.address;
                const allocation = BigNumber.from('5000');
                const proof = tree.getProof(myNFT.address, 2, allocation);

                const accountBalanceBefore = await fakeWETH.balanceOf(account);

                claimTx = await splitProxy
                  .connect(account2)
                  .claim(window, 2, allocation, proof);

                const accountBalanceAfter = await fakeWETH.balanceOf(account);
                amountClaimedBySecond = accountBalanceAfter.sub(
                  accountBalanceBefore,
                );
              });

              it('allows them to successfully claim 0.45 ETH', async () => {
                expect(amountClaimedBySecond).to.eq(
                  ethers.utils.parseEther('0.45'),
                );
              });
            });

            describe('and the other account claims on the first window', () => {
              let amountClaimedBySecond;
              before(async () => {
                // Setup.
                const window = 0;
                const account = account2.address;
                const allocation = BigNumber.from('5000');
                const proof = tree.getProof(myNFT.address, 2, allocation);
                const accountBalanceBefore = await fakeWETH.balanceOf(account);

                await splitProxy
                  .connect(account2)
                  .claim(window, 2, allocation, proof);

                const accountBalanceAfter = await fakeWETH.balanceOf(account);
                amountClaimedBySecond = accountBalanceAfter.sub(
                  accountBalanceBefore,
                );
              });

              it('allows them to successfully claim 0.45 ETH', async () => {
                expect(amountClaimedBySecond).to.eq(
                  ethers.utils.parseEther('0.45'),
                );
              });
            });

            describe('and the first account claims on the second window', () => {
              let amountClaimedBySecond;
              beforeEach(async () => {
                // Setup.
                const window = 1;
                const account = account1.address;
                const allocation = BigNumber.from('5000');
                const proof = tree.getProof(myNFT.address, tokenId, allocation);
                const accountBalanceBefore = await fakeWETH.balanceOf(account);

                await splitProxy
                  .connect(account1)
                  .claim(window, tokenId, allocation, proof);

                const accountBalanceAfter = await fakeWETH.balanceOf(account);

                amountClaimed = accountBalanceAfter.sub(accountBalanceBefore);
              });

              it('allows them to successfully claim 0.45 ETH', async () => {
                expect(amountClaimed).to.eq(ethers.utils.parseEther('0.45'));
              });
            });
          });

          describe('Adding 2 more weth and incrementing window twice.', () => {
            before(async () => {
              await fakeWETH
                .connect(funder)
                .transfer(royaltyVaultProxy, ethers.utils.parseEther('1'));
              await royaltyVaultProxyContract.sendToSplitter();

              await fakeWETH
                .connect(funder)
                .transfer(royaltyVaultProxy, ethers.utils.parseEther('1'));
              await royaltyVaultProxyContract.sendToSplitter();
            });

            describe('and the second account claims on the all window', () => {
              let amountClaimedBySecond;
              before(async () => {
                // Setup.
                const account = account2.address;
                const allocation = BigNumber.from('5000');
                const proof = tree.getProof(myNFT.address, 2, allocation);
                const accountBalanceBefore = await fakeWETH.balanceOf(account);

                await splitProxy
                  .connect(account2)
                  .claimForAllWindows(2, allocation, proof);

                const accountBalanceAfter = await fakeWETH.balanceOf(account);

                amountClaimedBySecond = accountBalanceAfter.sub(
                  accountBalanceBefore,
                );
              });

              it('allows them to successfully claim 1 ETH', async () => {
                expect(amountClaimedBySecond).to.eq(
                  ethers.utils.parseEther('.9'),
                );
              });
            });

            describe('and the first account claims on the all window', () => {
              let amountClaimedBySecond;
              before(async () => {
                // Setup.
                const account = account1.address;
                const allocation = BigNumber.from('5000');
                const proof = tree.getProof(myNFT.address, 1, allocation);
                const accountBalanceBefore = await fakeWETH.balanceOf(account);

                await splitProxy
                  .connect(account1)
                  .claimForAllWindows(1, allocation, proof);

                const accountBalanceAfter = await fakeWETH.balanceOf(account);

                amountClaimedBySecond = accountBalanceAfter.sub(
                  accountBalanceBefore,
                );
              });

              it('allows them to successfully claim 1 ETH', async () => {
                expect(amountClaimedBySecond).to.eq(
                  ethers.utils.parseEther('.9'),
                );
              });
            });
          });
        });
      });
    });
  });
});
