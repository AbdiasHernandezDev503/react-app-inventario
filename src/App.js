import { Routes, Route, useLocation } from "react-router-dom";

import Sidebar from "./components/sidebar";
import Dashboard from "./pages/dashboard";
import Productos from "./pages/productos";
import Sucursales from "./pages/sucursales";
import Categorias from "./pages/categorias";
import Loign from "./pages/login";
import Registro from "./pages/registro";
import Inventario from "./pages/inventario";

function AppContent() {
  const location = useLocation();
  const ocultarSidebar = location.pathname === "/" || location.pathname === "/registro";

  return (
    <div className="App" style={{ display: "flex" }}>
      {!ocultarSidebar && <Sidebar />}
      <div className="flex-grow-1" style={{ marginLeft: "220px" }}>
        <Routes>
          <Route path="/" element={<Loign />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/sucursales" element={<Sucursales />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/inventario" element={<Inventario />} />
        </Routes>
      </div>
    </div>
  );
}

export default AppContent;
