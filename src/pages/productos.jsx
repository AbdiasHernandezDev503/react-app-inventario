import React, { useState, useEffect } from "react";
import ProductoFormModal from "../components/ProductoModal";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoEdit, setProductoEdit] = useState(null);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [alerta, setAlerta] = useState({ visible: false, tipo: "", mensaje: "" });
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 5;

  useEffect(() => {
    fetch("http://localhost:8080/api/productos")
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error("Error al cargar productos", err));
  }, []);

  const mostrarAlerta = (tipo, mensaje) => {
    setAlerta({ visible: true, tipo, mensaje });
    setTimeout(() => {
      setAlerta({ visible: false, tipo: "", mensaje: "" });
    }, 3000);
  };

  const productosFiltrados = productos.filter(
    (p) =>
      (p.nombre && p.nombre.toLowerCase().includes(busqueda.toLowerCase())) ||
      (p.categoria?.nombre && p.categoria.nombre.toLowerCase().includes(busqueda.toLowerCase()))
  );

  const indiceInicio = (paginaActual - 1) * productosPorPagina;
  const indiceFin = indiceInicio + productosPorPagina;
  const productosPaginados = productosFiltrados.slice(indiceInicio, indiceFin);
  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);

  const resaltarTexto = (texto, termino) => {
    if (!termino || !texto) return texto;
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

  const confirmarEliminarProducto = (producto) => {
    setProductoAEliminar(producto);
    setMostrarConfirmacion(true);
  };

  const eliminarProductoConfirmado = () => {
    if (!productoAEliminar) return;

    fetch(`http://localhost:8080/api/productos/${productoAEliminar.idProducto}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al eliminar");
        setProductos((prev) =>
          prev.filter((p) => p.idProducto !== productoAEliminar.idProducto)
        );
        mostrarAlerta("success", "Producto eliminado correctamente.");
      })
      .catch((err) => {
        console.error("Error al eliminar producto", err);
        mostrarAlerta("danger", "Error al eliminar el producto.");
      })
      .finally(() => {
        setMostrarConfirmacion(false);
        setProductoAEliminar(null);
      });
  };

  const guardarProducto = (producto) => {
    const url = productoEdit
      ? `http://localhost:8080/api/productos/${productoEdit.idProducto}`
      : "http://localhost:8080/api/productos";

    const metodo = productoEdit ? "PUT" : "POST";

    fetch(url, {
      method: metodo,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(producto),
    })
      .then((res) => res.json())
      .then((data) => {
        if (productoEdit) {
          setProductos((prev) =>
            prev.map((p) => (p.idProducto === data.idProducto ? data : p))
          );
          mostrarAlerta("success", "Producto actualizado correctamente.");
        } else {
          setProductos((prev) => [...prev, data]);
          mostrarAlerta("success", "Producto agregado correctamente.");
        }
        setModalAbierto(false);
      })
      .catch((err) => {
        console.error("Error al guardar producto", err);
        mostrarAlerta("danger", "Error al guardar el producto.");
      });
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3">Productos</h1>
        <button className="btn btn-primary" onClick={abrirModal}>
          ➕ Agregar Producto
        </button>
      </div>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Buscar producto o categoría..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {alerta.visible && (
        <div className={`alert alert-${alerta.tipo}`} role="alert">
          {alerta.mensaje}
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-bordered table-striped table-hover bg-white">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosPaginados.map((producto) => (
              <tr key={producto.idProducto}>
                <td>{producto.idProducto}</td>
                <td>{resaltarTexto(producto.nombre, busqueda)}</td>
                <td>
                  {resaltarTexto(
                    producto.categoria?.nombre || "Sin categoría",
                    busqueda
                  )}
                </td>
                <td>${producto.precio?.toFixed(2) ?? "0.00"}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => editarProducto(producto)}
                  >
                    ✏️
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => confirmarEliminarProducto(producto)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <button
          className="btn btn-outline-primary"
          onClick={() => setPaginaActual((p) => Math.max(p - 1, 1))}
          disabled={paginaActual === 1}
        >
          ⬅️ Anterior
        </button>
        <span>
          Página {paginaActual} de {totalPaginas}
        </span>
        <button
          className="btn btn-outline-primary"
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

      {mostrarConfirmacion && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar eliminación</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setMostrarConfirmacion(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  ¿Estás seguro que deseas eliminar el producto{" "}
                  <strong>{productoAEliminar?.nombre}</strong>?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setMostrarConfirmacion(false)}
                >
                  Cancelar
                </button>
                <button
                  className="btn btn-danger"
                  onClick={eliminarProductoConfirmado}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Productos;
