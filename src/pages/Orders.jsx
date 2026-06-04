import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { PAYMENT_METHODS } from '../data/paymentMethods.js'
import { formatOrderId, getOrdersForUser, ORDER_STATUSES } from '../services/orders.js'

const formatPrice = (price) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(price)

const statusLabel = (value) =>
  ORDER_STATUSES.find((status) => status.value === value)?.label ?? value

const paymentLabel = (id) =>
  PAYMENT_METHODS.find((method) => method.id === id)?.label ?? id

function Orders() {
  const { user } = useAuth()
  const orders = getOrdersForUser(user?.idUser)

  return (
    <section className="orders-page section-container">
      <div className="orders-header">
        <p className="eyebrow">Tu cuenta</p>
        <h1>Mis pedidos</h1>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state card-panel">
          <h2>Todavia no tenes pedidos</h2>
          <p>Cuando confirmes una compra, aparecera el historial aqui.</p>
          <Link className="button primary" to="/catalogo">
            Ir al catalogo
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <article className="order-card" key={order.idOrder}>
              <div className="order-card-top">
                <div className="order-card-info">
                  <h2>Pedido #{formatOrderId(order.idOrder)}</h2>
                  <p className="order-card-date">
                    {new Date(order.createdAt).toLocaleString('es-AR', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                  <p className="order-card-meta">
                    {order.items.length} articulo{order.items.length !== 1 ? 's' : ''} ·{' '}
                    {paymentLabel(order.paymentMethod?.type)}
                  </p>
                </div>
                <span
                  className={`order-status-badge status-${order.status.toLowerCase()}`}
                >
                  {statusLabel(order.status)}
                </span>
              </div>
              <div className="order-card-foot">
                <strong className="order-card-total">{formatPrice(order.total)}</strong>
                <Link className="order-card-link" to={`/pedidos/${order.idOrder}`}>
                  Ver detalle
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default Orders
