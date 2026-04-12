import React from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">

      <div className="w-[350px] p-8 rounded-2xl bg-white/5 backdrop-blur-lg shadow-xl 
                      transition-all duration-700 animate-fadeIn">

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src="/ai.png" alt="logo" className="w-16 h-16 object-contain" />
        </div>

        <h2 className="text-2xl font-semibold mb-6 text-center">Welcome Back</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 rounded-lg bg-black border border-gray-700 focus:outline-none focus:border-white"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-4 py-2 rounded-lg bg-black border border-gray-700 focus:outline-none focus:border-white"
        />

        <button className="w-full bg-white text-black py-2 rounded-lg font-semibold hover:bg-gray-200 transition">
          Login
        </button>

        <p className="text-sm text-center mt-4 text-gray-400">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="cursor-pointer text-white hover:underline"
          >
            Register
          </span>
        </p>

      </div>
    </div>
  );
};

export default Login;