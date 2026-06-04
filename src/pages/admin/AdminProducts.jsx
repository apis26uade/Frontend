import { useMemo, useState } from 'react'
import { getStoredCategories, getStoredProducts, saveProduct, deleteStoredProduct } from '../../services/catalogStore.js'

const emptyForm = {
  idProduct: null,
  productName: '',
  productDescription: '',
  price: '',
  stock: '',
  imageProduct: '',
  categoryId: '1',
}

const formatPrice = (price) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(price)

function AdminProducts() {
  const categories = getStoredCategories()
  const [refreshKey, setRefreshKey] = useState(0)
  const [form, setForm] = useState(emptyForm)
  const [message, setMessage] = useState('')

  const products = useMemo(() => getStoredProducts(), [refreshKey])

  const reload = () => setRefreshKey((key) => key + 1)

  const startEdit = (product) => {
    setForm({
      idProduct: product.idProduct,
      productName: product.productName,
      productDescription: product.productDescription,
      price: String(product.price),
      stock: String(product.stock),
      imageProduct: product.imageProduct,
      categoryId: String(product.category?.idCategory ?? 1),
    })
    setMessage('')
  }

  const startCreate = () => {
    setForm({ ...emptyForm, categoryId: '1' })
    setMessage('')
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    saveProduct({
      idProduct: form.idProduct ?? undefined,
      productName: form.productName,
      productDescription: form.productDescription,
      price: form.price,
      stock: form.stock,
      imageProduct: form.imageProduct,
      categoryId: form.categoryId,
    })
    setMessage(form.idProduct ? 'Producto actualizado' : 'Producto creado')
    setForm(emptyForm)
    reload()
  }

  const handleDelete = (idProduct) => {
    if (!window.confirm('Eliminar este producto?')) return
    deleteStoredProduct(idProduct)
    setMessage('Producto eliminado')
    reload()
  }

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <p className="eyebrow">Catalogo</p>
          <h1>Gestion de productos</h1>
        </div>
        <button className="button primary" type="button" onClick={startCreate}>
          Nuevo producto
        </button>
      </header>

      {message ? <p className="admin-flash">{message}</p> : null}

      <div className="admin-split">
        <section className="admin-card">
          <h2>{form.idProduct ? 'Editar producto' : 'Alta de producto'}</h2>
          <form className="admin-form" onSubmit={handleSubmit}>
            <label>
              Nombre
              <input name="productName" value={form.productName} onChange={handleChange} required />
            </label>
            <label className="full-width">
              Descripcion
              <textarea
                name="productDescription"
                value={form.productDescription}
                onChange={handleChange}
                rows="3"
              />
            </label>
            <label>
              Precio (USD)
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Stock
              <input
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Categoria
              <select name="categoryId" value={form.categoryId} onChange={handleChange}>
                {categories.map((category) => (
                  <option key={category.idCategory} value={category.idCategory}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </label>
            <label className="full-width">
              URL imagen
              <input name="imageProduct" value={form.imageProduct} onChange={handleChange} />
            </label>
            <div className="admin-form-actions">
              <button className="button primary" type="submit">
                {form.idProduct ? 'Guardar cambios' : 'Crear producto'}
              </button>
              {form.idProduct ? (
                <button className="button ghost" type="button" onClick={startCreate}>
                  Cancelar edicion
                </button>
              ) : null}
            </div>
          </form>
        </section>

        <section className="admin-card admin-table-card">
          <h2>Productos ({products.length})</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Categoria</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.idProduct}>
                    <td>
                      <div className="admin-product-cell">
                        {product.imageProduct ? (
                          <img src={product.imageProduct} alt="" />
                        ) : null}
                        <span>{product.productName}</span>
                      </div>
                    </td>
                    <td>{product.category?.categoryName}</td>
                    <td>{formatPrice(product.price)}</td>
                    <td>{product.stock}</td>
                    <td className="admin-row-actions">
                      <button type="button" onClick={() => startEdit(product)}>
                        Editar
                      </button>
                      <button type="button" onClick={() => handleDelete(product.idProduct)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}

export default AdminProducts
