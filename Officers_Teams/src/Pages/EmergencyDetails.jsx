import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faUser,
  faPhone,
  faEnvelope,
  faCalendar,
  faTint,
  faVenus,
  faMars,
  faMapMarkerAlt,
  faExclamationTriangle,
  faClock,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import Loader from "../Components/Loader";

function EmergencyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [call, setCall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchCallDetails();
  }, [id]);

  const fetchCallDetails = async () => {
    try {
      setLoading(true);
      // Get specific emergency call details
      const response = await axios.get(`/emergency-call/${id}`, {
        withCredentials: true,
      });
      setCall(response.data);
    } catch (err) {
      console.error("Error fetching call details:", err);
      setError(err.response?.data?.msg || "Failed to load emergency details");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      setUpdatingStatus(true);
      await axios.put(
        `/emergency-call/${id}/status/personnel`,
        { status: newStatus },
        { withCredentials: true }
      );

      // Update local state
      setCall((prev) => ({
        ...prev,
        statusByPersonnel: newStatus,
      }));

      alert("Status updated successfully!");
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const closeCall = () => {
    if (window.confirm("Are you sure you want to close this call?")) {
      updateStatus("resolved");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-red-100 text-red-800 border-red-200";
      case "active":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getServiceIcon = (service) => {
    switch (service) {
      case "Police Service":
        return "🚔";
      case "Fire Service":
        return "🚒";
      case "Ambulance Service":
        return "🚑";
      default:
        return "🚨";
    }
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/emergency-calls")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Emergency Calls
          </button>
        </div>
      </div>
    );
  }

  if (!call) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Call Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The emergency call you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/emergency-calls")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Emergency Calls
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate("/emergency-calls")}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <FontAwesomeIcon icon={faArrowLeft} size="lg" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Emergency Call Details
                </h1>
                <p className="text-sm text-gray-500">
                  Case ID: {call._id?.slice(-8)?.toUpperCase() || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                  call.statusByPersonnel
                )}`}
              >
                {call.statusByPersonnel?.charAt(0).toUpperCase() +
                  call.statusByPersonnel?.slice(1) || "Pending"}
              </span>
              {call.statusByPersonnel !== "resolved" && (
                <button
                  onClick={closeCall}
                  disabled={updatingStatus}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                >
                  <FontAwesomeIcon icon={faCheck} className="mr-2" />
                  {updatingStatus ? "Closing..." : "Close Call"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Caller Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Caller Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="text-gray-400 mr-3 w-5"
                    />
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">
                        {call.user?.name || call.name || "Anonymous"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="text-gray-400 mr-3 w-5"
                    />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{call.user?.email || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={faPhone}
                      className="text-gray-400 mr-3 w-5"
                    />
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-medium">
                        {call.user?.phone || call.phone || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={faCalendar}
                      className="text-gray-400 mr-3 w-5"
                    />
                    <div>
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="font-medium">
                        {call.user?.dateOfBirth
                          ? new Date(call.user.dateOfBirth).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={faTint}
                      className="text-gray-400 mr-3 w-5"
                    />
                    <div>
                      <p className="text-sm text-gray-500">Blood Group</p>
                      <p className="font-medium">
                        {call.user?.bloodGroup || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={call.user?.gender === "Female" ? faVenus : faMars}
                      className="text-gray-400 mr-3 w-5"
                    />
                    <div>
                      <p className="text-sm text-gray-500">Gender</p>
                      <p className="font-medium">
                        {call.user?.gender || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Emergency Details
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Nature of Emergency</p>
                  <p className="font-medium text-lg">
                    {getServiceIcon(call.service)} {call.service}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <div className="flex items-start mt-1">
                    <FontAwesomeIcon
                      icon={faMapMarkerAlt}
                      className="text-red-500 mr-2 mt-1"
                    />
                    <div>
                      <p className="font-medium">
                        {call.location?.address ||
                          `Lat: ${call.location?.lat}, Lng: ${call.location?.lng}`}
                      </p>
                      <a
                        href={`https://www.google.com/maps?q=${call.location?.lat},${call.location?.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View on Google Maps →
                      </a>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Additional Notes</p>
                  <p className="font-medium">
                    {call.description ||
                      "Caller reported emergency situation requiring immediate assistance."}
                  </p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Location Map
              </h2>
              <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0, borderRadius: "0.5rem" }}
                  src={`https://maps.google.com/maps?q=${call.location?.lat},${call.location?.lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  allowFullScreen
                  title="Emergency Location"
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Emergency Response System */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Emergency Response System
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">👮</span>
                    <span className="font-medium">Police</span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      call.service === "Police Service"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {call.service === "Police Service" ? "Active" : "Standby"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🚒</span>
                    <span className="font-medium">Fire</span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      call.service === "Fire Service"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {call.service === "Fire Service" ? "Active" : "Standby"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🚑</span>
                    <span className="font-medium">Ambulance</span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      call.service === "Ambulance Service"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {call.service === "Ambulance Service"
                      ? "Active"
                      : "Standby"}
                  </span>
                </div>
              </div>
            </div>

            {/* Call Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Call Timeline
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div className="ml-4">
                    <p className="font-medium">Emergency Call Received</p>
                    <p className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(call.timestamp), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>

                {call.statusByPersonnel === "active" && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div className="ml-4">
                      <p className="font-medium">Response Team Dispatched</p>
                      <p className="text-sm text-gray-500">
                        {call.lastUpdatedBy?.name || "System"}
                      </p>
                    </div>
                  </div>
                )}

                {call.statusByPersonnel === "resolved" && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="ml-4">
                      <p className="font-medium">Call Resolved</p>
                      <p className="text-sm text-gray-500">
                        {call.lastUpdatedBy?.name || "System"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Status Actions */}
            {call.statusByPersonnel !== "resolved" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h2>
                <div className="space-y-3">
                  {call.statusByPersonnel === "pending" && (
                    <button
                      onClick={() => updateStatus("active")}
                      disabled={updatingStatus}
                      className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 disabled:opacity-50"
                    >
                      Dispatch Team
                    </button>
                  )}

                  <button
                    onClick={() => updateStatus("resolved")}
                    disabled={updatingStatus}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    Mark as Resolved
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmergencyDetails;
