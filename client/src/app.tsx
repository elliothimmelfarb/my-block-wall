import { Router, Route } from 'preact-router'
import { Home } from './views/home/Home'
import { NotConnected } from './views/notConnected/NotConnected'

export function App() {
  const isConnected = true

  return (
    <Router>
      <Route path='/' component={isConnected ? Home : NotConnected} />
    </Router>
  )
}
