import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import PlantBot from "./Plantbot";
import API from "../services/api";

export default function Home() {
  const [plants, setPlants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = user.token;
        const res = await API.get("/plants", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPlants(res.data);
      } catch (err) {
        console.error("Error fetching plants", err);
      } finally {
        setLoading(false);
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
      (plant.nickname && plant.nickname.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const markAsWatered = async (plantId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user.token;
      
      await API.patch(
        `/plants/${plantId}/water`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state to reflect the change
      setPlants(plants.map(plant => 
        plant._id === plantId 
          ? { ...plant, lastWatered: new Date().toISOString(), needsAttention: false } 
          : plant
      ));
    } catch (err) {
      console.error("Error marking plant as watered", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your plants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white p-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-emerald-800 mb-2">🌿 My Plant Family</h1>
        <p className="text-gray-600">You're taking care of {plants.length} plant{plants.length !== 1 ? 's' : ''}</p>
      </div>
      {/* Search and Filter Section */}
      {plants.length > 0 && (
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
      )}

      {/* Plants Grid or Empty State */}
      {plants.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="h-12 w-12 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No plants yet</h3>
          <p className="text-gray-500 mb-6">Start building your plant family by adding your first plant</p>
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
      ) : filteredPlants.length === 0 ? (
        <div className="text-center py-12  rounded-xl shadow-sm ">
          <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No plants found</h3>
          <p className="mt-1 text-gray-500">Try adjusting your search or filter</p>
          <button 
            onClick={() => { setSearchQuery(""); setActiveFilter("all"); }}
            className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPlants.map((plant) => (
            <div key={plant._id} className="flex flex-col items-center text-center group">
              <Link to={`/plants/${plant._id}`} className="relative">
                <div className="w-32 h-32 rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden border-4 border-emerald-300 group-hover:scale-105 transition-transform relative">
                  <img
                    src={plant.imageUrl}
                    alt={plant.name}
                    className="w-full h-full object-cover"
                  />
                  {plant.needsAttention && (
                    <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                      !
                    </div>
                  )}
                </div>
              </Link>
              <div className="mt-4 w-full">
                <Link to={`/plants/${plant._id}`}>
                  <h3 className="font-semibold text-emerald-800 group-hover:text-emerald-600 transition-colors">
                    {plant.nickname || plant.name}
                  </h3>
                  {plant.nickname && (
                    <p className="text-gray-500 text-sm">{plant.name}</p>
                  )}
                </Link>
                
                {plant.health && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Health</span>
                      <span>{plant.health}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${plant.health > 80 ? 'bg-emerald-500' : plant.health > 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${plant.health}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                <div className="mt-3 flex justify-between items-center">
                  {plant.nextWatering && (
                    <span className={`text-xs font-medium ${new Date(plant.nextWatering) <= new Date() ? 'text-amber-600' : 'text-gray-600'}`}>
                      {new Date(plant.nextWatering) <= new Date() ? (
                        <span className="flex items-center">
                          <svg className="h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Water due!
                        </span>
                      ) : (
                        `${Math.ceil((new Date(plant.nextWatering) - new Date()) / (1000 * 60 * 60 * 24))}d`
                      )}
                    </span>
                  )}
                  
                  <button 
                    onClick={() => markAsWatered(plant._id)}
                    className="text-xs bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-2 py-1 rounded transition-colors"
                  >
                    Watered
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <PlantBot/>
      {/* Add Plant Floating Button */}
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