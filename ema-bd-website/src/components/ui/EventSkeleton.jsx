const EventSkeletonItem = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 flex flex-col md:flex-row items-stretch w-full animate-pulse gap-6">
      {/* Left side text placeholders */}
      <div className="flex flex-col justify-between flex-grow space-y-4">
        <div className="space-y-3">
          {/* Date badge skeleton */}
          <div className="h-6 w-32 bg-slate-200 rounded-full"></div>
          {/* Title skeleton */}
          <div className="h-7 w-3/4 bg-slate-200 rounded-lg"></div>
          {/* Organizer skeleton */}
          <div className="h-4 w-1/2 bg-slate-200 rounded-md"></div>
          {/* Description lines */}
          <div className="space-y-2 pt-2">
            <div className="h-4 w-full bg-slate-100 rounded"></div>
            <div className="h-4 w-5/6 bg-slate-100 rounded"></div>
          </div>
        </div>
        {/* Button skeleton */}
        <div className="h-10 w-32 bg-slate-200 rounded-xl"></div>
      </div>

      {/* Right side banner image placeholder */}
      <div className="md:w-72 lg:w-80 h-48 md:h-auto bg-slate-200 rounded-xl flex-shrink-0"></div>
    </div>
  );
};

const EventSkeleton = () => {
  return (
    <div className="min-h-screen pb-20 max-w-4xl mx-auto px-4 mt-14">
      {/* Header Skeleton */}
      <div className="text-center space-y-4 mb-10">
        <div className="h-10 w-48 bg-slate-200 rounded-lg mx-auto"></div>
        <div className="h-4 w-96 bg-slate-100 rounded-md mx-auto"></div>
      </div>

      {/* Tabs Skeleton */}
      <div className="flex justify-center gap-12 border-b border-slate-200 pb-4 mb-10">
        <div className="h-6 w-32 bg-slate-200 rounded"></div>
        <div className="h-6 w-32 bg-slate-200 rounded"></div>
      </div>

      {/* Skeleton Cards Feed */}
      <div className="flex flex-col gap-6">
        <EventSkeletonItem />
        <EventSkeletonItem />
        <EventSkeletonItem />
      </div>
    </div>
  );
};

export default EventSkeleton;