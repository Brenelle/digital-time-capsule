import React from "react";
import { useState } from 'react'
import { Home } from './Pages/Home.jsx'
import { Navbar } from './components/NavBar.jsx'
import { Routes, Route } from 'react-router-dom';
import { CreateCapsule } from './Pages/CreateCapsule.jsx';
import { MyCapsules } from './Pages/MyCapsules.jsx'
import { Footer } from './components/Footer.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateCapsule/>} />
        <Route path="/my-capsules" element={<MyCapsules/>} />
      </Routes>
      <Footer/>
      
      
      
    </>
  )
}

export default App
