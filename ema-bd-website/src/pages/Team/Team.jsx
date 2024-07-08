import Profile from '../../components/Profile/Profile'
import { useLoaderData } from 'react-router-dom'
import './Team.css'


const Team = () => {
 
   const team = useLoaderData();
   const teamArray = [];
   const leadArray = [];


// Iterate over the members array and separate the members
 team.forEach(member => {
   if (member.position == ("Country Representative") || member.position == ("Deputy Country Representative")) {
      leadArray.push(member);
   } else {
       teamArray.push(member);
   }
}); 
leadArray.sort((a) => a.position === "Country Representative" ? -1 : 1);
teamArray.sort((a, b) => {
   if (a.position.startsWith('Coordinator') && b.position.startsWith('Deputy Coordinator')) {
       return -1; // a comes before b
   } else if (a.position.startsWith('Deputy Coordinator') && b.position.startsWith('Coordinator')) {
       return 1; // b comes before a
   } else {
       return 0; // maintain the order if both are the same level
   }
});
   
   console.log(teamArray)
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
                  designation = "team"
                  data = {lead}
                />
    ))}
               
              </div>
           </div>
           <div className='grid-container'>
              <div className='team-grid'>
                {
                   teamArray.map((member, index) => (
                      <Profile
                        key={index}
                        designation = "team"
                        data= {member}
                       
                      /> 
                   )) }
              </div>
           </div>
        </div>
    </div>
    );
};

export default Team;