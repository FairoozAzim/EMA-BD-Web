import { Link, useLoaderData } from "react-router-dom";
import ev1 from '../../Assets/images/event1.png';

const EventDetails = () => {
   const responseData = useLoaderData();
   const eventData = responseData.filtered_data;
   console.log(eventData);
   const prevId = responseData.prev_id;
   const nextId = responseData.next_id;
   console.log(responseData);
  
    return (
        <div className="mt">
            <h1 className="text-center">{eventData.title}</h1>
           
            <div className="event-img">
            <img src={ev1}></img>
            </div>
          <div className="event-desc">
          <span>{eventData.date} {eventData.time}</span>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus alias, aspernatur, voluptatem deserunt iusto quasi soluta quia ea commodi repudiandae maiores non excepturi cupiditate? Vero iure nulla fugiat repellat, repellendus, accusamus obcaecati quidem ex tempora cumque dolorum ea expedita magni quibusdam labore autem officia suscipit. Consequuntur tempora veritatis atque similique deserunt saepe hic officia possimus voluptate non vero ex at suscipit illum alias reprehenderit, repudiandae obcaecati eveniet veniam distinctio temporibus quas ducimus! Blanditiis labore doloremque voluptatem repellendus deleniti, voluptatum repellat libero amet assumenda! Velit ratione ipsum minus! Fugiat, harum, odit distinctio itaque sed commodi perspiciatis magnam atque facere quasi tempora iste fugit perferendis ratione illo, sit dicta? Veniam neque nemo accusantium alias dolorem natus repellendus sed, obcaecati illum consectetur pariatur, libero error earum mollitia, perspiciatis suscipit maxime hic quos deserunt porro reprehenderit provident magnam voluptatum eius! Assumenda illo quibusdam tempora nisi ducimus autem ut vel et voluptates suscipit quia, similique aliquam illum exercitationem magnam sed earum ad eos impedit ipsam quis! Laudantium quo vero nemo quae eveniet, neque similique fugit quas, voluptates unde mollitia recusandae inventore laborum, doloribus et tenetur voluptate! Eveniet ut nulla fugit commodi veritatis eum modi porro error iusto, explicabo eligendi tempora facilis nihil, inventore assumenda mollitia.</p>
             <button className="btn-red">Add to Calendar</button>
            <div className="event-footer d-flex">
               <Link className={` ${(prevId) ? 'show' : 'hide'}`} to ={`/events/${prevId}`}>Previous Event</Link> 
               <Link className={` ${(nextId) ? 'show' : 'hide'}`} to ={`/events/${nextId}`}>Next Event</Link> 
            </div>
          </div>
          
        </div>
    );
};

export default EventDetails;