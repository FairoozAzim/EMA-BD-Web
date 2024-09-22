import { Link } from 'react-router-dom';
import Charles from '../../Assets/images/Charles.jpeg';
import Slider from '../../components/Slider/Slider';
import './AboutPage.css'

const AboutPage = () => {
    return (
        <div className="mt">
            <h1 className="section-header">About EMA-BD</h1>
            <p className='about-details'>EMA BD (Erasmus Mundus Association Bangladesh) is an independent and non-profit association managed by the EMA Country Representatives for Bangladesh along with other active Bangladeshi volunteers. Our mission is to foster educational and cultural exchange, enhance professional development, and build a strong network of Erasmus Mundus alumni and students in Bangladesh.</p>
            <div className="mt-10 keynote-ch">
                <h1 className='section-header'>Keynote from the Ambassador of EU Delegation</h1>
               <div className='d-flex'>
              <div className='person-img'>
              <img src={Charles}></img>
              </div>
              <div className='person-spch'>
                <p className='about-details'>Dear members of the Erasmus Mundus Association-Bangladesh (EMA-BD),
                 It is with great pleasure and enthusiasm that I address you today on the transformative power 
                 of Erasmus+ educational opportunities and cross-cultural exchange... </p>
                 <button className='btn-red'> <Link to='/keynote'>Read More</Link></button>
               </div>
              
               </div>
            </div>
    
          <div className='d-flex about-vision'>
            <div className="mt-10 vision">

           <h1 className="section-header">Our Vision</h1>
           <p className='about-details'>Our vision is to become a leading organization that empowers Bangladeshi students and alumni through education, collaboration, and community building, contributing to the socio-economic development of Bangladesh.</p>
            </div>
            <div className="mt-10 mission">
                <h1 className="section-header">Our Mission</h1>
                <p className='about-'>The mission of EMA BD is to: 
                    <ul>
                        <li>Promote the Erasmus Mundus program in Bangladesh.</li>
                        <li>Support current and prospective students through guidance and mentorship.</li>
                        <li>Facilitate professional networking and career development opportunities for alumni.</li>
                        <li>Foster a sense of community among Erasmus Mundus scholars and alumni in Bangladesh.</li>
                    </ul>
                </p>
            </div>
            </div>
            <div className='mt-10 about-slider'>
                <h1 className='text-center'>Insights from our leaders</h1>
                <Slider></Slider>
             
            </div>
           
        
            <div className="mt-10">
                <h1 className="section-header">Our Goals</h1>
                <p className='about-details'>
                    <ul>
                        <li>Increase awareness and participation in the Erasmus Mundus program.</li>
                        <li>Provide a robust support system for Erasmus Mundus students and alumni.</li>
                        <li>Organize events and activities that enhance professional and personal growth.</li>
                        <li>Strengthen the network of Bangladeshi Erasmus Mundus scholars and alumni.</li>
                    </ul>
                </p>
            </div>
         
        </div>
    );
};

export default AboutPage;