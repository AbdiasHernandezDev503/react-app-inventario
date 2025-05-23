import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar";
import Dashboard from "./pages/dashboard";
import Productos from "./pages/productos";
import Sucursales from "./pages/sucursales";
import Categorias from "./pages/categorias"

function App() {
  return (
    <Router>
      <div className="App" style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/sucursales" element={<Sucursales />} />
          <Route path="/categorias" element={<Categorias />} />
        </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
