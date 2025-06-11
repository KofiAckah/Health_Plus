import useAuth from "../../Context/useAuth";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

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
    <div className="bg-white text-primary-300 font-inter">
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
            <div className="text-xs text-primary-100 text-center mt-2">
              <p>
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  className="mr-1"
                  color="#ff4d4d"
                />
                This site is for only Ghana Police Service personnel only.
              </p>
            </div>
            {error && (
              <div className="text-red-500 text-center mt-2">{error}</div>
            )}
          </form>
          {/* Link to Fire and Health Service */}
          <div className="text-center mt-4">
            <p className="text-sm text-primary-100">
              Not a Police Officer?{" "}
              <Link
                to="/firehealth-login"
                className="text-primary-200 hover:text-blue-500 transition-colors"
              >
                Log in as Fire or Health Service personnel
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default OfficerLogin;
