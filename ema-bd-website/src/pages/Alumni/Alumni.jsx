// import { useState } from 'react';
// // import Avatar from '../../Assets/members/avatar.jpg';
// import Profile from '../../components/Profile/Profile';
// import { useLoaderData } from 'react-router-dom';
// import './Alumni.css';
// import Pagination from '../../components/Pagination/Pagination';


// const Alumni = () => {
//   const alumni = useLoaderData(); 
//   console.log(" alumni",alumni);
//   alumni.sort((a, b) => a.Name .localeCompare(b.Name));

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(9); // Number of items to display per page

//   // Calculate index of the first and last item of current page
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentAlumni = alumni.slice(indexOfFirstItem, indexOfLastItem);

//   // Change page
//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };


//   return (
//     <div className='mt alumnus-grid'>
//       <h1 className='section-header text-center'>Student and Alumni</h1>
//       {/* <select value={sortCriteria} onChange={handleSortChange}>
//         <option value="name">Sort by Name</option>
//         <option value="date">Sort by Date</option>
//       </select> */}
//       <div className='mt-5 team-grid'>
//         {currentAlumni.map((alumni, index) => (
         
//           <Profile
//             key={index}
//             designation = "alumni"
//             data = {alumni} 
//           />
//         ))}
//       </div>
//       {/* Pagination controls */}
//       <Pagination
        
//         currentPage={currentPage}
//         itemsPerPage={itemsPerPage}
//         totalItems={alumni.length}
//         onPageChange={handlePageChange}
//       />
//     </div>
//   );
// };

// export default Alumni;


/////////////////////////////////////////////////////////////
import { useState, useEffect } from 'react';
import Profile from '../../components/Profile/Profile';
import { useLoaderData } from 'react-router-dom';
import './Alumni.css';
import Pagination from '../../components/Pagination/Pagination';

const Alumni = () => {
  const alumni = useLoaderData();
  console.log("alumni", alumni);
  alumni.sort((a, b) => a.Name.localeCompare(b.Name));

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9); // Number of items to display per page

  // State for session filter
  const [session, setSession] = useState('');
  const [filteredAlumni, setFilteredAlumni] = useState(alumni);

  // Effect to filter alumni based on selected session
  useEffect(() => {
    if (session) {
      setFilteredAlumni(alumni.filter(alumni => alumni.Session === session));
    } else {
      setFilteredAlumni(alumni);
    }
  }, [session, alumni]);

  // Calculate index of the first and last item of current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAlumni = filteredAlumni.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Get unique sessions
  const sessions = ['2020-2022','2021-2023', '2022-2024', '2023-2025', '2024-2026'];
  console.log(sessions);

  return (
    <div className='mt-10 alumnus-grid'>
      <h1 className='section-header text-center'>Student and Alumni</h1>
      {/* session selection */}
    <div className='session-select'>
      <select id="session" onChange={e => setSession(e.target.value)} value={session}>
        <option value="">Select Session</option>
        {sessions.map(sess => (
          <option key={sess} value={sess}>{sess}</option>
        ))}
      </select>
      </div>
      <div className='mt-5 team-grid'>
        {currentAlumni.map((alumni, index) => (
          <Profile
            key={index}
            designation="alumni"
            data={alumni}
          />
        ))}
      </div>
      
      {/* Pagination controls */}
      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={filteredAlumni.length}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Alumni;
