import axios from "axios";
import { useState, useEffect } from "react";
import useAuth from "../Context/useAuth";
import Loader from "../Components/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

function Home() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileResponse =
          user?.role === "police"
            ? await axios.get("/officer/profile")
            : await axios.get("/officer/firehealth/profile");
        const response = profileResponse;
        if (!response) {
          throw new Error("Profile not found");
        }
        setProfile(response.data);
      } catch (err) {
        console.error(
          "Failed to fetch profile:",
          err.message || "Unknown error"
        );
        setError(err.message || "Failed to fetch teams");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user.role]);

  if (loading) return <Loader />;

  return (
    <div className="bg-white p-4 md:p-8">
      <h1>Teams</h1>
      {error && <p className="error">{error}</p>}
      {/* Profile */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
        <div className="mb-4 bg-white p-4 rounded-lg shadow-md ">
          <p className="mb-2">Profile</p>
          <div className="flex items-center justify-between">
            <div className="border border-primary-200 rounded-full p-4 mr-4 overflow-hidden">
              <FontAwesomeIcon icon={faUser} className="text-7xl" />
            </div>
            <div className="">
              <h2 className="text-lg font-semibold">
                {profile?.name || "No Name Provided"}
              </h2>
              <p>{profile.email}</p>
              <p>{profile.phone || "No Phone Provided"}</p>
              <p>
                Role:{" "}
                <span className="text-primary-200">
                  {profile.role || "No Role Provided"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
