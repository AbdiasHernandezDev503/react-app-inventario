import React, { useState, useEffect } from 'react';
import '../styles/usuarios.css';

const UsuarioFormModal = ({ isOpen, onClose, onSave, usuarioEdit }) => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [rol, setRol] = useState('');

  useEffect(() => {
    if (usuarioEdit) {
      setNombre(usuarioEdit.nombre);
      setApellido(usuarioEdit.apellido);
      setEmail(usuarioEdit.email);
      setRol(usuarioEdit.rol);
    } else {
      setNombre('');
      setApellido('');
      setEmail('');
      setRol('');
    }
  }, [usuarioEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevoUsuario = {
      id: usuarioEdit ? usuarioEdit.id : Date.now(),
      nombre,
      apellido,
      email,
      rol,
    };
    onSave(nuevoUsuario);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{usuarioEdit ? 'Editar Usuario' : 'Agregar Usuario'}</h2>
        <form onSubmit={handleSubmit}>
          <label>Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          <label>Apellido:</label>
          <input
            type="text"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            required
          />

          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Rol:</label>
          <input
            type="text"
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            required
          />

          <div className="modal-buttons">
            <button type="submit" className="btn-guardar">Guardar</button>
            <button type="button" className="btn-cancelar" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsuarioFormModal;
