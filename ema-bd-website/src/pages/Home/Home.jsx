import About from '../../components/HomePage/About/About';
import Banner from '../../components/HomePage/Banner/Banner';
import Upcoming_events from '../../components/HomePage/Events/Upcoming_events';
import Newsletter from '../../components/HomePage/Newsletter/Newsletter';
import './Home.css'


const Home = () => {
    return (
      <>
       <Banner/>
       <About/>
       <Upcoming_events/>
       <Newsletter/>
      </>
    );
};

export default Home;