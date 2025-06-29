import { useEffect, useState } from "react";
import axios from "../services/api";
import { Circle, Check, AlertCircle } from "lucide-react";

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
      fetchTables();
    } catch {
      setError("Error al cambiar el estado de la mesa.");
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const getStatusLabel = (status: Table["status"]) => {
    switch (status) {
      case "free":
        return { text: "Libre", color: "text-green-600", icon: <Circle size={18} /> };
      case "reserved":
        return { text: "Reservada", color: "text-yellow-600", icon: <AlertCircle size={18} /> };
      case "occupied":
        return { text: "Ocupada", color: "text-red-600", icon: <Check size={18} /> };
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Dashboard del Mesero</h1>

      {error && (
        <div className="text-red-600 bg-red-100 p-3 rounded mb-4 border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {tables.map((table) => {
          const status = getStatusLabel(table.status);
          return (
            <div key={table.id} className="bg-white shadow rounded p-4 border border-gray-200">
              <h2 className="text-lg font-bold mb-2">{table.name}</h2>
              <p className="text-sm text-gray-600 mb-1">Capacidad: {table.capacity}</p>
              <p className={`flex items-center gap-2 font-medium ${status.color}`}>
                {status.icon}
                {status.text}
              </p>

              <div className="mt-4 flex gap-2">
                {table.status === "free" && (
                  <button
                    onClick={() => changeTableStatus(table.id, "occupy")}
                    className="w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700 transition"
                  >
                    Walk-in
                  </button>
                )}

                {table.status === "occupied" && (
                  <button
                    onClick={() => changeTableStatus(table.id, "free")}
                    className="w-full bg-green-600 text-white py-1 rounded hover:bg-green-700 transition"
                  >
                    Finalizar
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
