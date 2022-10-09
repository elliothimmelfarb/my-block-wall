import { Button, Flex, Heading } from '@chakra-ui/react'
import { useMetaMask } from 'metamask-react'

export const NotConnected = () => {
  const { connect } = useMetaMask()

  return (
    <Flex width='100%'>
      <Heading>Not Connected</Heading>
      <Button onClick={connect}>Connect to MetaMask</Button>
    </Flex>
  )
}
