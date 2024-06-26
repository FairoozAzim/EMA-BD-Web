import { FaLinkedinIn } from "react-icons/fa";
import './Profile.css'
import { Link } from "react-router-dom";

const Profile = ({api, id, profile, url, name, position}) => {
   
    return (
        <div className="gallery-item">
         <div className="profile-info">
         <div className='item-img'>
              <img src={`http://localhost:5000/uploads/${url}`}></img>
              <div className='view-details'>
               <a href={profile} className='details-link'><FaLinkedinIn></FaLinkedinIn></a>
            </div>
            </div>
            

            <p className='item-name'>{name}</p>
            <small className='item-pos'>{position}</small>
         </div>
            <Link to = {`/${api}/${id}`} className='details-btn'>View Details</Link>

         </div>
    );
};

export default Profile;