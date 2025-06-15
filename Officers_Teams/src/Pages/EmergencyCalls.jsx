import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000"; // Adjust if needed

function EmergencyCalls() {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCalls = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/emergency-call");
        setCalls(res.data);
      } catch (err) {
        console.error("Failed to fetch emergency calls:", err);
        setCalls([]);
      }
      setLoading(false);
    };
    fetchCalls();

    // --- SOCKET.IO ---
    const socket = io(SOCKET_URL, { withCredentials: true });

    socket.on("connect", () => {
      // console.log("Connected to socket server");
    });

    socket.on("new-emergency-call", (call) => {
      setCalls((prev) => [call, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Live Emergency Calls</h2>
      {loading ? (
        <p>Loading...</p>
      ) : calls.length === 0 ? (
        <p>No emergency calls.</p>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr>
              <th>Service</th>
              <th>User</th>
              <th>Location</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {calls.map((call) => (
              <tr key={call._id}>
                <td>{call.service}</td>
                <td>
                  {call.user ? call.user.name : call.name || "Anonymous"}
                  <br />
                  {call.user ? call.user.phone : call.phone || ""}
                </td>
                <td>
                  {call.location.address ? (
                    <span>
                      {call.location.address}
                      <br />
                    </span>
                  ) : null}
                  <a
                    href={`https://www.google.com/maps?q=${call.location.lat},${call.location.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Map
                  </a>
                </td>
                <td>{new Date(call.timestamp).toLocaleString()}</td>
                <td>{call.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default EmergencyCalls;
