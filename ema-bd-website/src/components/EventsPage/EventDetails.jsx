import { Link, useLoaderData } from "react-router-dom";


const EventDetails = () => {
   const responseData = useLoaderData();
   
   console.log("event data", responseData.event);
   const eventData = responseData.event;
   const prevId = responseData.links.prev_id;
   const nextId = responseData.links.next_id;

  
    return (
        <div className="mt">
            <h1 className="text-center">{eventData.title}</h1>
           
            <div className="event-img">
            <img src={`http://localhost:5000/uploads/${eventData.banner}`}></img>
            </div>
          <div className="event-desc">
          <span>{eventData.date} {eventData.time}</span>
            <pre>{eventData.desc}</pre>
            <div className="event-footer d-flex">
               <Link className={` ${(prevId) ? 'show' : 'hide'}`} to ={`/events/${prevId}`}>Previous Event</Link> 
               <Link className={` ${(nextId) ? 'show' : 'hide'}`} to ={`/events/${nextId}`}>Next Event</Link> 
            </div>
          </div>
          
        </div>
    );
};

export default EventDetails;