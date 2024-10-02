
import  { useState } from 'react';
import EventCard from '../../components/EventsPage/EventCard';
import { useLoaderData } from 'react-router-dom';

import './Events.css';


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

    // Separate upcoming and past events
    const upcomingEvents = events.filter(event => parseDate(event.date) >= today);
    const pastEvents = events.filter(event => parseDate(event.date) < today);

    // Sorting events by date (upcoming events ascending, past events descending)
    upcomingEvents.sort((a, b) => parseDate(a.date) - parseDate(b.date));
    pastEvents.sort((a, b) => parseDate(b.date) - parseDate(a.date));

    // State to track which tab is active (upcoming or past events)
    const [activeTab, setActiveTab] = useState('upcoming');

    return (
        <div className='mt-10'>
            {/* Tabs for toggling between Upcoming and Past Events */}
            <div className="tabs">
                <button 
                    className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('upcoming')}
                >
                    Upcoming Events
                </button>
                <button 
                    className={`tab ${activeTab === 'past' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('past')}
                >
                    Past Events
                </button>
            </div>

            {/* Conditional rendering based on the active tab */}
            {activeTab === 'upcoming' ? (
                <div className='events-container'>
                    <h2 className='text-center'>Events Coming Up!</h2>
                    {upcomingEvents.length > 0 ? (
                        upcomingEvents.map(event => (
                            <EventCard
                                key={event.id}
                                event_details={event}
                            />
                        ))
                    ) : (
                        <p>No upcoming events.</p>
                    )}
                </div>
            ) : (
                <div className='events-container'>
                    <h2 className='mt-10 text-center'>Previous Events</h2>
                    {pastEvents.length > 0 ? (
                        pastEvents.map(event => (
                            <EventCard
                                key={event.id}
                                event_details={event}
                            />
                        ))
                    ) : (
                        <p>No past events.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Events;
