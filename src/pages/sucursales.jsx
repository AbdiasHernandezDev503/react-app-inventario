import React, { useState } from 'react';
import SucursalFormModal from '../components/SucursalModal';
import '../styles/sucursales.css';

const Sucursales = () => {
  const [sucursales, setSucursales] = useState([
    { id: 1, nombre: 'Sucursal Centro', direccion: 'Calle 123, San Salvador', telefono: '2222-1234' },
    { id: 2, nombre: 'Sucursal Norte', direccion: 'Avenida Norte, SS', telefono: '2222-5678' },
  ]);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [sucursalEdit, setSucursalEdit] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  const sucursalesFiltradas = sucursales.filter ( s =>
    s.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    s.direccion.toLowerCase().includes(busqueda.toLowerCase()) ||
    s.telefono.toLowerCase().includes(busqueda.toLowerCase())
  )

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
    setSucursalEdit(null);
    setModalAbierto(true);
  };

  const editarSucursal = (sucursal) => {
    setSucursalEdit(sucursal);
    setModalAbierto(true);
  };

  const guardarSucursal = (sucursal) => {
    if (sucursalEdit) {
      setSucursales(sucursales.map(s => s.id === sucursal.id ? sucursal : s));
    } else {
      setSucursales([...sucursales, sucursal]);
    }
  };

  const eliminarSucursal = (id) => {
    setSucursales(sucursales.filter(s => s.id !== id));
  };

  return (
    <div className="sucursales-container">
      <div className="sucursales-header">
        <h1>Sucursales</h1>
        <button className="btn-agregar" onClick={abrirModal}>➕ Agregar Sucursal</button>
      </div>

      <input
        type="text"
        placeholder="Buscar  Nombre, Dirección o Teléfono..."
        className="input-busqueda"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <table className="sucursales-tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sucursalesFiltradas.map(sucursal => (
            <tr key={sucursal.id}>
              <td>{sucursal.id}</td>
              <td>{resaltarTexto(sucursal.nombre, busqueda)}</td>
              <td>{resaltarTexto(sucursal.direccion, busqueda)}</td>
              <td>{resaltarTexto(sucursal.telefono, busqueda)}</td>
              <td>
                <button className="btn-editar" onClick={() => editarSucursal(sucursal)}>✏️</button>
                <button className="btn-eliminar" onClick={() => eliminarSucursal(sucursal.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <SucursalFormModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onSave={guardarSucursal}
        sucursalEdit={sucursalEdit}
      />
    </div>
  );
};

export default Sucursales;
