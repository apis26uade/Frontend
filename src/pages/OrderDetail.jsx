import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { formatOrderId, getOrderById, ORDER_STATUSES } from '../services/orders.js'
import { PAYMENT_METHODS } from '../data/paymentMethods.js'

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

function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAdmin } = useAuth()
  const order = getOrderById(id)

  if (!order) {
    return (
      <section className="section-container center-section">
        <h1>Pedido no encontrado</h1>
        <Link className="button primary" to="/pedidos">
          Volver a mis pedidos
        </Link>
      </section>
    )
  }

  const canView = isAdmin || order.userId === user?.idUser

  if (!canView) {
    return (
      <section className="section-container center-section">
        <h1>No tenes acceso a este pedido</h1>
        <button className="button primary" type="button" onClick={() => navigate('/pedidos')}>
          Ir a mis pedidos
        </button>
      </section>
    )
  }

  return (
    <section className="order-detail-page section-container">
      <div className="breadcrumb">
        <Link to="/">Inicio</Link>
        <span>/</span>
        <Link to="/pedidos">Mis pedidos</Link>
        <span>/</span>
        <span>#{formatOrderId(order.idOrder)}</span>
      </div>

      <header className="order-detail-header">
        <div>
          <p className="eyebrow">Confirmacion</p>
          <h1>Pedido #{formatOrderId(order.idOrder)}</h1>
          <p>
            {new Date(order.createdAt).toLocaleString('es-AR', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </p>
        </div>
        <span className={`order-status-badge status-${order.status.toLowerCase()}`}>
          {statusLabel(order.status)}
        </span>
      </header>

      <div className="order-detail-layout">
        <section className="card-panel">
          <h2>Productos</h2>
          <ul className="order-detail-items">
            {order.items.map((item) => (
              <li key={`${order.idOrder}-${item.idProduct}`}>
                {item.imageProduct ? (
                  <img src={item.imageProduct} alt="" />
                ) : (
                  <span className="order-item-placeholder" />
                )}
                <div>
                  <strong>{item.productName}</strong>
                  <p>
                    {item.quantity} x {formatPrice(item.unitPrice)}
                  </p>
                </div>
                <strong>{formatPrice(item.unitPrice * item.quantity)}</strong>
              </li>
            ))}
          </ul>
          <div className="cart-summary-row">
            <span>Subtotal</span>
            <strong>{formatPrice(order.subtotal)}</strong>
          </div>
          {order.discountAmount > 0 ? (
            <div className="cart-summary-row discount-row">
              <span>Descuento</span>
              <strong>-{formatPrice(order.discountAmount)}</strong>
            </div>
          ) : null}
          <div className="cart-summary-row shipping-row">
            <span>Envio</span>
            <strong>{formatPrice(order.shippingCost)}</strong>
          </div>
          <div className="cart-summary-row checkout-total">
            <span>Total pagado</span>
            <strong>{formatPrice(order.total)}</strong>
          </div>
        </section>

        <aside className="order-detail-side">
          <section className="card-panel">
            <h2>Envio</h2>
            <p>
              {order.shipping?.name}
              <br />
              {order.shipping?.address}
              <br />
              {order.shipping?.city} ({order.shipping?.postalCode})
              <br />
              Tel: {order.shipping?.phone}
            </p>
            {order.shipping?.notes ? <p className="order-notes">{order.shipping.notes}</p> : null}
          </section>
          <section className="card-panel">
            <h2>Pago</h2>
            <p>{paymentLabel(order.paymentMethod?.type)}</p>
            {order.paymentMethod?.last4 ? (
              <p>Terminada en ···· {order.paymentMethod.last4}</p>
            ) : null}
          </section>
        </aside>
      </div>

      <Link className="button primary" to="/catalogo">
        Seguir comprando
      </Link>
    </section>
  )
}

export default OrderDetail
