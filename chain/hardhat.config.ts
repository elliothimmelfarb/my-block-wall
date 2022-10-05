import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import 'hardhat-tracer'
import '@nomiclabs/hardhat-solhint'

const config: HardhatUserConfig = {
  solidity: '0.8.17',
  gasReporter: {
    enabled: true,
  },
}

export default config
