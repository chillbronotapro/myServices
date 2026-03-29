"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Navigation from "@/app/components/Navigation";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState({});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editDate, setEditDate] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [savedBookingId, setSavedBookingId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        router.push("/login");
        setLoading(false);
        return;
      }

      setUser(currentUser);

      // Fetch bookings for this user
      const fetchBookings = async () => {
        try {
          const response = await fetch(
            `/api/bookings/list?userId=${currentUser.uid}`
          );
          const data = await response.json();
          setBookings(data || []);

          // Fetch service details for all bookings
          if (data && data.length > 0) {
            const serviceIds = [...new Set(data.map(b => b.service_id))];
            const serviceResponse = await fetch('/api/services/list');
            const allServices = await serviceResponse.json();
            const serviceMap = {};
            allServices.forEach(s => {
              serviceMap[s.id] = s;
            });
            setServices(serviceMap);
          }
        } catch (error) {
          console.error("Error fetching bookings:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchBookings();
    });

    return () => unsubscribe();
  }, [router]);

  const handleEdit = (booking) => {
    setEditingId(booking.id);
    setEditDate(booking.date);
    setEditStatus(booking.status);
  };

  const handleSaveEdit = async () => {
    if (!editDate) {
      alert("Please select a date");
      return;
    }

    try {
      const response = await fetch("/api/bookings/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: editingId,
          date: editDate,
          status: editStatus
        })
      });

      if (!response.ok) throw new Error("Failed to update booking");

      const updated = await response.json();
      setBookings(bookings.map(b => b.id === editingId ? updated : b));
      setSavedBookingId(editingId);
      setTimeout(() => setSavedBookingId(null), 2000);
      setEditingId(null);
    } catch (error) {
      alert("Error updating booking: " + error.message);
    }
  };

  const handleDelete = async (bookingId) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    try {
      const response = await fetch(`/api/bookings/delete?id=${bookingId}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Failed to delete booking");

      setBookings(bookings.filter(b => b.id !== bookingId));
    } catch (error) {
      alert("Error deleting booking: " + error.message);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading your bookings...</p>
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
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow-md text-center">
            <p className="text-xl text-gray-600 mb-2">No bookings yet</p>
            <p className="text-gray-500 mb-6">Start by browsing available services</p>
            <a href="/services">
              <button className="bg-indigo-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
                Browse Services
              </button>
            </a>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {bookings.map((b) => {
              const service = services[b.service_id];
              const isEditing = editingId === b.id;

              return (
                <div 
                  key={b.id} 
                  className={`rounded-lg shadow-md hover:shadow-lg transition border-l-4 p-6 ${
                    isEditing ? 'bg-indigo-50 border-indigo-600' : 'bg-white border-indigo-600'
                  } ${savedBookingId === b.id ? 'ring-2 ring-green-400' : ''}`}
                >
                  {isEditing ? (
                    // Edit Form
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">Edit Booking</h3>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Service: {service?.title || `Service #${b.service_id}`}
                        </label>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Booking Date:
                        </label>
                        <input
                          type="date"
                          value={editDate}
                          onChange={(e) => setEditDate(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Status:
                        </label>
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={handleSaveEdit}
                          className="flex-1 bg-green-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-700 transition"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={handleCancel}
                          className="flex-1 bg-gray-400 text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-500 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Display View
                    <>
                      <h3 className="text-lg font-bold text-gray-800 mb-3">
                        {service?.title || `Service #${b.service_id}`}
                      </h3>
                      <div className="space-y-2 text-gray-700 mb-4">
                        <p><span className="font-semibold">Booking Date:</span> {new Date(b.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p><span className="font-semibold">Status:</span> 
                          <span className={`ml-2 px-3 py-1 rounded-full font-semibold ${
                            b.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            b.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            b.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                          </span>
                        </p>
                        <p className="text-sm text-gray-500">Booked on: {new Date(b.created_at).toLocaleString('en-IN')}</p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEdit(b)}
                          className="flex-1 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(b.id)}
                          className="flex-1 bg-red-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}