import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Leader from "./../../../../public/assets/images/house/Leader.jpg";

const TEAM = [
  { name: "John Wick",        designation: "Chief Executive Officer" },
  { name: "Kakashi Hatake",   designation: "Team Leader"             },
  { name: "David Finch",      designation: "Senior Agent"            },
  { name: "Mark Raffelo",     designation: "Junior Agent"            },
  { name: "Chris Hamswarth",  designation: "Team Leader"             },
  { name: "Tom Elis",         designation: "Senior Agent"            },
  { name: "John Smith",       designation: "Marketing Lead"          },
  { name: "Tony Stark",       designation: "Operations Manager"      },
];

const TeamSlider = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className="relative">

      {/* Custom nav buttons */}
      <div className="flex items-center justify-end gap-3 mb-6">
        <button
          ref={prevRef}
          aria-label="Previous slide"
          className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-[#1a1a1a] hover:text-white hover:border-[#1a1a1a] transition-all duration-200"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <button
          ref={nextRef}
          aria-label="Next slide"
          className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-[#1a1a1a] hover:text-white hover:border-[#1a1a1a] transition-all duration-200"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={true}
        breakpoints={{
          0:    { slidesPerView: 1, spaceBetween: 16 },
          480:  { slidesPerView: 2, spaceBetween: 20 },
          768:  { slidesPerView: 3, spaceBetween: 24 },
          1024: { slidesPerView: 4, spaceBetween: 28 },
        }}
        className="pb-12"
      >
        {TEAM.map((member, i) => (
          <SwiperSlide key={i}>
            <div className="group cursor-pointer">
              {/* Image wrapper */}
              <div className="overflow-hidden rounded-2xl relative">
                <img
                  src={Leader}
                  alt={member.name}
                  loading="lazy"
                  className="w-full aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[#1a1a1a]/0 group-hover:bg-[#1a1a1a]/20 transition-all duration-300 rounded-2xl" />

                {/* Gold accent tag */}
                <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <p className="text-xs text-[#C8973A] font-semibold uppercase tracking-wider">
                    {member.designation}
                  </p>
                </div>
              </div>

              {/* Name & designation */}
              <div className="mt-3 text-center">
                <h3 className="text-base font-semibold text-gray-900">
                  {member.name}
                </h3>
                <p className="text-sm text-gray-400 mt-0.5">
                  {member.designation}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Pagination dot styles */}
      <style>{`
        .swiper-pagination-bullet {
          background: #D1D5DB;
          opacity: 1;
          width: 8px;
          height: 8px;
          transition: all 0.3s;
        }
        .swiper-pagination-bullet-active {
          background: #1a1a1a;
          width: 24px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default TeamSlider;