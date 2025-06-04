import React, { useEffect, useState } from "react";
import GraficoProductosCategoria from "../components/GraficoProductosCategoria";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const Dashboard = () => {
  const [totales, setTotales] = useState({
    productos: 0,
    sucursales: 0,
    categorias: 0,
    inventarios: 0,
  });

  const [ultimosProductos, setUltimosProductos] = useState([]);
  const [productosPorSucursal, setProductosPorSucursal] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resProductos, resSucursales, resCategorias, resInventarios] =
          await Promise.all([
            fetch("http://localhost:8080/api/productos"),
            fetch("http://localhost:8080/api/sucursales"),
            fetch("http://localhost:8080/api/categorias"),
            fetch("http://localhost:8080/api/inventarios"),
          ]);

        const [dataProductos, dataSucursales, dataCategorias, dataInventarios] =
          await Promise.all([
            resProductos.json(),
            resSucursales.json(),
            resCategorias.json(),
            resInventarios.json(),
          ]);

        setTotales({
          productos: dataProductos.length,
          sucursales: dataSucursales.length,
          categorias: dataCategorias.length,
          inventarios: dataInventarios.length,
        });

        const recientes = dataProductos
          .sort((a, b) => b.idProducto - a.idProducto)
          .slice(0, 5);
        setUltimosProductos(recientes);

        const conteoPorSucursal = {};
        dataInventarios.forEach((inv) => {
          const nombreSucursal = inv.sucursal?.nombre || "Sin nombre";
          conteoPorSucursal[nombreSucursal] =
            (conteoPorSucursal[nombreSucursal] || 0) + 1;
        });

        const datosGrafico = Object.entries(conteoPorSucursal).map(
          ([nombre, cantidad]) => ({
            nombre,
            cantidad,
          })
        );

        setProductosPorSucursal(datosGrafico);
      } catch (error) {
        console.error("Error al cargar datos del dashboard:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container py-4">
      <h1 className="mb-4">📊 Panel de Control</h1>
      <div className="row g-4">
        <div className="col-md-3">
          <div className="card text-white bg-primary h-100">
            <div className="card-body text-center">
              <h5 className="card-title">Productos</h5>
              <p className="display-6">{totales.productos}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-success h-100">
            <div className="card-body text-center">
              <h5 className="card-title">Sucursales</h5>
              <p className="display-6">{totales.sucursales}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-warning h-100">
            <div className="card-body text-center">
              <h5 className="card-title">Categorías</h5>
              <p className="display-6">{totales.categorias}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-danger h-100">
            <div className="card-body text-center">
              <h5 className="card-title">Inventario</h5>
              <p className="display-6">{totales.inventarios}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <GraficoProductosCategoria />
      </div>

      <div className="mt-5">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title text-center">
              Sucursales con más productos registrados
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={productosPorSucursal}
                margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cantidad" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <h4>Últimos productos agregados</h4>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
              </tr>
            </thead>
            <tbody>
              {ultimosProductos.map((p) => (
                <tr key={p.idProducto}>
                  <td>{p.idProducto}</td>
                  <td>{p.nombre}</td>
                  <td>{p.categoria?.nombre || "Sin categoría"}</td>
                  <td>${p.precio?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
