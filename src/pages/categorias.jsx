import React, { useState, useEffect } from "react";
import CategoriaModal from "../components/CategoriaModal";

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [categoriaEdit, setCategoriaEdit] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);
  const [alerta, setAlerta] = useState({
    visible: false,
    tipo: "",
    mensaje: "",
  });

  useEffect(() => {
    fetch("http://localhost:8080/api/categorias")
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((err) => console.error("Error al cargar las categorías", err));
  }, []);

  const categoriasFiltradas = categorias.filter((c) =>
    c.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const mostrarAlerta = (tipo, mensaje) => {
    setAlerta({ visible: true, tipo, mensaje });
    setTimeout(() => {
      setAlerta({ visible: false, tipo: "", mensaje: "" });
    }, 3000);
  };

  const confirmarEliminarCategoria = (categoria) => {
    setCategoriaAEliminar(categoria);
    setMostrarConfirmacion(true);
  };

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
    setCategoriaEdit(null);
    setModalAbierto(true);
  };

  const editarCategoria = (categoria) => {
    setCategoriaEdit(categoria);
    setModalAbierto(true);
  };

  const guardarCategoria = (categoria) => {
    const url = categoriaEdit
      ? `http://localhost:8080/api/categorias/${categoriaEdit.idCategoria}`
      : "http://localhost:8080/api/categorias";

    const metodo = categoriaEdit ? "PUT" : "POST";

    fetch(url, {
      method: metodo,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoria),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al guardar");
        return res.json();
      })
      .then((data) => {
        if (categoriaEdit) {
          setCategorias((prev) =>
            prev.map((c) => (c.idCategoria === data.idCategoria ? data : c))
          );
          mostrarAlerta("success", "Categoría actualizada correctamente.");
        } else {
          setCategorias((prev) => [...prev, data]);
          mostrarAlerta("success", "Categoría creada correctamente.");
        }
        setModalAbierto(false);
      })
      .catch((error) => {
        console.error("Error al guardar categoría:", error);
        mostrarAlerta("danger", "Error al guardar la categoría.");
      });
  };

  const eliminarCategoriaConfirmada = () => {
    if (!categoriaAEliminar) return;

    fetch(
      `http://localhost:8080/api/categorias/${categoriaAEliminar.idCategoria}`,
      {
        method: "DELETE",
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Error al eliminar");
        setCategorias((prev) =>
          prev.filter((c) => c.idCategoria !== categoriaAEliminar.idCategoria)
        );
      })
      .catch((error) => {
        console.error("Error al eliminar la categoría:", error);
      })
      .finally(() => {
        setMostrarConfirmacion(false);
        setCategoriaAEliminar(null);
        mostrarAlerta("success", "Categoría eliminada exitosamente.");
      });
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3">Categorías</h1>
        <button className="btn btn-primary" onClick={abrirModal}>
          ➕ Agregar Categoría
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar por nombre..."
        className="form-control mb-3"
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
              <th scope="col">ID</th>
              <th scope="col">Nombre</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categoriasFiltradas.map((categoria) => (
              <tr key={categoria.idCategoria}>
                <td>{categoria.idCategoria}</td>
                <td>{resaltarTexto(categoria.nombre, busqueda)}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => editarCategoria(categoria)}
                  >
                    ✏️
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => confirmarEliminarCategoria(categoria)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CategoriaModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onSave={guardarCategoria}
        categoriaEdit={categoriaEdit}
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
                  ¿Estás seguro que deseas eliminar la categoría{" "}
                  <strong>{categoriaAEliminar?.nombre}</strong>?
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
                  onClick={eliminarCategoriaConfirmada}
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

export default Categorias;
