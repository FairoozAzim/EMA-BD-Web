import About from '../../components/HomePage/About/About';
import Banner from '../../components/HomePage/Banner/Banner';
import Upcoming_events from '../../components/HomePage/Events/Upcoming_events';
import HomeAlumni from '../../components/HomePage/HomeAlumni/HomeAlumni';
import HomeFaq from '../../components/HomePage/HomeFaq/HomeFaq';
import HomeTeam from '../../components/HomePage/HomeTeam/HomeTeam';


const Home = () => {
    return (
      <>
       <Banner/>
       <About/>
       <HomeTeam/>
       <HomeAlumni/>
       <HomeFaq/>
       <Upcoming_events/>
      </>
    );
};

export default Home;