import React, { useState, useRef, useEffect } from 'react'

interface PrintDropdownProps {
  onPrint: (type: string) => void
}

const PrintDropdown: React.FC<PrintDropdownProps> = ({ onPrint }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(prev => !prev)} className="text-gray-500 hover:text-gray-800">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          <ul className="py-1">
            <li>
              <button 
                onClick={(e) => { 
                  e.preventDefault(); 
                  onPrint('kitchen'); 
                  setIsOpen(false); 
                }} 
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Comanda (Cozinha)
              </button>
            </li>
            <li>
              <button 
                onClick={(e) => { 
                  e.preventDefault(); 
                  onPrint('customer'); 
                  setIsOpen(false); 
                }} 
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Comanda (Cliente)
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default PrintDropdown