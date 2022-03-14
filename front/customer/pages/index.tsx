import type { NextPage } from 'next'
import { useState, useEffect } from 'react'
import Home from '../components/Home'

const App = () => {
  const [showApp, setShowApp] = useState(false)

  const init = async () => {
    setShowApp(true)
  }

  useEffect(() => {
    init()
  }, [])

  if (!showApp) {
    return <p>Loading..</p>
  }

  return <Home />
}

export default App
