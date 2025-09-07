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
    const {user}=useContext(AuthContext)
    console.log(user.user.id)
    const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("image", file);
try{
const res = await axios.post("http://localhost:5000/api/plants/add", formData);
    setPlantName(res.data.plantName);
    setImageUrl(res.data.imageUrl);
    setStep(2);
}
catch(err){
  console.log(err)
}
  };

  const handleSave = async () => {
    await axios.post("http://localhost:5000/api/plants/save", {
      userId: user.user.id, // TODO: replace with logged-in user ID
      plantName,
      nickname,
      imageUrl,
    });
    alert("Plant saved!");
    setStep(1);
    setFile(null);
    setPreview(null);
    setPlantName("");
    setNickname("");
    setImageUrl("");
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white shadow rounded-lg">
      {step === 1 && (
        <>
          <h2 className="text-xl font-bold mb-4">Upload Plant</h2>
          <input type="file" onChange={handleFileChange} className="mb-4" />
          {preview && <img src={preview} alt="preview" className="w-48 mx-auto rounded-lg mb-4" />}
          <button
            onClick={handleUpload}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
            disabled={!file}
          >
            Identify Plant
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <h2 className="text-xl font-bold mb-4">Plant Identified</h2>
          <p>AI Suggestion: <strong>{plantName}</strong></p>
          <input
            type="text"
            placeholder="Give a nickname (optional)"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="border rounded p-2 w-full mt-4"
          />
          <button
            onClick={handleSave}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg mt-4 hover:bg-emerald-700"
          >
            Save Plant
          </button>
        </>
      )}
    </div>
  );
}
