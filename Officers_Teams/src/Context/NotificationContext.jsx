import React, { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import useAuth from "./useAuth";

const NotificationContext = createContext();

const SOCKET_URL = "http://localhost:5000";

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider"
    );
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const newSocket = io(SOCKET_URL, { withCredentials: true });
    setSocket(newSocket);

    // Listen for new emergency calls
    newSocket.on("new-emergency-call", (call) => {
      // Create notification
      const notification = {
        id: call._id,
        type: "emergency",
        title: `New ${call.service} Emergency`,
        message: `Emergency call from ${
          call.user?.name || call.name || "Anonymous"
        }`,
        timestamp: new Date(),
        call: call,
        read: false,
      };

      setNotifications((prev) => [notification, ...prev]);
    });

    // Listen for emergency call updates
    newSocket.on("emergency-call-updated", (updatedCall) => {
      // Update existing notification if it exists
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === updatedCall._id ? { ...notif, call: updatedCall } : notif
        )
      );
    });

    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated, user]);

  const addNotification = (notification) => {
    setNotifications((prev) => [{ ...notification, id: Date.now() }, ...prev]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        markAsRead,
        clearAllNotifications,
        socket,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
