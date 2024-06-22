import { useState } from 'react';
// import Avatar from '../../Assets/members/avatar.jpg';
import Profile from '../../components/Profile/Profile';
import { useLoaderData } from 'react-router-dom';
import './Alumni.css';
import Pagination from '../../components/Pagination/Pagination';

// const alumniList = [];
// for (let i = 0; i < 5; i++) {
//   alumniList.push({ url: Avatar, name: "John Doe", subject: "EMJM ABC" });
// }

const Alumni = () => {
  const alumni = useLoaderData(); // Assuming this provides your alumni data
  // console.log(alumni)
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9); // Number of items to display per page

  // Calculate index of the first and last item of current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAlumni = alumni.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className='mt alumnus-grid'>
      <h1 className='section-header text-center'>Year 2022</h1>
      <div className='mt-5 team-grid'>
        {currentAlumni.map((member, index) => (
          <Profile
            key={index}
            name={member.Name} // Assuming your alumni data has 'name'
            position={member.Session} // Assuming your alumni data has 'subject'
          />
        ))}
      </div>
      {/* Pagination controls */}
      <Pagination
        
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={alumni.length}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Alumni;
