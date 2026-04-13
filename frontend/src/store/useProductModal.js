import { create } from 'zustand'

export const useProductModalStore = create((set) => ({
  isAddProductOpen: false,
  isEditProductOpen: false,
  isDeleteWarningOpen: false,
  selectedProduct: null,
  newProduct: {
    id: '',
    name: '',
    description: '',
    price: '',
    quantity: '',
  },
  setAddProductOpen: (value) => set({ isAddProductOpen: value }),
  setEditProductOpen: (value) => set({ isEditProductOpen: value }),
  setDeleteWarningOpen: (value) => set({ isDeleteWarningOpen: value }),
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  setNewProduct: (partial) => set((state) => ({
    newProduct: {
      ...state.newProduct,
      ...partial,
    },
  })),
  resetNewProduct: () => set({
    newProduct: {
      id: '',
      name: '',
      description: '',
      price: '',
      quantity: '',
    },
  }),
  resetSelectedProduct: () => set({ selectedProduct: null }),
}))
