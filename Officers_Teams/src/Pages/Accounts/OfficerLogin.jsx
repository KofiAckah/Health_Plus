import useAuth from "../../Context/useAuth";
import { useNavigate } from "react-router-dom";
import { Logo, CompanyName } from "../../Components/Default";
import { useState, useEffect } from "react";

function OfficerLogin() {
  const { loginOfficer, loading, isAuthenticated } = useAuth();
  const [soNumber, setSoNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await loginOfficer(soNumber, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-white text-primary-300 font-inter">
      <header className="flex items-center px-6 py-4 border-b border-secondary-200">
        <img src={Logo} alt="Health Plus Logo" className="w-8 sm:w-12 mr-2" />
        <span className="text-xl sm:text-2xl font-semibold">{CompanyName}</span>
      </header>
      <main className="flex flex-col items-center mt-12">
        <div className="w-full max-w-md bg-transparent rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-2 text-primary-300 text-center">
            Police Officer Login
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label
                className="block mb-1 text-base font-medium"
                htmlFor="soNumber"
              >
                Service Order Number
              </label>
              <input
                id="soNumber"
                type="number"
                placeholder="Enter SONumber"
                value={soNumber}
                onChange={(e) => setSoNumber(e.target.value)}
                required
                className="w-full bg-secondary-200 text-primary-300 placeholder:text-primary-100 border-none rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>
            <div>
              <label
                className="block mb-1 text-base font-medium"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-secondary-200 text-primary-300 placeholder:text-primary-100 border-none rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-200 hover:bg-primary-100 text-white font-semibold rounded-xl py-3 mt-2 transition-colors duration-200 disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
            {error && (
              <div className="text-red-500 text-center mt-2">{error}</div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}

export default OfficerLogin;
