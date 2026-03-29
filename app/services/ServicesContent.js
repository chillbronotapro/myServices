"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ServicesContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const [services, setServices] = useState([]);
  const [providerServices, setProviderServices] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedProvider, setExpandedProvider] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = category 
          ? `/api/services/list?category=${encodeURIComponent(category)}`
          : "/api/services/list";
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch services");
        const data = await response.json();
        setServices(Array.isArray(data) ? data : []);

        // Fetch all services for each provider to show their experience
        if (data && Array.isArray(data)) {
          const providers = [...new Set(data.map(s => s.provider_id))];
          const providerServicesMap = {};
          
          for (const providerId of providers) {
            try {
              const providerResponse = await fetch(`/api/services/list?providerId=${providerId}`);
              const providerData = await providerResponse.json();
              providerServicesMap[providerId] = providerData || [];
            } catch (error) {
              console.error(`Error fetching services for provider ${providerId}:`, error);
              providerServicesMap[providerId] = [];
            }
          }
          
          setProviderServices(providerServicesMap);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category]);

  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <>
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        {category 
          ? `${category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ')} Services` 
          : 'Available Services'}
      </h1>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">Loading services...</p>
        </div>
      ) : services.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-md text-center">
          <p className="text-xl text-gray-600">No services available yet</p>
          <p className="text-gray-500 mt-2">Check back later for new services!</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {services.map(service => {
            const isExpanded = expandedProvider === service.provider_id;
            const providerExp = providerServices[service.provider_id] || [];
            
            return (
              <div 
                key={service.id} 
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
              >
                {/* Service Card */}
                <div className="p-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Service Details */}
                    <div className="md:col-span-2">
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">{service.title}</h2>
                      {service.category && (
                        <p className="text-sm text-indigo-600 font-semibold mb-3">📁 {service.category}</p>
                      )}
                      <p className="text-gray-600 mb-4">Service ID: {service.id}</p>
                      <p className="text-3xl font-bold text-indigo-600 mb-4">₹{parseFloat(service.price).toFixed(2)}</p>
                      <button 
                        onClick={() => setExpandedProvider(isExpanded ? null : service.provider_id)}
                        className="text-indigo-600 hover:text-indigo-800 font-semibold mb-4"
                      >
                        {isExpanded ? "Hide" : "View"} Provider Details & Experience
                      </button>
                    </div>

                    {/* Book Button */}
                    <div className="flex flex-col justify-between">
                      <div />
                      <a href={`/book/${service.id}`}>
                        <button className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition">
                          Book Now
                        </button>
                      </a>
                    </div>
                  </div>

                  {/* Expanded Provider Details */}
                  {isExpanded && (
                    <div className="mt-6 pt-6 border-t">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">Provider Experience</h3>
                      
                      <div className="bg-indigo-50 p-4 rounded-lg mb-4">
                        <p className="text-gray-700">
                          <span className="font-semibold">Provider ID:</span> {service.provider_id}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-semibold">Total Services:</span> {providerExp.length}
                        </p>
                      </div>

                      {providerExp.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3">Services Offered by This Provider:</h4>
                          <div className="space-y-2">
                            {providerExp.map((s) => (
                              <div 
                                key={s.id}
                                className={`flex items-center justify-between p-3 rounded-lg border ${
                                  s.id === service.id 
                                    ? 'bg-indigo-100 border-indigo-400' 
                                    : 'bg-white border-gray-200'
                                }`}
                              >
                                <div>
                                  <p className="font-semibold text-gray-800">{s.title}</p>
                                  {s.category && (
                                    <p className="text-xs text-gray-600">Category: {s.category}</p>
                                  )}
                                </div>
                                <p className="font-bold text-indigo-600">₹{parseFloat(s.price).toFixed(2)}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
