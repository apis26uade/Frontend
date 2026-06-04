import {
  categories as defaultCategories,
  featuredProducts as defaultProducts,
} from '../data/products.js'

const CATALOG_KEY = 'boho_catalog'

const readCatalog = () => {
  try {
    const saved = localStorage.getItem(CATALOG_KEY)
    return saved ? JSON.parse(saved) : [...defaultProducts]
  } catch {
    return [...defaultProducts]
  }
}

const writeCatalog = (products) => {
  localStorage.setItem(CATALOG_KEY, JSON.stringify(products))
}

export const getStoredProducts = () => readCatalog()

export const getStoredCategories = () => [...defaultCategories]

export const saveProduct = (product) => {
  const products = readCatalog()
  const idProduct = product.idProduct ?? Date.now()
  const category =
    typeof product.category === 'object'
      ? product.category
      : defaultCategories.find((c) => c.idCategory === Number(product.categoryId)) ??
        defaultCategories[0]

  const entry = {
    idProduct,
    productName: product.productName?.trim() || 'Producto sin nombre',
    productDescription: product.productDescription?.trim() || '',
    price: Number(product.price) || 0,
    stock: Math.max(0, Number(product.stock) || 0),
    imageProduct: product.imageProduct?.trim() || '',
    category,
  }

  const index = products.findIndex((p) => p.idProduct === idProduct)
  if (index >= 0) {
    products[index] = { ...products[index], ...entry }
  } else {
    products.push(entry)
  }
  writeCatalog(products)
  return entry
}

export const deleteStoredProduct = (idProduct) => {
  const products = readCatalog().filter((p) => p.idProduct !== Number(idProduct))
  writeCatalog(products)
}

export const resetCatalog = () => {
  localStorage.removeItem(CATALOG_KEY)
}
