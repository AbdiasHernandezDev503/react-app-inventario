import React, { useState, useEffect } from "react";

const InventarioFormModal = ({ isOpen, onClose, onSave, inventarioEdit }) => {
  const [productos, setProductos] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [formData, setFormData] = useState({
    idProducto: "",
    idSucursal: "",
    cantidad: "",
  });

  useEffect(() => {
    if (!isOpen) return;

    fetch("http://localhost:8080/api/productos")
      .then((res) => res.json())
      .then((data) => setProductos(data));

    fetch("http://localhost:8080/api/sucursales")
      .then((res) => res.json())
      .then((data) => setSucursales(data));

    if (inventarioEdit) {
      setFormData({
        idProducto: inventarioEdit.producto?.idProducto || "",
        idSucursal: inventarioEdit.sucursal?.idSucursal || "",
        cantidad: inventarioEdit.cantidad || "",
      });
    } else {
      setFormData({ idProducto: "", idSucursal: "", cantidad: "" });
    }
  }, [isOpen, inventarioEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const inventario = {
      cantidad: parseInt(formData.cantidad),
      producto: { idProducto: parseInt(formData.idProducto) },
      sucursal: { idSucursal: parseInt(formData.idSucursal) },
      idInventario: inventarioEdit?.idInventario,
    };

    onSave(inventario);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">
                {inventarioEdit ? "Editar Stock" : "Agregar Stock"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-2">
                <label className="form-label">Producto:</label>
                <select
                  name="idProducto"
                  className="form-select"
                  value={formData.idProducto}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione producto</option>
                  {productos.map((p) => (
                    <option key={p.idProducto} value={p.idProducto}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-2">
                <label className="form-label">Sucursal:</label>
                <select
                  name="idSucursal"
                  className="form-select"
                  value={formData.idSucursal}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione sucursal</option>
                  {sucursales.map((s) => (
                    <option key={s.idSucursal} value={s.idSucursal}>
                      {s.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-2">
                <label className="form-label">Cantidad:</label>
                <input
                  type="number"
                  name="cantidad"
                  className="form-control"
                  value={formData.cantidad}
                  onChange={handleChange}
                  required
                  min="0"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-success">
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InventarioFormModal;
