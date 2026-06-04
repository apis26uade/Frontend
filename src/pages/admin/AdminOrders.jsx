import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllOrders, ORDER_STATUSES, updateOrderStatus } from '../../services/orders.js'
import { PAYMENT_METHODS } from '../../data/paymentMethods.js'

const formatPrice = (price) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(price)

const paymentLabel = (id) =>
  PAYMENT_METHODS.find((method) => method.id === id)?.label ?? id

function AdminOrders() {
  const [refreshKey, setRefreshKey] = useState(0)
  const orders = useMemo(() => getAllOrders(), [refreshKey])

  const handleStatusChange = (idOrder, status) => {
    updateOrderStatus(idOrder, status)
    setRefreshKey((key) => key + 1)
  }

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <p className="eyebrow">Ventas</p>
          <h1>Pedidos</h1>
        </div>
      </header>

      {orders.length === 0 ? (
        <div className="admin-card empty-state">
          <h2>Sin pedidos aun</h2>
          <p>Cuando un cliente confirme una compra, aparecera aqui.</p>
        </div>
      ) : (
        <div className="admin-orders-list">
          {orders.map((order) => (
            <article className="admin-card admin-order-card" key={order.idOrder}>
              <div className="admin-order-head">
                <div>
                  <h2>Pedido #{order.idOrder}</h2>
                  <p>
                    {order.userEmail} · {new Date(order.createdAt).toLocaleString('es-AR')}
                  </p>
                </div>
                <div className="admin-order-meta">
                  <label>
                    Estado
                    <select
                      value={order.status}
                      onChange={(event) =>
                        handleStatusChange(order.idOrder, event.target.value)
                      }
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <strong>{formatPrice(order.total)}</strong>
                </div>
              </div>
              <div className="admin-order-grid">
                <div>
                  <p className="admin-label">Envio</p>
                  <p>
                    {order.shipping?.name}
                    <br />
                    {order.shipping?.address}, {order.shipping?.city}{' '}
                    {order.shipping?.postalCode}
                  </p>
                </div>
                <div>
                  <p className="admin-label">Pago</p>
                  <p>{paymentLabel(order.paymentMethod?.type)}</p>
                </div>
                <div>
                  <p className="admin-label">Items</p>
                  <ul className="admin-order-items">
                    {order.items.map((item) => (
                      <li key={`${order.idOrder}-${item.idProduct}`}>
                        {item.productName} x{item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <Link className="text-link" to={`/pedidos/${order.idOrder}`}>
                Ver como cliente
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminOrders
