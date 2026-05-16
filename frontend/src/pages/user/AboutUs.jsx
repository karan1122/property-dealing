import React from "react";
import Navbar from "../../components/users/Navbar";
import team from "./../../../public/assets/images/house/team.jpg";
import Testimonials from "../../components/users/aboutUs/Testimonials";
import Footer from "../../components/users/Footer";
import TeamSlider from "../../components/users/aboutUs/TeamSlider";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="max-w-7xl pt-28 relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between flex-col items-center mb-10">
          <div>
            <h1 className="text-5xl font-bold leading-tight">
              Turning Real Estate
              <span className="text-gray-400"> Dreams</span> Into Reality.
            </h1>
          </div>

          <p className="text-gray-500 mt-5">
            "Revolutionizing the way you buy, sell, and rent properties with
            trust, technology, and transparency."
          </p>
        </div>

        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
          className="rounded-xl w-full"
        />
      </div>

      {/* Future of real estate */}
      <section className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="flex justify-between flex-wrap gap-10 items-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
            Shaping The Future Of <br />
            Real Estate With Inovation
          </h2>

          <p className="text-gray-500 leading-relaxed max-w-md ">
            We are redefining real estate with innovation and excellence. By
            leveraging technology and market expertise, we make buying, selling,
            and renting seamless.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 mb-10"></div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          <div>
            <h3 className="text-3xl font-bold">10K+</h3>
            <p className="text-gray-500 text-sm mt-1">Properties Listed</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold">5K+</h3>
            <p className="text-gray-500 text-sm mt-1">Happy Clients Served</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold">100+</h3>
            <p className="text-gray-500 text-sm mt-1">Professional Agents</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold">95%</h3>
            <p className="text-gray-500 text-sm mt-1">Satisfaction Rate</p>
          </div>
        </div>
      </section>

      {/* Our Teams */}
      <section className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center flex-wrap mb-20">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
            The Experts Behind <br />
            Our Success
          </h2>

          <p className="text-gray-500 leading-relaxed max-w-md ">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum
            assumenda aliquid tempore necessitatibus quam
          </p>
        </div>
        <TeamSlider />
      </section>

      {/* Team message */}
      <section className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className=" grid md:grid-cols-2 gap-10 items-center">
          <img src={team} className="rounded-xl " />

          <div className="bg-white flex flex-col shadow-xl rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-4">
              Trusted & Innovative Real Estate Connection
            </h2>

            <p className="text-gray-500 text-justify">
              "Finding the perfect home or investment property requires
              expertise, trust, and innovation. We combine market knowledge with
              technology to deliver seamless real estate experiences for our
              clients. Our team is dedicated to understanding your needs,
              providing expert guidance, and ensuring every transaction is
              smooth, transparent, and rewarding. Whether you are buying,
              selling, or investing, we strive to turn your real estate goals
              into reality with confidence and ease."
            </p>
            <span className="w-full text-end mt-3">- Team of Crestovia</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutUs;
