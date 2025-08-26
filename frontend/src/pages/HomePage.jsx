import { useEffect, useState } from "react";
import api from "../lib/api";
import toast from "react-hot-toast";
import NavBar from "../components/NavBar";
import DaysNotFound from "../components/DaysNotFound";
import DayCard from "../components/DayCard";
import { formatDate } from "../lib/utils";

const HomePage = () => {
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDays = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/days", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDays(res.data);
      } catch (error) {
        toast.error("Failed to load days");
      } finally {
        setLoading(false);
      }
    };
    fetchDays();
  }, []);

  return (
    <div className="min-h-screen bg-base-200">
      <NavBar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-primary">Your Days</h1>
        {loading ? (
          <div className="text-center text-primary">Loading Days...</div>
        ) : days.length === 0 ? (
          <DaysNotFound />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {days.map((day) => (
              <DayCard key={day._id} day={day} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
