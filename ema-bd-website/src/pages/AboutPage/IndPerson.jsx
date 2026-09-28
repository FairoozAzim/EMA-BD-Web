/* eslint-disable react/no-unescaped-entities */
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiCalendar } from "react-icons/fi";
import Eud from "./EUD_dets.jsx";
import CRs from "./CR_dets.jsx";

const IndPerson = () => {
  const { name } = useParams();

  let item = Eud.find((item) => item.name === name);

  if (!item) {
    item = CRs.find((item) => item.name === name);
  }

  // Handle invalid name / missing person
  if (!item) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Person Not Found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            We couldn't find the requested profile.
          </p>

          <Link
            to="/about"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0F2A5F] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#0b214b]"
          >
            <FiArrowLeft />
            Back to About
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Header */}
      <section className="mx-auto max-w-7xl px-6 pb-8 pt-8">
        <Link
          to="/about"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#0F2A5F]"
        >
          <FiArrowLeft />
          Back to About
        </Link>

        <div className="mt-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#0F2A5F]">
            EMA Bangladesh
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#0F2A5F] md:text-5xl">
            Keynote from {name}
          </h1>
        </div>
      </section>

      {/* Profile */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
          <div className="grid md:grid-cols-[300px_1fr]">
            {/* Person */}
            <div className="bg-slate-50 p-6 md:p-8">
              <div className="overflow-hidden rounded-2xl">
                <img
                  src={item.image}
                  alt={item.name}
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>

              <div className="mt-5">
                <h2 className="text-xl font-bold text-slate-900">
                  {item.name}
                </h2>

                {item.year && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                    <FiCalendar className="text-[#0F2A5F]" />

                    <span>Active Period: {item.year}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Keynote */}
            <div className="p-6 md:p-10">
              {/* Highlight */}
              <div className="border-l-4 border-[#0F2A5F] pl-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#0F2A5F]">
                  Keynote
                </p>

                <h3 className="mt-2 text-xl font-semibold leading-8 text-slate-900 md:text-2xl">
                  {item.highlight}
                </h3>
              </div>

              {/* Speech */}
              <div className="mt-8">
                {item.keynote.split("\n").map((line, index) => (
                  <p
                    key={index}
                    className="mb-5 text-sm leading-8 text-slate-600 md:text-base"
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default IndPerson;