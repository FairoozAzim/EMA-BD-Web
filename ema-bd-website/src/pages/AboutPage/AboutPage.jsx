import Slider from "../../components/Slider/Slider.jsx";
import {
  FaBullhorn,
  FaHandsHelping,
  FaNetworkWired,
  FaUsers,
} from "react-icons/fa";

const AboutPage = () => {
  const missionItems = [
    {
      icon: <FaBullhorn />,
      title: "Promote",
      description: "Promote the Erasmus Mundus program and its opportunities in Bangladesh.",
    },
    {
      icon: <FaHandsHelping />,
      title: "Support",
      description:
        "Support current and prospective students through guidance, mentorship, and resources.",
    },
    {
      icon: <FaNetworkWired />,
      title: "Connect",
      description:
        "Facilitate professional networking and career development opportunities for alumni.",
    },
    {
      icon: <FaUsers />,
      title: "Build Community",
      description:
        "Foster a strong and inclusive community among Erasmus Mundus scholars and alumni.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-12">
        <div className="pt-5 md:pt-16 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-[#0F2A5F] md:text-5xl">
            About EMA Bangladesh
          </h1>

          <p className="mx-auto mt-4 max-w-3xl text-xs leading-6 text-slate-600 md:text-base md:leading-7">
            Erasmus Mundus Association Bangladesh is an independent,
            non-profit association managed by EMA Country Representatives for
            Bangladesh together with active Bangladeshi volunteers.
          </p>
        </div>

        {/* Introduction Card */}
        <div className="mt-8 rounded-2xl bg-[#0F2A5F] px-6 py-8 text-center shadow-sm md:px-12 md:py-12">
          <p className="mx-auto max-w-4xl text-sm leading-7 text-white/90 md:text-base md:leading-8">
            Our mission is to foster educational and cultural exchange,
            enhance professional development, and build a strong network of
            Erasmus Mundus students and alumni in Bangladesh.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="mb-8 text-center md:text-left">
          <h2 className="text-xl font-bold text-slate-900 md:text-3xl">
            Our Mission & Vision
          </h2>

          <p className="mt-2 max-w-3xl text-xs leading-6 text-slate-500 md:text-base md:leading-7">
            We envision a connected and empowered community where Bangladeshi
            students and alumni can grow through education, collaboration,
            and meaningful opportunities.
          </p>
        </div>

        {/* Mission Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {missionItems.map((item) => (
            <div
              key={item.title}
              className="group rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#0F2A5F]/10 text-2xl text-[#0F2A5F] transition-colors duration-300 group-hover:bg-[#0F2A5F] group-hover:text-white">
                {item.icon}
              </div>

              <h3 className="mt-5 text-base font-semibold text-slate-900 md:text-lg">
                {item.title}
              </h3>

              <p className="mt-3 text-xs leading-6 text-slate-500 md:text-sm">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* What We Do */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 md:text-3xl">
              What We Do
            </h2>

            <p className="mt-2 max-w-2xl text-xs leading-6 text-slate-500 md:text-base">
              EMA Bangladesh works to create opportunities, connections, and
              support for the Erasmus Mundus community.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
              <h3 className="text-lg font-semibold text-[#0F2A5F]">
                For Prospective Students
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                We help aspiring students understand Erasmus Mundus
                opportunities, prepare their applications, and learn from the
                experiences of students who have already taken the journey.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
              <h3 className="text-lg font-semibold text-[#0F2A5F]">
                For Students & Alumni
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                We create opportunities for networking, professional
                development, knowledge sharing, and meaningful engagement
                within the Erasmus Mundus community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leaders */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 text-center">
          <h2 className="text-xl font-bold text-slate-900 md:text-3xl">
            Insights from Our Leaders
          </h2>

          <p className="mx-auto mt-2 max-w-2xl text-xs leading-6 text-slate-500 md:text-base">
            Hear from the people helping shape the Erasmus Mundus community in
            Bangladesh.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <Slider />
        </div>
      </section>
    </div>
  );
};

export default AboutPage;