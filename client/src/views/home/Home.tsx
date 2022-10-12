import { Container, Flex, Heading, Stack } from '@chakra-ui/react'
import { useMetaMask } from 'metamask-react'

export const Home = () => {
  const { account } = useMetaMask()

  return (
    <Container maxW='5xl' width='100%' direction='column' align='center'>
      <Heading>Home</Heading>
      <Heading>{account}</Heading>
    </Container>
  )
}
