import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { GameLinks } from './utils/data'
import Home from './pages/Home'
import Navbar from './components/Navbar'


const App = () => {
  return (
    <div>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          {GameLinks.map(link => (
            <Route key={link.id} path={link.path} element={<link.element/>} />
          ))}
        </Routes>
    </div>
  )
}

export default App