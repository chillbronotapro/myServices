"use client";

import { useParams, useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { useState, useEffect } from "react";
import Navigation from "@/app/components/Navigation";

export default function Book() {
  const { id } = useParams();
  const router = useRouter();
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (!currentUser) {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleBooking = async () => {
    if (!user) {
      alert("Please login first");
      return;
    }

    if (!date) {
      setError("Please select a date");
      return;
    }

    try {
      setError("");
      const response = await fetch("/api/bookings/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: parseInt(id),
          userId: user.uid,
          date
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create booking");
      }

      alert("Booked successfully!");
      router.push("/bookings");
    } catch (error) {
      setError(error.message || "Failed to create booking");
      console.error("Error creating booking:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <div className="max-w-md mx-auto mt-12 px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Book Service</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-3">Select Booking Date:</label>
            <input 
              type="date" 
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button 
            onClick={handleBooking}
            className="w-full bg-green-600 text-white font-bold py-2 rounded-lg hover:bg-green-700 transition"
          >
            Confirm Booking
          </button>

          <a href="/services" className="block text-center text-indigo-600 font-semibold mt-4 hover:underline">
            Back to Services
          </a>
        </div>
      </div>
    </div>
  );
}
