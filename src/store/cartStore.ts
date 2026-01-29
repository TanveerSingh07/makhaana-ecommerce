import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  productVariantId: string
  productName: string
  flavour: string
  packetSize: string
  price: number
  quantity: number
  image?: string
  sku: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (productVariantId: string) => void
  updateQuantity: (productVariantId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find(
            i => i.productVariantId === item.productVariantId
          )
          
          if (existingItem) {
            return {
              items: state.items.map(i =>
                i.productVariantId === item.productVariantId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              )
            }
          }
          
          return {
            items: [...state.items, { ...item, id: Date.now().toString() }]
          }
        })
      },
      
      removeItem: (productVariantId) => {
        set((state) => ({
          items: state.items.filter(i => i.productVariantId !== productVariantId)
        }))
      },
      
      updateQuantity: (productVariantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productVariantId)
          return
        }
        
        set((state) => ({
          items: state.items.map(i =>
            i.productVariantId === productVariantId
              ? { ...i, quantity }
              : i
          )
        }))
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotal: () => {
        return get().items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      },
      
      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      }
    }),
    {
      name: 'makhaana-cart',
    }
  )
)