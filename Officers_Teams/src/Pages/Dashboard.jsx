import axios from "axios";
import { useState, useEffect } from "react";
import useAuth from "../Context/useAuth";
import Loader from "../Components/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { io } from "socket.io-client";
import { Link } from "react-router-dom";

import DataOne from "@/Components/DataOne";

const SOCKET_URL = "http://localhost:5000"; // Adjust if needed
const STATUS_OPTIONS = ["pending", "active", "resolved"];

const ROLE_SERVICE_MAP = {
  police: "Police Service",
  fire: "Fire Service",
  health: "Ambulance Service",
};

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [calls, setCalls] = useState([]);
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    call: null,
    newStatus: "",
  });
  const [now, setNow] = useState(Date.now());
  const { user } = useAuth();

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileResponse =
          user?.role === "police"
            ? await axios.get("/officer/profile")
            : await axios.get("/officer/firehealth/profile");
        const response = profileResponse;
        if (!response) {
          throw new Error("Profile not found");
        }
        setProfile(response.data);
      } catch (err) {
        console.error(
          "Failed to fetch profile:",
          err.message || "Unknown error"
        );
        setError(err.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user.role]);

  // Fetch emergencies for this role
  useEffect(() => {
    const fetchCalls = async () => {
      if (!profile?.role) return;
      const service = ROLE_SERVICE_MAP[profile.role];
      if (!service) return;
      try {
        setLoading(true);
        const res = await axios.get(
          `/emergency-call/service/${encodeURIComponent(service)}`
        );
        setCalls(res.data);
      } catch (err) {
        setCalls([]);
      }
      setLoading(false);
    };
    fetchCalls();
  }, [profile?.role]);

  // Live update for time ago
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // --- SOCKET.IO for live updates ---
  useEffect(() => {
    if (!profile?.role) return;
    const service = ROLE_SERVICE_MAP[profile.role];
    if (!service) return;

    const socket = io(SOCKET_URL, { withCredentials: true });

    socket.on("new-emergency-call", (call) => {
      // Only add if the call is for this officer's service
      if (call.service === service) {
        setCalls((prev) => [call, ...prev]);
      }
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
  }, [profile?.role]);

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

  if (loading) return <Loader />;

  return (
    <div className="bg-white p-4 md:p-8">
      {error && <p className="error">{error}</p>}
      {/* Profile */}
      <div>
        <div className="mb-4 bg-white p-4 rounded-lg shadow-md ">
          <p className="mb-2">Profile</p>
          <div className="flex items-center justify-between">
            <div className="border border-primary-200 rounded-full p-4 mr-4 overflow-hidden">
              <FontAwesomeIcon icon={faUser} className="text-7xl" />
            </div>
            <div className="">
              <h2 className="text-lg font-semibold">
                {profile?.name || "No Name Provided"}
              </h2>
              <p>{profile.email}</p>
              <p>{profile.phone || "No Phone Provided"}</p>
              <p>
                Role:{" "}
                <span className="text-primary-200">
                  {profile.role || "No Role Provided"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* DataOne Component */}
      {/* <DataOne /> */}

      {/* Emergencies Table */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">
          {ROLE_SERVICE_MAP[profile.role] || "Emergencies"} Assigned to You
        </h2>
        {calls.length === 0 ? (
          <p>No emergencies for your service.</p>
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
      </div>

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

export default Dashboard;
