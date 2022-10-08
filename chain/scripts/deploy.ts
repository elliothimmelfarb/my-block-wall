import { ethers } from 'hardhat'

async function main() {
  const MyBlockWall = await ethers.getContractFactory('MyBlockWall')
  const myBlockWall = await MyBlockWall.deploy()

  await myBlockWall.deployed()

  console.log(`Contract MyBlockWall is deployed to ${myBlockWall.address}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
