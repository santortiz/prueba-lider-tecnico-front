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

        const raw = res.data;

        const transformed: RoomWithTables[] = Object.entries(raw).map(
        ([room_name, tables]) => ({
            room_id: Math.random(), // Provisorio, porque no hay ID real
            room_name,
            tables: (tables as any[]).map((t) => ({
            id: t.table_id,
            name: `Mesa ${t.table_id}`,
            capacity: t.capacity,
            status: "free", // valor ficticio porque no viene en la respuesta
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
      const payload = {
        guests,
        date,
        time,
        notification_email: email,
        notes,
      };

      await axios.post("/reservations/reservations/", payload);
      setMessage("¡Reserva creada exitosamente!");
    } catch {
      setError("Error al crear la reserva");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleReservation}
        className="bg-white p-6 rounded shadow w-full max-w-md mb-6"
      >
        <h2 className="text-xl font-bold mb-4">Hacer una Reserva</h2>

        {message && <p className="text-green-600 mb-2">{message}</p>}
        {error && <p className="text-red-600 mb-2">{error}</p>}

        <label className="block mb-2">Fecha:</label>
        <input
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full mb-3 px-3 py-2 border rounded"
        />

        <label className="block mb-2">Hora:</label>
        <input
          type="time"
          required
          step="3600"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full mb-3 px-3 py-2 border rounded"
        />

        <label className="block mb-2">Número de invitados:</label>
        <input
          type="number"
          required
          min={1}
          value={guests}
          onChange={(e) => setGuests(parseInt(e.target.value))}
          className="w-full mb-3 px-3 py-2 border rounded"
        />

        <label className="block mb-2">Correo electrónico (opcional):</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 px-3 py-2 border rounded"
        />

        <label className="block mb-2">Notas adicionales:</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Confirmar Reserva
        </button>
      </form>

      {availableRooms.length > 0 && (
        <div className="w-full max-w-md bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold mb-4">Selecciona una mesa</h3>

          {availableRooms.map((room) => (
            <div key={room.room_id} className="mb-4">
              <h4 className="font-semibold mb-2">{room.room_name}</h4>
              <div className="grid grid-cols-2 gap-2">
                {room.tables.map((table) => (
                  <button
                    key={table.id}
                    onClick={() => setSelectedTable(table.id)}
                    className={`p-2 border rounded ${
                      selectedTable === table.id
                        ? "bg-blue-600 text-white"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    {table.name} — Cap: {table.capacity}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {selectedTable && (
            <button
              onClick={async () => {
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
              }}
              className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Confirmar Reserva con Mesa Seleccionada
            </button>
          )}
        </div>
      )}
    </div>
  );
}
