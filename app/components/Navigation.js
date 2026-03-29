"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export default function Navigation() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [userServices, setUserServices] = useState([]);
  const router = useRouter();
  const fetchUserServices = async (userId) => {
    try {
      const response = await fetch(`/api/services/list?providerId=${userId}`);
      const data = await response.json();
      setUserServices(data || []);
    } catch (error) {
      console.error("Error fetching user services:", error);
    }
  };
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);

      // Fetch user's services if logged in
      if (currentUser) {
        fetchUserServices(currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setSideMenuOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      {/* Header */}
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="px-4 py-4 flex justify-between items-center">
          {/* Hamburger Menu Button (left) */}
          {!loading && user && (
            <button
              onClick={() => setSideMenuOpen(!sideMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              aria-label="Menu"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sideMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          )}

          {/* Centered Logo */}
          <div className="flex-1 flex justify-center">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              MyServices
            </Link>
          </div>

          {/* Header Actions (right) */}
          <div className="flex items-center space-x-4 w-12">
            {!loading && !user ? (
              <div className="flex items-center space-x-2">
                <Link href="/login" className="text-gray-600 hover:text-gray-800 font-medium text-sm">
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700 transition font-medium text-sm"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div />
            )}
          </div>
        </div>
      </nav>

      {/* Side Menu Overlay */}
      {sideMenuOpen && user && !loading && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSideMenuOpen(false)}
        />
      )}

      {/* Side Menu (Left) */}
      {user && !loading && (
        <div
          className={`fixed top-0 left-0 h-screen w-64 bg-white shadow-lg transform transition-transform duration-300 z-50 overflow-y-auto ${
            sideMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Header with Close Button */}
          <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
            <h2 className="text-xl font-bold text-gray-800">Menu</h2>
            <button
              onClick={() => setSideMenuOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-6 space-y-4 border-b">
            <Link
              href="/services"
              className="block text-gray-700 hover:text-indigo-600 font-medium py-2 transition"
              onClick={() => setSideMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              href="/add-service"
              className="block text-gray-700 hover:text-indigo-600 font-medium py-2 transition"
              onClick={() => setSideMenuOpen(false)}
            >
              Add Service
            </Link>
            <Link
              href="/bookings"
              className="block text-gray-700 hover:text-indigo-600 font-medium py-2 transition"
              onClick={() => setSideMenuOpen(false)}
            >
              My Bookings
            </Link>
            <Link
              href="/add-category"
              className="block text-gray-700 hover:text-indigo-600 font-medium py-2 transition"
              onClick={() => setSideMenuOpen(false)}
            >
              Add Category
            </Link>
          </div>

          {/* Profile Section */}
          <div className="p-6 border-b">
            <h3 className="text-lg font-bold text-gray-800 mb-4">My Profile</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Email:</p>
                <p className="text-gray-800 font-medium break-all">{user.email}</p>
              </div>

              {userServices.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-2">My Services:</p>
                  <div className="space-y-2">
                    {userServices.map((service) => (
                      <div
                        key={service.id}
                        className="bg-indigo-50 border border-indigo-200 p-3 rounded-lg"
                      >
                        <p className="text-sm font-semibold text-gray-800">{service.title}</p>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-xs text-gray-600">₹{parseFloat(service.price).toFixed(2)}</p>
                          {service.category && (
                            <span className="text-xs bg-indigo-600 text-white px-2 py-1 rounded">
                              {service.category}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Logout Button */}
          <div className="p-6">
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
}
