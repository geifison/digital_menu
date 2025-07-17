import React from 'react'
import { Order } from '../services/api'

interface KitchenPrintSlipProps {
  order: Order
}

const KitchenPrintSlip: React.FC<KitchenPrintSlipProps> = ({ order }) => {
  const items = order.items_json || []
  
  return (
    <div className="p-4 text-black bg-white" style={{ width: '288px', fontSize: '12px' }}>
      <h2 className="text-2xl font-bold text-center mb-4">Pedido #{order.id}</h2>
      <p className="text-center mb-4"><strong>Cliente:</strong> {order.customer_name}</p>
      <div className="border-t border-b border-black py-2 my-2">
        {items.map((item, index) => (
          <div key={index} className="mb-1">
            <p className="font-bold">{item.name}</p>
            {item.variant && <p className="pl-2">- {item.variant}</p>}
            {item.modifiers && item.modifiers.length > 0 && (
              <p className="pl-2">- {item.modifiers.join(', ')}</p>
            )}
          </div>
        ))}
      </div>
      {order.customer_observation && (
        <div className="mt-4">
          <h3 className="font-bold text-lg">OBSERVAÇÕES:</h3>
          <p className="text-md">{order.customer_observation}</p>
        </div>
      )}
    </div>
  )
}

export default KitchenPrintSlip