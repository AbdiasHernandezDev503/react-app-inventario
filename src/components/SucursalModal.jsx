import React, { useState, useEffect } from 'react';
import '../styles/sucursales.css';

const SucursalFormModal = ({ isOpen, onClose, onSave, sucursalEdit }) => {
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');

  useEffect(() => {
    if (sucursalEdit) {
      setNombre(sucursalEdit.nombre);
      setDireccion(sucursalEdit.direccion);
      setTelefono(sucursalEdit.telefono);
    } else {
      setNombre('');
      setDireccion('');
      setTelefono('');
    }
  }, [sucursalEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevaSucursal = {
      id: sucursalEdit ? sucursalEdit.id : Date.now(),
      nombre,
      direccion,
      telefono,
    };

    onSave(nuevaSucursal);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{sucursalEdit ? 'Editar Sucursal' : 'Agregar Sucursal'}</h2>
        <form onSubmit={handleSubmit}>
          <label>Nombre:</label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />

          <label>Dirección:</label>
          <input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />

          <label>Teléfono:</label>
          <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />

          <div className="modal-buttons">
            <button type="submit" className="btn-guardar">Guardar</button>
            <button type="button" className="btn-cancelar" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SucursalFormModal;
