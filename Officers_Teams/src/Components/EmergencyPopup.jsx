import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faExclamationTriangle,
  faMapMarkerAlt,
  faClock,
  faUser,
  faPhone,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { useNotifications } from "../Context/NotificationContext";
import { useNavigate } from "react-router-dom";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import alarmSound from "../assets/random-alarm.mp3";

const EmergencyPopup = () => {
  const { notifications, removeNotification, markAsRead } = useNotifications();
  const [currentNotification, setCurrentNotification] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const audioRef = useRef(null); // Reference to the audio element

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio(alarmSound);
    audioRef.current.loop = true; // Loop the alarm sound
    audioRef.current.volume = 0.7; // Set volume (0.0 to 1.0)

    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Show the latest unread emergency notification
  useEffect(() => {
    const latestEmergency = notifications.find(
      (notif) => notif.type === "emergency" && !notif.read
    );

    if (latestEmergency && latestEmergency.id !== currentNotification?.id) {
      setCurrentNotification(latestEmergency);
      setIsVisible(true);

      // Play alarm sound when popup shows
      if (audioRef.current) {
        audioRef.current.play().catch((error) => {
          console.log("Audio play failed:", error);
          // Handle autoplay restrictions - you might want to show a button to enable sound
        });
      }

      // Auto-hide after 30 seconds if not interacted with
      const timer = setTimeout(() => {
        handleClose();
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, [notifications, currentNotification]);

  // Stop sound when popup is hidden
  useEffect(() => {
    if (!isVisible && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Reset to beginning
    }
  }, [isVisible]);

  const handleClose = () => {
    if (currentNotification) {
      markAsRead(currentNotification.id);
    }

    // Stop the alarm sound
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setIsVisible(false);
    setCurrentNotification(null);
  };

  const handleViewDetails = () => {
    if (currentNotification) {
      markAsRead(currentNotification.id);
      // Navigate to emergency calls page or home page
      // to={`/emergency-calls/${call._id}`}
      navigate(`/emergency-calls/${currentNotification.call._id}`);
    }

    // Stop the alarm sound
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setIsVisible(false);
    setCurrentNotification(null);
  };

  const handleDismiss = () => {
    if (currentNotification) {
      removeNotification(currentNotification.id);
    }

    // Stop the alarm sound
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setIsVisible(false);
    setCurrentNotification(null);
  };

  if (!isVisible || !currentNotification) return null;

  const { call } = currentNotification;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-red-600 text-white p-4 flex items-center justify-between animate-pulse">
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="text-yellow-300 mr-3 text-xl animate-bounce"
            />
            <div>
              <h3 className="font-bold text-lg">Emergency Alert</h3>
              <p className="text-red-100 text-sm">
                {currentNotification.title}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:text-red-200 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Service Type */}
            <div className="bg-red-50 p-3 rounded-lg border-l-4 border-red-500">
              <p className="font-semibold text-red-800">
                Service Required: {call.service}
              </p>
            </div>

            {/* User Information */}
            <div className="flex items-center space-x-3">
              <FontAwesomeIcon icon={faUser} className="text-gray-600" />
              <div>
                <p className="font-medium">
                  {call.user?.name || call.name || "Anonymous"}
                </p>
                {(call.user?.phone || call.phone) && (
                  <div className="flex items-center text-sm text-gray-600">
                    <FontAwesomeIcon icon={faPhone} className="mr-1" />
                    {call.user?.phone || call.phone}
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start space-x-3">
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="text-red-600 mt-1"
              />
              <div>
                <p className="font-medium">Location:</p>
                {call.location?.address ? (
                  <p className="text-sm text-gray-700">
                    {call.location.address}
                  </p>
                ) : (
                  <p className="text-sm text-gray-700">
                    Lat: {call.location?.lat}, Lng: {call.location?.lng}
                  </p>
                )}
                <a
                  href={`https://www.google.com/maps?q=${call.location?.lat},${call.location?.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  View on Map
                </a>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-center space-x-3">
              <FontAwesomeIcon icon={faClock} className="text-gray-600" />
              <p className="text-sm text-gray-700">
                {formatDistanceToNow(new Date(call.timestamp), {
                  addSuffix: true,
                })}
              </p>
            </div>

            {/* Status */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  Status:
                </span>
                <div className="flex space-x-2">
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">
                    User: {call.statusByUser || "pending"}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    Personnel: {call.statusByPersonnel || "pending"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 mt-6">
            <button
              onClick={handleViewDetails}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faEye} className="mr-2" />
              View Details
            </button>
            <button
              onClick={handleDismiss}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyPopup;
