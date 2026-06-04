/**
 * Capa de datos solo en el cliente (sin fetch).
 * La version con backend esta en _backup-backend-integration/api.js
 */
import { findDiscountByCode } from '../data/discounts.js'
import { getCategories, getProductById, getProducts } from './catalog.js'
import { loginLocal, registerLocal } from './localAuth.js'
import { saveOrder } from './orders.js'

export { getCategories, getProductById, getProducts }

export const login = async (email, password) => loginLocal(email, password)

export const register = async (name, email, password) =>
  registerLocal(name, email, password)

export const getDiscountByCode = async (code) => {
  const discount = findDiscountByCode(code)
  if (!discount) {
    throw new Error('Codigo invalido')
  }
  return discount
}

export const createOrder = async ({
  userId,
  userEmail,
  items,
  shipping,
  paymentMethod,
  discountCode,
  totals,
}) => {
  const order = {
    idOrder: Date.now(),
    userId,
    userEmail,
    status: 'CONFIRMED',
    items: items.map(({ product, quantity, unitPrice }) => ({
      idProduct: product.idProduct,
      productName: product.productName,
      imageProduct: product.imageProduct,
      quantity,
      unitPrice,
    })),
    shipping,
    paymentMethod,
    discountCode: discountCode ?? null,
    subtotal: totals.subtotal,
    discountAmount: totals.discountAmount,
    shippingCost: totals.shipping,
    total: totals.total,
    createdAt: new Date().toISOString(),
  }
  return saveOrder(order)
}
