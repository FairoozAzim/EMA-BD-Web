import { useState, useEffect } from 'react';
import Profile from '../../components/Profile/Profile';
import { useLoaderData } from 'react-router-dom';
import './Alumni.css';

import Pagination from '../../components/Pagination/Pagination';

const Alumni = () => {
  const alumni = useLoaderData();
  console.log("alumni", alumni);
  //Session , Program Name, Bangladesh University, EMJM universities, EMJM Countries.
  alumni.sort((a, b) => a.Name.localeCompare(b.Name));

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9); // Number of items to display per page

  // State for session filter
  const [session, setSession] = useState('');
  const [program, setProgram] = useState('');
  // const [bdUniversity, setBdUniversity] = useState('');
  const [emjmUniversity, setEmjmUniversity] = useState('');
  // const [emjmCountry, setEmjmCountry] = useState('');



  const [filteredAlumni, setFilteredAlumni] = useState(alumni);

  
  // Effect to filter alumni based on selected session
 // Apply all filters
  useEffect(() => {
    let filtered = alumni;

    if (session) {
      filtered = filtered.filter(a => a.Session === session);
    }
    if (program) {
      filtered = filtered.filter(a => a.ProgramName === program);
    }
    // if (bdUniversity) {
    //   filtered = filtered.filter(a => extractBangladeshUniversity(a.About) === bdUniversity);
    // }
    if (emjmUniversity) {
      filtered = filtered.filter(a => extractUniversities(a.UniName).includes(emjmUniversity));
    }
    // if (emjmCountry) {
    //   filtered = filtered.filter(a => extractCountries(a.UniName).includes(emjmCountry));
    // }

    setFilteredAlumni(filtered);
    setCurrentPage(1); // reset to first page on filter change
  }, [session, program, emjmUniversity, alumni]);
  // Calculate index of the first and last item of current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAlumni = filteredAlumni.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  //Extract university names
 const extractUniversities = (uniName) => {
  if (!uniName) return [];

  return uniName
    .replace(/\d+\.\s*/g, '') // remove "1. ", "2. ", etc.
    .replace(/\s+and\s+/gi, ',') // replace "and" with comma
    .split(/,\s*/) // split by commas
    .map(u => u.trim()) // trim spaces
    .filter(u => u); // remove empty strings
}
  // Get unique sessions
  const sessions = ['2020-2022','2021-2023', '2022-2024', '2023-2025', '2024-2026', '2025-2027'];
  const programs = [...new Set(alumni.map(a => a.ProgramName))];
  // const bdUniversities = [...new Set(alumni.map(a => extractBangladeshUniversity(a.About)))];
  const emjmUniversities = [...new Set(alumni.flatMap(a => extractUniversities(a.UniName)))];
  // const emjmCountries = [...new Set(alumni.flatMap(a => extractCountries(a.UniName)))];
  // console.log(sessions);

  return (
    <div className='alumni-container'>
    <div className='panel-division d-flex'> 
      {/* session selection */}
    <div className='filter-panel mt-5'>
     <div className='d-flex filter-div'>
       <h2>Add Filters</h2>
      <div>
        <button className="clear-button d-flex" onClick={() => {
            setSession('');
            setProgram('');
            setEmjmUniversity('');
          }}>
            Clear Filters
</button>
</div>
      </div>
      <select id="session" onChange={e => setSession(e.target.value)} value={session}>
        <option value="">Select Session</option>
        {sessions.map(sesh => (
          <option key={sesh} value={sesh}>{sesh}</option>
        ))}
      </select>
        {/* Program Name Filter */}
        <select id ="program" onChange={e => setProgram(e.target.value)} value={program}>
          <option value="">Select Program</option>
          {programs.map(p => <option key={p} value={p}>{p}</option>)}
        </select>

         {/* EMJM University Filter */}
        <select id = "emUni" onChange={e => setEmjmUniversity(e.target.value)} value={emjmUniversity}>
          <option value="">Select EMJM University</option>
          {emjmUniversities.map(u => <option key={u} value={u}>{u}</option>)}
        </select>
      </div>
      <div className='main-panel'>
        <h1 className='section-header text-center'>Student and Alumni</h1>
        <div className='team-grid'>
        {currentAlumni.map((alumni, index) => (
          <Profile
            key={index}
            designation="alumni"
            data={alumni}
          />
        ))}
        </div>
      </div>
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

