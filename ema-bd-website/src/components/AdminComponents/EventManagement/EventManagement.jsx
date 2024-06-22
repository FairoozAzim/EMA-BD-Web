import { MdDelete, MdOutlineFileUpload } from 'react-icons/md';
import { useEffect, useState } from 'react';
import DatePicker from "react-datepicker";


import Modal from '../../Modal/Modal';
// import ev1 from '../../../Assets/images/event1.png';
// import ev2 from '../../../Assets/images/event2.jpg';

import './EventManagement.css'
import "react-datepicker/dist/react-datepicker.css";

const EventManagement = () => {
    
const [isOpen, setIsOpen] = useState(false);
const [image, setImage] = useState(null);
const [fileName, setFileName] = useState([]);
const [events, setEvents] = useState([]);
const [startDate, setStartDate] = useState(new Date());
const [time, setTime] = useState("")
 const today = new Date();
// console.log("time", time);
// console.log(events);
const openModal = () => {
  setIsOpen(true);
};

const closeModal = () => {
  setIsOpen(false);
};

const getTime = (time) => {
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  
  // Format the time as hh:mm:ss
  const formattedTime = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  return formattedTime;
}

 useEffect(() =>{
   fetch('http://localhost:5000/events')
   .then(res => res.json())
   .then(data => setEvents(data));

 }, [])
 

const handleImageUpload = event => {
  console.log(event.target.files);
  setImage(URL.createObjectURL(event.target.files[0]));
  setFileName(event.target.files[0]);
  console.log(image);
}

 const handleAddEvent = event => {
  event.preventDefault();
  let formData = new FormData()
  const form = event.target;
  const newEvent = {
    "title": form.title.value,
    "date" :  startDate.toLocaleDateString('en-GB'),
    "time" : getTime(time),
    "place" : form.place.value,
    "link" : form.link.value,
    "org" : form.org.value,
    "banner" :fileName,
    "desc" : form.eventDesc.value
  }
  for (const key in newEvent){
    formData.append(key, newEvent[key]);
  }
 
  console.log(fileName);
  fetch("http://localhost:5000/events", {
    method: 'POST',
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    console.log('post response', data);
    const addNewEvent = [...events, data];
    setEvents[addNewEvent];
    setImage(null);
    form.reset();
    setIsOpen(false);


  })
 }

 const handleDeleteEvent = id =>{
   console.log(id);
   fetch(`http://localhost:5000/events/${id}`,{
    method: 'DELETE'
   } )
   .then(res => res.json())
   .then(data => {
    console.log(data);
    if(data.deletedCount > 0)
      {
        alert("Deleted Successfully!");
      }
   })
 }

    return (
        <div>
            <div className='d-flex event-header'>
            
            <div className='upcoming-event'>
            <h2>Upcoming Events</h2>
            <p>No Upcoming Events</p>
            </div>
            <button className='create-btn btn-red event-btn' onClick={openModal}>Create an Event</button>
            <Modal isOpen={isOpen} onClose={closeModal}>
                   <h3 className='text-center'>Create an Event</h3>
                   <form className='create-form' onSubmit={handleAddEvent}>
                     <div className='form-content'>
                      <input name='title' type='text' placeholder='Event Title'></input>
                     <div className='d-flex double-input'>
                     {/* <input name='date' type='text' placeholder='Event Date'> */}
                      <DatePicker className='date-time-input' name='date' selected={startDate} onChange={(date) => setStartDate(date)} placeholderText='Event Date' minDate={today}></DatePicker>
                     {/* </input> */}
                    <DatePicker 
                     className='date-time-input' 
                     name='time'
                     selected={time} 
                     onChange={(time) => setTime(time)}
                     placeholderText='Event Time' 
                     showTimeSelect
                     showTimeSelectOnly
                     timeIntervals={15}
                     timeCaption="Time"
                     dateFormat="h:mm aa" ></DatePicker>
                     </div>
                     <div className='d-flex double-input'>
                     <input name='place' type='text' placeholder='Place of Event'></input>
                     <input name='org' type='text' placeholder='Partner Organization'></input>
                     </div>
                    <input name='link' type='text' placeholder='Joining Link/ Registration Link'></input>
                    <div className='image-input-container'>
                    <input name='banner' type='file' id='banner' className='event-banner' placeholder='Event Banner' hidden onChange={handleImageUpload}
                     ></input>
                    
                    {
                      image ?
                      <div className='banner-img-container'>
                      <img className='banner-img' src={image} accept="image/*"></img>
                      <button className='delete-img' onClick={() => setImage(null)}>Clear Image</button>
                      </div>
                      : 
                      <label className='banner-label' htmlFor='banner'>
                       <MdOutlineFileUpload className='icon'/>
                      Choose a banner</label>
                     
                    }
                    
                    </div>
                    <textarea name='eventDesc' type='text' placeholder='Description' rows={10}></textarea>
                    <button className='submit btn-submit' type='submit'>Submit</button>
                     </div>
                     
                   </form>
                 </Modal>
            </div>
           
            <div className='event-wrapper'>
            <h2 className='text-center'>Past Events</h2>
            <table className='event-table'>
            <thead>
                    <tr>
                       <td>Event Title</td>
                       <td>Date</td>
                       <td>Action</td>
                   </tr>
            </thead>
            <tbody>
                {
                    events.map(event => 
                        <tr key={event._id}>
                            <td>{event.title}</td>
                            <td>{event.date}</td>
                            <td className='text-center'>
                              <button className='delete-btn' onClick={() => handleDeleteEvent(event._id)}><MdDelete /></button></td>
                        </tr>
                        
                    )
                }
            </tbody>
            </table>
            </div>

        </div>
    );
};

export default EventManagement;