import {
  Bath,
  Bed,
  Box,
  MapPin,
} from "lucide-react";

import {
  Link
} from "react-router-dom";

import React from "react";

const PropertyCard = ({
  data,
}) => {

  return (

    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 flex flex-col h-full">

      {/* Image */}
      <div className="w-full h-[280px] overflow-hidden">

        <img
          src={
            data.thumbnail ||
            data.images?.[0] ||
            "https://via.placeholder.com/500x300"
          }
          alt={data.title}
          className="w-full h-full object-cover hover:scale-105 transition duration-500"
        />

      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">

        {/* Title + Price */}
        <div className="flex justify-between items-start gap-4">

          <h3 className="font-bold text-2xl line-clamp-1 text-gray-900">

            {data.title}

          </h3>

          <p className="text-black font-bold whitespace-nowrap text-lg">

            ₹{" "}

            {data.price
              ? Number(
                  data.price
                ).toLocaleString(
                  "en-IN"
                )
              : "0"}

          </p>

        </div>

        {/* Location */}
        <div className="flex items-center gap-2 mt-3 text-gray-500">

          <MapPin size={17} />

          <span className="line-clamp-1 text-sm">

            {data.address?.city},
            {" "}
            {data.address?.state}

          </span>

        </div>

        {/* Description */}
        <div className="mt-4 flex-1">

          <p className="text-gray-500 text-sm leading-7 line-clamp-2">

            {data.description ||
              "No description available"}

          </p>

        </div>

        {/* Property Details */}
        <div className="grid grid-cols-3 divide-x divide-gray-200 text-center mt-6 py-4 border-y border-gray-100">

          {/* Bath */}
          <div className="flex flex-col items-center gap-1">

            <Bath
              size={20}
              strokeWidth={1.7}
            />

            <span className="text-sm text-gray-500">

              {
                data.propertyDetails
                  ?.bathrooms || 0
              }
              {" "}
              Bath

            </span>

          </div>

          {/* Bed */}
          <div className="flex flex-col items-center gap-1">

            <Bed
              size={20}
              strokeWidth={1.7}
            />

            <span className="text-sm text-gray-500">

              {
                data.propertyDetails
                  ?.bedrooms || 0
              }
              {" "}
              Bed

            </span>

          </div>

          {/* Area */}
          <div className="flex flex-col items-center gap-1">

            <Box
              size={20}
              strokeWidth={1.7}
            />

            <span className="text-sm text-gray-500">

              {
                data.propertyInfo
                  ?.squareArea || 0
              }
              {" "}
              sq ft

            </span>

          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-5">

          <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full font-medium">

            {
              data.propertyInfo
                ?.propertyType ||
              "Property"
            }

          </span>

          <Link
            to={`/property/${data._id}`}
            className="bg-black text-white px-5 py-2.5 rounded-xl text-sm hover:bg-gray-800 transition"
          >

            View Details

          </Link>

        </div>

      </div>

    </div>
  );
};

export default PropertyCard;