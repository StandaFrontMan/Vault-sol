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
  const SECRET_REVEAL_PHRASE = 'secret'

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

    it('Should emit event DepositEvent', async () => {
      const addr1Address = await addr1.getAddress()

      const tx = await addr1.sendTransaction({
        to: ct.getAddress(),
        value: ETH_AMOUNT,
      })

      await tx.wait()

      expect(tx).to.emit(ct, 'DepositEvent').withArgs(addr1Address, ETH_AMOUNT)
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

    it('Should deposite decreese after success user withdraw call', async function () {
      const addr1DepositeBeforeTx = await ct.deposits(await addr1.getAddress())

      await addr1.sendTransaction({
        to: ct.getAddress(),
        value: ETH_AMOUNT,
      })

      await ct.connect(addr1).userWithdraw(ETH_AMOUNT)

      const addr1DepositeAfterTx = await ct.deposits(await addr1.getAddress())

      expect(addr1DepositeBeforeTx).to.be.eq(addr1DepositeAfterTx)
    })

    it('Revert userWithdraw call if a commit exist', async () => {
      const addr1Address = await addr1.getAddress()

      await addr1.sendTransaction({
        to: ct.getAddress(),
        value: ETH_AMOUNT,
      })

      const hashedSecretPhrase =
        ethers.encodeBytes32String(SECRET_REVEAL_PHRASE)
      const hashedWithdrawCommit = ethers.solidityPackedKeccak256(
        ['address', 'bytes32', 'uint256'],
        [addr1Address, hashedSecretPhrase, ETH_AMOUNT],
      )

      await ct.connect(addr1).commitUserWithdraw(hashedWithdrawCommit)

      expect(async () => {
        await ct.connect(addr1).userWithdraw(ETH_AMOUNT)
      })
        .to.be.revertedWithCustomError(ct, 'FrozenFunds')
        .withArgs('Your funds are frozen, delete or reveal commit first')
    })

    it('Should emit event WithdrawEvent', async () => {
      const addr1Address = await addr1.getAddress()

      const tx = await addr1.sendTransaction({
        to: ct.getAddress(),
        value: ETH_AMOUNT,
      })

      expect(tx).to.emit(ct, 'WithdrawEvent').withArgs(addr1Address, ETH_AMOUNT)
    })

    it('Revert incorrect user withdraw call', async function () {
      const incorrectEthAmount = ethers.parseEther('200')
      const addr1Deposit = await ct.deposits(addr1)

      await addr1.sendTransaction({
        to: ct.getAddress(),
        value: ETH_AMOUNT,
      })

      expect(ct.connect(addr1).userWithdraw(incorrectEthAmount))
        .to.be.revertedWithCustomError(ct, 'InsufficientBalance')
        .withArgs(addr1Deposit, incorrectEthAmount)
    })

    it('Should withdraw should be able only for owner', async function () {
      await addr1.sendTransaction({
        to: ct.getAddress(),
        value: ETH_AMOUNT,
      })

      await ct.connect(owner).withdraw(someAddr, ETH_AMOUNT)
    })

    it('Should emit event WithdrawEvent', async () => {
      const ownerAddr = await owner.getAddress()

      await addr1.sendTransaction({
        to: ct.getAddress(),
        value: ETH_AMOUNT,
      })

      const tx = await ct.connect(owner).withdraw(someAddr, ETH_AMOUNT)

      expect(tx).to.emit(ct, 'WithdrawEvent').withArgs(ownerAddr, ETH_AMOUNT)
    })

    it('Revert incorrect withdraw call (_amount)', async function () {
      expect(ct.connect(owner).withdraw(someAddr, ETH_AMOUNT))
        .to.be.revertedWithCustomError(ct, 'ZeroBalanceForWithdraw')
        .withArgs('Zero balance for withdraw')
    })

    it('Revert incorrect withdraw call (not a owner)', async function () {
      await addr1.sendTransaction({
        to: ct.getAddress(),
        value: ETH_AMOUNT,
      })

      expect(ct.connect(addr1).withdraw(someAddr, ETH_AMOUNT))
        .to.be.revertedWithCustomError(ct, 'OnlyOwnerAction')
        .withArgs('Only owner')
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

    it('Should emit event DepositEvent', async () => {
      const addr1Address = await addr1.getAddress()

      const tx = await addr1.sendTransaction({
        to: ct.getAddress(),
        value: ETH_AMOUNT,
        data: '0x1234',
      })

      await tx.wait()

      expect(tx).to.emit(ct, 'DepositEvent').withArgs(addr1Address, ETH_AMOUNT)
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

  describe('Commit/reveal user withdraw', function () {
    describe('commit', function () {
      it('Should be able to commit', async function () {
        const addr1Address = await addr1.getAddress()

        await addr1.sendTransaction({
          to: ct.getAddress(),
          value: ETH_AMOUNT,
        })

        const hashedSecretPhrase =
          ethers.encodeBytes32String(SECRET_REVEAL_PHRASE)
        const hashedWithdrawCommit = ethers.solidityPackedKeccak256(
          ['address', 'bytes32', 'uint256'],
          [addr1Address, hashedSecretPhrase, ETH_AMOUNT],
        )

        await ct.connect(addr1).commitUserWithdraw(hashedWithdrawCommit)

        const userCommit = await ct.userWithdrawCommits(addr1Address)
        expect(userCommit).to.eq(hashedWithdrawCommit)
      })

      it('Revert custom error if commit already exist', async () => {
        const addr1Address = await addr1.getAddress()

        await addr1.sendTransaction({
          to: ct.getAddress(),
          value: ETH_AMOUNT,
        })

        const hashedSecretPhrase =
          ethers.encodeBytes32String(SECRET_REVEAL_PHRASE)
        const hashedWithdrawCommit = ethers.solidityPackedKeccak256(
          ['address', 'bytes32', 'uint256'],
          [addr1Address, hashedSecretPhrase, ETH_AMOUNT],
        )

        await ct.connect(addr1).commitUserWithdraw(hashedWithdrawCommit)

        expect(ct.connect(addr1).commitUserWithdraw(hashedWithdrawCommit))
          .to.be.revertedWithCustomError(ct, 'ExistingUserWithdrawCommit')
          .withArgs('Commit already exist')
      })

      it('Should emit event CreatedUserWithdrawEvent', async () => {
        const addr1Address = await addr1.getAddress()

        await addr1.sendTransaction({
          to: ct.getAddress(),
          value: ETH_AMOUNT,
        })

        const hashedSecretPhrase =
          ethers.encodeBytes32String(SECRET_REVEAL_PHRASE)
        const hashedWithdrawCommit = ethers.solidityPackedKeccak256(
          ['address', 'bytes32', 'uint256'],
          [addr1Address, hashedSecretPhrase, ETH_AMOUNT],
        )

        const tx = await ct
          .connect(addr1)
          .commitUserWithdraw(hashedWithdrawCommit)
        await tx.wait()

        expect(tx).to.emit(ct, 'CreatedUserWithdrawEvent')
      })
    })

    describe('delete  commit', function () {
      it('Should delete existing commit', async () => {
        const addr1Address = await addr1.getAddress()

        await addr1.sendTransaction({
          to: ct.getAddress(),
          value: ETH_AMOUNT,
        })

        const hashedSecretPhrase =
          ethers.encodeBytes32String(SECRET_REVEAL_PHRASE)
        const hashedWithdrawCommit = ethers.solidityPackedKeccak256(
          ['address', 'bytes32', 'uint256'],
          [addr1Address, hashedSecretPhrase, ETH_AMOUNT],
        )

        await ct.connect(addr1).commitUserWithdraw(hashedWithdrawCommit)

        await ct.connect(addr1).deleteUserWithdrawCommit()
        const userCommitEmpty = await ct.userWithdrawCommits(addr1Address)

        expect(userCommitEmpty).to.eq(ethers.ZeroHash)
      })

      it('Revert with custom error if userWithdrawCommits[msg.sender] empty', async () => {
        expect(async () => {
          await ct.connect(addr1).deleteUserWithdrawCommit()
        })
          .to.be.revertedWithCustomError(ct, 'NonExistingUserWithdrawCommit')
          .withArgs('Commit not exist')
      })

      it('Should emit event DeletedUserWithdrawEvent', async () => {
        const addr1Address = await addr1.getAddress()

        await addr1.sendTransaction({
          to: ct.getAddress(),
          value: ETH_AMOUNT,
        })

        const hashedSecretPhrase =
          ethers.encodeBytes32String(SECRET_REVEAL_PHRASE)
        const hashedWithdrawCommit = ethers.solidityPackedKeccak256(
          ['address', 'bytes32', 'uint256'],
          [addr1Address, hashedSecretPhrase, ETH_AMOUNT],
        )

        await ct.connect(addr1).commitUserWithdraw(hashedWithdrawCommit)

        const tx = await ct.connect(addr1).deleteUserWithdrawCommit()

        expect(tx).to.emit(ct, 'DeletedUserWithdrawEvent')
      })
    })

    describe('reveal', function () {
      it('Should decreese ct balance after reveal', async () => {
        const addr1Address = await addr1.getAddress()
        const ctBalanceBeforeTx = await ct.getBalance()

        await addr1.sendTransaction({
          to: ct.getAddress(),
          value: ETH_AMOUNT,
        })

        const hashedSecretPhrase =
          ethers.encodeBytes32String(SECRET_REVEAL_PHRASE)
        const hashedWithdrawCommit = ethers.solidityPackedKeccak256(
          ['address', 'bytes32', 'uint256'],
          [addr1Address, hashedSecretPhrase, ETH_AMOUNT],
        )

        await ct.connect(addr1).commitUserWithdraw(hashedWithdrawCommit)

        await ct
          .connect(addr1)
          .revealUserWithdraw(ETH_AMOUNT, hashedSecretPhrase)

        const ctBalanceAfterTx = await ct.getBalance()

        expect(ctBalanceBeforeTx).to.be.eq(ctBalanceAfterTx)
      })

      it('Revert incorrect withdraw call', async () => {
        const incorrectetherAmount = ethers.parseEther('1000')
        const addr1Address = await addr1.getAddress()

        await addr1.sendTransaction({
          to: ct.getAddress(),
          value: ETH_AMOUNT,
        })

        const hashedSecretPhrase =
          ethers.encodeBytes32String(SECRET_REVEAL_PHRASE)
        const hashedWithdrawCommit = ethers.solidityPackedKeccak256(
          ['address', 'bytes32', 'uint256'],
          [addr1Address, hashedSecretPhrase, incorrectetherAmount],
        )

        await ct.connect(addr1).commitUserWithdraw(hashedWithdrawCommit)

        expect(async () => {
          await ct
            .connect(addr1)
            .revealUserWithdraw(incorrectetherAmount, hashedSecretPhrase)
        })
          .to.be.revertedWithCustomError(ct, 'InsufficientBalance')
          .withArgs(ETH_AMOUNT, incorrectetherAmount)
      })

      it('Should emit event WithdrawEvent', async () => {
        const addr1Address = await addr1.getAddress()

        await addr1.sendTransaction({
          to: ct.getAddress(),
          value: ETH_AMOUNT,
        })

        const hashedSecretPhrase =
          ethers.encodeBytes32String(SECRET_REVEAL_PHRASE)
        const hashedWithdrawCommit = ethers.solidityPackedKeccak256(
          ['address', 'bytes32', 'uint256'],
          [addr1Address, hashedSecretPhrase, ETH_AMOUNT],
        )

        await ct.connect(addr1).commitUserWithdraw(hashedWithdrawCommit)

        const tx = await ct
          .connect(addr1)
          .revealUserWithdraw(ETH_AMOUNT, hashedSecretPhrase)

        expect(tx)
          .to.emit(ct, 'WithdrawEvent')
          .withArgs(addr1Address, ETH_AMOUNT)
      })
    })
  })
})
