
import Slider from '../../components/Slider/Slider';
import SupportIcon from '../../Assets/support-logo.png'
import PromoteIcon from '../../Assets/promote-logo.png'
import NetworkIcon from '../../Assets/network-logo.png'
import CommunityIcon from '../../Assets/community-icon.png'
import './AboutPage.css'

const AboutPage = () => {
    return (
        <div className="mt">
            <h1 className="section-header">About EMA-BD</h1>
            <div className='header-text'>EMA BD (Erasmus Mundus Association Bangladesh) is an independent and non-profit association managed by the EMA Country Representatives for Bangladesh along with other active Bangladeshi volunteers. Our mission is to foster educational and cultural exchange, enhance professional development, and build a strong network of Erasmus Mundus alumni and students in Bangladesh.</div>

            <div className="mt-10 mission">
                <h1 className="text-center">Our Mission and Vision</h1>
                <p className='about-details'>Our vision is to become a leading organization that empowers Bangladeshi students and alumni through education, collaboration, and community building, contributing to the socio-economic development of Bangladesh.</p>
                    <ul className='d-flex mission-list'>
                        <li className='item-1'>
                            <div className='icon-container'>
                            <img className='icon' src={PromoteIcon}/>
                            </div>
                            Promote the Erasmus Mundus program in Bangladesh</li>
                        <li className='item-2'>
                        <div className='icon-container'>
                            <img className='icon' src={SupportIcon}/>
                        </div>
                        Support current and prospective students through guidance and mentorship</li>
                        <li className='item-3'>
                        <div className='icon-container'>
                            <img className='icon' src={NetworkIcon}/>
                        </div>
                            Facilitate professional networking and career development opportunities for alumni</li>
                        <li className='item-4'>
                        <div className='icon-container'>
                            <img className='icon' src={CommunityIcon}/>
                        </div>
                            Foster a sense of community among Erasmus Mundus scholars and alumni in Bangladesh</li>
                    </ul>
               
            </div>
           
            <div className='mt-10 about-slider'>
                <h1 className='text-center'>Insights from our leaders</h1>
                <Slider></Slider>
             
            </div>
        
         
        </div>
    );
};

export default AboutPage;