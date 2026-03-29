import { Suspense } from "react";
import Navigation from "@/app/components/Navigation";
import ServicesContent from "./ServicesContent";

export default function Services() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Suspense fallback={<div className="p-10">Loading...</div>}>
          <ServicesContent />
        </Suspense>
      </div>
    </div>
  );
}