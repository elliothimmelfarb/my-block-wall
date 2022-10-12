import { useMetaMask } from 'metamask-react'
import { Router, Route } from 'preact-router'
import { Home } from './views/Home/Home'
import { NotConnected } from './views/NotConnected/NotConnected'

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
