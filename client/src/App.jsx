import React from "react";
import { useState } from 'react'
import { Home } from './Pages/Home.jsx'
import { Navbar } from './components/NavBar.jsx'
import { Routes, Route } from 'react-router-dom';
import { CreateCapsule } from './Pages/CreateCapsule.jsx';
import { OpenCapsule } from './Pages/OpenCapsule';
import { MyCapsules } from './Pages/MyCapsules.jsx'
import { About } from './Pages/About.jsx'
import { Footer } from './components/Footer.jsx'
import { SharedCapsule } from './Pages/SharedCapsule';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateCapsule/>} />
        <Route path="/capsule/:id" element={<OpenCapsule />} />
        <Route path="/my-capsules" element={<MyCapsules/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/shared/:id" element={<SharedCapsule />} />
      </Routes>
      <Footer/>
      
      
      
    </>
  )
}

export default App
  