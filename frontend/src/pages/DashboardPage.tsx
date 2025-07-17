import React, { useState, useEffect, useMemo, useRef } from 'react'
import OrderCard from '../components/OrderCard'
import KitchenPrintSlip from '../components/KitchenPrintSlip'
import CustomerPrintReceipt from '../components/CustomerPrintReceipt'
import { fetchOrders, updateOrderStatus, Order } from '../services/api'
import OrderTimer from '../components/OrderTimer'

const DashboardPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSoundEnabled, setIsSoundEnabled] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  
  const filteredOrders = useMemo(() => ({
    'Novo': orders.filter(o => o.status === 'Novo'),
    'Em Produção': orders.filter(o => o.status === 'Em Produção'),
    'A Caminho': orders.filter(o => o.status === 'A Caminho'),
    'Finalizado': orders.filter(o => o.status === 'Finalizado'),
  }), [orders])

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchOrders()
        setOrders(data)
      } catch (err) {
        setError('Erro ao carregar pedidos. Tente novamente mais tarde.')
      } finally {
        setIsLoading(false)
      }
    }

    loadOrders()
    const intervalId = setInterval(loadOrders, 10000)
    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const audioEl = audioRef.current
    if (!audioEl || !hasInteracted) return
    
    if (isSoundEnabled && filteredOrders['Novo'].length > 0) {
      audioEl.play().catch(e => console.error("Erro ao tocar áudio:", e))
    } else {
      audioEl.pause()
      audioEl.currentTime = 0
    }
  }, [filteredOrders, isSoundEnabled, hasInteracted])

  const handleToggleSound = () => {
    if (!hasInteracted) setHasInteracted(true)
    setIsSoundEnabled(prev => !prev)
  }
  
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const updatedOrder = await updateOrderStatus(orderId, newStatus)
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { 
              ...order, 
              status: newStatus, 
              created_at: newStatus === 'Em Produção' ? new Date().toISOString() : order.created_at 
            } 
          : order
      ))
    } catch (err) {
      alert('Falha ao atualizar o status do pedido.')
    }
  }
  
  const handlePrint = (order: Order, type: string) => {
    // Implementação da impressão
    console.log(`Imprimir ${type} para pedido ${order.id}`)
  }

  if (isLoading) {
    return (
      <div className="text-center mt-12">
        <p className="text-gray-500">Carregando painel de pedidos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center mt-12 p-6 bg-red-100 border-2 border-dashed border-red-400 rounded-lg max-w-2xl mx-auto">
        <h2 className="font-bold text-xl text-red-800 mb-2">Falha na Comunicação</h2>
        <p className="text-red-700 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700"
        >
          Tentar Novamente
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      <audio ref={audioRef} src="/notification.mp3" loop />
      
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Painel de Gestão de Pedidos</h1>
        <button 
          onClick={handleToggleSound} 
          className={`p-2 rounded-full transition-colors ${
            isSoundEnabled 
              ? 'bg-red-100 text-red-600 hover:bg-red-200' 
              : 'bg-green-100 text-green-600 hover:bg-green-200'
          }`}
          title={isSoundEnabled ? 'Desativar som' : 'Ativar som'}
        >
          {isSoundEnabled ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l-4-4m0 4l4-4"></path>
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
            </svg>
          )}
        </button>
      </header>
      
      <main className="flex-grow flex p-4 space-x-4 overflow-x-auto">
        <div className="bg-gray-100 rounded-lg w-full md:w-1/4 p-2 flex flex-col">
          <h2 className="text-xl font-bold text-center text-gray-700 p-2 mb-2">
            Novos Pedidos ({filteredOrders['Novo'].length})
          </h2>
          <div className="flex-grow overflow-y-auto kanban-col pr-2">
            {filteredOrders['Novo'].map(order => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onStatusChange={handleStatusChange} 
                onPrint={handlePrint} 
              />
            ))}
          </div>
        </div>
        
        <div className="bg-gray-100 rounded-lg w-full md:w-1/4 p-2 flex flex-col">
          <h2 className="text-xl font-bold text-center text-gray-700 p-2 mb-2">
            Em Produção ({filteredOrders['Em Produção'].length})
          </h2>
          <div className="flex-grow overflow-y-auto kanban-col pr-2">
            {filteredOrders['Em Produção'].map(order => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onStatusChange={handleStatusChange} 
                onPrint={handlePrint} 
              />
            ))}
          </div>
        </div>
        
        <div className="bg-gray-100 rounded-lg w-full md:w-1/4 p-2 flex flex-col">
          <h2 className="text-xl font-bold text-center text-gray-700 p-2 mb-2">
            A Caminho ({filteredOrders['A Caminho'].length})
          </h2>
          <div className="flex-grow overflow-y-auto kanban-col pr-2">
            {filteredOrders['A Caminho'].map(order => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onStatusChange={handleStatusChange} 
                onPrint={handlePrint} 
              />
            ))}
          </div>
        </div>
        
        <div className="bg-gray-100 rounded-lg w-full md:w-1/4 p-2 flex flex-col">
          <h2 className="text-xl font-bold text-center text-gray-700 p-2 mb-2">
            Finalizados ({filteredOrders['Finalizado'].length})
          </h2>
          <div className="flex-grow overflow-y-auto kanban-col pr-2">
            {filteredOrders['Finalizado'].map(order => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onStatusChange={handleStatusChange} 
                onPrint={handlePrint} 
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default DashboardPage