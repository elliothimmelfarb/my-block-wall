import { useMetaMask } from 'metamask-react'
import { Router, Route } from 'preact-router'
import { Home } from './views/home/Home'
import { NotConnected } from './views/notConnected/NotConnected'

export function App() {
  const { status } = useMetaMask()

  return (
    <>
      {status === 'connected' ? (
        <Router>
          <Route path='/' component={Home} />
        </Router>
      ) : (
        <NotConnected />
      )}
    </>
  )
}
