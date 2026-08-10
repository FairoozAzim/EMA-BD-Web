const AlumniSkeleton = () => {
  return (
    <div className="min-h-screen animate-pulse">
      {/* Hero */}
      <section>
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="mx-auto mt-5 h-10 w-64 rounded-lg bg-slate-200 md:h-12 md:w-80" />

          <div className="mx-auto mt-4 h-4 max-w-2xl rounded bg-slate-200" />
          <div className="mx-auto mt-2 h-4 max-w-xl rounded bg-slate-200" />
        </div>
      </section>

      {/* Alumni Content */}
      <section className="mx-auto mt-8 max-w-7xl px-6 pb-16 md:mt-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* Filter Skeleton */}
          <aside className="w-full lg:w-72 lg:shrink-0">
            <div className="rounded-2xl bg-white p-6 shadow-md">
              {/* Filter Header */}
              <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                  <div className="h-6 w-32 rounded bg-slate-200" />
                  <div className="mt-2 h-3 w-52 rounded bg-slate-200" />
                </div>

                <div className="h-9 w-16 rounded-lg bg-slate-200" />
              </div>

              {/* Filters */}
              <div className="flex flex-col gap-5">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item}>
                    <div className="mb-2 h-4 w-24 rounded bg-slate-200" />

                    <div className="h-12 w-full rounded-xl bg-slate-200" />
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Alumni Right Side */}
          <div className="min-w-0 flex-1">
            {/* Directory Header */}
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="h-9 w-56 rounded bg-slate-200" />

                <div className="mt-2 h-4 w-36 rounded bg-slate-200" />
              </div>

              {/* Search */}
              <div className="h-12 w-full rounded-xl bg-slate-200 md:w-80" />
            </div>

            {/* Alumni Cards */}
            <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {[...Array(12)].map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl bg-white shadow-md"
                >
                  {/* Profile Image */}
                  <div className="h-64 w-full bg-slate-200" />

                  <div className="p-5 text-center">
                    {/* Name */}
                    <div className="mx-auto h-6 w-3/4 rounded bg-slate-200" />

                    {/* Program */}
                    <div className="mx-auto mt-3 h-4 w-full rounded bg-slate-200" />
                    <div className="mx-auto mt-2 h-4 w-4/5 rounded bg-slate-200" />

                    {/* Session */}
                    <div className="mx-auto mt-5 h-8 w-32 rounded-full bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pagination */}
      <section className="pb-20">
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="h-10 w-10 rounded-full bg-slate-200"
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default AlumniSkeleton;