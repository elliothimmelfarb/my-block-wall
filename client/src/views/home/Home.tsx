import { Center, Container, Heading } from '@chakra-ui/react'
import { useMetaMask } from 'metamask-react'

export const Home = () => {
  const { account } = useMetaMask()

  return (
    <Container maxW='7xl' width='100%' direction='column' align='center'>
      <Heading>This is your Home</Heading>

      <Heading>This is your account:</Heading>
      <Heading>{account}</Heading>

      <Center>Give Permission to Account</Center>
      <Center>Accounts you have permission from</Center>
      <Center>Accounts you have given permission to</Center>
      <Center>Your Wall</Center>
    </Container>
  )
}
