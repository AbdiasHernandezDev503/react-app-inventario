import React, { useState } from 'react';
import UsuarioFormModal from '../components/UsuariosModal';
import '../styles/usuarios.css';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([
    { id: 1, nombre: 'Juan', apellido: 'Pérez', email: 'juan@mail.com', rol: 'Administrador' },
    { id: 2, nombre: 'Ana', apellido: 'Gómez', email: 'ana@mail.com', rol: 'Usuario' },
  ]);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [usuarioEdit, setUsuarioEdit] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  const usuariosFiltrados = usuarios.filter(u =>
    `${u.nombre} ${u.apellido}`.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.email.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.rol.toLowerCase().includes(busqueda.toLowerCase())
  );

  const resaltarTexto = (texto, termino) => {
    if (!termino) return texto;
    const partes = texto.split(new RegExp(`(${termino})`, 'gi'));
    return partes.map((parte, i) =>
      parte.toLowerCase() === termino.toLowerCase()
        ? <mark key={i}>{parte}</mark>
        : parte
    );
  };

  const abrirModal = () => {
    setUsuarioEdit(null);
    setModalAbierto(true);
  };

  const editarUsuario = (usuario) => {
    setUsuarioEdit(usuario);
    setModalAbierto(true);
  };

  const guardarUsuario = (usuario) => {
    if (usuarioEdit) {
      setUsuarios(usuarios.map(u => u.id === usuario.id ? usuario : u));
    } else {
      setUsuarios([...usuarios, usuario]);
    }
    setModalAbierto(false);
  };

  const eliminarUsuario = (id) => {
    setUsuarios(usuarios.filter(u => u.id !== id));
  };

  return (
    <div className='usuarios-container'>
      <div className='usuarios-header'>
        <h1>Usuarios</h1>
        <button className="btn-agregar" onClick={abrirModal}>➕ Agregar Usuario</button>
      </div>

      <input
        type="text"
        placeholder='Busqueda...'
        className='input-busqueda'
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <table className='usuarios-tabla'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuariosFiltrados.map(usuario => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{resaltarTexto(usuario.nombre, busqueda)}</td>
              <td>{resaltarTexto(usuario.apellido, busqueda)}</td>
              <td>{resaltarTexto(usuario.email, busqueda)}</td>
              <td>{resaltarTexto(usuario.rol, busqueda)}</td>
              <td>
                <button className="btn-editar" onClick={() => editarUsuario(usuario)}>Editar</button>
                <button className="btn-eliminar" onClick={() => eliminarUsuario(usuario.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <UsuarioFormModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onSave={guardarUsuario}
        usuarioEdit={usuarioEdit}
      />
    </div>
  );
};

export default Usuarios;
