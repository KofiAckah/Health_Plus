import useAuth from "../../Context/useAuth";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

function FireHealthLogin() {
  const {
    loginFireHealth,
    loginFireHealthWithPhone,
    loading,
    isAuthenticated,
  } = useAuth();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loginMode, setLoginMode] = useState("email"); // "email" or "phone"
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (loginMode === "email") {
        if (!email) throw new Error("Please provide an email.");
        await loginFireHealth(email, password);
      } else {
        if (!phone) throw new Error("Please provide a phone number.");
        await loginFireHealthWithPhone(phone, password);
      }
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className=" bg-white text-primary-300 font-inter">
      <main className="flex flex-col items-center mt-12">
        <div className="w-full max-w-md bg-transparent rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-2 text-primary-300 text-center">
            Log in to your account
          </h1>
          <p className="text-sm text-primary-100 text-center mb-8">
            Log in with your email or phone number and password.
          </p>
          <div className="flex justify-center gap-2 mb-6">
            <button
              type="button"
              onClick={() => setLoginMode("email")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                loginMode === "email"
                  ? "bg-primary-200 text-white"
                  : "bg-primary-300/20 text-primary-300"
              }`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => setLoginMode("phone")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                loginMode === "phone"
                  ? "bg-primary-200 text-white"
                  : "bg-primary-300/20 text-primary-300"
              }`}
            >
              Phone
            </button>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {loginMode === "email" && (
              <div>
                <label
                  className="block mb-1 text-base font-medium"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-secondary-200 text-primary-300 placeholder:text-primary-100 border-none rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
              </div>
            )}
            {loginMode === "phone" && (
              <div>
                <label
                  className="block mb-1 text-base font-medium"
                  htmlFor="phone"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/, ""))}
                  required
                  className="w-full bg-secondary-200 text-primary-300 placeholder:text-primary-100 border-none rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
              </div>
            )}
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
                This site is for only Ghana National Fire Service and Ghana
                Health Service personnel only.
              </p>
              {/* <p>
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  className="mr-1"
                  color="#ff4d4d"
                />
                For assistance, please reach out to your department's IT
                support.
              </p> */}
            </div>
            {error && (
              <div className="text-red-500 text-center mt-2">{error}</div>
            )}
          </form>
          {/* Link to Officer */}
          <div className="text-center mt-4">
            <p className="text-sm text-primary-100">
              Not a Fire or Health Service personnel?{" "}
              <Link
                to="/officer-login"
                className="text-primary-200 hover:text-blue-500 transition-colors"
              >
                Log in as Police Officer
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default FireHealthLogin;
