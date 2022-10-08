import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { ethers } from 'hardhat'

describe('MyBlockWall', () => {
  const deployAndGetAccounts = async () => {
    const MyBlockWall = await ethers.getContractFactory('MyBlockWall')
    const myBlockWall = await MyBlockWall.deploy()

    const [acc1, acc2] = await ethers.getSigners()

    return { myBlockWall, acc1, acc2 }
  }

  describe('giving permission', () => {
    it('is recorded in state', async () => {
      const { myBlockWall, acc1, acc2 } = await loadFixture(
        deployAndGetAccounts,
      )

      await myBlockWall.connect(acc1).grantPermission(acc2.address)

      const givenPermission = await myBlockWall
        .connect(acc1)
        .viewGrantedPermissions()

      const hasPermissionFrom = await myBlockWall
        .connect(acc2)
        .viewReceivedPermissions()

      expect(givenPermission).to.include(acc2.address)
      expect(hasPermissionFrom).to.include(acc1.address)
    })

    it('emits an event', async () => {
      const { myBlockWall, acc1, acc2 } = await loadFixture(
        deployAndGetAccounts,
      )

      await expect(
        await myBlockWall.connect(acc1).grantPermission(acc2.address),
      )
        .to.emit(myBlockWall, 'PermissionGranted')
        .withArgs(acc1.address, acc2.address)
    })

    it('reverts if permission has already been given', async () => {
      const { myBlockWall, acc1, acc2 } = await loadFixture(
        deployAndGetAccounts,
      )

      await myBlockWall.connect(acc1).grantPermission(acc2.address)

      await expect(
        myBlockWall.connect(acc1).grantPermission(acc2.address),
      ).to.be.revertedWith('Permission is already granted.')
    })
  })

  describe('nicknames', () => {
    it('setting reverts if permission has not been granted', async () => {
      const { myBlockWall, acc1, acc2 } = await loadFixture(
        deployAndGetAccounts,
      )

      await expect(
        myBlockWall.connect(acc1).setNickName(acc2.address, 'my friend'),
      ).to.be.revertedWith('Grant permission before setting nicknames.')
    })

    it('can be set if permission is granted', async () => {
      const { myBlockWall, acc1, acc2 } = await loadFixture(
        deployAndGetAccounts,
      )

      await myBlockWall.connect(acc1).grantPermission(acc2.address)

      await myBlockWall.connect(acc1).setNickName(acc2.address, 'my friend')

      await expect(
        await myBlockWall.connect(acc1).viewNickName(acc2.address),
      ).to.equal('my friend')
    })

    it('reverts if the nickname is longer than 15 chars', async () => {
      const { myBlockWall, acc1, acc2 } = await loadFixture(
        deployAndGetAccounts,
      )

      await myBlockWall.connect(acc1).grantPermission(acc2.address)

      const longNickname = new Array(16).fill('c').join('')

      await expect(
        myBlockWall.connect(acc1).setNickName(acc2.address, longNickname),
      ).to.be.revertedWith('Nickname must be less than 16 characters.')
    })
  })

  describe('posting to a wall', () => {
    it('emits a post event', async () => {
      const { myBlockWall, acc1, acc2 } = await loadFixture(
        deployAndGetAccounts,
      )

      await myBlockWall.connect(acc1).grantPermission(acc2.address)

      const message = 'here is my message.'

      await expect(
        await myBlockWall.connect(acc2).postToWall(acc1.address, message),
      )
        .to.emit(myBlockWall, 'Post')
        .withArgs(acc2.address, acc1.address, message)
    })

    it('reverts if user does not have permission', async () => {
      const { myBlockWall, acc1, acc2 } = await loadFixture(
        deployAndGetAccounts,
      )

      const message = 'here is my message.'

      await expect(
        myBlockWall.connect(acc2).postToWall(acc1.address, message),
      ).to.be.revertedWith("You don't have permission.")
    })
  })
})
