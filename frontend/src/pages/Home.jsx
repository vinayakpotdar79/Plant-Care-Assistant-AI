import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const [plants, setPlants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/plants", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPlants(res.data);
      } catch (err) {
        console.error("Error fetching plants", err);
      }
    };
    fetchPlants();
  }, []);

  const filteredPlants = plants.filter((plant) => {
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "attention" && plant.needsAttention);
    const matchesSearch =
      plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.nickname.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white p-6">
      <h1 className="text-3xl font-bold text-emerald-800 mb-6">🌿 My Plants</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search plants..."
        className="w-full border rounded-lg p-3 mb-6"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Plant Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {filteredPlants.map((plant) => (
          <Link
            key={plant._id}
            to={`/plants/${plant._id}`}
            className="flex flex-col items-center text-center group"
          >
            <div className="w-32 h-32 rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden border-4 border-emerald-300 group-hover:scale-105 transition-transform">
              <img
                src={plant.imageUrl}
                alt={plant.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="mt-3 font-semibold text-emerald-800">
              {plant.nickname || plant.name}
            </h3>
            <p className="text-gray-500 text-sm">{plant.name}</p>
          </Link>
        ))}
      </div>

      {/* Add Plant Floating Button */}
      <Link
        to="/add-plant"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg hover:bg-emerald-600 transition"
      >
        +
      </Link>
    </div>
  );
}
