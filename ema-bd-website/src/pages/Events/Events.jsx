import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import EventCard from "../../components/EventsPage/EventCard";
import ErrorPage from "../Error/Error";
import EventSkeleton from "../../components/ui/EventSkeleton";

const Events = () => {
  const [activeTab, setActiveTab] = useState("upcoming");

  // Fetch events using TanStack Query
  const {
    data: events = [],
    isLoading,
    error,
  } = useQuery({
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
  const { upcomingEvents, pastEvents } = useMemo(() => {
    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split("/");
      return new Date(year, month - 1, day);
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = [];
    const past = [];

    for (const event of events) {
      const eventDate = parseDate(event.date);
      if (eventDate >= today) {
        upcoming.push(event);
      } else {
        past.push(event);
      }
    }

    upcoming.sort((a, b) => parseDate(a.date) - parseDate(b.date));
    past.sort((a, b) => parseDate(b.date) - parseDate(a.date));

    return { upcomingEvents: upcoming, pastEvents: past };
  }, [events]);

  if (isLoading) {
    return <EventSkeleton />;
  }

  if (error) {
    return <ErrorPage error={error.message} />;
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="text-center">
        <h1 className="mt-4 md:mt-[60px] text-3xl font-semibold tracking-tight text-[#0F2A5F] md:text-5xl">
          Our Events
        </h1>
        <p className="mx-auto text-xs md:text-base mt-4 max-w-2xl text-slate-600">
          Explore upcoming workshops, webinars, and community meetups organized
          by EMA Bangladesh.
        </p>
      </div>

      {/* Tabs for toggling between Upcoming and Past Events */}
      <div className="flex justify-center border-b border-slate-200 my-10 overflow-x-auto px-4">
        <div className="flex space-x-6 sm:space-x-12 whitespace-nowrap">
          <button
            className={`pb-4 text-sm sm:text-base font-semibold transition-all relative cursor-pointer ${
              activeTab === "upcoming"
                ? "text-[#0F2A5F]"
                : "text-slate-400 hover:text-slate-600"
            }`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming Events
            <span
              className={`ml-2 px-2 py-0.5 text-xs rounded-full ${activeTab === "upcoming" ? "bg-[#0F2A5F]/10 text-[#0F2A5F]" : "bg-slate-100 text-slate-500"}`}
            >
              {upcomingEvents.length}
            </span>
            {activeTab === "upcoming" && (
              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#0F2A5F] rounded-t-full" />
            )}
          </button>

          <button
            className={`pb-4 text-sm sm:text-base font-semibold transition-all relative cursor-pointer ${
              activeTab === "past"
                ? "text-[#0F2A5F]"
                : "text-slate-400 hover:text-slate-600"
            }`}
            onClick={() => setActiveTab("past")}
          >
            Past Events
            <span
              className={`ml-2 px-2 py-0.5 text-xs rounded-full ${activeTab === "past" ? "bg-[#0F2A5F]/10 text-[#0F2A5F]" : "bg-slate-100 text-slate-500"}`}
            >
              {pastEvents.length}
            </span>
            {activeTab === "past" && (
              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#0F2A5F] rounded-t-full" />
            )}
          </button>
        </div>
      </div>

      {/* Conditional rendering for Full-Width Layout */}
      {activeTab === "upcoming" ? (
        <div className="events-container mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold mb-6 text-slate-900">
            Events Coming Up!
          </h2>
          {upcomingEvents.length > 0 ? (
            <div className="flex flex-col gap-6">
              {upcomingEvents.map((event) => (
                <div key={event._id || event.id} className="w-full">
                  <EventCard event_details={event} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-100 shadow-sm">
              <p className="text-slate-500">
                No upcoming events right now. Check back soon!
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="events-container mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold mb-6 text-slate-900">
            Previous Events
          </h2>
          {pastEvents.length > 0 ? (
            <div className="flex flex-col gap-6">
              {pastEvents.map((event) => (
                <div key={event._id || event.id} className="w-full">
                  <EventCard event_details={event} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-100 shadow-sm">
              <p className="text-slate-500">No past events found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Events;
