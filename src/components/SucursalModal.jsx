import React, { useState, useEffect } from 'react';

const SucursalFormModal = ({ isOpen, onClose, onSave, sucursalEdit }) => {
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');

  useEffect(() => {
    if(!isOpen) return;

    if (sucursalEdit) {
      setNombre(sucursalEdit.nombre);
      setDireccion(sucursalEdit.direccion);
      setTelefono(sucursalEdit.telefono);
    } else {
      setNombre('');
      setDireccion('');
      setTelefono('');
    }
  }, [sucursalEdit, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevaSucursal = {
      idSucursal: sucursalEdit?.idSucursal, // solo se usa en edición
      nombre,
      direccion,
      telefono,
    };

    onSave(nuevaSucursal);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">
                {sucursalEdit ? 'Editar Sucursal' : 'Agregar Sucursal'}
              </h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Nombre:</label>
                <input
                  type="text"
                  className="form-control"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Dirección:</label>
                <input
                  type="text"
                  className="form-control"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Teléfono:</label>
                <input
                  type="text"
                  className="form-control"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
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

export default SucursalFormModal;
