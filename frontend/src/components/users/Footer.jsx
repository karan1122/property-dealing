import { Building, Mail, MapPin, Phone } from "lucide-react";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Building className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-2xl font-bold">Crestovia</span>
            </div>
            <p className="text-gray-400">
              Simplifying property buying, selling, and renting since 2020.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Properties
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Listings
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  Buy Property
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Sell Property
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Rent Property
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Consulting
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Contact Info</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                (555) 123-4567
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                info@Crestovia.com
              </li>
              <li className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                New York, NY 10001
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2026 Crestovia. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
