import { Link } from "react-router-dom";

import logo1 from "../../../Assets/images/home-logo1.png";
import logo2 from "../../../Assets/images/home-logo2.png";
import logo3 from "../../../Assets/images/home-logo3.png";
import logo4 from "../../../Assets/images/home-logo4.png";
import CountUp from "./CountUp";

const About = () => {
  const partnerLinks = [
    {
      image: logo1,
      href: "https://www.em-a.eu/membership",
      alt: "Erasmus Mundus Association Membership",
    },
    {
      image: logo2,
      href: "https://www.em-a.eu/",
      alt: "Erasmus Mundus Association",
    },
    {
      image: logo3,
      href: "https://www.eacea.ec.europa.eu/scholarships/erasmus-mundus-catalogue_en",
      alt: "Erasmus Mundus Catalogue",
    },
    {
      image: logo4,
      href: "https://marie-sklodowska-curie-actions.ec.europa.eu/",
      alt: "Marie Skłodowska-Curie Actions",
    },
  ];

  return (
    <section className="bg-white px-6 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Partner Logos */}
          <div className="relative order-2 lg:order-1">
            <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-[#0F2A5F]/5" />

            <div className="relative grid grid-cols-2 gap-4 sm:gap-6">
              {partnerLinks.map(({ image, href, alt }) => (
                <a
                  key={alt}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={alt}
                  className="group flex h-36 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#0F2A5F]/20 hover:bg-white hover:shadow-lg sm:h-40 sm:p-8"
                >
                  <img
                    src={image}
                    alt={alt}
                    className="max-h-20 max-w-full object-contain transition-transform duration-300 group-hover:scale-105 sm:max-h-28"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* About Content */}
          <div className="order-1 lg:order-2">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-10 bg-[#0F2A5F]" />
              <span className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0F2A5F]">
                Who We Are
              </span>
            </div>

            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-[#0F2A5F] md:text-5xl">
              About Us
            </h2>

            <p className="mx-auto text-xs md:text-base mt-4 max-w-2xl text-slate-600">
              Erasmus Mundus Association Bangladesh is a community of Erasmus
              Mundus students and alumni working together to promote higher
              education, knowledge sharing, and meaningful connections.
            </p>

            {/* Statistics */}
            <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6">
              <div className="rounded-2xl bg-slate-50 p-5 sm:p-6">
                <p className="text-3xl font-bold text-[#0F2A5F] sm:text-4xl">
                  <CountUp end={24000} />+
                </p>

                <p className="mt-2 text-sm leading-5 text-slate-500 sm:text-base">
                  Students have participated in Erasmus Mundus courses
                </p>
              </div>

              <div className="rounded-2xl bg-[#0F2A5F] p-5 text-white sm:p-6">
                <p className="text-3xl font-bold sm:text-4xl">
                  <CountUp end={12000} />+
                </p>

                <p className="mt-2 text-sm leading-5 text-white/75 sm:text-base">
                  EMA members worldwide
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-lg bg-[#0F2A5F] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0b214c] hover:shadow-lg"
              >
                Learn More
                <span
                  aria-hidden="true"
                  className="text-lg transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
