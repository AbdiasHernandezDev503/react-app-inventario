import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
/* import 'bootstrap/dist/css/bootstrap.min.css'; */


import Sidebar from "./components/sidebar";
import Dashboard from "./pages/dashboard";
import Productos from "./pages/productos";
import Sucursales from "./pages/sucursales";
import Categorias from "./pages/categorias"
import Usuarios from "./pages/usuarios";
import Loign from "./pages/login"
import Registro from "./pages/registro"

function App() {
  return (
    <Router>
      <div className="App" style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Loign />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/sucursales" element={<Sucursales />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/registro" element={<Registro />} />
        </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
