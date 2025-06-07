import useAuth from "../../Context/useAuth";
import { useNavigate } from "react-router-dom";
import { Logo, CompanyName } from "../../Components/Default";
import { useState, useEffect } from "react";

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
    <div className="min-h-screen bg-white text-primary-300 font-inter">
      <header className="flex items-center px-6 py-4 border-b border-secondary-200">
        <img src={Logo} alt="Health Plus Logo" className="w-8 sm:w-12 mr-2" />
        <span className="text-xl sm:text-2xl font-semibold">{CompanyName}</span>
      </header>
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
            {error && (
              <div className="text-red-500 text-center mt-2">{error}</div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}

export default FireHealthLogin;
