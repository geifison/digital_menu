// src/components/CategorySection.tsx
import React from 'react'
import MenuItem from './MenuItem'
// Atualize o import para vir do 'api' em vez de 'types'
import { Category } from '../services/api'

interface CategorySectionProps {
  category: Category
  onAddToCart: (cartItem: any) => void
}

const CategorySection: React.FC<CategorySectionProps> = ({ category, onAddToCart }) => {
  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold mb-6 border-b pb-2">{category.name}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {category.menu_items.map(item => (
          <MenuItem key={item.id} item={item} onAddToCart={onAddToCart} />
        ))}
      </div>
    </div>
  )
}

export default CategorySection