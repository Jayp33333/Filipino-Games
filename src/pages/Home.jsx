import React from 'react'
import { Link } from 'react-router-dom'
import { GameLinks } from '../utils/data'

const Home = () => {
  return (
     <div className="grid grid-cols-3 gap-6 p-6">
      {/* Tic-Tac-Toe Card */}
      {GameLinks.map(link => (
        <Link
          key={link.id}
          to={link.path}
          className="border border-black text-black rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300 hover:bg-white/10"
        >
          <h2 className="text-xl font-bold mb-2">{link.label}</h2>
          {/* <p className="text-gray-600 text-sm text-center">
            {link.description}
          </p> */}
        </Link>
      ))}
    </div>
  )
}

export default Home