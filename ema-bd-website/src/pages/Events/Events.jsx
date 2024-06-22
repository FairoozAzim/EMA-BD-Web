import EventCard from '../../components/EventsPage/EventCard';

import './Events.css'

import { useLoaderData } from 'react-router-dom';

const Events = () => {

const events = useLoaderData();

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