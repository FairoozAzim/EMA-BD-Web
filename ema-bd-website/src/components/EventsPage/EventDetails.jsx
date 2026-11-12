import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FiArrowLeft } from "react-icons/fi";
import DOMPurify from "dompurify";
import { API_URL, imageUrl, isHtmlContent } from "../../pages/Blogs/BlogUtils";

const EventDetails = () => {
  const { eventId } = useParams();

  const {
    data: events = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/events`);

      if (!res.ok) {
        throw new Error("Failed to fetch events");
      }

      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  // Find current event
  const currentIndex = events.findIndex(
    (event) => String(event._id || event.id) === String(eventId),
  );

  const eventData = events[currentIndex];

  // Previous and next events
  const prevEvent = currentIndex > 0 ? events[currentIndex - 1] : null;

  const nextEvent =
    currentIndex !== -1 && currentIndex < events.length - 1
      ? events[currentIndex + 1]
      : null;

  const prevId = prevEvent?._id || prevEvent?.id;
  const nextId = nextEvent?._id || nextEvent?.id;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-slate-500">Loading event details...</p>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-red-500">
          Failed to load event details. Please try again later.
        </p>
      </div>
    );
  }

  // Not found state
  if (!eventData) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-slate-500 text-lg">Event details not found.</p>

        <Link
          to="/events"
          className="text-[#0F2A5F] font-medium hover:underline"
        >
          Back to Events
        </Link>
      </div>
    );
  }

  const description = eventData.desc || eventData.description || "";
  const isHtml = isHtmlContent(description);

  const sanitizedDescription = DOMPurify.sanitize(description);

  return (
    <div className="max-w-7xl mx-auto min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Back Button */}
      <Link
        to="/events"
        className="mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-[#0F2A5F] transition mb-2 hover:bg-slate-100"
      >
        <FiArrowLeft />
        Back to Events
      </Link>

      <div className="max-w-7xl mx-auto bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Banner Image */}
        {eventData.banner && (
          <div className="w-full bg-slate-900 flex justify-center items-center overflow-hidden">
            <img
              src={imageUrl(eventData.banner)}
              alt={eventData.title || "Event banner"}
              className="w-full h-auto max-h-[600px] object-contain"
            />
          </div>
        )}

        {/* Event Content */}
        <div className="p-6 sm:p-10 md:p-12">
          {/* Date, Time and Organization */}
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

          {/* Description */}
          <div className="border-t border-slate-100 pt-6 mt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              About This Event
            </h3>

            {isHtml ? (
              <article
                className="mt-8 break-words text-sm leading-relaxed text-slate-700 md:mt-10 md:text-base md:leading-8
                  [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4
                  [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-3
                  [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mb-2
                  [&_p]:mb-4
                  [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4
                  [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4
                  [&_li]:mb-1
                  [&_a]:text-blue-600 [&_a]:underline
                  [&_img]:rounded-xl [&_img]:max-w-full [&_img]:h-auto
                  [&_blockquote]:border-l-4 [&_blockquote]:border-slate-300 [&_blockquote]:pl-4 [&_blockquote]:italic"
                dangerouslySetInnerHTML={{
                  __html: sanitizedDescription,
                }}
              />
            ) : (
              <article className="mt-8 whitespace-pre-line break-words text-sm leading-relaxed text-slate-700 md:mt-10 md:text-base md:leading-8">
                {description}
              </article>
            )}
          </div>

          {/* Previous / Next Navigation */}
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
