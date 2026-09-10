import { Link } from "react-router-dom";

const EventCard = ({ event_details }) => {
  let description = event_details.description;
  if (description && description.length > 100) {
    description = description.slice(0, 100) + "...";
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col md:flex-row items-stretch w-full">
      
      {/* Left Side: Event Text Details */}
      <div className="p-6 md:p-8 flex flex-col justify-between flex-grow">
        <div>
          {/* Date & Time Badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-[#0F2A5F]">
              📅 {event_details.date}
            </span>
            {event_details.time && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-600">
                ⏰ {event_details.time}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 leading-snug">
            {event_details.title}
          </h3>

          {/* Organizer */}
          {event_details.org && (
            <p className="text-xs md:text-sm font-medium text-slate-500 mb-3">
              Organized by <span className="text-slate-700">{event_details.org}</span>
            </p>
          )}

          {/* Description */}
          {description && (
            <p className="text-sm text-slate-600 line-clamp-2 mb-4">
              {description}
            </p>
          )}
        </div>

        {/* View Details Button */}
        <div>
          <Link 
            to={`/events/${event_details._id || event_details.id}`} 
            className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-[#0F2A5F] hover:bg-[#15387a] rounded-xl transition-colors shadow-sm"
          >
            View Details &rarr;
          </Link>
        </div>
      </div>

      {/* Right Side: Event Banner / Poster */}
      {event_details.banner && (
        <div className="md:w-72 lg:w-80 flex-shrink-0 bg-slate-100 flex items-center justify-center overflow-hidden border-t md:border-t-0 md:border-l border-slate-100">
          <img 
            src={`http://localhost:5001/uploads/${event_details.banner}`} 
            alt={event_details.title}
            className="w-full h-48 md:h-full object-cover hover:scale-105 transition-transform duration-500" 
          />
        </div>
      )}

    </div>
  );
};

export default EventCard;