import { useEffect, useState } from "react";
import { useParams, Link,useNavigate } from "react-router-dom";
import axios from "axios";
export default function PlantDetail() {
  const { id } = useParams();
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlant = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user.token;
      try {
        const res = await axios.get(`http://localhost:5000/api/plants/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlant(res.data);
      } catch (err) {
        console.error("Error fetching plant details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlant();
  }, [id]);

  const markAsWatered = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user.token;
      
      const res = await axios.patch(
        `http://localhost:5000/api/plants/${id}/water`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
            setPlant(res.data.plant);
      setShowPopup(true);
            setTimeout(() => {
        setShowPopup(false);
      }, 3000);
    } catch (err) {
      console.error("Error marking plant as watered", err);
    }
  };

  // Calculate days until next watering
  const getDaysUntilWatering = () => {
    if (!plant || !plant.nextWatering) return null;
    
    const nextWateringDate = new Date(plant.nextWatering);
    const today = new Date();
    const diffTime = nextWateringDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading plant details...</p>
        </div>
      </div>
    );
  }

  if (!plant) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Plant not found</h3>
          <Link
            to="/"
            className="mt-4 inline-block px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
          >
            Back to My Plants
          </Link>
        </div>
      </div>
    );
  }

  const daysUntilWatering = getDaysUntilWatering();
const deletePlant = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user.token;
    const res=await axios.delete(`http://localhost:5000/api/plants/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    navigate("/")
    alert(res.data.message)
  } catch (err) {
    console.error("Error deleting plant", err);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Back Button */}
      <Link to="/" className="inline-flex items-center text-emerald-600 hover:text-emerald-800 mb-6">
        <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to My Plants
      </Link>

      {/* Plant Card */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-2xl mx-auto">
        <div className="p-6">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-40 h-40 rounded-full bg-gray-100 border-4 border-emerald-300 overflow-hidden mb-4">
              <img
                src={plant.imageUrl}
                alt={plant.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900">{plant.nickname || plant.name}</h1>
            {plant.nickname && (
              <p className="text-gray-600">{plant.name}</p>
            )}
          </div>

          {/* Health Indicator */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Plant Health</span>
              <span className="text-sm font-bold text-emerald-700">{plant.health}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${plant.health > 80 ? 'bg-emerald-500' : plant.health > 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${plant.health}%` }}
              ></div>
            </div>
          </div>

          {/* Plant Details */}
          <div className="grid grid-cols-1 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <svg className="h-5 w-5 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
                <h3 className="font-medium text-gray-900">Watering Frequency</h3>
              </div>
              <p className="text-gray-600">Every {plant.wateringFrequency} days</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <svg className="h-5 w-5 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="font-medium text-gray-900">Last Watered</h3>
              </div>
              <p className="text-gray-600">{plant.lastWatered}</p>
            </div>

            {plant.nextWatering && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <svg className="h-5 w-5 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="font-medium text-gray-900">Next Watering</h3>
                </div>
                <p className="text-gray-600">
                  {new Date(plant.nextWatering).toLocaleDateString()}
                  {daysUntilWatering !== null && (
                    <span className="text-sm text-gray-500 block mt-1">
                      {daysUntilWatering <= 0 
                        ? "Watering is due!" 
                        : `in ${daysUntilWatering} day${daysUntilWatering !== 1 ? 's' : ''}`}
                    </span>
                  )}
                </p>
              </div>
            )}

            {plant.needsAttention && (
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-amber-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <h3 className="font-medium text-amber-800">Needs Attention</h3>
                </div>
                <p className="text-amber-700 text-sm mt-1">
                  This plant needs your care. Check if it needs water or other attention.
                </p>
              </div>
            )}
          </div>

          {/* Water Button */}
          <button
            onClick={markAsWatered}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
            Mark as Watered
          </button>
              {/* Delete Button */}
          <button
            onClick={deletePlant}
            className="w-full bg-red-600 text-white py-3 mt-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Remove Plant
          </button>

        </div>
      </div>
      

      {/* Watering Success Popup */}
      {showPopup && (
        <div className="fixed bottom-4 right-4 bg-emerald-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center animate-fadeIn">
          <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Plant watered successfully!</span>
        </div>
      )}
     

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}