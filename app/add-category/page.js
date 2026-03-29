"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Navigation from "@/app/components/Navigation";

export default function AddCategory() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryEmoji, setCategoryEmoji] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        router.push("/login");
        setLoading(false);
        return;
      }

      setUser(currentUser);

      // Fetch all categories
      const fetchCategories = async () => {
        try {
          const response = await fetch("/api/categories/list");
          const data = await response.json();
          setCategories(data || []);
        } catch (error) {
          console.error("Error fetching categories:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchCategories();
    });

    return () => unsubscribe();
  }, [router]);

  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      setError("");
      setSuccess("");
      
      const response = await fetch("/api/categories/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: categoryName.toLowerCase(),
          emoji: categoryEmoji || null,
          description: categoryDescription
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add category");
      }

      setCategories([data, ...categories]);
      setCategoryName("");
      setCategoryEmoji("");
      setCategoryDescription("");
      setSuccess("Category added successfully!");
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to add category. Please try again.");
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
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Service Categories</h1>

        {/* Add Category Form */}
        <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Category</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Category Name *</label>
              <input
                type="text"
                placeholder="e.g., plumbing, carpentry, tutoring"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Emoji (Optional)</label>
              <input
                type="text"
                placeholder="e.g., 🔧, 🏠, 📚"
                value={categoryEmoji}
                onChange={(e) => setCategoryEmoji(e.target.value)}
                maxLength="2"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Description (Optional)</label>
              <textarea
                placeholder="Describe this category..."
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                rows="3"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mt-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mt-4">
              {success}
            </div>
          )}

          <button
            onClick={handleAddCategory}
            className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg mt-6 hover:bg-indigo-700 transition"
          >
            Add Category
          </button>
        </div>

        {/* Categories List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">All Categories ({categories.length})</h2>
          
          {categories.length === 0 ? (
            <div className="bg-white p-12 rounded-lg shadow-md text-center">
              <p className="text-xl text-gray-600">No categories yet</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition border-l-4 border-indigo-600"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-800">
                      {category.emoji && <span className="text-2xl mr-2">{category.emoji}</span>}
                      {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                    </h3>
                  </div>
                  
                  {category.description && (
                    <p className="text-gray-600 text-sm mb-3">{category.description}</p>
                  )}
                  
                  <p className="text-xs text-gray-500">
                    Added on: {new Date(category.created_at).toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
