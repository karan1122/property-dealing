import React, {
  useEffect,
  useState,
} from "react";

import house1 from "./../../../public/assets/images/house/house-1.jpg";
import house2 from "./../../../public/assets/images/house/house-2.jpg";
import house3 from "./../../../public/assets/images/house/house-3.jpg";

import {
  Home,
  Search,
  Users,
  CheckCircle,
  Users2,
  ArrowRight,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import Navbar from "../../components/users/Navbar";
import PropertyCard from "../../components/PropertyCard";
import Footer from "../../components/users/Footer";
import Testimonials from "../../components/users/aboutUs/Testimonials";
import FAQ from "../../components/users/FAQ";

import {
  houses,
} from "../../constants/imageConstants";

import API from "../../API/axios";

const Homepage = () => {

  const [properties, setProperties] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    fetchProperties();

  }, []);

  const fetchProperties =
    async () => {

      try {

        setLoading(true);

        const res =
          await API.get(
            "/properties?approved=true&status=Available"
          );

        setProperties(
          res.data.properties
            ?.slice(0, 3) || []
        );

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);
      }
    };

  const steps = [
    {
      title: "Browse Listings",
      desc:
        "Find diverse properties in Crestovia",
    },
    {
      title: "Contact Agent",
      desc:
        "Ask, schedule, and get tailored deals",
    },
    {
      title: "Schedule Visits",
      desc:
        "Pick a time, and our agents ensure a hassle-free viewing",
    },
    {
      title: "Close the Deal",
      desc:
        "Close your deal confidently with expert guidance",
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
      title:
        "Real Estate Consulting",
      img: house1,
    },
  ];

  return (

    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <section className="w-full">

        <Navbar />

        {/* Hero */}
        <div className="flex flex-col items-center relative text-center text-sm text-white max-md:px-2 bg-center">

          <img
            src={houses.house3}
            className="w-screen h-150 object-cover opacity-80 z-0"
            alt=""
          />

          <div className="absolute flex flex-col flex-wrap items-center justify-center py-30">

            <h1 className="font-berkshire text-shadow-lg text-[45px]/[52px] md:text-6xl/[65px] mt-6 max-w-4xl">

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

      </section>

      {/* Connecting People */}
      <section className="py-20">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-wrap w-full justify-between mb-10">

            <div className="sm:w-125">

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">

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

          {/* Video/Image */}
          <div className="w-full shadow-2xl rounded-2xl bg-center hover:scale-101 duration-300">

            <img
              src={house2}
              alt=""
              className="rounded-2xl brightness-95"
            />

          </div>

        </div>

      </section>

      {/* Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        <h2 className="text-3xl font-bold mb-10">

          What We Offer

        </h2>

        <div className="grid md:grid-cols-4 gap-6">

          {services.map((s, i) => (

            <div
              key={i}
              className="bg-white shadow-lg rounded-xl overflow-hidden"
            >

              <img
                src={s.img}
                className="h-40 w-full object-cover"
              />

              <div className="p-4">

                <h3 className="font-semibold">

                  {s.title}

                </h3>

              </div>

            </div>

          ))}

        </div>

      </section>

      {/* Facilities */}
      <section className="py-20 bg-gray-50">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <h2 className="text-4xl font-bold text-center mb-16">

            Discover The{" "}

            <span className="text-blue-600">

              Facilities

            </span>

            {" "}We Offer At Crestovia

          </h2>

          <div className="grid md:grid-cols-4 gap-8">

            {[
              {
                icon: CheckCircle,
                title:
                  "Verified Property Listings",
                desc:
                  "100% trusted properties for peace of mind",
              },
              {
                icon: Search,
                title:
                  "Advanced Search Filters",
                desc:
                  "Find properties tailored to your preferences",
              },
              {
                icon: Users,
                title:
                  "Expert Support",
                desc:
                  "Agents and consultants at your service",
              },
              {
                icon: Home,
                title:
                  "User-Friendly Platform",
                desc:
                  "Simple navigation for seamless browsing",
              },
            ].map((item, index) => (

              <div
                key={index}
                className="bg-white p-6 rounded-xl text-center shadow-md"
              >

                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">

                  <item.icon className="h-8 w-8 text-blue-600" />

                </div>

                <h3 className="font-bold text-lg mb-2">

                  {item.title}

                </h3>

                <p className="text-gray-600">

                  {item.desc}

                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* Featured Properties */}
      {properties.length > 0 && (

        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex justify-between items-center mb-12">

            <h2 className="text-3xl font-bold">

              Explore Property Listings

            </h2>

            <Link
              to="/properties"
              className="flex items-center gap-2 text-black font-semibold hover:gap-3 transition-all"
            >

              View All

              <ArrowRight size={18} />

            </Link>

          </div>

          {loading ? (

            <div className="flex justify-center items-center py-20">

              <div className="w-14 h-14 border-4 border-black border-t-transparent rounded-full animate-spin"></div>

            </div>

          ) : (

            <div className="grid md:grid-cols-3 gap-8">

              {properties.map(
                (property) => (

                  <PropertyCard
                    data={property}
                    key={property._id}
                  />

                )
              )}

            </div>

          )}

        </section>

      )}

      {/* Testimonials */}
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

                  <h3 className="font-semibold text-lg mb-2">

                    {step.title}

                  </h3>

                  <p className="text-gray-500 text-sm">

                    {step.desc}

                  </p>

                </div>

                {index !==
                  steps.length - 1 && (

                  <ArrowRight className="text-gray-400 hidden md:block" />

                )}

              </React.Fragment>

            ))}

          </div>

        </div>

      </section>

      {/* FAQ */}
      <FAQ />

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default Homepage;