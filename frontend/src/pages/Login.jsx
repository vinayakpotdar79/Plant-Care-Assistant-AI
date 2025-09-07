import React, { useState, useContext } from "react";
import "../styles/login.css";
import { registerUser, loginUser } from "../services/authService";
import { AuthContext } from "../context/authContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("login");
  const [formData, setFormData] = useState({
    login: {
      email: "",
      password: "",
    },
    register: {
      name: "",
      email: "",
      password: "",
    },
  });

  // Handle form input changes
  const handleInputChange = (tab, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        [field]: value,
      },
    }));
  };

  // Handle form submission
  const handleSubmit = async (e, type) => {
    e.preventDefault();
    const form = formData[type];

    try {
      if (type === "login") {
        const data = await loginUser(form);
        login(data);
        console.log("Login successful!");
      } else {
        const data = await registerUser(form);
        login(data);
        console.log("Registered successfully!");
      }
      console.log(`${type} submitted:`, form);
    } catch (err) {
      alert(err.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-sans relative">
      {/* Botanical Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-green-100 to-teal-200 z-0 overflow-hidden">
        {/* Animated leaves */}
        <div className="leaf leaf1"></div>
        <div className="leaf leaf2"></div>
        <div className="leaf leaf3"></div>
        <div className="leaf leaf4"></div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-green-400 rounded-full opacity-60 animate-ping"></div>
        <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-emerald-500 rounded-full opacity-40 animate-pulse"></div>
      </div>

      {/* Form Section */}
      <div className="flex min-h-screen relative z-10">
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
          <div className="w-full max-w-md bg-white/30 backdrop-blur-md p-6 lg:p-10 rounded-2xl shadow-2xl border border-white/30">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">
                Get Started with FLORA
              </h1>

              {/* Tab Navigation */}
              <div className="flex bg-white/50 backdrop-blur-sm rounded-xl p-1 mb-8">
                <button
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 text-sm lg:text-base ${
                    activeTab === "login"
                      ? "bg-white/80 text-gray-800 shadow-md transform scale-105"
                      : "text-gray-600 hover:text-gray-800 hover:bg-white/30"
                  }`}
                  onClick={() => setActiveTab("login")}
                  type="button"
                >
                  Login
                </button>
                <button
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 text-sm lg:text-base ${
                    activeTab === "register"
                      ? "bg-white/80 text-gray-800 shadow-md transform scale-105"
                      : "text-gray-600 hover:text-gray-800 hover:bg-white/30"
                  }`}
                  onClick={() => setActiveTab("register")}
                  type="button"
                >
                  Register
                </button>
              </div>
            </div>

            {/* Login Form */}
            {activeTab === "login" && (
              <form className="space-y-6" onSubmit={(e) => handleSubmit(e, "login")}>
                <div>
                  <label
                    htmlFor="login-email"
                    className="block text-gray-700 font-semibold mb-2 text-sm"
                  >
                    Email address
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    value={formData.login.email}
                    onChange={(e) =>
                      handleInputChange("login", "email", e.target.value)
                    }
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border-2 border-white/50 rounded-xl text-base transition-all duration-300 bg-white/70 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100 hover:border-white/70"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="login-password"
                    className="block text-gray-700 font-semibold mb-2 text-sm"
                  >
                    Password
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    value={formData.login.password}
                    onChange={(e) =>
                      handleInputChange("login", "password", e.target.value)
                    }
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 border-2 border-white/50 rounded-xl text-base transition-all duration-300 bg-white/70 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100 hover:border-white/70"
                    required
                  />
                </div>

                <button
                  className="w-full py-4 bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-green-300 active:translate-y-0 active:shadow-lg transform hover:scale-[1.02]"
                  type="submit"
                >
                  Sign In
                </button>
              </form>
            )}

            {/* Register Form */}
            {activeTab === "register" && (
              <form className="space-y-6" onSubmit={(e) => handleSubmit(e, "register")}>
                <div>
                  <label
                    htmlFor="register-name"
                    className="block text-gray-700 font-semibold mb-2 text-sm"
                  >
                    Full Name
                  </label>
                  <input
                    id="register-name"
                    type="text"
                    value={formData.register.name}
                    onChange={(e) =>
                      handleInputChange("register", "name", e.target.value)
                    }
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border-2 border-white/50 rounded-xl text-base transition-all duration-300 bg-white/70 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100 hover:border-white/70"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="register-email"
                    className="block text-gray-700 font-semibold mb-2 text-sm"
                  >
                    Email address
                  </label>
                  <input
                    id="register-email"
                    type="email"
                    value={formData.register.email}
                    onChange={(e) =>
                      handleInputChange("register", "email", e.target.value)
                    }
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border-2 border-white/50 rounded-xl text-base transition-all duration-300 bg-white/70 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100 hover:border-white/70"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="register-password"
                    className="block text-gray-700 font-semibold mb-2 text-sm"
                  >
                    Password
                  </label>
                  <input
                    id="register-password"
                    type="password"
                    value={formData.register.password}
                    onChange={(e) =>
                      handleInputChange("register", "password", e.target.value)
                    }
                    placeholder="Create a strong password"
                    className="w-full px-4 py-3 border-2 border-white/50 rounded-xl text-base transition-all duration-300 bg-white/70 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100 hover:border-white/70"
                    required
                  />
                </div>

                <button
                  className="w-full py-4 bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-green-300 active:translate-y-0 active:shadow-lg transform hover:scale-[1.02]"
                  type="submit"
                >
                  Create Account
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
