import React from 'react'
import { Order } from '../services/api'

interface CustomerPrintReceiptProps {
  order: Order
}

const CustomerPrintReceipt: React.FC<CustomerPrintReceiptProps> = ({ order }) => {
  const items = order.items_json || []
  const changeToReturn = (order.payment_method === 'Dinheiro' && order.change_for && parseFloat(order.change_for) > 0) ? 
    (parseFloat(order.change_for) - parseFloat(order.total_price)) : null

  return (
    <div className="p-4 text-black bg-white" style={{ width: '288px', fontSize: '12px' }}>
      <h2 className="text-xl font-bold text-center mb-2">Comanda do Pedido #{order.id}</h2>
      <p className="text-xs text-center mb-4">{new Date(order.created_at).toLocaleString('pt-BR')}</p>
      <div className="border-t border-b border-dashed border-black py-2 my-2">
        <p><strong>Cliente:</strong> {order.customer_name}</p>
        <p><strong>Telefone:</strong> {order.customer_phone}</p>
        <p><strong>Endereço:</strong> {order.customer_address}</p>
      </div>
      <div className="py-2">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between mb-1">
            <span>{item.name}</span>
            <span>{parseFloat(item.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-black pt-2 mt-2">
        <div className="flex justify-between font-bold">
          <span>TOTAL</span>
          <span>{parseFloat(order.total_price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
        </div>
        <div className="flex justify-between">
          <span>Pagamento:</span>
          <span>{order.payment_method}</span>
        </div>
        {changeToReturn !== null && changeToReturn >= 0 && (
          <div className="flex justify-between">
            <span>Troco:</span>
            <span>{changeToReturn.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomerPrintReceipt