import React, { useEffect, useState } from "react";
import InventarioFormModal from "../components/InventarioFormModal";

const Inventario = () => {
  const [inventarios, setInventarios] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [inventarioEdit, setInventarioEdit] = useState(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [inventarioAEliminar, setInventarioAEliminar] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [alerta, setAlerta] = useState({
    visible: false,
    tipo: "",
    mensaje: "",
  });

  const cargarInventarios = () => {
    fetch("http://localhost:8080/api/inventarios")
      .then((res) => res.json())
      .then((data) => setInventarios(data))
      .catch((err) => console.error("Error al cargar inventario", err));
  };

  useEffect(() => {
    cargarInventarios();
  }, []);

  const inventariosFiltrados = inventarios.filter((inv) => {
    const producto = inv.producto?.nombre?.toLowerCase() || "";
    const sucursal = inv.sucursal?.nombre?.toLowerCase() || "";
    const cantidad = inv.cantidad?.toString() || "";

    return (
      producto.includes(busqueda.toLowerCase()) ||
      sucursal.includes(busqueda.toLowerCase()) ||
      cantidad.includes(busqueda)
    );
  });

  const abrirModal = () => {
    setInventarioEdit(null);
    setModalAbierto(true);
  };

  const editarInventario = (item) => {
    setInventarioEdit(item);
    setModalAbierto(true);
  };

  const guardarInventario = (nuevo) => {
    const metodo = nuevo.idInventario ? "PUT" : "POST";
    const url = nuevo.idInventario
      ? `http://localhost:8080/api/inventarios/${nuevo.idInventario}`
      : "http://localhost:8080/api/inventarios";

    fetch(url, {
      method: metodo,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevo),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al guardar");
        return res.json();
      })
      .then(() => cargarInventarios())
      .catch((err) => console.error("Error al guardar inventario", err));
  };

  const confirmarEliminarInventario = (inventario) => {
    setInventarioAEliminar(inventario);
    setMostrarConfirmacion(true);
  };

  const mostrarAlerta = (tipo, mensaje) => {
    setAlerta({ visible: true, tipo, mensaje });
    setTimeout(() => {
      setAlerta({ visible: false, tipo: "", mensaje: "" });
    }, 3000);
  };

  const eliminarInventarioConfirmado = () => {
    if (!inventarioAEliminar) return;

    fetch(
      `http://localhost:8080/api/inventarios/${inventarioAEliminar.idInventario}`,
      {
        method: "DELETE",
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Error al eliminar");
        setInventarios((prev) =>
          prev.filter(
            (inv) => inv.idInventario !== inventarioAEliminar.idInventario
          )
        );
        mostrarAlerta("success", "Inventario eliminado exitosamente.");
      })
      .catch((error) => {
        console.error("Error al eliminar el inventario:", error);
        mostrarAlerta("danger", "No se pudo eliminar el inventario.");
      })
      .finally(() => {
        setMostrarConfirmacion(false);
        setInventarioAEliminar(null);
      });
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Inventario</h2>
        <button className="btn btn-primary" onClick={abrirModal}>
          ➕ Agregar Stock
        </button>
      </div>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Buscar producto, sucursal o cantidad..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {alerta.visible && (
        <div className={`alert alert-${alerta.tipo}`} role="alert">
          {alerta.mensaje}
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-bordered table-hover bg-white">
          <thead className="table-dark">
            <tr>
              <th>Producto</th>
              <th>Sucursal</th>
              <th>Cantidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {inventariosFiltrados.map((inv) => (
              <tr key={inv.idInventario}>
                <td>{inv.producto?.nombre}</td>
                <td>{inv.sucursal?.nombre}</td>
                <td>{inv.cantidad}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => editarInventario(inv)}
                  >
                    ✏️
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => confirmarEliminarInventario(inv)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <InventarioFormModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onSave={guardarInventario}
        inventarioEdit={inventarioEdit}
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
                  ¿Estás seguro de eliminar este inventario del producto{" "}
                  <strong>{inventarioAEliminar?.producto?.nombre}</strong> en la
                  sucursal{" "}
                  <strong>{inventarioAEliminar?.sucursal?.nombre}</strong>?
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
                  onClick={eliminarInventarioConfirmado}
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

export default Inventario;
