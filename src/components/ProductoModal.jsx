import React, { useState, useEffect } from "react";

const ProductoFormModal = ({ isOpen, onClose, onSave, productoEdit }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    idCategoria: "",
    precio: "",
    codigo: "",
    descripcion: "",
    imagenUrl: "",
  });

  const [imagenArchivo, setImagenArchivo] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [subiendo, setSubiendo] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/categorias")
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((err) => console.error("Error al cargar categorías", err));
  }, []);

  useEffect(() => {
    if (!isOpen) return; 

    if (productoEdit) {
      setFormData({
        nombre: productoEdit.nombre || "",
        idCategoria: productoEdit.categoria?.idCategoria || "",
        precio: productoEdit.precio || "",
        codigo: productoEdit.codigo || "",
        descripcion: productoEdit.descripcion || "",
        imagenUrl: productoEdit.imagenUrl || "",
      });
      setPreviewUrl(productoEdit.imagenUrl || "");
    } else {
      setFormData({
        nombre: "",
        idCategoria: "",
        precio: "",
        codigo: "",
        descripcion: "",
        imagenUrl: "",
      });
      setPreviewUrl("");
    }

    setImagenArchivo(null);
  }, [productoEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
    setImagenArchivo(e.target.files[0]);
  };

  const subirImagenACloudinary = async () => {
    const data = new FormData();
    data.append("file", imagenArchivo);
    data.append("upload_preset", "inventario-app");
    data.append("folder", "inventario/productos");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dk42k45gz/image/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const result = await res.json();
    return result.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubiendo(true);

      let urlImagenFinal = formData.imagenUrl;

      if (imagenArchivo) {
        urlImagenFinal = await subirImagenACloudinary();
      }

      const productoFinal = {
        ...formData,
        precio: parseFloat(formData.precio),
        categoria: { idCategoria: parseInt(formData.idCategoria) },
        imagenUrl: urlImagenFinal,
        idProducto: productoEdit?.idProducto,
      };

      onSave(productoFinal);
      onClose();
    } catch (error) {
      console.error("Error al subir o guardar producto", error);
    } finally {
      setSubiendo(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {productoEdit ? "Editar Producto" : "Agregar Producto"}
            </h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body row g-3">
              <div className="col-md-6">
                <label className="form-label">Nombre:</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Categoría:</label>
                <select
                  name="idCategoria"
                  value={formData.idCategoria}
                  onChange={handleChange}
                  required
                  className="form-select"
                >
                  <option value="">Seleccione una categoría</option>
                  {categorias.map((cat) => (
                    <option key={cat.idCategoria} value={cat.idCategoria}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Precio:</label>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  required
                  step="0.01"
                  className="form-control"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Código:</label>
                <input
                  type="text"
                  name="codigo"
                  value={formData.codigo}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>

              <div className="col-12">
                <label className="form-label">Descripción:</label>
                <textarea
                  name="descripcion"
                  rows={3}
                  value={formData.descripcion}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>

              <div className="col-12">
                <label className="form-label">Imagen del producto:</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleFileChange}
                />

                {previewUrl && (
                  <div className="mt-2 text-center">
                    <img
                      src={previewUrl}
                      alt="Previsualización"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "200px",
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                )}
              </div>

              {formData.imagenUrl && (
                <div className="col-12">
                  <label className="form-label">Vista previa:</label>
                  <img src={formData.imagenUrl} alt="preview" height="100" />
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-success"
                disabled={subiendo}
              >
                {subiendo ? "Subiendo imagen..." : "Guardar Producto"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductoFormModal;
