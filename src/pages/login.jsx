import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/login.css";

const Login = () => {
  const [nombre, setNombre] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Validación básica de ejemplo
    if (nombre === "admin" && contrasena === "admin") {
      navigate("/dashboard");
    } else {
      setError("Nombre o contraseña incorrectos.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2 className="login-title">Iniciar Sesión</h2>

        {error && <div className="login-error">{error}</div>}

        <label htmlFor="nombre">Nombre</label>
        <input
          type="text"
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <label htmlFor="contrasena">Contraseña</label>
        <input
          type="password"
          id="contrasena"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
        />

        <button type="submit" className="btn-login">
          Entrar
        </button>

        <p className="mt-3 text-center">
          ¿No tienes una cuenta?{" "}
          <Link to="/registro" className="link-registro">
            Regístrate aquí
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
