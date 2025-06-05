import axios from "axios";
import { useState, useEffect } from "react";

function Home() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/issue", {
          withCredentials: true,
        });
        setTeams(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch teams");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);
  return (
    <div className="home">
      <h1>Teams</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (
        <ul>
          {teams.map((team) => (
            <li key={team._id}>
              <h2>{team.name}</h2>
              <p>{team.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Home;
