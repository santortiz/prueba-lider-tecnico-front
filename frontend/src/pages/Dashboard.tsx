import { useEffect, useState } from "react";
import axios from "../services/api";

type Table = {
  id: number;
  name: string;
  capacity: number;
  status: "free" | "reserved" | "occupied";
};

export default function Dashboard() {
  const [tables, setTables] = useState<Table[]>([]);
  const [error, setError] = useState("");

  const fetchTables = async () => {
    try {
      const res = await axios.get("/tables/tables/");
      setTables(res.data);
    } catch {
      setError("No se pudieron cargar las mesas.");
    }
  };

  const changeTableStatus = async (id: number, action: "occupy" | "free") => {
    try {
      await axios.post(`/tables/tables/${id}/${action}`);
      fetchTables(); // refresca el estado después del cambio
    } catch {
      setError("Error al cambiar el estado de la mesa.");
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Dashboard del Mesero</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tables.map((table) => (
          <div key={table.id} className="bg-white p-4 shadow rounded">
            <h2 className="font-bold text-lg">{table.name}</h2>
            <p>Capacidad: {table.capacity}</p>
            <p>
              Estado:{" "}
              <span
                className={`font-semibold ${
                  table.status === "free"
                    ? "text-green-600"
                    : table.status === "reserved"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {table.status.toUpperCase()}
              </span>
            </p>

            <div className="mt-4 flex gap-2">
              {table.status === "free" && (
                <button
                  onClick={() => changeTableStatus(table.id, "occupy")}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Walk-in
                </button>
              )}

              {table.status === "occupied" && (
                <button
                  onClick={() => changeTableStatus(table.id, "free")}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Finalizar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
