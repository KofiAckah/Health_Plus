import { useState } from "react";
import useAuth from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import { Logo, CompanyName } from "../Components/Default";

function Login() {
  const { login, loading } = useAuth();
  const [soNumber, setSoNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(soNumber, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#181314] text-white font-inter">
      <header className="flex items-center px-8 py-6 border-b border-[#231f20]">
        <img src={Logo} alt="CityServe" className="w-6 h-6 mr-3" />
        <span className="font-bold text-xl tracking-wide">{CompanyName}</span>
      </header>
      <main className="max-w-xl mx-auto mt-16 p-8">
        <h1 className="text-4xl font-bold mb-2">Welcome to {CompanyName}</h1>
        <p className="text-[#bdbdbd] mb-8">
          Log in with your Service Order Number (SONumber) and password.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 bg-none">
          <input
            type="number"
            placeholder="Service Order Number"
            value={soNumber}
            onChange={(e) => setSoNumber(e.target.value)}
            required
            className="bg-[#231f20] border-none rounded-lg p-4 text-white text-lg outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-[#231f20] border-none rounded-lg p-4 text-white text-lg outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className={`mt-4 bg-[#f51d1d] text-white border-none rounded-xl py-4 text-lg font-semibold transition-colors ${
              loading ? "opacity-60 cursor-not-allowed" : "hover:bg-red-700"
            }`}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
          {error && (
            <div className="text-[#f51d1d] mt-2 text-center">{error}</div>
          )}
        </form>
      </main>
    </div>
  );
}

export default Login;
