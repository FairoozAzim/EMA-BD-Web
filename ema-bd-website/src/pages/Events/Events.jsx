import EventCard from '../../components/EventsPage/EventCard';

import './Events.css'

import { useLoaderData } from 'react-router-dom';

const Events = () => {

const events = useLoaderData();
// Function to convert date string from "dd/mm/yyyy" to a Date object
const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split('/');
    return new Date(year, month - 1, day);
  };

  // Get today's date without time
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Sorting events by date
  events.sort((a, b) => parseDate(b.date) - parseDate(a.date));
  // Separate upcoming and past events
  const upcomingEvents = events.filter(event => parseDate(event.date) >= today);
  const pastEvents = events.filter(event => parseDate(event.date) < today);
  
  // Sorting events by date (upcoming events ascending, past events descending)
  upcomingEvents.sort((a, b) => parseDate(a.date) - parseDate(b.date));
  pastEvents.sort((a, b) => parseDate(b.date) - parseDate(a.date));
  

    return (
        <div className='mt'>
            {
                events.map(event => (
                    <EventCard
                     key = {event.id}
                     event_details={event}
                    />
                ))}
        </div>

    );
};

export default Events;