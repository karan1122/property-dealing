import {
  Facebook,
  FacebookIcon,
  Instagram,
  InstagramIcon,
  Linkedin,
  LinkedinIcon,
  Youtube,
  YoutubeIcon,
} from "lucide-react";
import React from "react";

const ContactInfo = () => {
  return (
    <div className="max-w-xl">
      {/* Heading */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
        Have Questions Or Need Assistance?
      </h2>

      {/* Description */}
      <p className="mt-4 text-gray-500 text-sm sm:text-base">
        We're here to help! Whether you have inquiries about our services, need
        guidance on your next steps, or require support, our team is ready to
        assist you.
      </p>

      {/* Info Grid */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
        {/* Message */}
        <div>
          <p className="text-gray-400">Message Us</p>
          <p className="font-medium text-gray-800 mt-1">
            support@crestovia.com
          </p>
        </div>

        {/* Call */}
        <div>
          <p className="text-gray-400">Call Us</p>
          <p className="font-medium text-gray-800 mt-1">(555) 987-6543</p>
        </div>

        {/* Location */}
        <div>
          <p className="text-gray-400">Location</p>
          <p className="font-medium text-gray-800 mt-1 leading-relaxed">
            4567 Elm Street, Suite 301, Greenfield, TX, 78901
          </p>
        </div>

        {/* Business Hours */}
        <div>
          <p className="text-gray-400">Business Hours</p>
          <p className="font-medium text-gray-800 mt-1">
            Monday - Friday <br />
            9:00 AM - 6:00 PM
          </p>
        </div>
      </div>

      {/* Social Icons */}
      <div className="mt-8">
        <p className="text-gray-400 text-sm">Social Media</p>

        <div className="flex gap-4 mt-3 text-gray-500">
          <FacebookIcon
            className="hover:text-black cursor-pointer"
            strokeWidth={1.5}
          />
          <InstagramIcon
            className="hover:text-black cursor-pointer"
            strokeWidth={1.5}
          />
          <YoutubeIcon
            className="hover:text-black cursor-pointer"
            strokeWidth={1.5}
          />
          <LinkedinIcon
            className="hover:text-black cursor-pointer"
            strokeWidth={1.5}
          />
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
