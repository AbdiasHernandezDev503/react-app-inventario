import React, { useState, useEffect } from "react";

const ProductoFormModal = ({ isOpen, onClose, onSave, productoEdit }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    idCategoria: "",
    precio: "",
    codigo: "",
    descripcion: "",
    imagen_url: "",
  });

  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/categorias")
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((err) => console.error("Error al cargar categorías", err));
  }, []);

  useEffect(() => {
    if (productoEdit) {
      setFormData({
        nombre: productoEdit.nombre || "",
        idCategoria: productoEdit.categoria?.idCategoria || "",
        precio: productoEdit.precio || "",
        codigo: productoEdit.codigo || "",
        descripcion: productoEdit.descripcion || "",
        imagen_url: productoEdit.imagen_url || "",
      });
    } else {
      setFormData({
        nombre: "",
        idCategoria: "",
        precio: "",
        codigo: "",
        descripcion: "",
        imagen_url: "",
      });
    }
  }, [productoEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const productoFinal = {
      ...formData,
      precio: parseFloat(formData.precio),
      categoria: { idCategoria: parseInt(formData.idCategoria) },
      idProducto: productoEdit?.idProducto,
    };

    onSave(productoFinal);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {productoEdit ? "Editar Producto" : "Agregar Producto"}
            </h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body row g-3">
              <div className="col-md-6">
                <label className="form-label">Nombre:</label>
                <input
                  type="text"
                  className="form-control"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Categoría:</label>
                <select
                  name="idCategoria"
                  className="form-select"
                  value={formData.idCategoria}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione una categoría</option>
                  {categorias.map((cat) => (
                    <option key={cat.idCategoria} value={cat.idCategoria}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Precio:</label>
                <input
                  type="number"
                  className="form-control"
                  name="precio"
                  step="0.01"
                  min="0"
                  value={formData.precio}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Código:</label>
                <input
                  type="text"
                  className="form-control"
                  name="codigo"
                  value={formData.codigo}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label">Descripción:</label>
                <textarea
                  className="form-control"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows={3}
                  required
                ></textarea>
              </div>

              <div className="col-12">
                <label className="form-label">URL de Imagen:</label>
                <input
                  type="url"
                  className="form-control"
                  name="imagen_url"
                  value={formData.imagen_url}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" type="button" onClick={onClose}>
                Cancelar
              </button>
              <button className="btn btn-success" type="submit">
                Guardar Producto
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductoFormModal;
