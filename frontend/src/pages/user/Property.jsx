import React from "react";
import Navbar from "../../components/users/Navbar";
import { houses, interiers } from "./../../constants/imageConstants";
import {
  Home,
  Users,
  GraduationCap,
  TreePine,
  ShoppingBag,
  MapPin,
} from "lucide-react";
import PropertyCard from "../../components/PropertyCard";
import Footer from "../../components/users/Footer";

const InfoCard = ({ title, value }) => {
  return (
    <div className="flex  justify-between items-center border-b-2 border-gray-200">
      <p className="text-gray-400">{title}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
};

const features = [
  {
    icon: Home,
    title: "Residential Property",
    value:
      "Situated in the heart of Greenfield, this property offers proximity to schools, parks, and shopping centers.",
  },
  {
    icon: Users,
    title: "Neighborhood",
    value:
      "Family-friendly neighborhood with quiet streets, well-maintained sidewalks, and a strong sense of community.",
  },
  {
    icon: GraduationCap,
    title: "Schools",
    value:
      "Greenfield Elementary School (0.5 miles), Lincoln High School (1 mile)",
  },
  {
    icon: TreePine,
    title: "Recreation",
    value: "Maple Park (0.3 miles), Greenfield Community Pool (0.8 miles)",
  },
  {
    icon: ShoppingBag,
    title: "Shopping",
    value: "Greenfield Plaza (1.2 miles), Supermarket (0.9 miles)",
  },
  {
    icon: MapPin,
    title: "Accessibility",
    value: "Quick access to major highways and public transportation hubs.",
  },
];

const Property = () => {
  const propertyInfo = [
    {
      title: "Service Type",
      value: "Residential Property",
    },
    {
      title: "Lot Size",
      value: "6,500 sq ft.",
    },
    {
      title: "Square Area",
      value: "900 sq ft",
    },
    {
      title: "Year Built",
      value: "2015",
    },
  ];

  const properties = [
    {
      title: "Family Home",
      price: "$350,000",
      img: houses.house1,
    },
    {
      title: "Suburban Villa",
      price: "$850,000",
      img: houses.house2,
    },
    {
      title: "Downtown Apartment",
      price: "$1,500",
      img: houses.house3,
    },
  ];

  const propertyDetails = [
    {
      title: "Total Bedroom",
      value: "3 Bedrooms",
    },
    {
      title: "Total Bathroom",
      value: "2 Bathrooms",
    },
    {
      title: "Furnishing",
      value: "Semi-Furnished",
    },
    {
      title: "Kitchen",
      value: "Modern Open Plan Kitchen",
    },
    {
      title: "Carport/Parking Spaces",
      value: "2 Car Garage",
    },
    {
      title: "Outdoor Space",
      value: "Private backyard with patio",
    },
    {
      title: "Heating/Cooling",
      value: "Central HVAC system",
    },
    {
      title: "Flooring",
      value: "Hardwood and ceramic tile",
    },
  ];
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Property Images */}
      <section className="py-28">
        {/* Image Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="mb-5">
            <span className="text-gray-400">Property Listing</span> / Morden
            Family Home
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Large Image */}
            <div className="aspect-4/3 md:aspect-auto">
              <img
                src={houses.house1}
                alt=""
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            {/* Right Section */}
            <div className="grid grid-rows-2 gap-4">
              {/* Top Image */}
              <div className="aspect-4/2">
                <img
                  src={interiers.interier1}
                  alt=""
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              {/* Bottom Two Images */}
              <div className="grid grid-cols-2 gap-5">
                <div className="aspect-square">
                  <img
                    src={interiers.interier2}
                    alt=""
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>

                <div className="relative aspect-square">
                  <img
                    src={interiers.interier2}
                    alt=""
                    className="w-full h-full object-cover rounded-xl"
                  />

                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
                    <span className="text-white text-3xl font-bold">10+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Property Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
            {/* LEFT SECTION */}
            <div className="md:col-span-2 space-y-8">
              {/* Title */}
              <div>
                <h1 className="text-3xl font-bold">Modern Family Home</h1>
                <div className="text-gray-500 mt-2 flex flex-wrap gap-1">
                  <MapPin />
                  <span>1234 Maple Avenue, Greenfield, TX</span>
                </div>

                <p className="text-gray-600 mt-4">
                  A modern family home designed with functionality, aesthetics,
                  and comfort in mind, catering to the needs of contemporary
                  families.
                </p>
              </div>

              {/* Property Info */}
              <div>
                <h2 className="font-semibold text-lg mb-4">Property Info</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 sm:grid-cols-2 gap-6 text-sm">
                  {propertyInfo.map((property, index) => (
                    <InfoCard
                      title={property.title}
                      key={index}
                      value={property.value}
                    />
                  ))}
                </div>
              </div>

              {/* Property Details */}
              <div>
                <h2 className="font-semibold text-lg mb-4">Property Details</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 sm:grid-cols-2 gap-6 text-sm">
                  {propertyDetails.map((property, index) => (
                    <InfoCard
                      title={property.title}
                      key={index}
                      value={property.value}
                    />
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <h2 className="font-semibold text-lg mb-4">Features</h2>
                <div className="space-y-4 text-sm ">
                  {features.map((feature) => {
                    const Icon = feature.icon;
                    return (
                      <div className="flex items-center gap-3 ">
                        <div className="p-2 bg-gray-100 rounded-md">
                          <Icon size={20} className="text-gray-700" />
                        </div>
                        <div className="flex-col">
                          <p className="font-medium">{feature.title}</p>
                          <p className="text-gray-500">{feature.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Map Location */}
              <div className="mt-10">
                <h2 className="text-xl font-semibold mb-4">Map</h2>

                <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps?q=Greenfield,TX&output=embed"
                    className="absolute inset-0 w-full h-full border-0"
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="space-y-6">
              {/* Price Card */}
              <div className="bg-gray-100 p-6 rounded-xl">
                <p className="text-gray-500 text-sm">Total Price</p>
                <h2 className="text-2xl font-bold mt-1">$350,000</h2>

                <button className="w-full mt-4 bg-black text-white py-3 rounded-lg">
                  Schedule Meeting
                </button>
              </div>

              {/* Agent Card */}
              <div className="bg-gray-100 p-6 rounded-xl">
                <p className="text-gray-500 text-sm mb-4">
                  Listed by property Agent
                </p>

                <div className="flex items-center gap-3">
                  <img
                    src="/agent.jpg"
                    className="w-10 h-10 rounded-full object-cover"
                  />

                  <div>
                    <p className="font-medium">Emily Zaun</p>
                    <p className="text-sm text-gray-500">
                      emily.zaun@example.com
                    </p>
                  </div>
                </div>

                <button className="w-full mt-4 bg-white border py-2 rounded-lg">
                  Contact Agent
                </button>
              </div>
            </div>
          </div>

          {/* Related Properties */}
          <section className="max-w-7xl mx-auto  py-20 ">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="text-3xl font-semibold">Related Properties</h2>

              <p className="text-gray-500 text-sm md:max-w-md">
                Discover your dream property from our curated selection of
                houses, apartments, and villas. Whether you're looking to buy or
                rent, we offer a variety of options to suit your lifestyle and
                budget.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 mt-15">
              {properties.map((property, index) => (
                <PropertyCard data={property} key={index} />
              ))}
            </div>
          </section>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Property;
