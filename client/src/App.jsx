import React from "react";
import { useState } from 'react'
import { Home } from './Pages/Home.jsx'
import { Navbar } from './components/NavBar.jsx'
import { Routes, Route } from 'react-router-dom';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <Home/>
      
    </>
  )
}

export default App
