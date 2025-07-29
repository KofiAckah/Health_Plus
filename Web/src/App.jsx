import React from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./Components/NavBar";

// Pages
import Home from "./Pages/Home";
import About from "./Pages/About";
import ContactUs from "./Pages/ContactUs";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactUs />} />
          {/* Add more routes as needed */}
          <Route
            path="*"
            element={<div className="text-center py-20">Page Not Found</div>}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
