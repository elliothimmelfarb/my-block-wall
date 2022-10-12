import { Box, Button, Container, Input } from '@chakra-ui/react'
import { ethers } from 'ethers'
import { useState } from 'preact/hooks'

export const GivePermission = () => {
  const [isAddressValid, setIsAddressValied] = useState(true)
  const [address, setAddress] = useState('')

  const handleInputChange = (event: any) => {
    const { value } = event.target
    setAddress(value)

    if (ethers.utils.isAddress(value)) {
      setIsAddressValied(true)
    } else {
      setIsAddressValied(false)
    }
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
      <Button disabled={!address.length || !isAddressValid}>
        Give Permission
      </Button>
    </Container>
  )
}
