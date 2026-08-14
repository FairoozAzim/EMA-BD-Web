import About from '../../components/HomePage/About/About';
import Banner from '../../components/HomePage/Banner/Banner';
import Upcoming_events from '../../components/HomePage/Events/Upcoming_events';
import HomeFaq from '../../components/HomePage/HomeFaq/HomeFaq';
import HomeTeam from '../../components/HomePage/HomeTeam/HomeTeam';
import './Home.css'


const Home = () => {
    return (
      <>
       <Banner/>
       <About/>
       <HomeTeam/>
       <HomeFaq/>
       <Upcoming_events/>
      </>
    );
};

export default Home;