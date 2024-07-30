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
  
  // Sorting events by date
  events.sort((a, b) => parseDate(b.date) - parseDate(a.date));
  
  console.log(events);

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