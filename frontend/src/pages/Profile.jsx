import { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";

export default function ProfileSection() {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("plants");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    location: user?.location || "",
    bio: user?.bio || "",
    experience: user?.experience || "beginner"
  });

  // Sample user plants data
  const userPlants = [
    { id: 1, name: "Monstera Deliciosa", nickname: "Monty", health: 85, lastWatered: "2 days ago", image: "/plant1.jpg" },
    { id: 2, name: "Snake Plant", nickname: "Slither", health: 92, lastWatered: "5 days ago", image: "/plant2.jpg" },
    { id: 3, name: "Pothos", nickname: "Goldie", health: 78, lastWatered: "3 days ago", image: "/plant3.jpg" },
  ];

  // Sample achievements
  const achievements = [
    { id: 1, title: "Plant Parent", description: "Added your first plant", earned: true, icon: "🌱" },
    { id: 2, title: "Green Thumb", description: "Kept a plant alive for 30 days", earned: true, icon: "👍" },
    { id: 3, title: "Plant Expert", description: "Identified 10 different plants", earned: false, icon: "🔍" },
    { id: 4, title: "Watering Pro", description: "Perfect watering for 2 weeks", earned: false, icon: "💧" },
  ];

  const handleSaveProfile = () => {
    // Here you would typically make an API call to update the user profile
    console.log("Saving profile:", editForm);
    setIsEditing(false);
    // Update context or global state with new user data
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center text-3xl">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <button className="absolute bottom-0 right-0 bg-emerald-500 text-white p-2 rounded-full shadow-md hover:bg-emerald-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>

            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleInputChange}
                    className="text-2xl font-bold border-b-2 border-emerald-500 focus:outline-none focus:border-emerald-600"
                    placeholder="Your Name"
                  />
                  <input
                    type="text"
                    name="location"
                    value={editForm.location}
                    onChange={handleInputChange}
                    className="text-gray-600 border-b-2 border-gray-300 focus:outline-none focus:border-emerald-500"
                    placeholder="Your Location"
                  />
                  <textarea
                    name="bio"
                    value={editForm.bio}
                    onChange={handleInputChange}
                    className="w-full text-gray-700 border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-emerald-500"
                    rows="3"
                    placeholder="Tell us about your plant journey..."
                  />
                  <select
                    name="experience"
                    value={editForm.experience}
                    onChange={handleInputChange}
                    className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="beginner">Beginner Plant Parent</option>
                    <option value="intermediate">Intermediate Gardener</option>
                    <option value="expert">Plant Expert</option>
                  </select>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-gray-900">{user?.name || 'Plant Lover'}</h1>
                  <p className="text-gray-600 mb-2">{user?.location || 'Location not set'}</p>
                  <p className="text-gray-700 mb-4">{user?.bio || 'No bio yet. Share your plant journey!'}</p>
                  <div className="flex items-center justify-center md:justify-start gap-4">
                    <span className="bg-emerald-100 text-emerald-800 text-sm font-medium px-3 py-1 rounded-full">
                      {user?.experience ? editForm.experience.replace(/\b\w/g, l => l.toUpperCase()) : 'Beginner'}
                    </span>
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                      {userPlants.length} Plants
                    </span>
                  </div>
                </>
              )}

              <div className="flex gap-3 mt-6 justify-center md:justify-start">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSaveProfile}
                      className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={logout}
                      className="border border-red-300 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600">{userPlants.length}</div>
            <div className="text-sm text-gray-600">Total Plants</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600">5</div>
            <div className="text-sm text-gray-600">Species</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600">87%</div>
            <div className="text-sm text-gray-600">Avg. Health</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600">{achievements.filter(a => a.earned).length}</div>
            <div className="text-sm text-gray-600">Achievements</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("plants")}
            className={`px-4 py-2 font-medium ${activeTab === "plants" ? "text-emerald-600 border-b-2 border-emerald-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            My Plants
          </button>
          <button
            onClick={() => setActiveTab("achievements")}
            className={`px-4 py-2 font-medium ${activeTab === "achievements" ? "text-emerald-600 border-b-2 border-emerald-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Achievements
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2 font-medium ${activeTab === "settings" ? "text-emerald-600 border-b-2 border-emerald-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Settings
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "plants" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userPlants.map(plant => (
              <div key={plant.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-40 bg-emerald-100 flex items-center justify-center">
                  <span className="text-4xl">🌿</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{plant.nickname}</h3>
                  <p className="text-gray-600 text-sm">{plant.name}</p>
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
                  <p className="text-gray-500 text-sm mt-2">Last watered: {plant.lastWatered}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "achievements" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map(achievement => (
              <div 
                key={achievement.id} 
                className={`bg-white rounded-xl shadow-sm p-4 flex items-center gap-4 ${achievement.earned ? '' : 'opacity-50'}`}
              >
                <div className="text-3xl">{achievement.icon}</div>
                <div>
                  <h3 className="font-semibold">{achievement.title}</h3>
                  <p className="text-gray-600 text-sm">{achievement.description}</p>
                  <span className={`text-xs mt-1 ${achievement.earned ? 'text-emerald-600' : 'text-gray-400'}`}>
                    {achievement.earned ? 'Earned' : 'Not yet earned'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-lg mb-4">Account Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Notifications</label>
                <div className="flex items-center">
                  <input type="checkbox" className="rounded text-emerald-600 focus:ring-emerald-500" defaultChecked />
                  <span className="ml-2 text-sm text-gray-600">Receive plant care reminders</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Watering Reminders</label>
                <select className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option>1 day before</option>
                  <option>2 days before</option>
                  <option>On the day</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Temperature Unit</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input type="radio" name="temperature" className="text-emerald-600 focus:ring-emerald-500" defaultChecked />
                    <span className="ml-2 text-sm text-gray-600">Celsius</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="temperature" className="text-emerald-600 focus:ring-emerald-500" />
                    <span className="ml-2 text-sm text-gray-600">Fahrenheit</span>
                  </label>
                </div>
              </div>
              <button className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors mt-4">
                Delete Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}