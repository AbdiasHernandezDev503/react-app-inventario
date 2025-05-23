import React, { useState, useEffect } from "react";
import "../styles/productos.css";
import ProductoFormModal from "../components/ProductoModal";

const Productos = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error("Error al cargar productos", err));
  }, []);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoEdit, setProductoEdit] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 5;

  const productosFiltrados = Array.isArray(productos)
    ? productos.filter(
        (p) =>
          (p.title && p.title.toLowerCase().includes(busqueda.toLowerCase())) ||
          (p.category &&
            p.category.toLowerCase().includes(busqueda.toLowerCase()))
      )
    : [];

  const indiceInicio = (paginaActual - 1) * productosPorPagina;
  const indiceFin = indiceInicio + productosPorPagina;

  const productosPaginados = productosFiltrados.slice(indiceInicio, indiceFin);

  const totalPaginas = Math.ceil(
    productosFiltrados.length / productosPorPagina
  );

  const resaltarTexto = (texto, termino) => {
    if (!termino) return texto;
    const partes = texto.split(new RegExp(`(${termino})`, "gi"));
    return partes.map((parte, i) =>
      parte.toLowerCase() === termino.toLowerCase() ? (
        <mark key={i}>{parte}</mark>
      ) : (
        parte
      )
    );
  };

  const abrirModal = () => {
    setProductoEdit(null);
    setModalAbierto(true);
  };

  const editarProducto = (producto) => {
    setProductoEdit(producto);
    setModalAbierto(true);
  };

  const guardarProducto = (producto) => {
    if (productoEdit) {
      setProductos(productos.map((p) => (p.id === producto.id ? producto : p)));
    } else {
      setProductos([...productos, producto]);
    }
  };

  const eliminarProducto = (id) => {
    setProductos(productos.filter((p) => p.id !== id));
  };

  return (
    <div className="productos-container">
      <div className="productos-header">
        <h1>Productos</h1>
        <button className="btn-agregar" onClick={abrirModal}>
          ➕ Agregar Producto
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar producto o categoría..."
        className="input-busqueda"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <table className="productos-tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosPaginados.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.id}</td>
              <td>{resaltarTexto(producto.title, busqueda)}</td>
              <td>{resaltarTexto(producto.category, busqueda)}</td>
              <td>{producto.stock}</td>
              <td>
                <button
                  className="btn-editar"
                  onClick={() => editarProducto(producto)}
                >
                  ✏️
                </button>
                <button
                  className="btn-eliminar"
                  onClick={() => eliminarProducto(producto.id)}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="paginacion">
        <button
          onClick={() => setPaginaActual((p) => Math.max(p - 1, 1))}
          disabled={paginaActual === 1}
        >
          ⬅️ Anterior
        </button>

        <span>
          Página {paginaActual} de {totalPaginas}
        </span>

        <button
          onClick={() => setPaginaActual((p) => Math.min(p + 1, totalPaginas))}
          disabled={paginaActual === totalPaginas}
        >
          Siguiente ➡️
        </button>
      </div>

      <ProductoFormModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onSave={guardarProducto}
        productoEdit={productoEdit}
      />
    </div>
  );
};

export default Productos;
