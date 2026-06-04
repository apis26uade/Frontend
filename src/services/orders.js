const ORDERS_KEY = 'boho_orders'

export const formatOrderId = (id) => String(id).slice(-8).toUpperCase()

export const ORDER_STATUSES = [
  { value: 'CONFIRMED', label: 'Confirmado' },
  { value: 'PREPARING', label: 'En preparacion' },
  { value: 'SHIPPED', label: 'Enviado' },
  { value: 'DELIVERED', label: 'Entregado' },
  { value: 'CANCELLED', label: 'Cancelado' },
]

const readOrders = () => {
  try {
    const saved = localStorage.getItem(ORDERS_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

const writeOrders = (orders) => {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
}

export const getAllOrders = () =>
  readOrders().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

export const getOrdersForUser = (userId) =>
  getAllOrders().filter((order) => order.userId === userId)

export const getOrderById = (idOrder) =>
  readOrders().find((order) => String(order.idOrder) === String(idOrder)) ?? null

export const saveOrder = (order) => {
  const orders = readOrders()
  orders.push(order)
  writeOrders(orders)
  return order
}

export const updateOrderStatus = (idOrder, status) => {
  const orders = readOrders()
  const index = orders.findIndex((o) => String(o.idOrder) === String(idOrder))
  if (index < 0) throw new Error('Pedido no encontrado')
  orders[index] = { ...orders[index], status }
  writeOrders(orders)
  return orders[index]
}
