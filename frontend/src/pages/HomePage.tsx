import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import CategorySection from '../components/CategorySection'
import ShoppingCart from '../components/ShoppingCart'
import CheckoutModal from '../components/CheckoutModal'
import ErrorMessage from '../components/ErrorMessage'
import { fetchCategories } from '../services/api'
import { Category } from '../services/types'

const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cart, setCart] = useState<any[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  const cartTotal = useMemo(() => 
    cart.reduce((sum, item) => sum + item.finalPrice, 0), 
    [cart]
  )

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const data = await fetchCategories()
        setCategories(data)
      } catch (err) {
        setError('Erro ao carregar o cardápio. Tente novamente mais tarde.')
      } finally {
        setIsLoading(false)
      }
    }

    loadMenu()
  }, [])

  const handleAddToCart = (cartItem: any) => {
    setCart(prev => [...prev, cartItem])
    setIsCartOpen(true)
  }

  const handleFinalizeOrder = async (customerDetails: any) => {
    try {
      // Formatar dados para enviar ao backend
      const orderData = {
        customer_name: customerDetails.name,
        customer_phone: customerDetails.phone,
        customer_address: customerDetails.address,
        customer_observation: customerDetails.observation,
        payment_method: customerDetails.paymentMethod,
        change_for: customerDetails.change_for,
        total_price: cartTotal,
        items: cart.map(item => ({
          menu_item_id: item.id,
          variant_id: item.selectedVariant?.id,
          modifiers: item.selectedModifiers.map((m: any) => m.id),
          quantity: 1,
          price: item.finalPrice,
        }))
      }

      // Enviar para o backend
      await createOrder(orderData)

      // Limpar carrinho e fechar modais
      setCart([])
      setIsCheckoutOpen(false)
      setIsCartOpen(false)
      alert('Pedido realizado com sucesso!')
    } catch (err) {
      alert('Erro ao finalizar pedido. Tente novamente.')
      console.error(err)
    }
  }

  if (isLoading) {
    return (
      <div className="text-center mt-12">
        <p className="text-gray-500">Carregando cardápio...</p>
      </div>
    )
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={() => window.location.reload()} />
  }

  return (
    <>
      <main>
        {categories.map(category => (
          <CategorySection 
            key={category.id} 
            category={category} 
            onAddToCart={handleAddToCart} 
          />
        ))}
      </main>

      <div className="fixed bottom-8 right-8 z-30">
        <button 
          onClick={() => setIsCartOpen(true)} 
          className="bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 flex items-center justify-center"
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            ></path>
          </svg>
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-2 py-1">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      <ShoppingCart 
        cart={cart} 
        setCart={setCart} 
        isOpen={isCartOpen} 
        setIsOpen={setIsCartOpen} 
        onCheckout={() => setIsCheckoutOpen(true)} 
      />
      
      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        cart={cart} 
        total={cartTotal} 
        handleFinalizeOrder={handleFinalizeOrder} 
      />
      
      <div className="text-center mt-8">
        <Link 
          to="/dashboard" 
          className="inline-block px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
        >
          Painel de Pedidos
        </Link>
      </div>
    </>
  )
}

export default HomePage