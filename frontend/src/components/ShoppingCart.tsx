import React, { useMemo } from 'react'

interface ShoppingCartProps {
  cart: any[]
  setCart: React.Dispatch<React.SetStateAction<any[]>>
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  onCheckout: () => void
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ 
  cart, 
  setCart, 
  isOpen, 
  setIsOpen, 
  onCheckout 
}) => {
  const removeFromCart = (cartItemId: number) => {
    setCart(c => c.filter(item => item.cartItemId !== cartItemId))
  }

  const total = useMemo(() => 
    cart.reduce((sum, item) => sum + item.finalPrice, 0), 
    [cart]
  )

  return (
    <div className={`fixed top-0 right-0 h-full w-full md:w-1/3 lg:w-1/4 bg-white shadow-2xl z-40 cart-sidebar transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex flex-col h-full">
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-2xl font-bold">Seu Pedido</h2>
          <button 
            onClick={() => setIsOpen(false)} 
            className="text-gray-500 hover:text-gray-800 text-3xl"
          >
            &times;
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto p-4">
          {cart.length === 0 ? (
            <p className="text-gray-500">Seu carrinho está vazio.</p>
          ) : (
            cart.map(item => (
              <div key={item.cartItemId} className="flex justify-between items-start mb-4 pb-4 border-b">
                <div>
                  <p className="font-bold">{item.name}</p>
                  {item.selectedVariant && (
                    <p className="text-sm text-gray-500">- {item.selectedVariant.name}</p>
                  )}
                  {item.selectedModifiers && item.selectedModifiers.map(m => (
                    <p key={m.id} className="text-sm text-gray-500">- {m.name}</p>
                  ))}
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {item.finalPrice.toLocaleString('pt-BR', { 
                      style: 'currency', 
                      currency: 'BRL' 
                    })}
                  </p>
                  <button 
                    onClick={() => removeFromCart(item.cartItemId)} 
                    className="text-red-500 text-xs hover:underline"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="p-4 border-t">
          <div className="flex justify-between items-center text-xl font-bold mb-4">
            <span>Total:</span>
            <span>
              {total.toLocaleString('pt-BR', { 
                style: 'currency', 
                currency: 'BRL' 
              })}
            </span>
          </div>
          <button 
            onClick={onCheckout} 
            className="w-full bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600 disabled:bg-gray-300" 
            disabled={cart.length === 0}
          >
            Finalizar Pedido
          </button>
        </div>
      </div>
    </div>
  )
}

export default ShoppingCart