import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs'
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
        .viewSendersPermissionsGiven()

      const hasPermissionFrom = await myBlockWall
        .connect(acc2)
        .viewSendersPermissionsReceived()

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

  describe('posting to a wall', () => {
    it('emits a post event', async () => {
      const { myBlockWall, acc1, acc2 } = await loadFixture(
        deployAndGetAccounts,
      )

      await myBlockWall.connect(acc1).grantPermission(acc2.address)

      const message = 'here is my message.'
      const signature = 'me'

      await expect(
        await myBlockWall
          .connect(acc2)
          .postToWall(acc1.address, message, signature),
      )
        .to.emit(myBlockWall, 'Post')
        .withArgs(acc2.address, acc1.address, message, signature)
    })

    it('reverts if user does not have permission', async () => {
      const { myBlockWall, acc1, acc2 } = await loadFixture(
        deployAndGetAccounts,
      )

      const message = 'here is my message.'
      const signature = 'me'

      await expect(
        myBlockWall.connect(acc2).postToWall(acc1.address, message, signature),
      ).to.be.revertedWith("You don't have permission.")
    })
  })
})
