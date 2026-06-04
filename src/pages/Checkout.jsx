import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CheckoutSummary from '../components/CheckoutSummary.jsx'
import {
  CheckIcon,
  CreditCardIcon,
  MapPinIcon,
  PackageIcon,
} from '../components/Icons.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { PAYMENT_METHODS } from '../data/paymentMethods.js'
import { createOrder } from '../services/api.js'
import { formatOrderId } from '../services/orders.js'

const formatPrice = (price) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(price)

const initialShipping = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  notes: '',
}

function Checkout() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const {
    items,
    subtotal,
    shipping: shippingCost,
    discountCode,
    discountPercent,
    discountAmount,
    total,
    clearCart,
  } = useCart()

  const [step, setStep] = useState('shipping')
  const [shippingForm, setShippingForm] = useState(initialShipping)
  const [paymentMethod, setPaymentMethod] = useState('credit')
  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardName: '',
  })
  const [orderId, setOrderId] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const selectedPayment = PAYMENT_METHODS.find((method) => method.id === paymentMethod)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' }, replace: true })
      return
    }
    if (!items.length && step !== 'success') {
      navigate('/carrito', { replace: true })
    }
    if (user?.email) {
      setShippingForm((current) => ({
        ...current,
        email: user.email,
        name: current.name || user.name || '',
      }))
      setCardForm((current) => ({
        ...current,
        cardName: current.cardName || user.name || '',
      }))
    }
  }, [isAuthenticated, items.length, navigate, step, user?.email, user?.name])

  const updateShipping = (event) => {
    const { name, value } = event.target
    setShippingForm((current) => ({ ...current, [name]: value }))
  }

  const updateCard = (event) => {
    const { name, value } = event.target
    setCardForm((current) => ({ ...current, [name]: value }))
  }

  const canContinueShipping =
    shippingForm.name &&
    shippingForm.phone &&
    shippingForm.address &&
    shippingForm.city &&
    shippingForm.postalCode

  const canConfirmPayment =
    selectedPayment &&
    (!selectedPayment.requiresCard ||
      (cardForm.cardNumber && cardForm.expiry && cardForm.cvv && cardForm.cardName))

  const handleConfirmOrder = async () => {
    if (!user?.idUser) {
      setError('Debes iniciar sesion para confirmar la compra')
      return
    }

    setLoading(true)
    setError('')

    try {
      const order = await createOrder({
        userId: user.idUser,
        userEmail: shippingForm.email || user.email,
        items,
        shipping: shippingForm,
        paymentMethod: {
          type: paymentMethod,
          label: selectedPayment?.label,
          last4: selectedPayment?.requiresCard
            ? cardForm.cardNumber.replace(/\s/g, '').slice(-4)
            : null,
        },
        discountCode: discountPercent > 0 ? discountCode.trim() : undefined,
        totals: {
          subtotal,
          discountAmount,
          shipping: shippingCost,
          total,
        },
      })
      setOrderId(order.idOrder)
      clearCart()
      setStep('success')
    } catch (submitError) {
      setError(submitError.message || 'No se pudo confirmar la compra')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'success') {
    return (
      <section className="checkout-page section-container center-section checkout-success">
        <div className="checkout-success-icon" aria-hidden="true">
          <CheckIcon size={36} />
        </div>
        <p className="eyebrow">Pedido confirmado</p>
        <h1>Gracias por tu compra</h1>
        <p className="checkout-success-id">
          Tu pedido <strong>#{formatOrderId(orderId)}</strong> fue registrado correctamente.
        </p>
        <p>
          Enviamos la confirmacion a <strong>{shippingForm.email}</strong>. Podes seguir el
          estado desde Mis pedidos.
        </p>
        <div className="checkout-success-actions">
          <Link className="button primary" to={`/pedidos/${orderId}`}>
            <PackageIcon size={16} />
            Ver detalle del pedido
          </Link>
          <Link className="button ghost" to="/pedidos">
            Mis pedidos
          </Link>
          <Link className="checkout-back centered" to="/catalogo">
            Seguir comprando
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="checkout-page section-container">
      <div className="checkout-header">
        <p className="eyebrow">Checkout</p>
        <h1>Finalizar compra</h1>
      </div>

      <div className="checkout-steps">
        {[
          { id: 'shipping', label: 'Envio', Icon: MapPinIcon },
          { id: 'payment', label: 'Pago', Icon: CreditCardIcon },
        ].map((item, index) => {
          const active = step === item.id
          const done = item.id === 'shipping' && step === 'payment'
          return (
            <div className="checkout-step-wrap" key={item.id}>
              {index > 0 ? <span className="checkout-step-line" /> : null}
              <span
                className={
                  active ? 'checkout-step active' : done ? 'checkout-step done' : 'checkout-step'
                }
              >
                {done ? <CheckIcon size={14} /> : <item.Icon size={14} />}
                {item.label}
              </span>
            </div>
          )
        })}
      </div>

      <div className="checkout-layout">
        <div className="checkout-form-panel">
          {step === 'shipping' ? (
            <form
              className="checkout-form"
              onSubmit={(event) => {
                event.preventDefault()
                if (canContinueShipping) setStep('payment')
              }}
            >
              <h2>Datos de envio</h2>
              <div className="checkout-grid">
                <label>
                  Nombre completo
                  <input
                    name="name"
                    value={shippingForm.name}
                    onChange={updateShipping}
                    required
                  />
                </label>
                <label>
                  Email
                  <input
                    name="email"
                    type="email"
                    value={shippingForm.email}
                    onChange={updateShipping}
                    required
                  />
                </label>
                <label>
                  Telefono
                  <input
                    name="phone"
                    value={shippingForm.phone}
                    onChange={updateShipping}
                    required
                  />
                </label>
                <label className="full-width">
                  Direccion
                  <input
                    name="address"
                    value={shippingForm.address}
                    onChange={updateShipping}
                    required
                  />
                </label>
                <label>
                  Ciudad
                  <input name="city" value={shippingForm.city} onChange={updateShipping} required />
                </label>
                <label>
                  Codigo postal
                  <input
                    name="postalCode"
                    value={shippingForm.postalCode}
                    onChange={updateShipping}
                    required
                  />
                </label>
                <label className="full-width">
                  Notas (opcional)
                  <textarea
                    name="notes"
                    value={shippingForm.notes}
                    onChange={updateShipping}
                    rows="4"
                  />
                </label>
              </div>
              <button
                className="button checkout-btn full"
                type="submit"
                disabled={!canContinueShipping}
              >
                Continuar al pago
              </button>
              <Link className="checkout-back" to="/carrito">
                Volver al carrito
              </Link>
            </form>
          ) : (
            <div className="checkout-form">
              <h2>Metodo de pago</h2>
              <div className="payment-methods">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    className={
                      paymentMethod === method.id ? 'payment-method active' : 'payment-method'
                    }
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <CreditCardIcon size={18} />
                    <strong>{method.label}</strong>
                    <span>{method.description}</span>
                  </button>
                ))}
              </div>

              {selectedPayment?.requiresCard ? (
                <div className="checkout-grid payment-card-grid">
                  <label className="full-width">
                    Numero de tarjeta
                    <input
                      name="cardNumber"
                      value={cardForm.cardNumber}
                      onChange={updateCard}
                      placeholder="4242 4242 4242 4242"
                      required
                    />
                  </label>
                  <label>
                    Vencimiento
                    <input
                      name="expiry"
                      value={cardForm.expiry}
                      onChange={updateCard}
                      placeholder="MM/AA"
                      required
                    />
                  </label>
                  <label>
                    CVV
                    <input
                      name="cvv"
                      value={cardForm.cvv}
                      onChange={updateCard}
                      placeholder="123"
                      required
                    />
                  </label>
                  <label className="full-width">
                    Nombre en la tarjeta
                    <input
                      name="cardName"
                      value={cardForm.cardName}
                      onChange={updateCard}
                      required
                    />
                  </label>
                </div>
              ) : (
                <p className="payment-transfer-note">
                  Recibiras por email los datos de la cuenta para transferir{' '}
                  <strong>{formatPrice(total)}</strong>.
                </p>
              )}

              <p className="payment-secure-note">
                <CheckIcon size={16} />
                Pago simulado para demostracion. No se procesa un cobro real.
              </p>

              {error ? <p className="auth-error">{error}</p> : null}

              <div className="checkout-payment-actions">
                <button
                  className="button ghost"
                  type="button"
                  onClick={() => setStep('shipping')}
                >
                  Volver
                </button>
                <button
                  className="button checkout-btn"
                  type="button"
                  onClick={handleConfirmOrder}
                  disabled={loading || !canConfirmPayment}
                >
                  {loading ? 'Procesando...' : 'Confirmar compra'}
                </button>
              </div>
            </div>
          )}
        </div>

        <CheckoutSummary
          items={items}
          subtotal={subtotal}
          shipping={shippingCost}
          discountPercent={discountPercent}
          discountAmount={discountAmount}
          total={total}
        />
      </div>
    </section>
  )
}

export default Checkout
