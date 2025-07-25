import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import useAuth from "./Context/useAuth";
import Home from "./Pages/Home";
import About from "./Pages/About";
import OfficerLogin from "./Pages/Accounts/OfficerLogin";
import FireHealthLogin from "./Pages/Accounts/FireHealthLogin";
import Loader from "./Components/Loader";
import NavBar from "./Components/NavBar";
import EmergencyCalls from "./Pages/EmergencyCalls";
import EmergencyDetails from "./Pages/EmergencyDetails";
import { NotificationProvider } from "./Context/NotificationContext";
import EmergencyPopup from "./Components/EmergencyPopup";

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Loader />;
  return isAuthenticated ? children : <Navigate to="/firehealth-login" />;
}

function App() {
  return (
    <NotificationProvider>
      <div className="App">
        <NavBar />
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/officer-login" element={<OfficerLogin />} />
          <Route path="/firehealth-login" element={<FireHealthLogin />} />
          <Route
            path="/emergency-calls"
            element={
              <PrivateRoute>
                <EmergencyCalls />
              </PrivateRoute>
            }
          />
          <Route
            path="/emergency-calls/:id"
            element={
              <PrivateRoute>
                <EmergencyDetails />
              </PrivateRoute>
            }
          />
        </Routes>

        {/* Global Emergency Popup */}
        <EmergencyPopup />
      </div>
    </NotificationProvider>
  );
}

export default App;
