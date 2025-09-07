import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import { Link } from "react-router-dom";

// Sample data (replace later with backend fetch)
const samplePlants = [
  {
    id: 1,
    name: "Aloe Vera",
    watered: "Yes",
    sunlight: "Indirect sunlight",
    nextCareDate: "2025-09-09"
  },
  {
    id: 2,
    name: "Snake Plant",
    watered: "No",
    sunlight: "Low light",
    nextCareDate: "2025-09-10"
  }
];

export default function Dashboard() {
  const { auth } = useContext(AuthContext);
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    // Later: fetch from backend
    setPlants(samplePlants);
  }, []);

  return (
    <>
    <div className="min-h-screen p-8 bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-6">
        <h1 className="text-3xl font-bold">🌱 My Dashboard</h1>
        <p className="text-gray-600">
          Hello {auth?.user?.name}, here’s your plant collection.
        </p>

        {/* Plant Cards */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {plants.map((p) => (
            <div
              key={p.id}
              className="p-4 border rounded-xl bg-emerald-50 shadow"
            >
              <h2 className="text-xl font-semibold">{p.name}</h2>
              <p>💧 Watered: {p.watered}</p>
              <p>☀️ Sunlight: {p.sunlight}</p>
              <p>📅 Next Care Date: {p.nextCareDate}</p>
            </div>
          ))}
        </div>

        {/* Feature Links */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <Link
            to="/plant-identifier"
            className="px-4 py-3 text-center bg-emerald-600 text-white rounded-xl shadow hover:bg-emerald-700"
          >
            Plant Identifier
          </Link>
          <Link
            to="/report-issue"
            className="px-4 py-3 text-center bg-emerald-500 text-white rounded-xl shadow hover:bg-emerald-600"
          >
            Report Issue
          </Link>
          <Link
            to="/plant-tips"
            className="px-4 py-3 text-center bg-emerald-400 text-white rounded-xl shadow hover:bg-emerald-500"
          >
            Daily Tips
          </Link>
          <Link
            to="/rewards"
            className="px-4 py-3 text-center bg-emerald-300 text-white rounded-xl shadow hover:bg-emerald-400"
          >
            Rewards
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}
