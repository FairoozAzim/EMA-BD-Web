import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import Profile from "../../Profile/Profile";
import Pagination from "../../Pagination/Pagination";

const AlumniManagement = () => {
    const alumni = useLoaderData(); 
    console.log(alumni)
    
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

export default AlumniManagement;