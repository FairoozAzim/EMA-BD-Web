import { Link } from "react-router-dom";

import faq from "../../../Assets/faq.json";
import Accordion from "../../../components/Accordion/Accordion";

const HomeFaq = () => {
  const featuredFaqs = faq.slice(0, 4);

  return (
    <section className="bg-white px-6 py-20 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-5xl">
        {/* Section Header */}
        <div className="text-center">
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-[#0F2A5F]" />

            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0F2A5F]">
              FAQ
            </span>

            <span className="h-px w-10 bg-[#0F2A5F]" />
          </div>

          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-[#0F2A5F] md:text-5xl">
            Frequently Asked Questions
          </h2>

          <p className="mx-auto text-xs md:text-base mt-4 max-w-2xl text-slate-600">
            Find quick answers to some of the most common questions about
            Erasmus Mundus and EMA Bangladesh.
          </p>
        </div>

        {/* FAQs */}
        <div className="mt-12 space-y-3">
          {featuredFaqs.map((item, index) => (
            <Accordion
              key={index}
              title={item.question}
              content={item.answer}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/faq"
            className="group inline-flex items-center gap-2 rounded-lg bg-[#0F2A5F] px-3 md:px-6 py-2 md:py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0b214c] hover:shadow-lg"
          >
            View All FAQs
            <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeFaq;
