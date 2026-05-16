import React from "react";

const ContactForm = () => {
  return (
    <div className="bg-white border rounded-2xl p-5 sm:p-6 md:p-8  shadow-sm w-full max-w-md">
      <form className="space-y-5">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            placeholder="Enter Your Name"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm 
            focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            placeholder="Enter your email address"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm 
            focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="text"
            placeholder="Enter your phone number"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm 
            focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
          />
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject
          </label>
          <input
            type="text"
            placeholder="Enter the subject of your message"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm 
            focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            rows="4"
            placeholder="Enter your message here"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none
            focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
          ></textarea>
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium
          hover:bg-gray-800 transition duration-200"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
