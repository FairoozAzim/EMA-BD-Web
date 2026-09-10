/* eslint-disable react/no-unescaped-entities */
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const Upcoming_events = () => {
  // Fetch events using TanStack Query for fast caching and consistency
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/events`);
      if (!res.ok) {
        throw new Error("Failed to fetch events");
      }
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  // Optimize parsing, filtering, and sorting using useMemo
  const futureEvents = useMemo(() => {
    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split("/");
      return new Date(year, month - 1, day);
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return events
      .filter((event) => parseDate(event.date) >= today)
      .sort((a, b) => parseDate(a.date) - parseDate(b.date));
  }, [events]);

  // If loading, don't show a jarring layout shift
  if (isLoading) return null;

  return (
    <section className="bg-slate-50/50 px-6 py-20 sm:px-8 lg:px-12 lg:py-28 border-y border-slate-100">
      <div className="mx-auto max-w-5xl">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-px w-8 bg-[#0F2A5F]" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0F2A5F]">
              What's Next
            </span>
            <span className="h-px w-8 bg-[#0F2A5F]" />
          </div>

          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-[#0F2A5F] md:text-5xl">
            Upcoming Events
          </h2>

          <p className="mt-3 text-sm md:text-base text-slate-600">
            Stay connected with Erasmus Mundus Association Bangladesh through
            our dynamic workshops, information sessions, and community
            gatherings.
          </p>
        </div>

        {/* Events Feed or Empty State */}
        {futureEvents.length > 0 ? (
          <div className="flex flex-col gap-6">
            {futureEvents.map((event) => (
              <div
                key={event._id || event.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row items-stretch gap-6"
              >
                {/* Event Text Details */}
                <div className="flex flex-col justify-between flex-grow">
                  <div>
                    {/* Date & Time Badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-[#0F2A5F]">
                        📅 {event.date}
                      </span>
                      {event.time && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-600">
                          ⏰ {event.time}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                      {event.title}
                    </h3>

                    {/* Organizer */}
                    {event.org && (
                      <p className="text-sm font-medium text-slate-500 mb-4">
                        Organized by{" "}
                        <span className="text-slate-700">{event.org}</span>
                      </p>
                    )}
                  </div>

                  {/* View Details Link */}
                  <div>
                    <Link
                      to={`/events/${event._id || event.id}`}
                      className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-[#0F2A5F] hover:bg-[#15387a] rounded-xl transition-colors shadow-sm"
                    >
                      View Details &rarr;
                    </Link>
                  </div>
                </div>

                {/* Banner Image */}
                {event.banner && (
                  <div className="md:w-72 lg:w-80 flex-shrink-0 bg-slate-100 rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center">
                    <img
                      src={`http://localhost:5001/uploads/${event.banner}`}
                      alt={event.title}
                      className="w-full h-48 md:h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Empty State Card */
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-sm max-w-lg mx-auto">
            <div className="text-4xl mb-3">🗓️</div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              No Upcoming Events Right Now
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              We're planning exciting new sessions and workshops. Check back
              soon or explore our past community events!
            </p>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0F2A5F] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#0b214c] transition-colors"
            >
              Browse Past Events &rarr;
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Upcoming_events;
