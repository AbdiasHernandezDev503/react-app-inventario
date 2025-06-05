import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, contraseña }),
      });

      if (!response.ok) {
        throw new Error("Credenciales inválidas");
      }

      const data = await response.text(); // en tu backend devuelve solo un mensaje string
      console.log("Login exitoso:", data);

      navigate("/dashboard");
    } catch (err) {
      setError("Correo o contraseña incorrectos.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2 className="login-title">Iniciar Sesión</h2>

        {error && <div className="login-error">{error}</div>}

        <label htmlFor="email">Correo</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="contraseña">Contraseña</label>
        <input
          type="password"
          id="contraseña"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
          required
        />

        <button type="submit" className="btn-login">Entrar</button>

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
