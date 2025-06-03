import React, { useState, useEffect } from "react";
import SucursalFormModal from "../components/SucursalModal";

const Sucursales = () => {
  const [sucursales, setSucursales] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [sucursalEdit, setSucursalEdit] = useState(null);
  const [sucursalAEliminar, setSucursalAEliminar] = useState(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [alerta, setAlerta] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/sucursales")
      .then((res) => res.json())
      .then((data) => setSucursales(data))
      .catch((err) => console.error("Error al cargar sucursales", err));
  }, []);

  const mostrarAlerta = (mensaje, tipo = "success") => {
    setAlerta({ mensaje, tipo });
    setTimeout(() => setAlerta(null), 3000);
  };

  const abrirModal = () => {
    setSucursalEdit(null);
    setModalAbierto(true);
  };

  const editarSucursal = (sucursal) => {
    setSucursalEdit(sucursal);
    setModalAbierto(true);
  };

  const confirmarEliminarSucursal = (sucursal) => {
    setSucursalAEliminar(sucursal);
    setMostrarConfirmacion(true);
  };

  const eliminarSucursal = () => {
    if (!sucursalAEliminar) return;

    fetch(`http://localhost:8080/api/sucursales/${sucursalAEliminar.idSucursal}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo eliminar");
        setSucursales((prev) =>
          prev.filter((s) => s.idSucursal !== sucursalAEliminar.idSucursal)
        );
        mostrarAlerta("Sucursal eliminada exitosamente");
      })
      .catch((err) => {
        console.error("Error al eliminar sucursal", err);
        mostrarAlerta("Error al eliminar", "danger");
      })
      .finally(() => {
        setMostrarConfirmacion(false);
        setSucursalAEliminar(null);
      });
  };

  const guardarSucursal = (sucursal) => {
    const esEdicion = !!sucursalEdit;
    const url = esEdicion
      ? `http://localhost:8080/api/sucursales/${sucursalEdit.idSucursal}`
      : "http://localhost:8080/api/sucursales";
    const metodo = esEdicion ? "PUT" : "POST";

    fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sucursal),
    })
      .then((res) => res.json())
      .then((data) => {
        if (esEdicion) {
          setSucursales((prev) =>
            prev.map((s) => (s.idSucursal === data.idSucursal ? data : s))
          );
          mostrarAlerta("Sucursal actualizada exitosamente");
        } else {
          setSucursales((prev) => [...prev, data]);
          mostrarAlerta("Sucursal creada exitosamente");
        }
        setModalAbierto(false);
      })
      .catch((err) => console.error("Error al guardar sucursal", err));
  };

  const sucursalesFiltradas = sucursales.filter((s) =>
    [s.nombre, s.direccion, s.telefono]
      .join(" ")
      .toLowerCase()
      .includes(busqueda.toLowerCase())
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

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Sucursales</h1>
        <button className="btn btn-primary" onClick={abrirModal}>
          ➕ Agregar Sucursal
        </button>
      </div>

      {alerta && (
        <div className={`alert alert-${alerta.tipo}`} role="alert">
          {alerta.mensaje}
        </div>
      )}

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Buscar Nombre, Dirección o Teléfono..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <div className="table-responsive">
        <table className="table table-bordered table-striped table-hover bg-white">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sucursalesFiltradas.map((sucursal) => (
              <tr key={sucursal.idSucursal}>
                <td>{sucursal.idSucursal}</td>
                <td>{resaltarTexto(sucursal.nombre, busqueda)}</td>
                <td>{resaltarTexto(sucursal.direccion, busqueda)}</td>
                <td>{resaltarTexto(sucursal.telefono, busqueda)}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => editarSucursal(sucursal)}
                  >
                    ✏️
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => confirmarEliminarSucursal(sucursal)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SucursalFormModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onSave={guardarSucursal}
        sucursalEdit={sucursalEdit}
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
                  ¿Estás seguro que deseas eliminar la sucursal{" "}
                  <strong>{sucursalAEliminar?.nombre}</strong>?
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
                  onClick={eliminarSucursal}
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

export default Sucursales;
