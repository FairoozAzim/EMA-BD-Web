import { Outlet } from "react-router-dom";
import Footer from "../pages/Shared/Footer/Footer";
import Header from "../pages/Shared/Header/Header";
import ScrollToTop from "../utils/ScrollToTop";

const Main = () => {
  return (
    <div>
      <ScrollToTop></ScrollToTop>
      <Header></Header>
      <div className="pt-[80px]">
        <Outlet></Outlet>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Main;
