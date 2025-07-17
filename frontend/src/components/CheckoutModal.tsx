import React, { useState, useEffect, useMemo } from 'react'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  cart: any[]
  total: number
  handleFinalizeOrder: (details: any) => Promise<void>
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ 
  isOpen, 
  onClose, 
  cart, 
  total, 
  handleFinalizeOrder 
}) => {
  const [customerDetails, setCustomerDetails] = useState({
    name: '', 
    phone: '', 
    address: '', 
    observation: '', 
    paymentMethod: 'Cartão de Crédito', 
    change_for: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    
    const savedDetails = localStorage.getItem('customerDetails')
    if (savedDetails) {
      setCustomerDetails(prev => ({
        ...prev,
        ...JSON.parse(savedDetails),
        observation: '',
        change_for: ''
      }))
    }
  }, [isOpen])

  const formatCurrency = (value: string) => {
    if (!value) return ''
    const digitsOnly = value.replace(/\D/g, '')
    if (digitsOnly === '') return ''
    const numberValue = parseInt(digitsOnly, 10)
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(numberValue / 100)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === 'change_for') {
      const formattedValue = formatCurrency(value)
      setCustomerDetails(prev => ({ ...prev, [name]: formattedValue }))
    } else {
      setCustomerDetails(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const detailsToSave = {
      name: customerDetails.name,
      phone: customerDetails.phone,
      address: customerDetails.address,
    }
    
    localStorage.setItem('customerDetails', JSON.stringify(detailsToSave))
    
    await handleFinalizeOrder(customerDetails)
    
    setIsSubmitting(false)
  }

  const calculatedChange = useMemo(() => {
    if (customerDetails.paymentMethod === 'Dinheiro' && customerDetails.change_for) {
      const changeValue = parseFloat(customerDetails.change_for.replace(/\D/g, '')) / 100
      if (!isNaN(changeValue) && changeValue >= total) {
        return changeValue - total
      }
    }
    return null
  }, [customerDetails.change_for, total, customerDetails.paymentMethod])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 modal-backdrop">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md m-4 modal-content transform scale-95">
        <h2 className="text-2xl font-bold mb-6">Finalizar Pedido</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={customerDetails.name}
            onChange={handleChange}
            placeholder="Seu Nome Completo"
            className="w-full p-2 border rounded mb-4"
            required
            disabled={isSubmitting}
          />
          
          <input
            type="tel"
            name="phone"
            value={customerDetails.phone}
            onChange={handleChange}
            placeholder="Seu Telefone (WhatsApp)"
            className="w-full p-2 border rounded mb-4"
            required
            disabled={isSubmitting}
          />
          
          <textarea
            name="address"
            value={customerDetails.address}
            onChange={handleChange}
            placeholder="Seu Endereço Completo"
            className="w-full p-2 border rounded mb-4"
            rows={3}
            required
            disabled={isSubmitting}
          ></textarea>
          
          <textarea
            name="observation"
            value={customerDetails.observation}
            onChange={handleChange}
            placeholder="Observações (ex: sem cebola, ponto da carne)"
            className="w-full p-2 border rounded mb-4"
            rows={2}
            disabled={isSubmitting}
          ></textarea>
          
          <select
            name="paymentMethod"
            value={customerDetails.paymentMethod}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-4"
            disabled={isSubmitting}
          >
            <option>Cartão de Crédito</option>
            <option>Cartão de Débito</option>
            <option>PIX</option>
            <option>Dinheiro</option>
          </select>
          
          {customerDetails.paymentMethod === 'Dinheiro' && (
            <div>
              <input
                type="text"
                name="change_for"
                value={customerDetails.change_for}
                onChange={handleChange}
                placeholder="Troco para quanto?"
                className="w-full p-2 border rounded mb-2"
                disabled={isSubmitting}
              />
              
              {calculatedChange !== null && (
                <p className="text-sm text-gray-600 mb-6">
                  Seu troco será de: 
                  <strong className="text-green-600 ml-1">
                    {calculatedChange.toLocaleString('pt-BR', { 
                      style: 'currency', 
                      currency: 'BRL' 
                    })}
                  </strong>
                </p>
              )}
            </div>
          )}
          
          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : `Confirmar Pedido (${total.toLocaleString('pt-BR', { 
                style: 'currency', 
                currency: 'BRL' 
              })})`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CheckoutModal