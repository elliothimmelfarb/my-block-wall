import { Router, Route } from 'preact-router'
import { Home } from './views/home/Home'

export function App() {
  return (
    <Router>
      <Route path='/' component={Home} />
    </Router>
  )
}
