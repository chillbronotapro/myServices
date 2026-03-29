"use client";

import { useParams, useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { useState, useEffect } from "react";

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

      if (!response.ok) throw new Error("Failed to create booking");

      alert("Booked!");
      router.push("/bookings");
    } catch (error) {
      setError("Failed to create booking");
      console.error("Error creating booking:", error);
    }
  };

  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="p-10">
      <h1>Book Service</h1>

      <input type="date" onChange={e => setDate(e.target.value)} />

      <button onClick={handleBooking}>Confirm Booking</button>
    </div>
  );
}