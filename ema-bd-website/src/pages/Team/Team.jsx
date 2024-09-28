// import Profile from '../../components/Profile/Profile'
// import { useLoaderData } from 'react-router-dom'
// import './Team.css'


// const Team = () => {
 
//    const team = useLoaderData();
//    const teamArray = [];
//    const leadArray = [];


// // Iterate over the members array and separate the members
//  team.forEach(member => {
//    if (member.position == ("Country Representative") || member.position == ("Deputy Country Representative")) {
//       leadArray.push(member);
//    } else {
//        teamArray.push(member);
//    }
// }); 
// leadArray.sort((a) => a.position === "Country Representative" ? -1 : 1);
// teamArray.sort((a, b) => {
//    if (a.position.startsWith('Coordinator') && b.position.startsWith('Deputy Coordinator')) {
//        return -1; // a comes before b
//    } else if (a.position.startsWith('Deputy Coordinator') && b.position.startsWith('Coordinator')) {
//        return 1; // b comes before a
//    } else {
//        return 0; // maintain the order if both are the same level
//    }
// });
   
//    console.log(teamArray)
//     return (
//         <div className="mt">
//         <h1 className="section-header text-center">Our Team (2024)</h1>

//         <div className="team-gallery">
//            <div className="leaders">
//               <div className="d-flex leaders-row">
//               {
//                  leadArray.map((lead, index) => (
//                   <Profile 
//                   key = {index}
//                   designation = "team"
//                   data = {lead}
//                 />
//     ))}
               
//               </div>
//            </div>
//            <div className='grid-container'>
//               <div className='team-grid'>
//                 {
//                    teamArray.map((member, index) => (
//                       <Profile
//                         key={index}
//                         designation = "team"
//                         data= {member}
                       
//                       /> 
//                    )) }
//               </div>
//            </div>
//         </div>
//     </div>
//     );
// };

// export default Team;
import Profile from '../../components/Profile/Profile';
import { useLoaderData } from 'react-router-dom';
import { useState } from 'react';
import './Team.css';

const Team = () => {
  const team = useLoaderData();

  // Extract years from the team data
  const years = [...new Set(team.map(member => member.year))]; // Get unique years
  const [selectedYear, setSelectedYear] = useState("2024"); // Default to 2024 or current year

  const teamArray = [];
  const leadArray = [];

  // Filter team based on the selected year
  const filteredTeam = team.filter(member => member.year === selectedYear);

  // Iterate over the filtered team and separate the members
  filteredTeam.forEach(member => {
    if (member.position === "Country Representative" || member.position === "Deputy Country Representative") {
      leadArray.push(member);
    } else {
      teamArray.push(member);
    }
  });

  // Sort the leaders and team members
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

  // Handle year change
  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  return (
    <div className="mt">
      <h1 className="section-header text-center">Our Team ({selectedYear})</h1>

      {/* Dropdown for selecting the year */}
      <div className="year-selector text-center">
        <label htmlFor="year">Select Year: </label>
        <select id="year" value={selectedYear} onChange={handleYearChange}>
          {years.map((year, index) => (
            <option key={index} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="team-gallery">
        <div className="leaders">
          <div className="d-flex leaders-row">
            {leadArray.map((lead, index) => (
              <Profile 
                key={index}
                designation="team"
                data={lead}
              />
            ))}
          </div>
        </div>

        <div className="grid-container">
          <div className="team-grid">
            {teamArray.map((member, index) => (
              <Profile
                key={index}
                designation="team"
                data={member}
              /> 
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
