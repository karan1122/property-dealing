import { Bath, Bed, Box } from "lucide-react";
import React from "react";
// import house2 from "./../../public/assets/images/house/house-2.jpg";
const PropertyCard = ({ data }) => {
  return (
    <div key="1" className="bg-white rounded-xl shadow w-95">
      <img src={data.img} className="h-75  w-full object-cover rounded-t-xl" />
      <div className="p-5 w-full">
        <div className="flex justify-between items-center ">
          <h3 className="font-semibold text-lg">{data.title}</h3>
          <p className="text-gray-600">{data.price}</p>
        </div>
        <div className="text-justify text-gray-500 mt-2 border-b-2 pb-2 border-b-gray-100">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            tempora necessitatibus natus asperiores cumque illo.
          </p>
        </div>
        <div className="grid grid-cols-3 divide-x-2 text-center divide-solid divide-gray-400 mt-3">
          <div className="flex  flex-wrap gap-2 justify-center items-center">
            <Bath size={20} strokeWidth={1.5} />
            <span className="text-gray-400 text-sm">2 Bathroom</span>
          </div>
          <div className="flex flex-wrap gap-2 justify-center items-center">
            <Bed size={20} strokeWidth={1.5} />
            <span className="text-gray-400 text-sm">3 Bedroom</span>
          </div>
          <div className="flex flex-wrap gap-2 justify-center items-center">
            <Box size={20} strokeWidth={1.5} />
            <span className="text-gray-400 text-sm">2000 sq ft</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
