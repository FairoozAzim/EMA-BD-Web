import Profile from "../../components/Profile/Profile";
// import { useLoaderData } from 'react-router-dom';
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import TeamSkeleton from "../../components/ui/TeamSkeleton";
import ErrorPage from "../Error/Error";

const Team = () => {
  const currentYear = new Date().getFullYear().toString();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const {
    data: team = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["team"],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/members`);
      if (!res.ok) {
        throw new Error("Failed to fetch members");
      }

      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { years, leadArray, teamArray } = useMemo(() => {
    // Get years
    const years = [...new Set(team.map((member) => member.year))].sort(
      (a, b) => Number(b) - Number(a),
    );

    // Split members
    const leaders = [];
    const members = [];

    for (const member of team) {
      if (member.year !== selectedYear) continue;

      if (
        member.position === "Country Representative" ||
        member.position === "Deputy Country Representative"
      ) {
        leaders.push(member);
      } else {
        members.push(member);
      }
    }

    leaders.sort((a) => (a.position === "Country Representative" ? -1 : 1));

    members.sort((a, b) => {
      const aCoordinator = a.position.startsWith("Coordinator");
      const bCoordinator = b.position.startsWith("Coordinator");

      const aDeputy = a.position.startsWith("Deputy Coordinator");
      const bDeputy = b.position.startsWith("Deputy Coordinator");

      if (aCoordinator && bDeputy) return -1;
      if (aDeputy && bCoordinator) return 1;

      return 0;
    });

    return {
      years,
      leadArray: leaders,
      teamArray: members,
    };
  }, [team, selectedYear]);

  if (isLoading) {
    return <TeamSkeleton />;
  }

  if (error) {
    return <ErrorPage error={error.message} />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-10">
        <div className="text-center">
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-[#0F2A5F] md:text-5xl">
            Meet Our Team
          </h1>

          <p className="mx-auto text-xs md:text-base mt-4 max-w-2xl text-slate-600">
            Meet the passionate volunteers leading Erasmus Mundus Association
            Bangladesh and building a stronger international student community.
          </p>
        </div>

{/* Year Dropdown */}
        <div className="mt-8 flex justify-center">
          <div className="relative inline-block w-48">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full appearance-none rounded-full bg-white px-5 py-2.5 pr-10 text-xs md:text-sm font-medium text-slate-700 border border-slate-200 shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#0F2A5F] focus:border-transparent cursor-pointer"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            {/* Custom Arrow Icon */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="mx-auto max-w-7xl px-6 pb-12">
        <div className="mb-8">
          <h2 className="text-xl md:text-3xl font-bold text-slate-900">
            Leadership Team
          </h2>

          <p className="text-xs md:text-base mt-2 text-slate-500">
            Country representatives leading EMA Bangladesh.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {leadArray.map((lead) => (
            <div key={lead._id} className="w-full max-w-sm">
              <Profile designation="team" data={lead} />
            </div>
          ))}
        </div>
      </section>

      {/* Members */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-8">
          <h2 className="text-xl md:text-3xl font-bold text-slate-900">
            Executive Committee
          </h2>

          <p className="text-xs md:text-base mt-2 text-slate-500">
            Dedicated volunteers working across different teams.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {teamArray.map((member) => (
            <Profile key={member._id} designation="team" data={member} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Team;
