import { expect } from 'chai'
import type { Signer } from 'ethers'
import { ethers } from 'hardhat'

import type { Vault, Vault__factory } from '../typechain-types'

describe('Vault', function () {
  let owner: Signer
  let addr1: Signer
  let someAddr: Signer
  let ct: Vault
  const ETH_AMOUNT = ethers.parseEther('100')

  beforeEach(async function () {
    ;[owner, addr1, someAddr] = await ethers.getSigners()

    const Vault = (await ethers.getContractFactory(
      'Vault',
      owner,
    )) as Vault__factory
    ct = await Vault.deploy()
    await ct.waitForDeployment()
  })

  describe('Deploy', function () {
    it('Should be right owner', async function () {
      const ownerAddr = await owner.getAddress()
      const ctOwnerAddr = await ct.owner()

      expect(ownerAddr).to.be.eq(ctOwnerAddr)
    })
  })

  describe('Payment', async function () {
    it('Should accept funds by receive()', async function () {
      await addr1.sendTransaction({
        to: ct.getAddress(),
        value: ETH_AMOUNT,
      })

      expect(await ct.getBalance()).to.be.eq(ETH_AMOUNT)
    })

    it('Should update deposits after tx', async function () {
      await addr1.sendTransaction({
        to: ct.getAddress(),
        value: ETH_AMOUNT,
      })

      expect(await ct.deposits(await addr1.getAddress())).to.be.eq(ETH_AMOUNT)
    })
  })

  describe('Withdraw', function () {
    it('Allow to user withdraw funds', async function () {
      const ctBalanceBeforeTx = await ct.getBalance()

      await addr1.sendTransaction({
        to: ct.getAddress(),
        value: ETH_AMOUNT,
      })

      await ct.connect(addr1).userWithdraw(ETH_AMOUNT)

      const ctBalanceAfterTx = await ct.getBalance()

      expect(ctBalanceBeforeTx).to.be.eq(ctBalanceAfterTx)
    })

    it('Shold deposite decreese after success user withdraw call', async function () {
      const addr1DepositeBeforeTx = await ct.deposits(await addr1.getAddress())

      await addr1.sendTransaction({
        to: ct.getAddress(),
        value: ETH_AMOUNT,
      })

      await ct.connect(addr1).userWithdraw(ETH_AMOUNT)

      const addr1DepositeAfterTx = await ct.deposits(await addr1.getAddress())

      expect(addr1DepositeBeforeTx).to.be.eq(addr1DepositeAfterTx)
    })

    it('Revert incorrect user withdraw call', async function () {
      const incorrectEthAmount = ethers.parseEther('200')
      await addr1.sendTransaction({
        to: ct.getAddress(),
        value: ETH_AMOUNT,
      })

      expect(
        ct.connect(addr1).userWithdraw(incorrectEthAmount),
      ).to.be.revertedWith('not enough balance')
    })

    it('Should withdraw should be able only for owner', async function () {
      await addr1.sendTransaction({
        to: ct.getAddress(),
        value: ETH_AMOUNT,
      })

      await ct.connect(owner).withdraw(someAddr, ETH_AMOUNT)
    })

    it('Revert incorrect withdraw call (_amount)', async function () {
      expect(
        ct.connect(owner).withdraw(someAddr, ETH_AMOUNT),
      ).to.be.revertedWith('nothing to withdraw')
    })

    it('Revert incorrect withdraw call (not a owner)', async function () {
      await addr1.sendTransaction({
        to: ct.getAddress(),
        value: ETH_AMOUNT,
      })

      expect(
        ct.connect(addr1).withdraw(someAddr, ETH_AMOUNT),
      ).to.be.revertedWith('only owner')
    })
  })

  describe('Should invoke fallback()', function () {
    it('should accept deposits via fallback()', async function () {
      const tx = await addr1.sendTransaction({
        to: ct.getAddress(),
        value: ETH_AMOUNT,
        data: '0x1234',
      })

      await tx.wait()

      expect(await ct.deposits(addr1.getAddress())).to.equal(ETH_AMOUNT)
    })
  })

  describe('Deposits', function () {
    it('Should retrun user deposit correctly', async () => {
      await addr1.sendTransaction({
        to: ct.getAddress(),
        value: ETH_AMOUNT,
      })

      const addr1Deposit = await ct.connect(addr1).getUserDeposit()

      expect(addr1Deposit).to.be.eq(ETH_AMOUNT)
    })
  })
})
