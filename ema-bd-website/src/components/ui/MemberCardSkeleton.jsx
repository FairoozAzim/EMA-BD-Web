const MemberCardSkeleton = () => {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-1 flex-col items-center p-6">
        {/* Arrow */}
        <div className="absolute right-4 top-4 h-10 w-10 animate-pulse rounded-full bg-slate-200" />

        {/* Avatar */}
        <div className="h-28 w-28 animate-pulse rounded-full bg-slate-200" />

        {/* Name */}
        <div className="mt-6 h-6 w-40 animate-pulse rounded bg-slate-200" />

        {/* Position */}
        <div className="mt-3 h-4 w-32 animate-pulse rounded bg-slate-200" />
      </div>
    </div>
  );
};

export default MemberCardSkeleton;
