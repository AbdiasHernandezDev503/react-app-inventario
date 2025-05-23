import React, { useState, useEffect } from 'react';
import '../styles/productoModal.css';

const ProductoFormModal = ({ isOpen, onClose, onSave, productoEdit }) => {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [stock, setStock] = useState(0);

  useEffect(() => {
    if (productoEdit) {
      setNombre(productoEdit.nombre);
      setCategoria(productoEdit.categoria);
      setStock(productoEdit.stock);
    } else {
      setNombre('');
      setCategoria('');
      setStock(0);
    }
  }, [productoEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevoProducto = {
      id: productoEdit ? productoEdit.id : Date.now(),
      nombre,
      categoria,
      stock: parseInt(stock)
    };

    onSave(nuevoProducto);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{productoEdit ? 'Editar Producto' : 'Agregar Producto'}</h2>
        <form onSubmit={handleSubmit}>
          <label>Nombre:</label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />

          <label>Categoría:</label>
          <input type="text" value={categoria} onChange={(e) => setCategoria(e.target.value)} required />

          <label>Stock:</label>
          <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required min="0" />

          <div className="modal-buttons">
            <button type="submit" className="btn-guardar">Guardar</button>
            <button type="button" className="btn-cancelar" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductoFormModal;
