import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import useAuth from "./Context/useAuth";
import Home from "./Pages/Home";
import About from "./Pages/About";
import OfficerLogin from "./Pages/Accounts/OfficerLogin";
import FireHealthLogin from "./Pages/Accounts/FireHealthLogin";
import Loader from "./Components/Loader";

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Loader />;
  return isAuthenticated ? children : <Navigate to="/firehealth-login" />;
}

function App() {
  return (
    <div className="App">
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
      </Routes>
    </div>
  );
}

export default App;
