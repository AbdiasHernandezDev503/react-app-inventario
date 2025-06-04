import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#b76f9d", "#2d3250"];

const GraficoProductosCategoria = () => {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/productos");
        const productos = res.data;

        const conteoPorCategoria = {};
        productos.forEach((producto) => {
          const nombreCategoria = producto.categoria?.nombre || "Sin categoría";
          conteoPorCategoria[nombreCategoria] = (conteoPorCategoria[nombreCategoria] || 0) + 1;
        });

        const datosFormateados = Object.entries(conteoPorCategoria).map(
          ([nombre, valor]) => ({ name: nombre, value: valor })
        );

        setDatos(datosFormateados);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };

    cargarDatos();
  }, []);

  return (
    <div className="card p-3">
      <h5 className="text-center">Productos por Categoría</h5>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={datos}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {datos.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoProductosCategoria;
