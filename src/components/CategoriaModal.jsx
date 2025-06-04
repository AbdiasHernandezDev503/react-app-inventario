import React, { useState, useEffect } from 'react';
import '../styles/sucursales.css';

const CategoriaModal = ({ isOpen, onClose, onSave, categoriaEdit }) => {
  const [nombre, setNombre] = useState('');

  useEffect(() => {
    if(!isOpen) return;

    if (categoriaEdit) {
      setNombre(categoriaEdit.nombre);
    } else {
      setNombre("");
    }
  }, [categoriaEdit, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevaCategoria = categoriaEdit 
    ? { idCategoria: categoriaEdit.idCategoria, nombre }
    : { nombre }

    onSave(nuevaCategoria);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{categoriaEdit ? 'Editar Sucursal' : 'Agregar Categoría'}</h2>
        <form onSubmit={handleSubmit}>
          <label>Nombre:</label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />

          <div className="modal-buttons">
            <button type="submit" className="btn-guardar">Guardar</button>
            <button type="button" className="btn-cancelar" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoriaModal;
