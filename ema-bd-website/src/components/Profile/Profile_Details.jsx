import { useLoaderData, useParams } from "react-router-dom";
import { FaFacebookF, FaLinkedinIn, FaUniversity } from 'react-icons/fa';
import { GiGraduateCap } from "react-icons/gi";
import { CiLink } from "react-icons/ci";
import { TbCalendarClock } from "react-icons/tb";

const Profile_Details = () => {
    let {designation } = useParams();
    
   const profile = useLoaderData();
   
    if (designation === 'alumni')
        {

     
    const {About, Email, FBLink, LinkedIn, Name, OtherLink, ProgramName, Session, UniName, ID, Image} = profile.data;
    const demoImageUrl = `http://localhost:5000/uploads/avatar.jpg`;
    const imageUrl =`http://localhost:5000/uploads/${ID}.jpg`;
    return (
        
        <div className="mt">
           <div className="profile-details-container">
      <div className="d-flex profile-details">
      <div className="prof-details-img">
          {Image ? (
               <img src={imageUrl} alt={Name}></img>
              ) : (
                 <img src={demoImageUrl} alt="Demo Image"></img>
               )}
          </div>
           <div className="profile-details-info">
           <h2>{Name}</h2>
            <p><GiGraduateCap className="icon"/> Program: {ProgramName}</p>
            <p><TbCalendarClock className="icon"/> Session: {Session}</p>
            <p><FaUniversity className="icon"/> Institutes: {UniName}</p>
           </div>
      </div>
      <hr className="header-divider"></hr>
            <div className="profile-about d-flex">
            <div className="about-text">
            <h3>About Me</h3>
            <pre>{About}</pre>
            </div>
            
           <div className="about-contact">
            <h3>Contact Details</h3>
            <p>Email Address: <a href={Email}>{Email}</a></p> 
            
           <div className="profile-socials">
           <a href={FBLink}><FaFacebookF /></a>
            <a href={LinkedIn}><FaLinkedinIn /></a>
            <a href={OtherLink}><CiLink /></a>
           </div>
           </div>
            </div>
           </div>


        </div>
    );
}
  else if (designation === 'team')
    {
          
    const{linkedIn, url, name, position, email, about} = profile.data;
    return (
        
        <div className="mt">
           <div className="profile-details-container">
      <div className="d-flex profile-details">
      <div className="prof-details-img">
      <img src={`http://localhost:5000/uploads/${url}`} alt={name}></img>
          </div>
           <div className="profile-details-info">
           <h2>{name}</h2>
           <p>{position}</p>
            {/* <p><GiGraduateCap className="icon"/> Program: {ProgramName}</p>
            <p><TbCalendarClock className="icon"/> Session: {Session}</p>
            <p><FaUniversity className="icon"/> Institutes: {UniName}</p> */}
           </div>
      </div>
      <hr className="hr"></hr>
            <div className="profile-about d-flex">
            <div className="about-text">
            <h3>About Me</h3>
            <pre>{about}</pre> 
            </div>
            
           <div className="about-contact">
            <h3>Contact Details</h3>
            <p>Email Address: <a href={email}>{email}</a></p> 
            
           <div className="profile-socials">
           
            <a href={linkedIn}><FaLinkedinIn /></a>
            {/* <a href={OtherLink}><CiLink /></a> */}
           </div>
           </div>
            </div>
           </div>


        </div>
    );
    }
    return null;
};

export default Profile_Details;