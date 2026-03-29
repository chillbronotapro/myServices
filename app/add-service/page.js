"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import Navigation from "@/app/components/Navigation";

export default function AddService() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [addedServices, setAddedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        router.push("/login");
        setLoading(false);
        return;
      }

      setUser(currentUser);

      // Fetch categories and existing services for this provider
      const fetchData = async () => {
        try {
          // Fetch categories
          const categoriesResponse = await fetch("/api/categories/list");
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData || []);

          // Fetch existing services for this provider
          const servicesResponse = await fetch(
            `/api/services/list?providerId=${currentUser.uid}`
          );
          const servicesData = await servicesResponse.json();
          setAddedServices(servicesData || []);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    });

    return () => unsubscribe();
  }, [router]);

  const handleAdd = async () => {
    if (!title.trim() || !price.trim()) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setError("");
      const response = await fetch("/api/services/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          price: parseFloat(price),
          category: category || null,
          providerId: user.uid
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add service");
      }

      const newService = data;

      setAddedServices([newService, ...addedServices]);
      setTitle("");
      setPrice("");
      setCategory("");
    } catch (err) {
      setError(err.message || "Failed to add service. Please try again.");
      console.error("Error adding service:", err);
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
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Add New Service</h1>

        {/* Add Service Form */}
        <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Service Title</label>
              <input 
                placeholder="e.g., Web Development, Tutoring, Cleaning" 
                value={title}
                onChange={e => setTitle(e.target.value)} 
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Price (₹)</label>
              <input 
                placeholder="Enter service price" 
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)} 
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Category (Optional)</label>
              <select 
                value={category}
                onChange={e => setCategory(e.target.value)} 
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select a category...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.emoji ? `${cat.emoji} ` : ""}{cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mt-4\">
              {error}
            </div>
          )}

          <button 
            onClick={handleAdd}
            className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg mt-6 hover:bg-indigo-700 transition\"
          >
            Add Service
          </button>
        </div>

        {/* Services Added List */}
        {addedServices.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6\">Your Services ({addedServices.length})</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {addedServices.map((service) => (
                <div key={service.id} className="bg-green-50 border-2 border-green-200 p-6 rounded-lg hover:shadow-lg transition\">
                  <h3 className="font-bold text-lg text-gray-800 mb-2\">{service.title}</h3>
                  <p className="text-2xl font-bold text-green-600 mb-3\">₹{parseFloat(service.price).toFixed(2)}</p>
                  {service.category && (
                    <p className="text-sm text-indigo-600 font-semibold mb-2\">Category: {service.category}</p>
                  )}
                  <p className="text-sm text-gray-500\">
                    Added: {new Date(service.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}