import { useState, useEffect } from "react"; 
import EventCard from '../../EventsPage/EventCard' 
import './Upcoming.css' 
 
const Upcoming_events = () => { 
 
    const [events, setEvents] = useState([]); 
     
    useEffect(() => { 
        fetch('http://localhost:5000/events') 
        .then(res => res.json()) 
        .then(data => setEvents(data)); 
    }, []); 
 
    console.log(events); 
 
    // Function to convert date string from "dd/mm/yyyy" to a Date object 
    const parseDate = (dateStr) => { 
        const [day, month, year] = dateStr.split('/'); 
        return new Date(year, month - 1, day); 
    }; 
 
    // Get today's date without time part 
    const today = new Date(); 
    today.setHours(0, 0, 0, 0); 
 
    // Filter and sort events by date 
    const futureEvents = events 
        .filter(event => parseDate(event.date) >= today) 
        .sort((a, b) => parseDate(a.date) - parseDate(b.date)); 
 
    console.log("future", futureEvents); 
 
    return ( 
        <div className="mt-10"> 
            <div className="upcoming-events"> 
                <h1 className="section-header text-center">Upcoming Events</h1> 
                {futureEvents.length > 0  
                    ? futureEvents.map(event => ( 
                        <EventCard 
                            key={event.id} 
                            event_details={event} 
                        /> 
                      )) 
                    : <p className='text-center'>There are no upcoming events yet</p> 
                } 
            </div> 
        </div> 
    ); 
}; 
 
export default Upcoming_events;