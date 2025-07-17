import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './components/Header'

const App: React.FC = () => {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Header />
      <Outlet />
    </div>
  )
}

export default App