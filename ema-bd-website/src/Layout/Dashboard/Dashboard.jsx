import { NavLink, Outlet, useNavigate } from "react-router-dom";

import './Dashboard.css'
import { FaHome } from "react-icons/fa";
import { GrNotes } from "react-icons/gr";
import { MdDashboard, MdEvent } from "react-icons/md";
import { AiOutlineLogout } from "react-icons/ai";
import { RiMenu2Line, RiTeamLine } from "react-icons/ri";
import { PiStudentFill } from "react-icons/pi";
import { useContext, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";

const Dashboard = () => {
   const {role, logout} = useContext(AuthContext);
   const navigate = useNavigate();

   const [dashboardActive, setDashboardActive] = useState(false);

   //navigating according to admin roles
   const navigationLinks = [
      { to: '/dashboard/manageEvents', text: 'Events', Icon: MdEvent, roles: ['SuperAdmin', 'Monitor', 'EventManager'] },
      { to: '/dashboard/manageBlogs', text: 'Blogs', Icon: GrNotes, roles: ['SuperAdmin', 'Monitor'] },
      { to: '/dashboard/manageAlumni', text: 'Students', Icon: PiStudentFill, roles: ['SuperAdmin', 'Monitor', 'StudentManager'] },
      { to: '/dashboard/manageMembers', text: 'Members', Icon:RiTeamLine, roles: ['SuperAdmin', 'Monitor'] },
      
    ];

    //checking if admin's role list include any of the allowed roles
    const hasAllowedRole = (allowedRoles) => {
      return role.some(r => allowedRoles.includes(r));
    };
 
    //to toggle navbar in mobile view
   const toggleMobileNav = () => {
   
     setDashboardActive(!dashboardActive);
     console.log(dashboardActive);
   }

   const removeActive = () => {
      setDashboardActive(false);
   }

     // Function to handle logout
    const handleLogout = () => {
     removeActive();
     logout(); // Clear authentication state
     navigate('/login'); // Redirect to login page after logout
   };
    return (
        <div className="d-flex">
         <div className="sidebar-menu-icon" onClick={() => toggleMobileNav()}>
         <RiMenu2Line />
         </div>
            <div className={`sidebar ${dashboardActive ? 'menu-show' : 'menu-hide'}`}>
              <ul className="side-menu">
               
                 <li onClick={removeActive} className="menu-item"><NavLink to ='/dashboard/adminHome'>
                 <div className="item-div">
                  <MdDashboard className="icon" />
                  <p>Dashboard</p>
                 </div>
                 </NavLink>
                 </li>
                {navigationLinks.map((link, index) => {
                       // Check if the current role is allowed to see the link
                       if (hasAllowedRole(link.roles)) {
                         return (
                           <li key={index} onClick={removeActive} className="menu-item">
                             <NavLink to={link.to}>
                               <div className="item-div">
                                <link.Icon className="icon"/>
                               <p>{link.text}</p>
                               </div>
                             </NavLink>
                           </li>
                         );
                       } else {
                         return null; // Don't render the link if the role is not allowed
                       }
                  })}
               
                 <li onClick={() => handleLogout()} className="menu-item"><NavLink to = '/logout'>
                 <div className="item-div">
                   <AiOutlineLogout className="icon"/>
                   <p> Logout </p>
                 </div>
                  </NavLink>
                 </li>
                 <hr className="divider"></hr>
                 <li onClick={removeActive} className="mt menu-item"><NavLink to='/'>
                  <div className="item-div">
                  <FaHome className="icon"/>
                   <p>Home Page</p> 
                  </div>
                    </NavLink>
                 </li>
              </ul>
            </div>
            <div className="contents">
                <Outlet></Outlet>
            </div>
        </div>
    );
};

export default Dashboard;