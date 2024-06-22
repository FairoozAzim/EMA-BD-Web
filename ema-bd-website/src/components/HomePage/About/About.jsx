import logo1 from '../../../Assets/images/home-logo1.png'
import logo2 from '../../../Assets/images/home-logo2.png'
import logo3 from '../../../Assets/images/home-logo3.png'
import logo4 from '../../../Assets/images/home-logo4.png'
import './About.css'

const About = () => {
    return (
      <div className='mt-10 about-wrapper'>
        <div className="d-flex about-section">
            <div className="logo-gallery">
             <div className='grid-item'>
                <a href="https://www.em-a.eu/membership">
             <img src={logo1}></img>
             </a>
             </div>
              <div className='grid-item' >
                <a href="https://www.em-a.eu/">
              <img src={logo2}></img>
              </a>
              </div>
              <div className='grid-item'>
                <a href='https://www.eacea.ec.europa.eu/scholarships/erasmus-mundus-catalogue_en'>
              <img src={logo3}></img>
              </a>
              </div>
              <div className='grid-item'>
              <a href='https://marie-sklodowska-curie-actions.ec.europa.eu/'>
              <img  src={logo4}></img>
             </a>
              </div>
            </div>
            <div className='about-right'>
                <h1 className="section-header montserrat">About Us</h1>
                <p className="mt-5"> Over <span>24000</span> students have taken part in Erasmus Mundus courses. Over <span>12000</span> of them are EMA members!</p>
                <button className='mt-10 btn-red montserrat'>Learn More</button>
            </div>
        </div>
        </div>
    );
};

export default About;