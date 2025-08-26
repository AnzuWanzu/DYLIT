import { useEffect, useState, useRef } from "react";
import api from "../lib/api";
import toast from "react-hot-toast";
import NavBar from "../components/NavBar";
import DaysNotFound from "../components/DaysNotFound";
import DayCard from "../components/DayCard";
import {
  groupDaysBySort,
  getSortedGroupKeys,
  getGroupTitle,
} from "../lib/utils";
import {
  ChevronDownIcon,
  CalendarIcon,
  Calendar,
  Clock,
  Zap,
} from "lucide-react";

const HomePage = () => {
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("day");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSortDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const getSortIcon = () => {
    switch (sortBy) {
      case "latest":
        return <Zap className="w-4 h-4" />;
      case "week":
        return <Calendar className="w-4 h-4" />;
      case "month":
        return <CalendarIcon className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const groupedDays = groupDaysBySort(days, sortBy);
  const sortedKeys = getSortedGroupKeys(groupedDays, sortBy);

  return (
    <div className="min-h-screen bg-base-200">
      <NavBar />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent drop-shadow-sm">
              How Locked-in are you?
            </h1>
            <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-primary/30 via-accent/30 to-secondary/30 rounded-full blur-sm"></div>
            <div className="absolute -bottom-1 left-0 w-3/4 h-0.5 bg-gradient-to-r from-primary via-accent to-transparent rounded-full"></div>
          </div>

          {/* Sort Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="btn btn-primary btn-sm flex items-center gap-2"
            >
              {getSortIcon()}
              Sort by {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
              <ChevronDownIcon
                className={`w-4 h-4 transition-transform ${
                  showSortDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {showSortDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-base-100 rounded-lg shadow-lg border border-base-300 z-10">
                <div className="py-2">
                  <button
                    onClick={() => {
                      setSortBy("latest");
                      setShowSortDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-base-200 flex items-center gap-2 ${
                      sortBy === "latest"
                        ? "bg-primary text-primary-content"
                        : ""
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                    Latest
                  </button>
                  <button
                    onClick={() => {
                      setSortBy("day");
                      setShowSortDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-base-200 flex items-center gap-2 ${
                      sortBy === "day" ? "bg-primary text-primary-content" : ""
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    By Day
                  </button>
                  <button
                    onClick={() => {
                      setSortBy("week");
                      setShowSortDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-base-200 flex items-center gap-2 ${
                      sortBy === "week" ? "bg-primary text-primary-content" : ""
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    By Week
                  </button>
                  <button
                    onClick={() => {
                      setSortBy("month");
                      setShowSortDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-base-200 flex items-center gap-2 ${
                      sortBy === "month"
                        ? "bg-primary text-primary-content"
                        : ""
                    }`}
                  >
                    <CalendarIcon className="w-4 h-4" />
                    By Month
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center text-primary">Loading Days...</div>
        ) : days.length === 0 ? (
          <DaysNotFound />
        ) : (
          <div className="space-y-8">
            {sortedKeys.map((groupKey) => (
              <div key={groupKey} className="space-y-4">
                {/* Group Header */}
                <div className="flex items-center gap-3">
                  <div className="h-px bg-primary/20 flex-1"></div>
                  <h2 className="text-xl font-semibold text-primary bg-base-200 px-4 py-2 rounded-lg border border-primary/20">
                    {getGroupTitle(groupKey, sortBy)}
                  </h2>
                  <div className="h-px bg-primary/20 flex-1"></div>
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedDays[groupKey].map((day) => (
                    <DayCard key={day._id} day={day} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
