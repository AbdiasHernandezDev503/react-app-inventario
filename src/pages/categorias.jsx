import React, { useState, useEffect } from "react";
import CategoriaModal from "../components/CategoriaModal";
import "../styles/sucursales.css";

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [categoriaEdit, setCategoriaEdit] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/categorias")
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((err) => console.error("Error al cargar las categorías", err));
  }, []);

  const categoriasFiltradas = categorias.filter((c) =>
    c.nombre?.toLowerCase().includes(busqueda.toLowerCase())
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
    setCategoriaEdit(null);
    setModalAbierto(true);
  };

  const editarCategoria = (categoria) => {
    setCategoriaEdit(categoria);
    setModalAbierto(true);
  };

  const guardarCategoria = (categoria) => {
    fetch("http://localhost:8080/api/categorias", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoria),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Categoría creada:", data);
        if (categoriaEdit) {
          setCategorias((prev) =>
            prev.map((c) => (c.idCategoria === data.idCategoria ? data : c))
          );
        } else {
          setCategorias((prev) => [...prev, data]);
        }
        setModalAbierto(false);
      })
      .catch((error) => console.error("Error al crear categoría:", error));
  };

  const eliminarCategoria = (id) => {
    setCategorias(categorias.filter((c) => c.idCategoria !== id));
  };

  return (
    <div className="sucursales-container">
      <div className="sucursales-header">
        <h1>Categorías</h1>
        <button className="btn-agregar" onClick={abrirModal}>
          ➕ Agregar Categoría
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar por nombre..."
        className="input-busqueda"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <table className="sucursales-tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categoriasFiltradas.map((categoria) => (
            <tr key={categoria.idCategoria}>
              <td>{categoria.idCategoria}</td>
              <td>{resaltarTexto(categoria.nombre, busqueda)}</td>
              <td>
                <button
                  className="btn-editar"
                  onClick={() => editarCategoria(categoria)}
                >
                  ✏️
                </button>
                <button
                  className="btn-eliminar"
                  onClick={() => eliminarCategoria(categoria.idCategoria)}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <CategoriaModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onSave={guardarCategoria}
        categoriaEdit={categoriaEdit}
      />
    </div>
  );
};

export default Categorias;
