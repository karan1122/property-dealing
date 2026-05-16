import React from "react";
import Navbar from "../../components/users/Navbar";
import Footer from "../../components/users/Footer";
import { houses } from "./../../constants/imageConstants";
import ContactForm from "../../components/users/contactUs/ContactForm";
import FAQ from "../../components/users/FAQ";
import ContactInfo from "../../components/users/contactUs/ContactInfo";
import { Link } from "react-router-dom";
import { USER_ROUTE } from "../../constants/routeConstants";

const Contact = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white text-gray-800">
        <Navbar />

        {/* HERO */}
        <section className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] flex items-center justify-center text-center">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
            className="absolute inset-0 w-full h-full object-cover"
            alt="hero"
          />
          <div className="absolute inset-0 bg-black/40"></div>

          <div className="relative z-10 text-white px-4 max-w-2xl">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold">
              Get In Touch With Us
            </h1>
            <p className="mt-3 text-xs sm:text-sm md:text-base opacity-90">
              Browse curated properties tailored to your needs.
            </p>
          </div>
        </section>

        {/* CONTACT */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20   sm:py-14 md:py-16 md:px-16 ">
          <div className="w-full flex flex-wrap justify-between items-start gap-10">
            {/* LEFT */}
            <ContactInfo />

            {/* RIGHT FORM */}
            <ContactForm />
          </div>
        </section>

        {/* MAP */}
        <section className="h-100 sm:h-150 md:h-170 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <iframe
            title="map"
            src="https://maps.google.com/maps?q=Texas&t=&z=13&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full border-0 rounded-xl shadow-xl"
          ></iframe>
        </section>

        {/* FAQ */}
        <FAQ />

        {/* CTA */}
        <section className="relative px-4 sm:px-6 md:px-16 py-20 text-white">
          <img
            src={houses.house3}
            className="absolute inset-0 w-full h-full object-cover"
            alt=""
          />
          <div className="absolute inset-0 bg-black/50"></div>

          <div className="relative z-10 max-w-7xl mx-auto">
            <h2 className="text-2xl my-10 sm:text-3xl md:text-4xl font-bold">
              Find Your Perfect Property With Crestovia
            </h2>

            <Link
              role="button"
              to={USER_ROUTE.PROPERTY_LIST}
              className="my-10 bg-white text-black px-5 py-2 rounded-lg text-sm sm:text-base"
            >
              Start Your Search
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default Contact;
