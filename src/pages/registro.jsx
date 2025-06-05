import React, { useState, useEffect } from "react";
import "../styles/registro.css";
import imagenRegistro from "../images/registro-img.jpg";
import { useNavigate } from "react-router-dom";

const Registro = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    contraseña: "",
    confirmPassword: "",
    rol: "",
  });

  const [roles, setRoles] = useState([]);
  const [cargandoRoles, setCargandoRoles] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/roles")
      .then((res) => res.json())
      .then((data) => setRoles(data))
      .catch((error) => {
        console.error("Error al cargar roles:", error);
        setRoles([]);
      })
      .finally(() => setCargandoRoles(false));
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.contraseña !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    const empleado = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      contraseña: formData.contraseña,
      role: {
        idRol: formData.rol,
      },
    };

    try {
      const response = await fetch("http://localhost:8080/api/empleados", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(empleado),
      });

      if (!response.ok) throw new Error("Error al registrar empleado");

      alert("Empleado registrado exitosamente.");
      navigate("/");
      setFormData({
        nombre: "",
        apellido: "",
        email: "",
        contraseña: "",
        confirmPassword: "",
        rol: "",
      });
    } catch (error) {
      console.error(error);
      alert("Error al registrar empleado.");
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-form">
        <h6 className="text-uppercase text-danger fw-bold">Miniso</h6>
        <h2 className="fw-bold mb-3">Registrarse</h2>

        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label htmlFor="nombre" className="form-label">
              Nombre
            </label>
            <input
              type="text"
              className="form-control"
              id="nombre"
              required
              value={formData.nombre}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="apellido" className="form-label">
              Apellido
            </label>
            <input
              type="text"
              className="form-control"
              id="apellido"
              required
              value={formData.apellido}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="email" className="form-label">
              Correo electrónico
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="contraseña" className="form-label">
              Contraseña
            </label>
            <input
              type="password"
              className="form-control"
              id="contraseña"
              required
              value={formData.contraseña}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="confirmPassword" className="form-label">
              Confirmar contraseña
            </label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="rol" className="form-label">
              Rol
            </label>
            <select
              id="rol"
              className="form-select"
              required
              value={formData.rol}
              onChange={handleChange}
            >
              <option value="">Seleccionar</option>
              {cargandoRoles ? (
                <option disabled>Cargando roles...</option>
              ) : roles.length === 0 ? (
                <option disabled>No hay roles disponibles</option>
              ) : (
                roles.map((r) => (
                  <option key={r.idRol} value={r.idRol}>
                    {r.nombre}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="col-12 text-end mt-3">
            <button type="submit" className="btn btn-success me-2">
              Registrar
            </button>
            <button
              type="reset"
              className="btn btn-secondary"
              onClick={() => navigate("/")}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>

      <div className="registro-img">
        <img src={imagenRegistro} alt="Estudiante" />
      </div>
    </div>
  );
};

export default Registro;
