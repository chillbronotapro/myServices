"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/app/components/Navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      setError("");
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/services");
    } catch (err) {
      setError(err.message);
      console.error("Login error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <div className="max-w-md mx-auto mt-12 px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Login</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email</label>
              <input 
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)} 
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Password</label>
              <input 
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)} 
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button 
            onClick={handleLogin}
            className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg mt-6 hover:bg-indigo-700 transition"
          >
            Login
          </button>

          <p className="text-center text-gray-600 mt-4">
            Don't have an account? <a href="/signup" className="text-indigo-600 font-bold hover:underline">Sign up here</a>
          </p>
        </div>
      </div>
    </div>
  );
}