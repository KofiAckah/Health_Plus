import axios from "axios";
import { useState, useEffect } from "react";
import useAuth from "../Context/useAuth";
import Loader from "../Components/Loader";

function Home() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/issue");
        setTeams(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch teams");
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="home">
      <h1>Teams</h1>
      {error && <p className="error">{error}</p>}
      {!error && (
        <ul>
          {teams.map((team) => (
            <li key={team._id}>
              <h2>{team.name || team.title}</h2>
              <p>{team.description}</p>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-8">
        <p>
          Logged in as: <b>{user?.name}</b> ({user?.role})
        </p>
      </div>
    </div>
  );
}

export default Home;
