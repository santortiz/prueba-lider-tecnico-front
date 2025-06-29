import { useState } from "react";
import axios from "../services/api";

type Table = {
  id: number;
  name: string;
  capacity: number;
  status: string;
};

type RoomWithTables = {
  room_id: number;
  room_name: string;
  tables: Table[];
};

export default function Reservation() {
  const [guests, setGuests] = useState(1);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("12:00");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [availableRooms, setAvailableRooms] = useState<RoomWithTables[]>([]);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);

  const fetchAvailableTables = async () => {
    try {
      const res = await axios.get("/tables/tables/available-by-room", {
        params: { date, time, guests },
      });

      const transformed: RoomWithTables[] = Object.entries(res.data).map(
        ([room_name, tables]) => ({
          room_id: Math.random(),
          room_name,
          tables: (tables as any[]).map((t) => ({
            id: t.table_id,
            name: `Mesa ${t.table_id}`,
            capacity: t.capacity,
            status: "free",
          })),
        })
      );

      setAvailableRooms(transformed);
    } catch {
      setError("No se pudieron cargar las mesas disponibles");
    }
  };

  const handleReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (guests > 6) {
      await fetchAvailableTables();
      return;
    }

    try {
      const payload = { guests, date, time, notification_email: email, notes };
      await axios.post("/reservations/reservations/", payload);
      setMessage("¡Reserva creada exitosamente!");
    } catch {
      setError("Error al crear la reserva");
    }
  };

  const confirmReservationWithTable = async () => {
    try {
      await axios.post("/reservations/reservations/", {
        guests,
        date,
        time,
        table_id: selectedTable,
        notification_email: email,
        notes,
      });
      setMessage("¡Reserva creada exitosamente!");
      setAvailableRooms([]);
      setSelectedTable(null);
    } catch {
      setError("Error al crear la reserva");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Reserva tu mesa
        </h2>

        {message && (
          <div className="bg-green-100 text-green-700 p-3 mb-4 rounded border border-green-300">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-3 mb-4 rounded border border-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleReservation} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Fecha:</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Hora:</label>
            <input
              type="time"
              required
              step="3600"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Número de invitados:</label>
            <input
              type="number"
              required
              min={1}
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Correo electrónico:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Opcional (para confirmación)"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Notas adicionales:</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition duration-200"
            >
              Confirmar Reserva
            </button>
          </div>
        </form>

        {availableRooms.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-3">Selecciona una mesa</h3>
            {availableRooms.map((room) => (
              <div key={room.room_id} className="mb-4">
                <h4 className="text-blue-600 font-medium mb-2">{room.room_name}</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {room.tables.map((table) => (
                    <button
                      key={table.id}
                      onClick={() => setSelectedTable(table.id)}
                      className={`p-2 border rounded-lg text-sm ${
                        selectedTable === table.id
                          ? "bg-blue-600 text-white"
                          : "bg-white hover:bg-gray-100"
                      }`}
                    >
                      {table.name} (Cap: {table.capacity})
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {selectedTable && (
              <div className="mt-4 text-center">
                <button
                  onClick={confirmReservationWithTable}
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg transition"
                >
                  Confirmar con Mesa Seleccionada
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
