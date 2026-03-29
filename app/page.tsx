import Link from "next/link";
import Navigation from "./components/Navigation";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gray-800 mb-4">
            Welcome to <span className="text-indigo-600">MyServices</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connecting service providers with customers seeking reliable, professional services
          </p>
        </div>

        {/* Purpose Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">For Service Providers</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-indigo-600 mr-3">✓</span>
                <span>Post your services with detailed descriptions and competitive pricing</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-3">✓</span>
                <span>Reach a growing customer base actively seeking your expertise</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-3">✓</span>
                <span>Manage bookings and customer interactions seamlessly</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-3">✓</span>
                <span>Build your reputation and expand your business</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">For Customers</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-indigo-600 mr-3">✓</span>
                <span>Browse a diverse marketplace of vetted professional services</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-3">✓</span>
                <span>Compare services, pricing, and provider details easily</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-3">✓</span>
                <span>Book services securely with transparent pricing</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-3">✓</span>
                <span>Track all your bookings in one convenient location</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Categories Section */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">Browse Services by Category</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Link href="/services?category=tutoring" className="group">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:bg-indigo-50 transition text-center">
                <div className="text-4xl mb-3">📚</div>
                <h4 className="font-bold text-gray-800 group-hover:text-indigo-600">Tutoring</h4>
              </div>
            </Link>
            <Link href="/services?category=roommate" className="group">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:bg-indigo-50 transition text-center">
                <div className="text-4xl mb-3">🏠</div>
                <h4 className="font-bold text-gray-800 group-hover:text-indigo-600">Find Roommate</h4>
              </div>
            </Link>
            <Link href="/services?category=plumbing" className="group">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:bg-indigo-50 transition text-center">
                <div className="text-4xl mb-3">🔧</div>
                <h4 className="font-bold text-gray-800 group-hover:text-indigo-600">Plumber</h4>
              </div>
            </Link>
            <Link href="/services?category=electrical" className="group">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:bg-indigo-50 transition text-center">
                <div className="text-4xl mb-3">⚡</div>
                <h4 className="font-bold text-gray-800 group-hover:text-indigo-600">Electrician</h4>
              </div>
            </Link>
            <Link href="/services?category=carpentry" className="group">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:bg-indigo-50 transition text-center">
                <div className="text-4xl mb-3">🔨</div>
                <h4 className="font-bold text-gray-800 group-hover:text-indigo-600">Carpenter</h4>
              </div>
            </Link>
            <Link href="/services?category=daily-labor" className="group">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:bg-indigo-50 transition text-center">
                <div className="text-4xl mb-3">👷</div>
                <h4 className="font-bold text-gray-800 group-hover:text-indigo-600">Daily Labor</h4>
              </div>
            </Link>
            <Link href="/services?category=masonry" className="group">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:bg-indigo-50 transition text-center">
                <div className="text-4xl mb-3">🧱</div>
                <h4 className="font-bold text-gray-800 group-hover:text-indigo-600">Masonry</h4>
              </div>
            </Link>
            <Link href="/services?category=pandit" className="group">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:bg-indigo-50 transition text-center">
                <div className="text-4xl mb-3">🙏</div>
                <h4 className="font-bold text-gray-800 group-hover:text-indigo-600">Pandit Services</h4>
              </div>
            </Link>
            <Link href="/services" className="group">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:bg-indigo-50 transition text-center">
                <div className="text-4xl mb-3">🔍</div>
                <h4 className="font-bold text-gray-800 group-hover:text-indigo-600">View All</h4>
              </div>
            </Link>
          </div>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md mb-16">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Why Choose MyServices?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-2">🔒</div>
              <h4 className="font-bold text-gray-800 mb-2">Secure & Reliable</h4>
              <p className="text-gray-600">Your data is protected with modern security standards. Firebase authentication ensures safe access.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">⚡</div>
              <h4 className="font-bold text-gray-800 mb-2">Fast & Easy</h4>
              <p className="text-gray-600">Simple sign-up process, easy bookings, and quick confirmation of your service needs.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🤝</div>
              <h4 className="font-bold text-gray-800 mb-2">Community Driven</h4>
              <p className="text-gray-600">Connect with trusted professionals and build lasting relationships on our platform.</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-12 rounded-lg shadow-lg">
          <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-lg mb-8">Join our growing community of service providers and customers today</p>
          <div className="space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row">
            <Link 
              href="/signup" 
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 text-center"
            >
              Create Account
            </Link>
            <Link 
              href="/login" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-indigo-600 text-center"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>&copy; 2026 MyServices. All rights reserved.</p>
          <p className="text-sm mt-2">Connecting service providers and customers seamlessly</p>
        </div>
      </footer>
    </div>
  );
}
