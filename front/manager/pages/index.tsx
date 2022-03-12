import type { NextPage } from 'next'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Home from '../components/Home'

//import login from '../utils/LoginWrapper'

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
