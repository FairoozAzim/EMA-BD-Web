import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import Profile from "../../../components/Profile/Profile";
import MemberCardSkeleton from "../../../components/ui/MemberCardSkeleton";

const HomeAlumni = () => {
  const {
    data: alumni = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["alumni"],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/alumni`);

      if (!res.ok) {
        throw new Error("Failed to fetch alumni");
      }

      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const featuredAlumni = useMemo(() => {
    return [...alumni]
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
  }, [alumni]);

  if (isError) {
    return null;
  }

  return (
    <section className="px-6 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-7xl">

        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-[#0F2A5F]" />

            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0F2A5F]">
              Our Community
            </span>

            <span className="h-px w-10 bg-[#0F2A5F]" />
          </div>

          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-[#0F2A5F] md:text-5xl">
            Our Students & Alumni
          </h2>

          <p className="mx-auto text-xs md:text-base mt-4 max-w-2xl text-slate-600">
            Meet Erasmus Mundus scholars and alumni from Bangladesh who are
            studying, researching, and building connections around the world.
          </p>
        </div>

        {/* Alumni Cards */}
        <div className="mt-12">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <MemberCardSkeleton key={index} />
              ))}
            </div>
          ) : featuredAlumni.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredAlumni.map((alumni) => (
                <Profile
                  key={alumni._id}
                  designation="alumni"
                  data={alumni}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500">
              No alumni available at the moment.
            </p>
          )}
        </div>

        {/* CTA */}
        {!isLoading && featuredAlumni.length > 0 && (
          <div className="mt-10 text-center">
            <Link
              to="/alumni"
              className="group inline-flex items-center gap-2 rounded-lg bg-[#0F2A5F] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0b214c] hover:shadow-lg"
            >
              Explore Our Alumni
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

export default HomeAlumni;