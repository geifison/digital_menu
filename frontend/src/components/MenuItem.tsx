import React, { useState, useMemo } from 'react'
import type { MenuItem as MenuItemType, Variant, ModifierGroup } from '../services/api'

interface MenuItemProps {
  item: MenuItemType
  onAddToCart: (cartItem: any) => void
}

const MenuItem: React.FC<MenuItemProps> = ({ item, onAddToCart }) => {
  const variants = item.variants || []
  const modifier_groups = item.modifier_groups || []
  
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    variants.length > 0 ? variants[0].id : null
  )
  
  const [selectedModifiers, setSelectedModifiers] = useState<Record<string, any[]>>({})

  const selectedVariant = useMemo(() => 
    variants.find(v => v.id === selectedVariantId), 
    [variants, selectedVariantId]
  )
  
  const allModifierGroups = useMemo(() => {
    const variantGroups = selectedVariant?.modifier_groups || []
    return [...modifier_groups, ...variantGroups]
  }, [modifier_groups, selectedVariant])

  const handleModifierChange = (group: ModifierGroup, option: any) => {
    setSelectedModifiers(prev => {
      const newSelections = { ...prev }
      const currentGroupSelections = newSelections[group.id] || []
      const isSelected = currentGroupSelections.some(o => o.id === option.id)

      if (group.max_choices === 1) {
        newSelections[group.id] = [option]
      } else {
        if (isSelected) {
          newSelections[group.id] = currentGroupSelections.filter(o => o.id !== option.id)
        } else if (currentGroupSelections.length < group.max_choices) {
          newSelections[group.id] = [...currentGroupSelections, option]
        } else {
          alert(`Você pode escolher no máximo ${group.max_choices} opções para ${group.display_name}.`)
        }
      }
      return newSelections
    })
  }

  const isAddToCartDisabled = useMemo(() => {
    for (const group of allModifierGroups) {
      if (group.is_required) {
        const selectionCount = (selectedModifiers[group.id] || []).length
        if (selectionCount < group.min_choices) {
          return true
        }
      }
    }
    return false
  }, [selectedModifiers, allModifierGroups])

  const calculateTotalPrice = () => {
    let total = parseFloat(item.base_price)
    if (selectedVariant) {
      total += parseFloat(selectedVariant.additional_price)
    }
    Object.values(selectedModifiers).flat().forEach(option => {
      total += parseFloat(option.additional_price)
    })
    return parseFloat(total.toFixed(2))
  }

  const handleAddToCart = () => {
    const cartItem = {
      ...item,
      cartItemId: Date.now(),
      selectedVariant: selectedVariant,
      selectedModifiers: Object.values(selectedModifiers).flat(),
      finalPrice: calculateTotalPrice()
    }
    onAddToCart(cartItem)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden flex flex-col transform hover:scale-105 transition-transform duration-300">
      {item.image_url && (
        <img 
          src={item.image_url} 
          alt={item.name} 
          className="w-full h-48 object-cover"
          onError={e => { 
            // Substitui a imagem por uma padrão caso ocorra erro
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/default-image.png'; // Coloque uma imagem padrão em public/
          }} 
        />
      )}
      
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
          <p className="text-gray-600 mt-2 flex-grow">{item.description}</p>
          
          {variants.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-500 mb-2">Opções:</h4>
              <div className="flex flex-col gap-1">
                {variants.map(variant => (
                  <label key={variant.id} className="flex items-center text-gray-700 cursor-pointer">
                    <input 
                      type="radio" 
                      name={`variant-${item.id}`} 
                      checked={selectedVariantId === variant.id} 
                      onChange={() => setSelectedVariantId(variant.id)} 
                      className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" 
                    />
                    <span className="ml-2">
                      {variant.name} (+
                      {parseFloat(variant.additional_price).toLocaleString('pt-BR', { 
                        style: 'currency', 
                        currency: 'BRL' 
                      })})
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
          
          {allModifierGroups.map(group => (
            <div key={group.id} className="mt-4">
              <h4 className="text-sm font-semibold text-gray-500 mb-2">
                {group.display_name} 
                {group.is_required && <span className="text-red-500">*</span>}
                <span className="text-xs font-normal text-gray-400 ml-2">
                  (Escolha {group.min_choices > 0 ? `de ${group.min_choices}` : ''} até {group.max_choices})
                </span>
              </h4>
              {group.options.map(option => (
                <label key={option.id} className="flex items-center text-gray-700 cursor-pointer">
                  <input
                    type={group.max_choices === 1 ? 'radio' : 'checkbox'}
                    name={`modifier-${group.id}`}
                    checked={(selectedModifiers[group.id] || []).some(o => o.id === option.id)}
                    onChange={() => handleModifierChange(group, option)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <span className="ml-2">
                    {option.name} 
                    {Number(option.additional_price) > 0 && (
                      `( +${parseFloat(option.additional_price).toLocaleString('pt-BR', { 
                        style: 'currency', 
                        currency: 'BRL' 
                      })} )`
                    )}
                  </span>
                </label>
              ))}
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex justify-between items-center">
          <p className="text-xl font-bold text-indigo-600">
            {calculateTotalPrice().toLocaleString('pt-BR', { 
              style: 'currency', 
              currency: 'BRL' 
            })}
          </p>
          
          {item.is_available ? (
            <button 
              onClick={handleAddToCart} 
              disabled={isAddToCartDisabled} 
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Adicionar
            </button>
          ) : (
            <span className="px-3 py-1 text-xs font-semibold text-red-800 bg-red-200 rounded-full">
              Indisponível
            </span>
          )}
        </div>
      </div>
    </div>
  )
}// src/components/MenuItem.tsx
import React, { useState, useMemo } from 'react'
// Atualize o import para vir do 'api'
import type { MenuItem as MenuItemType, Variant, ModifierGroup } from '../services/api'

// ... restante do código ...

export default MenuItem