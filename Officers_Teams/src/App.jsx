import { Routes, Route } from "react-router-dom";
import "./App.css";
import useAuth from "./context/useAuth";

import Home from "./Pages/Home";
import Login from "./Pages/Login";
import About from "./Pages/About";

function App() {
  const { isAuthenticated } = useAuth();
  return (
    <div className="App">
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={isAuthenticated ? <Home /> : <Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

export default App;
