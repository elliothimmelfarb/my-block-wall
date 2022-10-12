import { ChakraProvider } from '@chakra-ui/react'
import { MetaMaskProvider } from 'metamask-react'
import { render } from 'preact'
import { App } from './App'

render(
  <ChakraProvider>
    <MetaMaskProvider>
      <App />
    </MetaMaskProvider>
  </ChakraProvider>,
  document.getElementById('app') as HTMLElement,
)
