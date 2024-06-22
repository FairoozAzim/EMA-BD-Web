
import PR1 from '../../../Assets/members/PR_CR_Tahmida_Shamsuddin.jpeg'
import PR2 from '../../../Assets/members/PR_Fahim_Tahmid.jpg'
import PR3 from '../../../Assets/members/PR_SHARIF_MUTASIM_BILLAH.jpg'
import PM1 from '../../../Assets/members/PM_CR_Md Imran Hossain.jpg'
import PM2 from '../../../Assets/members/PM_Abu_Touhid_Hossain.jpg'
import PM3 from '../../../Assets/members/PM_faysal_ahmed.jpg'
import AS1 from 'D:\\Erasmus Website\\ema-bd-website\\src\\Assets\\members\\Ans_ CR_Fahmida Yeasmin.jpg'
import AS2 from '../../../Assets/members/Ans_Mazharul Islam Sajeeb.jpg'
import As3 from '../../../Assets/members/Ans_Sohana Alam Mim.jpg'
import IT1 from '../../../Assets/members/IT_CR_Sadad_Mahmud.png'
import IT2 from '../../../Assets/members/IT_Abdur_Rahman.jpg'
import IT3 from '../../../Assets/members/IT_Fairooz_Azim.jpg'
import CR1 from '../../../Assets/members/CR_Baker.jpg'
import CR2 from '../../../Assets/members/Deputy_CR_Mahamudul_Hasan_Mredul.jpg'
import PnD1 from '../../../Assets/members/PnD_Arghya_Kamol_Roy.jpg'
import PnD2 from '../../../Assets/members/PnD_Samsoon_Nahar_Shampa.jpg'

import './MemberManagement.css'

const MemberManagement = () => {
    const teams = [
        {
            id: 1,
            url: CR1,
            name: "Sayed Muhammad Baker",
            position: "Country Representative"
        },
        {
            id: 2,
            url: CR2,
            name: "Md Mahmudul Hasan Mredul",
            position: "Deputy Country Representative"
        },
        {
            id: 3,
            url: PM1,
            name: "Md Imran Hossain",
            position: "Coordinator of Event and Project Management"
        },
    
        {
            id: 4,
            url: PnD1,
            name: "Arghya Kamol Roy",
            position: "Coordinator of Planning and Development"
        },
    
          {
            id: 5,
            url: IT1,
            name: "Sadad Mahamud",
            position: "Coordinator of IT and Social Media"
          },
          {
            id: 6,
            url: PR1,
            name: "Tahmida Shamsuddin",
            position: "Coordinator of Public Relation and Students"
          },
          {
            id: 7,
            url: AS1,
            name: "Fahmida Yeasmin",
            position: "Coordinator of Alumni and Students"
          },
          {
            id: 8,
            url: PM3,
            name: "M FAYSAL AHMED",
            position: "Deputy Coordinators of Event and Project Management"
          },
          {
            id: 9,
            url: PnD2,
            name: "Samsoon Nahar Shampa",
            position: "Deputy Coordinator of Planning and Development"
          },
          {
            id: 10,
            url: IT3,
            name: "Fairooz Azim",
            position: "Deputy Coordinator of IT and Social Media"
          },
          {
            id: 11,
            url: PR3,
            name: "Sharif Mutasim Billah",
            position: "Deputy Coordinator of Public Relation"
          },
          {
            id: 12,
            url:  As3,
            name: "Sohana Alam Mim",
            position: "Deputy Coordinator of Alumni and Students"
          },
          {
            id: 13,
            url: PM2,
            name: "Abu Touhid Hossain",
            position: "Deputy Coordinator of Event and Project Management"
          },
          {
            id: 14,
            url: IT2,
            name: "Md Abdur Rahman",
            position: "Deputy Coordinator of IT and Social Media"
          },
          {
            id: 15,
            url: PR2,
            name: "Sk Fahim Tahmid Boni",
            position: "Deputy Coordinator of Public Relation"
          },
          {
            id: 16,
            url:  AS2,
            name: "Mazharul Islam Sajeeb",
            position: "Deputy Coordinator of Alumni and Students"
          },
    ]
    
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
                    teams.map((team) => 
                        <tr key={team.id}>
                            <td className='item-img'><img src={team.url}></img></td>
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