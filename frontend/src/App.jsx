import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AddPlant from "./pages/AddPlant";
import ReportIssue from "./pages/ReportIssue";
import Profile from "./pages/Profile";
import PlantDetail from "./pages/PlantDetail";
import Navbar from "./components/Navbar";
import { AuthContext } from "./context/authContext";
import "./styles/style.css";

function App() {
    const { user, loading } = useContext(AuthContext);
  console.log("App render", user);
  if (loading) {
    return <p>Loading...</p>; // or a spinner
  }
  return (
    <BrowserRouter>
      {user && <Navbar />} {/* Show navbar only when logged in */}
      <Routes>
        {/* Login route */}
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" replace />}
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={user ? <Home /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/add-plant"
          element={user ? <AddPlant /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/report-issue"
          element={user ? <ReportIssue /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/plants/:id"
          element={user ? <PlantDetail /> : <Navigate to="/login" replace />}
        />

        {/* Catch-all → redirect */}
<Route
  path="*"
  element={<Navigate to={user ? "/" : "/login"} replace />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
