import { useState } from "react";
import useAuth from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import { Logo } from "../Components/Default";

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
    <div
      style={{
        minHeight: "100vh",
        background: "#181314",
        color: "#fff",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          padding: "1.5rem 2rem 1rem 2rem",
          borderBottom: "1px solid #231f20",
        }}
      >
        <img
          src={Logo}
          alt="CityServe"
          // style={{ width: 24, height: 24, marginRight: 12 }}
        />
        <span style={{ fontWeight: 700, fontSize: 20, letterSpacing: 0.5 }}>
          CityServe
        </span>
      </header>
      <main
        style={{
          maxWidth: 480,
          margin: "0 auto",
          marginTop: "4rem",
          padding: "2rem",
        }}
      >
        <h1 style={{ fontSize: 40, fontWeight: 700, marginBottom: 8 }}>
          Welcome to CityServe
        </h1>
        <p style={{ color: "#bdbdbd", marginBottom: 32 }}>
          Log in with your Service Order Number (SONumber) and password.
        </p>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
            background: "none",
          }}
        >
          <input
            type="number"
            placeholder="Service Order Number"
            value={soNumber}
            onChange={(e) => setSoNumber(e.target.value)}
            required
            style={{
              background: "#231f20",
              border: "none",
              borderRadius: 8,
              padding: "1rem",
              color: "#fff",
              fontSize: 18,
              marginBottom: 0,
              outline: "none",
            }}
          />
          <div style={{ display: "flex", gap: 12 }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                flex: 1,
                background: "#231f20",
                border: "none",
                borderRadius: 8,
                padding: "1rem",
                color: "#fff",
                fontSize: 18,
                outline: "none",
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 16,
              background: "#f51d1d",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "1rem 0",
              fontSize: 18,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
          {error && (
            <div
              style={{ color: "#f51d1d", marginTop: 8, textAlign: "center" }}
            >
              {error}
            </div>
          )}
        </form>
      </main>
    </div>
  );
}

export default Login;
