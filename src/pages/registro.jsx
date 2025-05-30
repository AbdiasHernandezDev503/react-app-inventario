import React from "react";
import "../styles/registro.css";
import imagenRegistro from '../images/registro-img.jpg'; 

const Registro = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para registrar el usuario
    alert("Registro enviado.");
  };

  return (
    <div className="registro-container">
      {/* Lado izquierdo: Formulario */}
      <div className="registro-form">
        <h6 className="text-uppercase text-danger fw-bold">Miniso</h6>
        <h2 className="fw-bold mb-3">Registrarse</h2>

        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label htmlFor="nombre" className="form-label">Nombre</label>
            <input type="text" className="form-control" id="nombre" required />
          </div>

          <div className="col-md-6">
            <label htmlFor="apellido" className="form-label">Apellido</label>
            <input type="text" className="form-control" id="apellido" required />
          </div>

          <div className="col-md-6">
            <label htmlFor="email" className="form-label">Correo electrónico</label>
            <input type="email" className="form-control" id="email" />
          </div>

          <div className="col-md-6">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input type="password" className="form-control" id="password" required />
          </div>

          <div className="col-md-6">
            <label htmlFor="confirmPassword" className="form-label">Confirmar contraseña</label>
            <input type="password" className="form-control" id="confirmPassword" required />
          </div>

          <div className="col-md-6">
            <label htmlFor="rol" className="form-label">Rol</label>
            <select id="rol" className="form-select">
              <option value="">Seleccionar</option>
              <option value="admin">Administrador</option>
              <option value="vendedor">Vendedor</option>
              <option value="encargado">Encargado</option>
            </select>
          </div>

          <div className="col-12 text-end mt-3">
            <button type="submit" className="btn btn-success me-2">Registrar</button>
            <button type="reset" className="btn btn-secondary">Cancelar</button>
          </div>
        </form>
      </div>

      {/* Lado derecho: Imagen decorativa */}
      <div className="registro-img">
        <img src={imagenRegistro} alt="Estudiante" />
      </div>
    </div>
  );
};

export default Registro;
