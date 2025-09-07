import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import p1 from "../assets/plants/p1.png"
import p2 from "../assets/plants/p2.png"
import p3 from "../assets/plants/p3.png"

export default function Home() {
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    // Dummy data – later replace with API call
    setPlants([
      {
        id: 1,
        name: "Aloe Vera",
        image: p1,
        water: "Every 3 days",
        sunlight: "Indirect Sunlight",
        nextCare: "Tomorrow"
      },
      {
        id: 2,
        name: "Snake Plant",
        image: p2,
        water: "Once a week",
        sunlight: "Low to Bright Light",
        nextCare: "In 2 days"
      },
      {
        id: 3,
        name: "Peace Lily",
        image: p3,
        water: "Every 2 days",
        sunlight: "Medium Light",
        nextCare: "Today"
      }
    ]);
  }, []);

  return (
    <>
    <div className="p-6">
      <h1 className="text-3xl font-bold text-emerald-700 mb-6">🌱 My Plants</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {plants.map((plant) => (
          <Link
            key={plant.id}
            to={`/plants/${plant.id}`}
            className="flex flex-col items-center"
          >
            {/* Circle card */}
            <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg border-4 border-emerald-500 hover:scale-105 transition-transform">
              <img
                src={plant.image}
                alt={plant.name}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="mt-3 text-lg font-semibold text-gray-800">
              {plant.name}
            </p>
          </Link>
        ))}
      </div>
    </div>
    </>
  );
}
