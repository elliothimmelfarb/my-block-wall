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

      await myBlockWall.connect(acc1).givePermission(acc2.address)

      const givenPermission = await myBlockWall
        .connect(acc1)
        .viewGivenPermission()
      const hasPermissionFrom = await myBlockWall
        .connect(acc2)
        .viewHasPermissionFrom()

      expect(givenPermission).to.include(acc2.address)
      expect(hasPermissionFrom).to.include(acc1.address)
    })
  })
})
