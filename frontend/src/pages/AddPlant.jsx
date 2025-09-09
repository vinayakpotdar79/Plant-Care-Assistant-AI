import { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";

export default function AddPlant() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [plantName, setPlantName] = useState("");
  const [nickname, setNickname] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    
    // Validate file type
    if (!f.type.startsWith('image/')) {
      setError("Please select an image file");
      return;
    }
    
    // Validate file size (max 5MB)
    if (f.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB");
      return;
    }
    
    setError("");
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setLoading(true);
    setError("");
    
    const formData = new FormData();
    formData.append("image", file);
    console.log(formData)
    try {
      const res = await axios.post("http://localhost:5000/api/plants/add", formData);
      setPlantName(res.data.plantName);
      setImageUrl(res.data.imageUrl);
      setStep(2);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to identify plant. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!plantName) return;
    
    setLoading(true);
    
    try {
      await axios.post("http://localhost:5000/api/plants/save", {
        userId: user.user.id,
        plantName,
        nickname: nickname || plantName, // Use plant name if no nickname provided
        imageUrl,
      });
      
      // Reset form
      setStep(1);
      setFile(null);
      setPreview(null);
      setPlantName("");
      setNickname("");
      setImageUrl("");
      setError("");
      
      // Show success message (you might want to use a toast notification instead)
      alert("Plant saved successfully!");
      
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to save plant. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRetake = () => {
    setFile(null);
    setPreview(null);
    setPlantName("");
    setStep(1);
    setError("");
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-2xl font-bold text-center text-emerald-800 mb-6">Add a New Plant</h1>
      
      {/* Progress Indicator */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-500"}`}>
            1
          </div>
          <div className={`w-12 h-1 ${step >= 2 ? "bg-emerald-600" : "bg-gray-200"}`}></div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-500"}`}>
            2
          </div>
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Step 1: Upload Image */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Upload a Photo of Your Plant</h2>
            <p className="text-gray-600">Our AI will identify your plant and provide care recommendations</p>
          </div>
          
          <div className="border-2 border-dashed border-emerald-200 rounded-xl p-6 text-center hover:border-emerald-400 transition-colors">
            <input 
              type="file" 
              id="plant-image"
              onChange={handleFileChange} 
              accept="image/*"
              className="hidden"
            />
            
            {preview ? (
              <div className="space-y-4">
                <img 
                  src={preview} 
                  alt="Plant preview" 
                  className="w-64 h-64 object-cover mx-auto rounded-lg shadow-md"
                />
                <label 
                  htmlFor="plant-image"
                  className="inline-block text-sm text-emerald-600 hover:text-emerald-800 cursor-pointer"
                >
                  Choose a different photo
                </label>
              </div>
            ) : (
              <label htmlFor="plant-image" className="cursor-pointer">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Click to upload a photo</p>
                    <p className="text-xs text-gray-500">JPEG, PNG or WEBP (max. 5MB)</p>
                  </div>
                </div>
              </label>
            )}
          </div>
          
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Identifying...
              </>
            ) : "Identify Plant"}
          </button>
        </div>
      )}

      {/* Step 2: Confirm Identification */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Plant Identified!</h2>
            <p className="text-gray-600">We found a match for your plant</p>
          </div>
          
          <div className="bg-emerald-50 rounded-xl p-4">
            <div className="flex items-center space-x-4">
              <img 
                src={preview} 
                alt="Identified plant" 
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div>
                <p className="text-sm text-gray-600">AI Suggestion</p>
                <h3 className="text-lg font-semibold text-emerald-800">{plantName}</h3>
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1">
              Give your plant a nickname (optional)
            </label>
            <input
              id="nickname"
              type="text"
              placeholder={`e.g., "My ${plantName}"`}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <p className="text-xs text-gray-500 mt-1">This will be the display name for your plant</p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleRetake}
              disabled={loading}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              Retake Photo
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : "Save Plant"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}