import React from 'react'
import { Link } from 'react-router-dom'

const Header: React.FC = () => {
  return (
    <header className="text-center mb-12">
      <Link to="/">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">Cardápio Digital</h1>
      </Link>
      <p className="text-lg text-gray-500 mt-2">Sabores que encantam</p>
    </header>
  )
}

export default Header