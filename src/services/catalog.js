import { getStoredCategories, getStoredProducts } from './catalogStore.js'

export const getProducts = () => getStoredProducts()

export const getCategories = () => getStoredCategories()

export const getProductById = (id) =>
  getStoredProducts().find((product) => String(product.idProduct) === String(id)) ?? null
