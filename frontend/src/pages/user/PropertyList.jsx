
import React, { useEffect, useState } from "react";

import Navbar from "../../components/users/Navbar";
import Footer from "../../components/users/Footer";
import PropertyCard from "../../components/PropertyCard";

const DROPDOWN_OPTIONS = {
  type: {
    label: "Building Type",
    options: [
      "All Types",
      "smartphones",
      "laptops",
      "furniture",
      "home-decoration",
      "mens-shirts",
      "womens-dresses",
    ],
  },
  service: {
    label: "Service Type",
    options: [
      "All Services",
      "For Sale",
      "For Rent",
    ],
  },
  price: {
    label: "Price",
    options: [
      "All Prices",
      "Under $100",
      "$100 - $500",
      "$500 - $1000",
      "Above $1000",
    ],
  },
  location: {
    label: "Location",
    options: [
      "All Locations",
      "Apple",
      "Samsung",
      "OPPO",
      "Huawei",
      "Furniture",
    ],
  },
};

const Dropdown = ({
  label,
  filterKey,
  options,
  selected,
  isOpen,
  onToggle,
  onSelect,
}) => (
  <div className="flex flex-col">
    <span className="text-gray-400 text-sm py-3">
      {label}
    </span>

    <div className="flex flex-col w-64 text-sm relative">
      <button
        type="button"
        onClick={() => onToggle(filterKey)}
        className="w-full text-left px-4 pr-2 py-3 border rounded-lg bg-white border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none"
      >
        <span>
          {selected || "Select"}
        </span>

        <svg
          className={`w-5 h-5 inline float-right transition-transform duration-200 ${
            isOpen
              ? "rotate-0"
              : "-rotate-90"
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="#6B7280"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-md mt-1 py-2 z-50">
          {options.map((option) => (
            <li
              key={option}
              className="px-4 py-2 hover:bg-black hover:text-white cursor-pointer transition-colors"
              onClick={() =>
                onSelect(filterKey, option)
              }
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
);

const PropertyList = () => {
  const [properties, setProperties] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [debouncedSearch, setDebouncedSearch] =
    useState("");

  const [openDropdown, setOpenDropdown] =
    useState(null);

  const [filters, setFilters] = useState({
    type: "",
    service: "",
    price: "",
    location: "",
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  /* Debouncing */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 600);

    return () => clearTimeout(timer);
  }, [search]);

  /* API Search */
  useEffect(() => {
    if (debouncedSearch.trim() === "") {
      fetchProperties();
    } else {
      searchProperties(debouncedSearch);
    }
  }, [debouncedSearch]);

  const fetchProperties = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "https://dummyjson.com/products"
      );

      const data = await res.json();

      setProperties(data.products);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const searchProperties = async (
    value
  ) => {
    try {
      setLoading(true);

      const res = await fetch(
        `https://dummyjson.com/products/search?q=${value}`
      );

      const data = await res.json();

      setProperties(data.products);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key) => {
    setOpenDropdown((prev) =>
      prev === key ? null : key
    );
  };

  const handleSelect = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));

    setOpenDropdown(null);
  };

  const filteredProperties =
    properties.filter((item) => {
      const matchesSearch =
        item.title
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchType =
        !filters.type ||
        filters.type === "All Types" ||
        item.category === filters.type;

      const matchLocation =
        !filters.location ||
        filters.location ===
          "All Locations" ||
        item.brand === filters.location;

      return (
        matchesSearch &&
        matchType &&
        matchLocation
      );
    });

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      {/* Navbar */}
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-b from-[#e8e8e8] via-[#ebebeb] to-[#f4f4f4] pt-28 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight max-w-4xl mx-auto">
            Explore Premium Real Estate
            Properties
          </h1>

          <p className="mt-5 text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover luxury homes,
            apartments, and modern spaces
            tailored to your lifestyle and
            customer journey.
          </p>

          {/* Search */}
          <div className="mt-10 max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search properties..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full border border-gray-300 rounded-xl px-5 py-4 outline-none focus:border-black bg-white shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="flex flex-wrap gap-8 justify-between items-end">
          {Object.entries(
            DROPDOWN_OPTIONS
          ).map(([key, cfg]) => (
            <Dropdown
              key={key}
              label={cfg.label}
              filterKey={key}
              options={cfg.options}
              selected={filters[key]}
              isOpen={openDropdown === key}
              onToggle={handleToggle}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </section>

      {/* Properties */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Featured Properties
          </h2>

          <p className="text-gray-500 text-sm">
            {filteredProperties.length}
            &nbsp;Properties
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="w-14 h-14 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredProperties.length >
          0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map(
              (property) => (
                <PropertyCard
                  key={property.id}
                  data={{
                    title: property.title,
                    price: `$${property.price}`,
                    img: property.thumbnail,
                    type: property.category,
                    location:
                      property.brand,
                    service: "For Sale",
                    description:
                      property.description,
                  }}
                />
              )
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <p className="text-lg font-semibold">
              No properties found
            </p>

            <p className="text-sm mt-2">
              Try another search keyword.
            </p>
          </div>
        )}
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PropertyList;

