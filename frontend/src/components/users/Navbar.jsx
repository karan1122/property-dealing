import React, { useContext, useEffect, useState } from "react";
import { AUTH_ROUTE, USER_ROUTE } from "../../constants/routeConstants";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();

  const { user } = useContext(AuthContext);

  useEffect(() => {
    if(user){

    }
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: USER_ROUTE.HOME },
    { name: "About", path: USER_ROUTE.ABOUT },
    { name: "Listing", path: USER_ROUTE.PROPERTY_LIST },
    { name: "Contact", path: USER_ROUTE.CONTACT_US },
    // { name: "Profile", path: USER_ROUTE.PROFILE }
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300
      ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-lg py-3"
          : "bg-black/20 backdrop-blur-md py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        
        {/* Logo */}
        <Link
          to={USER_ROUTE.HOME}
          className={`text-2xl font-bold tracking-wide transition-colors duration-300
          ${scrolled ? "text-black" : "text-white"}`}
        >
          Crestovia
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              className={`text-sm font-semibold transition-all duration-300 hover:text-blue-500
              ${
                location.pathname === link.path
                  ? "text-blue-500"
                  : scrolled
                  ? "text-gray-800"
                  : "text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </ul>

        {/* Right Section */}
        <div className="hidden md:flex items-center gap-4">

          {user ? (
            <Link
              to={USER_ROUTE.PROFILE}
              className={`flex items-center justify-center w-12 h-12 rounded-full overflow-hidden transition-all duration-300 border
              ${
                scrolled
                  ? "border-gray-300 bg-white shadow-md"
                  : "border-white/30 bg-white/10 backdrop-blur-md"
              }`}
            >
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop"
                alt="profile"
                className="w-full h-full object-cover"
              />
            </Link>
          ) : (
            <Link
              to={AUTH_ROUTE.LOGIN}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 border
              ${
                scrolled
                  ? "border-black text-black hover:bg-black hover:text-white"
                  : "border-white text-white hover:bg-white hover:text-black"
              }`}
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`md:hidden transition-colors duration-300
          ${scrolled ? "text-black" : "text-white"}`}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white shadow-2xl px-6 py-6 space-y-5">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              onClick={() => setOpen(false)}
              className="block text-gray-800 font-semibold hover:text-blue-500 transition"
            >
              {link.name}
            </Link>
          ))}

          {user ? (
            <Link
              to={USER_ROUTE.PROFILE}
              onClick={() => setOpen(false)}
              className="block text-center bg-black text-white py-3 rounded-full font-medium hover:opacity-90 transition"
            >
              Profile
            </Link>
          ) : (
            <Link
              to={AUTH_ROUTE.LOGIN}
              onClick={() => setOpen(false)}
              className="block text-center bg-black text-white py-3 rounded-full font-medium hover:opacity-90 transition"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;