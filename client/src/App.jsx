import React from "react";
import { useState } from 'react'
import { Home } from './Pages/Home.jsx'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Home/>
    </>
  )
}

export default App
