import { FaLinkedinIn } from "react-icons/fa";
import './Profile.css'
import { Link } from "react-router-dom";
// import { useEffect, useState } from "react";

const Profile = ({designation, data}) => {

   // const {ID} = data;
 
   // const [imageUrl, setImageUrl] = useState('');
   // const [imageExists, setImageExists] = useState(true); // Assume image exists by default

   // useEffect(() => {
     
   //    const url_al = `http://localhost:5000/uploads/${ID}.jpg`
      
  
   //    // Check if image exists
   //    fetch(url_al, { method: 'HEAD' })
   //      .then(response => {
   //        if (response.ok) {
   //          setImageUrl(url_al); // Image exists
   //        } else {
   //          setImageExists(false); // Image does not exist
   //        }
   //      })
   //      .catch(() => {
   //        setImageExists(false); // Network error or other issues
   //      });
   //  }, [Name]); // Run effect whenever Name changes

   if (designation === 'team')
   {
   const {_id, linkedIn, url, name, position} = data
   
    return (
        <div className="gallery-item">
         <div className="profile-info">
         <div className='item-img'>
              <img src={`http://localhost:5000/uploads/${url}`}></img>
              <div className='view-details'>
               <a href={linkedIn} className='details-link' target="_blank" rel="noopener noreferrer"><FaLinkedinIn></FaLinkedinIn></a>
            </div>
            </div>
            

            <p className='item-name'>{name}</p>
            <small className='item-pos'>{position}</small>
         </div>
            <Link to =  {`/profile/${_id}/${designation}`} className='details-btn'>View Details</Link>

         </div>
    );
   }
   else if (designation === 'alumni')
      {
         const {ID,_id, Name, ProgramName,LinkedIn,Image } = data
         console.log(ID, Image);
         const demoImageUrl = `http://localhost:5000/uploads/avatar.jpg`;
         const url =  `http://localhost:5000/uploads/${ID}.jpg`; 
        console.log(url);
         return (
            <div className="gallery-item">
             <div className="profile-info">
             <div className='item-img'>
             {Image ? (
               <img src={url} alt={Name}></img>
              ) : (
                 <img src={demoImageUrl} alt="Demo Image"></img>
               )}
                  <div className='view-details'>
                   <a href={LinkedIn} className='details-link' target="_blank" rel="noopener noreferrer"><FaLinkedinIn></FaLinkedinIn></a>
                </div>
                </div>
                
    
                <p className='item-name'>{Name}</p>
                <small className='item-pos'>{ProgramName}</small>
             </div>
                <Link to = {`/profile/${_id}/${designation}`} className='details-btn'>View Details</Link>
    
             </div>
        );
      }
   return null
};

export default Profile;
