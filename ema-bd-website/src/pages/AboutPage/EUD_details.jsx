import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import EudData from "./EUD_dets";

const EUD_details = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-10">
        <div className="pt-5 md:pt-16 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-[#0F2A5F] md:text-5xl">
            European Union Delegation Ambassadors
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-xs leading-6 text-slate-600 md:text-base md:leading-7">
            Discover the ambassadors who have contributed to the Erasmus Mundus
            community and strengthened connections between Bangladesh and the
            European Union.
          </p>
        </div>
      </section>

      {/* Ambassador Cards */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="space-y-6">
          {EudData.map((item, index) => (
            <article
              key={index}
              className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="relative h-64 w-full shrink-0 overflow-hidden md:h-auto md:w-80">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Image overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F2A5F]/40 to-transparent md:bg-gradient-to-r" />
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col justify-center p-6 md:p-8">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#0F2A5F]">
                      European Union Delegation Ambassador
                    </p>

                    <h2 className="mt-2 text-xl font-bold text-slate-900 md:text-2xl">
                      {item.name}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Active Period:{" "}
                      <span className="font-medium text-slate-700">
                        {item.year}
                      </span>
                    </p>

                    <div className="mt-5 h-px bg-slate-100" />

                    <h3 className="mt-5 text-sm font-semibold text-slate-800 md:text-base">
                      {item.highlight}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {item.keynote.slice(0, 400)}
                      {item.keynote.length > 400 ? "..." : ""}
                    </p>
                  </div>

                  {/* Read More */}
                  <div className="mt-6">
                    <Link
                      to={`/keynote/${item.name}`}
                      className="inline-flex items-center gap-2 rounded-full bg-[#0F2A5F] px-5 py-2.5 text-xs font-medium text-white transition-all duration-300 hover:bg-[#0b214b] md:text-sm"
                    >
                      Read More
                      <FiArrowRight className="text-base transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default EUD_details;