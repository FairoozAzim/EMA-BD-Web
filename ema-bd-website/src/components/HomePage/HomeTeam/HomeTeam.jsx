import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import Profile from "../../../components/Profile/Profile";
import MemberCardSkeleton from "../../../components/ui/MemberCardSkeleton";

const HomeTeam = () => {
  const currentYear = new Date().getFullYear().toString();

  const {
    data: team = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["team"],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/members`);

      if (!res.ok) {
        throw new Error("Failed to fetch team members");
      }

      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const featuredMembers = useMemo(() => {
    const currentMembers = team.filter((member) => member.year === currentYear);

    const leaders = currentMembers
      .filter(
        (member) =>
          member.position === "Country Representative" ||
          member.position === "Deputy Country Representative",
      )
      .sort((a, b) => {
        if (a.position === "Country Representative") return -1;
        if (b.position === "Country Representative") return 1;
        return 0;
      });

    const otherMembers = currentMembers.filter(
      (member) =>
        member.position !== "Country Representative" &&
        member.position !== "Deputy Country Representative",
    );

    // Randomly select 2 executive members
    const randomMembers = [...otherMembers]
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    return [...leaders.slice(0, 2), ...randomMembers];
  }, [team, currentYear]);

  if (isError) {
    return null;
  }

  return (
    <section className="bg-slate-50 px-6 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-[#0F2A5F]" />

            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0F2A5F]">
              Our People
            </span>

            <span className="h-px w-10 bg-[#0F2A5F]" />
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Meet Our Team
          </h2>

          <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Meet the passionate volunteers working together to support Erasmus
            Mundus students and alumni and build a stronger international
            community.
          </p>
        </div>

        {/* Team Cards */}
        <div className="mt-12">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <MemberCardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredMembers.map((member) => (
                <Profile key={member._id} designation="team" data={member} />
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        {!isLoading && featuredMembers.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              to="/team"
              className="group inline-flex items-center gap-2 rounded-lg bg-[#0F2A5F] px-3 md:px-6 py-3.5 text-xs md:text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0b214c] hover:shadow-lg"
            >
              Meet Our Full Team
              <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeTeam;
