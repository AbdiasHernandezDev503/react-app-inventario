import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Inventario</h2>
      <ul>
        <li><Link to="/dashboard">🏠 Dashboard</Link></li>
        <li><Link to="/productos">📦 Productos</Link></li>
        <li><Link to="/sucursales">🏬 Sucursales</Link></li>
        <li><Link to="/categorias">📂 Categorías</Link></li>
        <li><Link to="/inventario">🧾Inventario</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
