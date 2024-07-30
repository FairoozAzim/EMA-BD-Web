import { useState } from 'react';
// import Avatar from '../../Assets/members/avatar.jpg';
import Profile from '../../components/Profile/Profile';
import { useLoaderData } from 'react-router-dom';
import './Alumni.css';
import Pagination from '../../components/Pagination/Pagination';


const Alumni = () => {
  const alumni = useLoaderData(); 
  alumni.sort((a, b) => a.Name.localeCompare(b.Name));
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
      <h1 className='section-header text-center'>Student and Alumni</h1>
      <div className='mt-5 team-grid'>
        {currentAlumni.map((alumni, index) => (
          <Profile
            key={index}
            designation = "alumni"
            data = {alumni} 
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
