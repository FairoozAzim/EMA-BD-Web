import About from "../../components/HomePage/About/About";
import Banner from "../../components/HomePage/Banner/Banner";
import Upcoming_events from "../../components/HomePage/Events/Upcoming_events";
import HomeAlumni from "../../components/HomePage/HomeAlumni/HomeAlumni";
import HomeBlogs from "../../components/HomePage/HomeBlogs/HomeBlogs";
import HomeFaq from "../../components/HomePage/HomeFaq/HomeFaq";
import HomeTeam from "../../components/HomePage/HomeTeam/HomeTeam";

const Home = () => {
  return (
    <>
      <Banner />
      <About />
      <HomeTeam />
      <HomeAlumni />
      <Upcoming_events />
      <HomeBlogs />
      <HomeFaq />
    </>
  );
};

export default Home;
