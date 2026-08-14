import About from '../../components/HomePage/About/About';
import Banner from '../../components/HomePage/Banner/Banner';
import Upcoming_events from '../../components/HomePage/Events/Upcoming_events';
import HomeTeam from '../../components/HomePage/HomeTeam/HomeTeam';
import './Home.css'


const Home = () => {
    return (
      <>
       <Banner/>
       <About/>
       <HomeTeam/>
       <Upcoming_events/>
      </>
    );
};

export default Home;