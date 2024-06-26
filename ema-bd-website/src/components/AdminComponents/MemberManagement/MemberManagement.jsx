import { useEffect, useState } from 'react'

import './MemberManagement.css'


const MemberManagement = () => {

  const [members, setMembers] = useState([]);

  useEffect(() =>{
    fetch('http://localhost:5000/members')
    .then(res => res.json())
    .then(data => setMembers(data));
 
  }, [])
    // console.log(members);
  return (

        <div>
            <h3>List of current members</h3>
           <div className='team-wrapper'>
           <table className='event-table'>
            <thead>
                    <tr>

                       <td>Image</td>
                       <td>Name</td>
                       <td>Position</td>
                
                   </tr>
            </thead>
            <tbody>
                {
                    members.map((team) => 
                        <tr key={team._id}>
                            <td className='item-img'><img src={`http://localhost:5000/uploads/${team.url}`}></img></td>
                            <td>{team.name}</td>
                            <td>{team.position}</td>
                        
                        </tr>
                        
                    )
                }
            </tbody>
            </table>
           </div>
        </div>
    );
};

export default MemberManagement;