import { useEffect, useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import Image1 from "../../../Assets/images/Slider2.jpg";
import Image2 from "../../../Assets/images/Slider1.jpg";
import Image3 from "../../../Assets/images/slider4.jpg";
import Image4 from "../../../Assets/images/slider7.png";
import Image5 from "../../../Assets/images/slider8.jpg";
import Image6 from "../../../Assets/images/Slider_7.jpg";
import Image7 from "../../../Assets/images/Slider_6.jpg";
import Image8 from "../../../Assets/images/2.png";
import Image9 from "../../../Assets/images/Slider_8.jpg";

const slides = [
  Image1,
  Image2,
  Image3,
  Image4,
  Image5,
  Image6,
  Image7,
  Image8,
  Image9,
];

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [slides.length]);

  const socialLinks = [
    {
      href: "https://www.facebook.com/ErasmusMundusBangladesh",
      icon: <FaFacebookF />,
      label: "Facebook",
    },
    {
      href: "https://www.linkedin.com/company/ema-bd/",
      icon: <FaLinkedinIn />,
      label: "LinkedIn",
    },
    {
      href: "https://www.instagram.com/erasmus_mundus_bangladesh/",
      icon: <FaInstagram />,
      label: "Instagram",
    },
    {
      href: "https://www.youtube.com/@erasmus_mundus_bangladesh",
      icon: <FaYoutube />,
      label: "YouTube",
    },
    {
      href: "https://x.com/erasmus_BD",
      icon: <FaXTwitter />,
      label: "X",
    },
  ];

  return (
    <section className="relative isolate h-[65vh] min-h-[500px] sm:h-[75vh] sm:min-h-[560px] lg:h-[80vh] lg:min-h-[600px] w-full overflow-hidden">
      {/* Background Images */}
      {slides.map((slide, index) => (
        <img
          key={slide}
          src={slide}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/30" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="max-w-4xl text-white">
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Erasmus Mundus Association Bangladesh
            </h1>

            <p className="mt-6 max-w-3xl text-sm md:text-base leading-6 text-white/90 md:leading-7 lg:text-xl">
              EMA is the Erasmus Mundus Students and Alumni Association. EMA was
              founded in 2008 and is registered as an AISBL non-profit
              organization. Our aims are to help EMJMD students and alumni
              promote higher education and be a go-to network for our Alumni
              across the world.
            </p>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="absolute right-6 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-3 sm:flex">
        {socialLinks.map(({ href, icon, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-[#0F2A5F]/80 text-white backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-[#0F2A5F]"
          >
            {icon}
          </a>
        ))}
      </div>

      {/* Mobile Social Links */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-3 sm:hidden">
        {socialLinks.map(({ href, icon, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-[#0F2A5F]/80 text-white backdrop-blur-sm transition-all duration-300 hover:bg-[#0F2A5F]"
          >
            {icon}
          </a>
        ))}
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-6 z-20 hidden items-center gap-2 sm:flex lg:left-12">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "w-8 bg-white"
                : "w-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Banner;
