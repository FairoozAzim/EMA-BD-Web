import MemberCardSkeleton from "./MemberCardSkeleton";

const TeamSkeleton = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pt-0 md:pt-12 pb-10">
        <div className="flex flex-col items-center">

          <div className="mt-6 h-10 w-72 animate-pulse rounded bg-slate-200" />

          <div className="mt-4 h-5 w-[500px] max-w-full animate-pulse rounded bg-slate-200" />
        </div>

        {/* Year Pills */}
        <div className="mt-10 flex justify-center gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-10 w-20 animate-pulse rounded-full bg-slate-200"
            />
          ))}
        </div>
      </section>

      {/* Leadership */}
      <section className="mx-auto max-w-7xl px-6 pb-12">
        <div className="mb-8">
          <div className="h-8 w-52 animate-pulse rounded bg-slate-200" />
          <div className="mt-3 h-5 w-72 animate-pulse rounded bg-slate-200" />
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {[1, 2].map((i) => (
            <div key={i} className="w-full max-w-sm">
              <MemberCardSkeleton />
            </div>
          ))}
        </div>
      </section>

      {/* Members */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-8">
          <div className="h-8 w-56 animate-pulse rounded bg-slate-200" />
          <div className="mt-3 h-5 w-80 animate-pulse rounded bg-slate-200" />
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <MemberCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default TeamSkeleton;
