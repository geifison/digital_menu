import React from 'react'
import { Order } from '../services/api'
import OrderTimer from './OrderTimer'
import PrintDropdown from './PrintDropdown'

interface OrderCardProps {
  order: Order
  onStatusChange: (orderId: string, newStatus: string) => void
  onPrint: (order: Order, type: string) => void
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onStatusChange, onPrint }) => {
  const STATUS_CONFIG = {
    'Novo': { nextStatus: 'Em Produção', actionText: 'Aceitar Pedido', bgColor: 'bg-blue-100', buttonColor: 'bg-blue-500 hover:bg-blue-600' },
    'Em Produção': { nextStatus: 'A Caminho', actionText: 'Pronto para Entrega', bgColor: 'bg-yellow-100', buttonColor: 'bg-yellow-500 hover:bg-yellow-600' },
    'A Caminho': { nextStatus: 'Finalizado', actionText: 'Finalizar Pedido', bgColor: 'bg-green-100', buttonColor: 'bg-green-500 hover:bg-green-600' },
    'Finalizado': { bgColor: 'bg-gray-200' }
  }

  const config = STATUS_CONFIG[order.status] || {}
  const items = order.items_json || []
  
  const changeToReturn = () => {
    if (order.payment_method === 'Dinheiro' && order.change_for && parseFloat(order.change_for) > 0) {
      const change = parseFloat(order.change_for) - parseFloat(order.total_price)
      return change >= 0 ? change : null
    }
    return null
  }

  return (
    <div className={`p-4 rounded-lg shadow-md mb-4 ${config.bgColor}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-lg">Pedido #{order.id}</h3>
        <div className="flex items-center gap-2">
          {order.status !== 'Novo' && order.status !== 'Finalizado' && (
            <div className="flex items-center gap-1 text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <OrderTimer createdAt={order.created_at} status={order.status} />
            </div>
          )}
          <PrintDropdown onPrint={(type) => onPrint(order, type)} />
        </div>
      </div>
      
      <div className="text-sm space-y-2">
        <p><strong>Cliente:</strong> {order.customer_name}</p>
        <p><strong>Telefone:</strong> {order.customer_phone}</p>
        <p><strong>Endereço:</strong> {order.customer_address}</p>
        {order.customer_observation && <p className="p-2 bg-yellow-50 rounded"><strong>Obs:</strong> {order.customer_observation}</p>}
        
        <div className="border-t border-gray-300 my-2 pt-2">
          <h4 className="font-semibold mb-1">Itens:</h4>
          <ul className="list-disc pl-5">
            {items.map((item, index) => (
              <li key={index}>
                {item.name}
                {item.variant && <span className="text-xs text-gray-600"> ({item.variant})</span>}
                {item.modifiers && item.modifiers.length > 0 && <span className="text-xs text-gray-600">, Adicionais: {item.modifiers.join(', ')}</span>}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex justify-between items-center font-semibold border-t border-gray-300 pt-2">
          <span>{order.payment_method}</span>
          <span>{parseFloat(order.total_price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
        </div>
        {changeToReturn() !== null && (
          <div className="text-right text-xs space-y-1 mt-1 p-2 bg-green-50 rounded-md">
            <span>Troco para: {parseFloat(order.change_for).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            <span className="block font-bold text-green-700">DEVOLVER: {changeToReturn()!.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
          </div>
        )}
      </div>
      
      {config.nextStatus && (
        <button 
          onClick={() => onStatusChange(order.id, config.nextStatus)}
          className={`w-full mt-4 py-2 text-white font-bold rounded-lg transition-colors ${config.buttonColor}`}
        >
          {config.actionText}
        </button>
      )}
    </div>
  )
}

export default OrderCard