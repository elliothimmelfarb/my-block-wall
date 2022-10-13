import { Box, Button, Container, Input } from '@chakra-ui/react'
import { ethers } from 'ethers'
import { useMetaMask } from 'metamask-react'
import { useState } from 'preact/hooks'

const contractAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3'
const abi = ['function grantPermission(address target) public']

const provider = new ethers.providers.Web3Provider(window.ethereum)

const signer = provider.getSigner()

const contract = new ethers.Contract(contractAddress, abi, provider)

const contractWithSigner = contract.connect(signer)

export const GivePermission = () => {
  const [isAddressValid, setIsAddressValied] = useState(true)
  const [address, setAddress] = useState('')

  const { ethereum } = useMetaMask()

  const handleInputChange = (event: any) => {
    const { value } = event.target
    setAddress(value)

    if (ethers.utils.isAddress(value)) {
      setIsAddressValied(true)
    } else {
      setIsAddressValied(false)
    }
  }

  const handleGivePermission = async () => {
    const contractAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3'
    const abi = ['function grantPermission(address target) public']

    const provider = new ethers.providers.Web3Provider(ethereum)

    console.log({ provider })

    const signer = provider.getSigner(0)

    console.log({ signer })

    const contract = new ethers.Contract(contractAddress, abi, provider)

    console.log({ contract })

    const contractWithSigner = contract.connect(signer)

    console.log({ contractWithSigner })

    console.log('give permission to', address)
    const result = await contractWithSigner.grantPermission(address)
    console.log({ result })
  }

  return (
    <Container>
      Give permission to a new address:
      <Input
        boxShadow='md'
        focusBorderColor={isAddressValid ? 'green.500' : 'red.500'}
        borderColor={isAddressValid ? 'green.500' : 'red.500'}
        value={address}
        isInvalid={!isAddressValid}
        onChange={handleInputChange}
        placeholder="Paste a friend's account here..."
      />
      {!!address.length && !isAddressValid && (
        <Box color='red.500'>Address is not valid</Box>
      )}
      <Button
        onClick={handleGivePermission}
        disabled={!address.length || !isAddressValid}
      >
        Give Permission
      </Button>
    </Container>
  )
}
