import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { Link } from "react-router-dom";

const SOCKET_URL = "http://localhost:5000"; // Adjust if needed
const STATUS_OPTIONS = ["pending", "active", "resolved"];

function EmergencyCalls() {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    call: null,
    newStatus: "",
  });
  const [now, setNow] = useState(Date.now());

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

    socket.on("new-emergency-call", (call) => {
      setCalls((prev) => [call, ...prev]);
    });

    // Listen for updates to either status
    socket.on("emergency-call-updated", (updatedCall) => {
      setCalls((prev) =>
        prev.map((call) => (call._id === updatedCall._id ? updatedCall : call))
      );
    });

    // Listen for user updates to their status
    socket.on("emergency-call-user-update", (updatedCall) => {
      setCalls((prev) =>
        prev.map((call) => (call._id === updatedCall._id ? updatedCall : call))
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Live update for time ago
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000); // update every second
    return () => clearInterval(interval);
  }, []);

  // Handler for personnel status selection change (open modal)
  const handleStatusSelect = (call, value) => {
    if (value === call.statusByPersonnel) return;
    setConfirmModal({ open: true, call, newStatus: value });
  };

  // Confirm and send status update
  const confirmStatusUpdate = async () => {
    const { call, newStatus } = confirmModal;
    try {
      // Use the personnel-specific endpoint
      await axios.put(
        `/emergency-call/${call._id}/status/personnel`,
        { status: newStatus },
        { withCredentials: true }
      );

      // Update local state
      setCalls((prev) =>
        prev.map((c) =>
          c._id === call._id ? { ...c, statusByPersonnel: newStatus } : c
        )
      );
      setConfirmModal({ open: false, call: null, newStatus: "" });
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status.");
      setConfirmModal({ open: false, call: null, newStatus: "" });
    }
  };

  // Cancel modal
  const cancelStatusUpdate = () => {
    setConfirmModal({ open: false, call: null, newStatus: "" });
  };

  // Get status color based on status value
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-red-600 text-white";
      case "active":
        return "bg-yellow-400 text-black";
      case "resolved":
        return "bg-green-400 text-black";
      default:
        return "bg-gray-400 text-black";
    }
  };

  // Get status badge component
  const StatusBadge = ({ status }) => (
    <span
      className={`px-2 py-1 rounded w-20 inline-block ${getStatusColor(
        status
      )}`}
    >
      {status}
    </span>
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">All Emergency Calls</h2>
      {loading ? (
        <p>Loading...</p>
      ) : calls.length === 0 ? (
        <p>No emergency calls.</p>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-200 border-b border-gray-700">
              <th>Service</th>
              <th>User</th>
              <th>Location</th>
              <th>Time</th>
              <th>User Status</th>
              <th>Personnel Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {calls.map((call, idx) => (
              <tr
                key={call._id}
                className={` ${idx % 2 === 0 ? "bg-white" : "bg-gray-100"}`}
              >
                <td className="px-2">{call.service}</td>
                <td className="px-2">
                  {call.user ? call.user.name : call.name || "Anonymous"}
                  <br />
                  {call.user ? call.user.phone : call.phone || ""}
                  <br />
                  {call.user ? call.user.bloodGroup : "No Blood Group"}
                </td>
                <td className="px-2">
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
                    className="text-blue-500 hover:underline"
                  >
                    View Map
                  </a>
                </td>
                <td className="px-2">
                  {formatDistanceToNow(new Date(call.timestamp), {
                    addSuffix: true,
                  })}
                </td>

                {/* User Status - Read Only */}
                <td className="px-2 text-center">
                  <StatusBadge status={call.statusByUser} />
                </td>

                {/* Personnel Status - Can be changed */}
                <td className="px-2 text-center">
                  <select
                    value={call.statusByPersonnel}
                    onChange={(e) => handleStatusSelect(call, e.target.value)}
                    className={`border border-black rounded px-2 py-1 ${getStatusColor(
                      call.statusByPersonnel
                    )}`}
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-2 text-center">
                  <Link
                    to={`/emergency-calls/${call._id}`}
                    className="text-blue-500 hover:underline"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Confirmation Modal */}
      {confirmModal.open && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">Confirm Status Change</h3>
            <p>
              Are you sure you want to change the personnel status to{" "}
              <span className="font-semibold">{confirmModal.newStatus}</span>?
            </p>
            <div className="mt-6 flex justify-end">
              <button
                className="px-4 py-2 mr-2 bg-gray-300 rounded"
                onClick={cancelStatusUpdate}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={confirmStatusUpdate}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmergencyCalls;
