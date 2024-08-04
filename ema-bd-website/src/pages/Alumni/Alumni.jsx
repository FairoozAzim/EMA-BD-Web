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
//   const [items, setItems] = useState([alumni]);

  //  const [sortCriteria, setSortCriteria] = useState('name');

//   const handleSortChange = (e) => {
//     setSortCriteria(e.target.value);
//   };
//   const extractYear = (dateString) => {
//     // Extract the first four digits that represent the year
//     const match = dateString.match(/\d{4}/);
//     return match ? parseInt(match[0], 10) : null;
//   };
//   // eslint-disable-next-line no-undef
//   const sortedItems = [...items].sort((a, b) => {
//     if (sortCriteria === 'name') {
//       return a.name.localeCompare(b.name);
//     } else if (sortCriteria === 'date') {
//       return extractYear(a.date) - extractYear(b.date); 
//     }
//     return 0;
//   });
//  console.log("sorted items",sortedItems);
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
      {/* <select value={sortCriteria} onChange={handleSortChange}>
        <option value="name">Sort by Name</option>
        <option value="date">Sort by Date</option>
      </select> */}
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
