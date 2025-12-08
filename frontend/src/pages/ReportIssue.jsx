import { useState, useRef } from "react";
import axios from "axios";
import API from "../services/api";

export default function ReportIssue() {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState("");
  const [step, setStep] = useState(1); // 1: form, 2: results
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image && !description) {
      alert("Please upload an image or enter a description");
      return;
    }

    const formData = new FormData();
    if (image) formData.append("image", image);
    if (description) formData.append("description", description);

    try {
      setLoading(true);
      const res = await API.post("/report", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setDiagnosis(res.data.diagnosis);
      setStep(2);
    } catch (err) {
      console.error("Error reporting issue:", err);
      setDiagnosis("Failed to analyze issue. Please try again.");
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const startNewDiagnosis = () => {
    setDescription("");
    setImage(null);
    setPreview(null);
    setDiagnosis("");
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🌿</span>
          </div>
          <h1 className="text-3xl font-bold text-emerald-800 mb-2">Plant Health Diagnosis</h1>
          <p className="text-gray-600">Upload a photo or describe your plant's issue for AI analysis</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-500"}`}>
              1
            </div>
            <div className="w-12 h-1 bg-emerald-600 mx-2"></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-500"}`}>
              2
            </div>
          </div>
        </div>

        {step === 1 ? (
          /* Form Step */
          <div className="bg-white rounded-xl shadow-md p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Plant Photo (Optional)
                </label>
                {preview ? (
                  <div className="relative">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-400 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-1 text-sm text-gray-600">Click to upload a photo</p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Describe the Issue (Optional)
                </label>
                <textarea
                  id="description"
                  placeholder="E.g., Leaves turning yellow, brown spots appearing, wilting..."
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || (!image && !description)}
                className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  "Analyze Plant Issue"
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Results Step */
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-emerald-800 mb-2">Analysis Complete</h2>
              <p className="text-gray-600">Here's what our AI diagnosis found</p>
            </div>

            {/* Diagnosis Result */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-emerald-800 mb-3">🌱 Plant Diagnosis</h3>
              <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {diagnosis}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={startNewDiagnosis}
                className="flex-1 bg-white border border-emerald-600 text-emerald-600 py-3 rounded-lg font-medium hover:bg-emerald-50 transition-colors"
              >
                Analyze Another Plant
              </button>
              <button
                onClick={() => navigator.clipboard.writeText(diagnosis)}
                className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center"
              >
                Copy Results
              </button>
            </div>
          </div>
        )}

        {/* Tips */}
        {step === 1 && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">💡 Tips for Better Analysis</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Take clear, well-lit photos of affected leaves</li>
              <li>• Include full plant view for better response</li>
              <li>• Describe symptoms, recent changes, and care routine</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}