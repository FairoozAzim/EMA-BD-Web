import Profile from '../../components/Profile/Profile'
import { useLoaderData } from 'react-router-dom'
import './Team.css'


const Team = () => {
 
   const team = useLoaderData();
   const teamArray = team.slice(2);
   const leadArray = team.slice(0,2);
   
   
    return (
        <div className="mt">
        <h1 className="section-header text-center">Our Team (2024)</h1>

        <div className="team-gallery">
           <div className="leaders">
              <div className="d-flex leaders-row">
              {
                 leadArray.map((lead, index) => (
                  <Profile 
                  key = {index}
                  url = {lead.url}
                  name = {lead.name}
                  position = {lead.position}
                />
    ))}
               
              </div>
           </div>
           <div className='grid-container'>
              <div className='team-grid'>
                {
                   teamArray.slice(2).map((member, index) => (
                      <Profile
                        key={index}
                        api= {member}
                        id = {member._id}
                        profile={member.linkedIn}
                        url = {member.url}
                        name = {member.name}
                        position = {member.position}
                      /> 
                   )) }
              </div>
           </div>
        </div>
    </div>
    );
};

export default Team;