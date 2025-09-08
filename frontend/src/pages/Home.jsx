import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import p1 from "../assets/plants/p1.png";
import p2 from "../assets/plants/p2.png";
import p3 from "../assets/plants/p3.png";

export default function Home() {
  const [plants, setPlants] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Dummy data – later replace with API call
    setPlants([
      {
        id: 1,
        name: "Aloe Vera",
        nickname: "Alo",
        image: p1,
        water: "Every 3 days",
        sunlight: "Indirect Sunlight",
        nextCare: "Tomorrow",
        health: 85,
        lastWatered: "2 days ago",
        needsAttention: false
      },
      {
        id: 2,
        name: "Snake Plant",
        nickname: "Slither",
        image: p2,
        water: "Once a week",
        sunlight: "Low to Bright Light",
        nextCare: "In 2 days",
        health: 92,
        lastWatered: "5 days ago",
        needsAttention: false
      },
      {
        id: 3,
        name: "Peace Lily",
        nickname: "Peaceful",
        image: p3,
        water: "Every 2 days",
        sunlight: "Medium Light",
        nextCare: "Today",
        health: 78,
        lastWatered: "4 days ago",
        needsAttention: true
      },
      {
        id: 4,
        name: "Monstera Deliciosa",
        nickname: "Monty",
        image: "https://images.unsplash.com/photo-1525498128493-380d1990a112?auto=format&fit=crop&q=80&w=300",
        water: "Every 5 days",
        sunlight: "Bright Indirect Light",
        nextCare: "Tomorrow",
        health: 90,
        lastWatered: "3 days ago",
        needsAttention: false
      }
    ]);
  }, []);

  const filteredPlants = plants.filter(plant => {
    const matchesFilter = activeFilter === "all" || 
                         (activeFilter === "attention" && plant.needsAttention);
    const matchesSearch = plant.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         plant.nickname.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const markAsWatered = (plantId) => {
    setPlants(plants.map(plant => 
      plant.id === plantId ? {...plant, lastWatered: "Just now", needsAttention: false} : plant
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white p-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-emerald-800 mb-2">🌿 My Plant Family</h1>
        <p className="text-gray-600">You're taking care of {plants.length} plants</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-emerald-100">
          <div className="text-2xl font-bold text-emerald-600">{plants.length}</div>
          <div className="text-sm text-gray-600">Total Plants</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-emerald-100">
          <div className="text-2xl font-bold text-emerald-600">
            {plants.filter(p => p.needsAttention).length}
          </div>
          <div className="text-sm text-gray-600">Need Attention</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-emerald-100">
          <div className="text-2xl font-bold text-emerald-600">
            {Math.round(plants.reduce((sum, plant) => sum + plant.health, 0) / plants.length)}%
          </div>
          <div className="text-sm text-gray-600">Avg. Health</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-emerald-100">
          <div className="text-2xl font-bold text-emerald-600">
            {plants.filter(p => p.nextCare === "Today").length}
          </div>
          <div className="text-sm text-gray-600">Due Today</div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search your plants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          <svg 
            className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        
        <div className="flex gap-2">
          <button 
            className={`px-4 py-2 rounded-xl ${activeFilter === "all" ? "bg-emerald-600 text-white" : "bg-white text-gray-700 border border-gray-300"}`}
            onClick={() => setActiveFilter("all")}
          >
            All Plants
          </button>
          <button 
            className={`px-4 py-2 rounded-xl flex items-center gap-2 ${activeFilter === "attention" ? "bg-amber-100 text-amber-800 border border-amber-200" : "bg-white text-gray-700 border border-gray-300"}`}
            onClick={() => setActiveFilter("attention")}
          >
            <span>Needs Attention</span>
            {plants.filter(p => p.needsAttention).length > 0 && (
              <span className="bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {plants.filter(p => p.needsAttention).length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Plants Grid */}
      {filteredPlants.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
          <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No plants found</h3>
          <p className="mt-1 text-gray-500">Try adjusting your search or filter</p>
          <div className="mt-6">
            <Link
              to="/add-plant"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Your First Plant
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlants.map((plant) => (
            <div key={plant.id} className={`bg-white rounded-xl shadow-sm overflow-hidden border-l-4 ${plant.needsAttention ? 'border-amber-500' : 'border-emerald-500'} hover:shadow-md transition-shadow`}>
              <Link to={`/plants/${plant.id}`}>
                <div className="h-48 bg-emerald-50 flex items-center justify-center relative">
                  <img
                    src={plant.image}
                    alt={plant.name}
                    className="h-40 w-40 object-contain"
                  />
                  {plant.needsAttention && (
                    <div className="absolute top-4 right-4 bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded-full">
                      Needs Care
                    </div>
                  )}
                </div>
              </Link>
              
              <div className="p-4">
                <Link to={`/plants/${plant.id}`}>
                  <h3 className="font-semibold text-lg text-gray-900 hover:text-emerald-700 transition-colors">
                    {plant.nickname}
                  </h3>
                  <p className="text-gray-600 text-sm">{plant.name}</p>
                </Link>
                
                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Health</span>
                    <span>{plant.health}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${plant.health > 80 ? 'bg-emerald-500' : plant.health > 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${plant.health}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <svg className="h-4 w-4 mr-1 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                    {plant.water}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="h-4 w-4 mr-1 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    {plant.sunlight}
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <span className={`text-sm font-medium ${plant.nextCare === "Today" ? 'text-amber-600' : 'text-gray-600'}`}>
                    {plant.nextCare === "Today" ? (
                      <span className="flex items-center">
                        <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Care due today!
                      </span>
                    ) : (
                      `Next care: ${plant.nextCare}`
                    )}
                  </span>
                  
                  <button 
                    onClick={() => markAsWatered(plant.id)}
                    className="text-xs bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-2 py-1 rounded-lg transition-colors"
                  >
                    Watered
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Plant Button */}
      <Link
        to="/add-plant"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg hover:bg-emerald-600 transition-colors"
      >
        <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </Link>
    </div>
  );
}