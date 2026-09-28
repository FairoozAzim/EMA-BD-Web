import { useEffect, useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import sliderData from "./SliderIamges";
import { BsChatSquareQuoteFill } from "react-icons/bs";


const Slider = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const currentSlide = sliderData[activeIndex];

  const nextSlide = () => {
    setActiveIndex((prev) =>
      prev === sliderData.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setActiveIndex((prev) =>
      prev === 0 ? sliderData.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-50 px-5 py-8 md:px-12 md:py-12">
      {/* Quote Icon */}
      <div className="absolute right-6 top-5 text-[#0F2A5F]/10 md:right-10 md:top-8">
        <BsChatSquareQuoteFill className="h-20 w-20 md:h-28 md:w-28" />
      </div>

      {/* Content */}
      <div className="relative flex flex-col items-center gap-8 md:flex-row md:gap-12">
        {/* Image */}
        <div className="shrink-0">
          <div className="h-40 w-40 overflow-hidden rounded-2xl shadow-md md:h-56 md:w-44">
            <img
              src={currentSlide.image}
              alt={currentSlide.name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Text */}
        <div className="flex-1 text-center md:text-left">
          <p className="text-sm leading-7 text-slate-600 md:text-base md:leading-8">
            “{currentSlide.text}”
          </p>

          <div className="mt-6">
            <h3 className="text-lg font-bold text-[#0F2A5F] md:text-xl">
              {currentSlide.name}
            </h3>

            <p className="mt-1 text-xs font-medium text-slate-500 md:text-sm">
              {currentSlide.role}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="relative mt-8 flex items-center justify-between">
        {/* Dots */}
        <div className="flex items-center gap-2">
          {sliderData.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIndex === index
                  ? "w-7 bg-[#0F2A5F]"
                  : "w-2 bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>

        {/* Arrows */}
        <div className="flex gap-2">
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-[#0F2A5F] hover:bg-[#0F2A5F] hover:text-white"
          >
            <FiChevronLeft />
          </button>

          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-[#0F2A5F] hover:bg-[#0F2A5F] hover:text-white"
          >
            <FiChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Slider;