import { Routes, Route } from "react-router-dom";
import NavBar from "./Components/NavBar";
import Footer from "./Components/Footer";

// Pages
import Home from "./Pages/Home";
import About from "./Pages/About";
import ContactUs from "./Pages/ContactUs";

function App() {
  return (
    <div className="min-h-screen bg-secondary-200">
      <NavBar />
      <main className="container mx-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactUs />} />
          {/* Add more routes as needed */}
          <Route
            path="*"
            element={
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="card text-center max-w-md">
                  <h1 className="text-2xl font-bold text-primary-300 mb-4">
                    Page Not Found
                  </h1>
                  <p className="text-muted-foreground mb-6">
                    The page you're looking for doesn't exist.
                  </p>
                  <button className="btn-primary">Go Back Home</button>
                </div>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
