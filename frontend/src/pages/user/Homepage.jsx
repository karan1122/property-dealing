// App.jsx
import React from "react";
import house1 from "./../../../public/assets/images/house/house-1.jpg";
import house2 from "./../../../public/assets/images/house/house-2.jpg";
import house3 from "./../../../public/assets/images/house/house-3.jpg";
import {
  Home,
  Search,
  Users,
  Building,
  Key,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Star,
  CheckCircle,
  Camera,
  DollarSign,
  TrendingUp,
  Users2,
  Bath,
  Bed,
  Box,
  ArrowRight,
} from "lucide-react";
import Navbar from "../../components/users/Navbar";
import PropertyCard from "../../components/PropertyCard";
import Footer from "../../components/users/Footer";
import Testimonials from "../../components/users/aboutUs/Testimonials";
import ContactForm from "../../components/users/contactUs/ContactForm";
import FAQ from "../../components/users/FAQ";
import { houses } from "../../constants/imageConstants";

const Homepage = () => {
  const steps = [
    {
      title: "Browse Listings",
      desc: "Find diverse properties in Crestovia",
    },
    {
      title: "Contact Agent",
      desc: "Ask, schedule, and get tailored deals",
    },
    {
      title: "Schedule Visits",
      desc: "Pick a time, and our agents ensure a hassle-free viewing",
    },
    {
      title: "Close the Deal",
      desc: "Close your deal confidently with expert guidance",
    },
  ];

  const properties = [
    {
      title: "Family Home",
      price: "$350,000",
      img: house1,
    },
    {
      title: "Suburban Villa",
      price: "$850,000",
      img: house2,
    },
    {
      title: "Downtown Apartment",
      price: "$1,500",
      img: house3,
    },
  ];
  const services = [
    {
      title: "Property Buying",
      img: house1,
    },
    {
      title: "Property Selling",
      img: house2,
    },
    {
      title: "Property Renting",
      img: house3,
    },
    {
      title: "Real Estate Consulting",
      img: house1,
    },
  ];
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <section className="w-full ">
        <Navbar />
        <div className="flex flex-col items-center relative  text-center text-sm text-white max-md:px-2   bg-center">
          <img
            src={houses.house3}
            className="w-screen h-150 object-cover opacity-80  z-0"
            alt=""
          />
          <div className="absolute  flex flex-col flex-wrap items-center justify-center py-30">
            <h1 className="font-berkshire text-shadow-lg text-[45px]/[52px] md:text-6xl/[65px]  mt-6 max-w-4xl">
              Empowering creators to build on their own terms.
            </h1>
            <p className="text-base mt-2 max-w-xl text-shadow-lg">
              Flexible tools, thoughtful design and the freedom to build your
              way. No limitations, no compromises.
            </p>
            <p className="text-base mt-3 md:mt-7 max-w-xl text-shadow-lg">
              Secure your spot early and unlock our limited-time founding rate.
            </p>
          </div>
        </div>
        {/* Hero Section */}
        {/* <div className="bg-linear-to-br pt-28 relative  from-gray-400  to-indigo-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl font-bold text-gray-900 mb-4">
                  Simplifying Property{" "}
                  <span className="text-blue-600">
                    Buying, Selling, And Renting
                  </span>
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Your life evolves, and your home should too. We design
                  flexible living spaces that adapt to your current needs,
                  ensuring comfort, functionality, and style at every stage of
                  life.
                </p>

                <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-gray-600">
                      Explore Listings
                    </span>
                    <span className="flex items-center text-blue-600">
                      <Users2 className="h-5 w-5 mr-1" />
                      50K+ Happy Clients
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-xl">Modern Family Home</h3>
                      <p className="text-gray-500">
                        1234 Maple Avenue, Greenfield, TX
                      </p>
                    </div>
                    <button className="flex items-center text-blue-600 hover:text-blue-700">
                      View Detail <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="relative">
                <img
                  src={house1}
                  alt="Modern home"
                  className="rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div> */}
      </section>
      {/* Connecting People Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap w-full justify-between mb-10">
            <div className="sm:w-125">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 ">
                Connecting People With Perfect Properties
              </h2>
            </div>
            <div className="w-1/2">
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                Crestovia is a leading real estate platform dedicated to
                connecting buyers, sellers, and renters with their perfect
                property.
              </p>
            </div>
          </div>
          {/* Video section */}
          <div className="w-full shadow-2xl rounded-2xl bg-center hover:scale-101 duration-300">
            <img src={house2} alt="" className="rounded-2xl brightness-95" />
          </div>
        </div>
      </section>

      {/* What we offer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold mb-10">What We Offer</h2>

        <div className="grid md:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <div
              key={i}
              className="bg-white shadow-lg rounded-xl overflow-hidden"
            >
              <img src={s.img} className="h-40 w-full object-cover" />
              <div className="p-4">
                <h3 className="font-semibold">{s.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">
            Discover The <span className="text-blue-600">Facilities</span> We
            Offer At Crestovia
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: CheckCircle,
                title: "Verified Property Listings",
                desc: "100% trusted properties for peace of mind",
              },
              {
                icon: Search,
                title: "Advanced Search Filters",
                desc: "Find properties tailored to your preferences",
              },
              {
                icon: Users,
                title: "Expert Support",
                desc: "Agents and consultants at your service",
              },
              {
                icon: Home,
                title: "User-Friendly Platform",
                desc: "Simple navigation for seamless browsing",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl text-center shadow-md"
              >
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exclusive Listings */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          Explore Property Listings
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {properties.map((property, index) => (
            <PropertyCard data={property} key={index} />
          ))}
        </div>
      </section>

      {/* testimonials */}
      <Testimonials />

      {/* Getting Started */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center mb-12">
            Getting Started With Crestovia
          </h2>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div className="bg-white p-6 rounded-xl shadow-sm w-full md:w-60 text-left">
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-gray-500 text-sm">{step.desc}</p>
                </div>

                {index !== steps.length - 1 && (
                  <ArrowRight className="text-gray-400 hidden md:block" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}

      <FAQ />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Homepage;
