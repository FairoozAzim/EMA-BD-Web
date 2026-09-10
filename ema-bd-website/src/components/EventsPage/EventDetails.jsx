import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const EventDetails = () => {
  const { eventId } = useParams();

  // Fetch all events to determine previous/next navigation
  const { data: events = [] } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/events`);
      if (!res.ok) throw new Error("Failed to fetch events");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  // Find the current event and compute prev/next indexes
  const currentIndex = events.findIndex((e) => (e._id || e.id) === eventId);
  const eventData = events[currentIndex];

  // Assuming your events list is sorted, prev is the previous item in array, next is the following
  // (Adjust index logic if your array order is reversed)
  const prevEvent = currentIndex > 0 ? events[currentIndex - 1] : null;
  const nextEvent =
    currentIndex < events.length - 1 && currentIndex !== -1
      ? events[currentIndex + 1]
      : null;

  const prevId = prevEvent?._id || prevEvent?.id;
  const nextId = nextEvent?._id || nextEvent?.id;

  if (!eventData) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-slate-500 text-lg">Event details not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Banner / Poster Image */}
        {eventData.banner && (
          <div className="w-full bg-slate-900 flex justify-center items-center overflow-hidden">
            <img
              src={`http://localhost:5001/uploads/${eventData.banner}`}
              alt={eventData.title}
              className="w-full h-auto max-h-[600px] object-contain"
            />
          </div>
        )}

        {/* Content Container */}
        <div className="p-6 sm:p-10 md:p-12">
          {/* Date & Time Badge */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {eventData.date && (
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-[#0F2A5F]">
                📅 {eventData.date}
              </span>
            )}
            {eventData.time && (
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                ⏰ {eventData.time}
              </span>
            )}
            {eventData.org && (
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                Hosted by {eventData.org}
              </span>
            )}
          </div>

          {/* Event Title */}
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-6 leading-tight">
            {eventData.title}
          </h1>

          {/* Description Section */}
          <div className="border-t border-slate-100 pt-6 mt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              About This Event
            </h3>
            <div className="text-slate-600 text-base leading-relaxed whitespace-pre-wrap font-sans">
              {eventData.desc || eventData.description}
            </div>
          </div>

          {/* Previous / Next Event Footer Navigation */}
          {(prevId || nextId) && (
            <div className="border-t border-slate-100 pt-8 mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="w-full sm:flex-1">
                {prevId && (
                  <Link
                    to={`/events/${prevId}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 sm:py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    &larr; Previous Event
                  </Link>
                )}
              </div>

              <div className="w-full sm:flex-1 flex justify-end">
                {nextId && (
                  <Link
                    to={`/events/${nextId}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 sm:py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Next Event &rarr;
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
