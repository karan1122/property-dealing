
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

const Profile = () => {
  const navigate = useNavigate();

  const { user, setUser } = useContext(AuthContext);

  const stats = [
    { label: "Properties Listed", value: "128" },
    { label: "Properties Sold", value: "86" },
    { label: "Happy Clients", value: "240+" },
    { label: "Years Experience", value: "6" },
  ];

  const recentProperties = [
    {
      title: "Luxury Family Villa",
      location: "California, USA",
      price: "$850,000",
      image:
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Modern Apartment",
      location: "New York, USA",
      price: "$420,000",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Premium Office Space",
      location: "Texas, USA",
      price: "$1,200,000",
      image:
        "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");

      setUser(null);

      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Cover */}
      <div className="relative h-[320px] w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1400&auto=format&fit=crop"
          alt="cover"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Profile Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 md:p-10">
            <div className="flex flex-col lg:flex-row gap-10 items-start lg:items-center justify-between">
              {/* Left */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop"
                  alt="profile"
                  className="w-36 h-36 rounded-3xl object-cover border-4 border-white shadow-xl"
                />

                <div className="text-center sm:text-left">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    {user?.name || "Karan Shah"}
                  </h1>

                  <p className="text-blue-600 font-medium mt-2 text-lg">
                    Senior Real Estate Consultant
                  </p>

                  <p className="text-gray-500 mt-3 max-w-xl leading-relaxed">
                    Helping clients buy, sell, and invest in premium real estate
                    properties with trust, transparency, and market expertise.
                  </p>

                  <div className="flex flex-wrap gap-3 mt-5 justify-center sm:justify-start">
                    <button className="bg-black text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition">
                      Contact Agent
                    </button>

                    <button className="border border-gray-300 px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition">
                      Edit Profile
                    </button>

                    <button
                      onClick={handleLogout}
                      className="bg-red-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-600 transition"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Stats */}
              <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
                {stats.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-2xl px-6 py-5 text-center min-w-[150px]"
                  >
                    <h2 className="text-2xl font-bold text-gray-900">
                      {item.value}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8 mt-10 pb-16">
          {/* Left Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-5">
                About Me
              </h2>

              <p className="text-gray-600 leading-relaxed">
                I specialize in luxury residential and commercial real estate.
                With years of experience in the property market, I focus on
                delivering exceptional customer experiences while helping
                clients achieve their dream investments.
              </p>
            </div>

            {/* Recent Listings */}
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Recent Listings
                </h2>

                <button className="text-blue-600 font-medium hover:underline">
                  View All
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {recentProperties.map((property, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-52 object-cover"
                    />

                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {property.title}
                      </h3>

                      <p className="text-gray-500 mt-1">
                        {property.location}
                      </p>

                      <div className="flex items-center justify-between mt-4">
                        <p className="text-xl font-bold text-black">
                          {property.price}
                        </p>

                        <button className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition">
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            {/* Contact Info */}
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-5">
                Contact Information
              </h2>

              <div className="space-y-5 text-gray-600">
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="font-medium">
                    {user?.email || "karan@urbanet.com"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <p className="font-medium">+91 98765 43210</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Office</p>
                  <p className="font-medium">
                    Urbanet Real Estate, Surat
                  </p>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-5">
                Expertise
              </h2>

              <div className="flex flex-wrap gap-3">
                {[
                  "Luxury Homes",
                  "Commercial",
                  "Apartments",
                  "Investments",
                  "Property Management",
                  "Consulting",
                ].map((skill, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

