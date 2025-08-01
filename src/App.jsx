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
import Login from './Pages/Login.jsx';
import Register from './Pages/Register.jsx';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateCapsule />} />
        <Route path="/capsule/:id" element={<OpenCapsule />} />
        <Route path="/my-capsules" element={<ProtectedRoute><MyCapsules /></ProtectedRoute>}/>
        <Route path="/about" element={<About />} />
        <Route path="/shared/:id" element={<SharedCapsule />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
      <>
      <Toaster
        position="top-center" 
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#333',
            padding: '16px',
            fontWeight: '500',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#e0fbe4',
            },
          },
          error: {
            style: {
              background: '#fee2e2',
              color: '#b91c1c',
            },
            iconTheme: {
              primary: '#dc2626',
              secondary: '#fee2e2',
            },
          },
        }}
      />
    </>



    </>
  )
}

export default App
