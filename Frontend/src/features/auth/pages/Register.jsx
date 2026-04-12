import React from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">

      <div className="w-[350px] p-8 rounded-2xl bg-white/5 backdrop-blur-lg shadow-xl 
                      transition-all duration-700 animate-slideIn">

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src="/ai.png" alt="logo" className="w-16 h-16 object-contain" />
        </div>

        <h2 className="text-2xl font-semibold mb-6 text-center">Create Account</h2>

        <input
          type="text"
          placeholder="Name"
          className="w-full mb-4 px-4 py-2 rounded-lg bg-black border border-gray-700 focus:outline-none focus:border-white"
        />

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
          Register
        </button>

        <p className="text-sm text-center mt-4 text-gray-400">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="cursor-pointer text-white hover:underline"
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
};

export default Register;