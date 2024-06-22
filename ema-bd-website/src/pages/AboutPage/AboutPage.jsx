import Slider from '../../components/Slider/Slider';

import './AboutPage.css'

const AboutPage = () => {
    return (
        <div className="mt">
            <h1 className="section-header">About EMA-BD</h1>
            <p className='about-details'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta est quaerat, cum debitis a nostrum sit id expedita facere deleniti repudiandae, minima cumque perferendis sapiente eos at omnis voluptatem. Nemo doloremque aspernatur sint et ipsum dolor, minima aliquid exercitationem neque magnam ex beatae minus magni dolorum at corrupti eaque? Blanditiis aliquam odit alias accusantium animi unde eos fugit, suscipit facere delectus sint, ducimus ex a officiis quod non esse eum nulla porro quas! Quia ipsum perferendis at deleniti omnis magnam nemo facere provident rerum? Architecto, consectetur quis blanditiis molestias dolor aperiam. Molestiae ullam quisquam qui perspiciatis atque dicta deserunt minima?</p>
            <div className='mt-10 about-slider'>
                <Slider></Slider>
             
            </div>
            <div className="mt-10">

           <h1 className="section-header">Our Vision</h1>
           <p className='about-details'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim aliquam, consectetur, recusandae accusamus exercitationem aliquid quae veritatis ea dolorum facere distinctio? Voluptas vero, sed nobis perspiciatis, ab iusto nisi fuga odio quia, praesentium dolorem. Soluta at sapiente provident veniam distinctio praesentium, repellendus officia dicta laborum perspiciatis est itaque saepe dolore.</p>
            </div>
            <div className="mt-10">
                <h1 className="section-header">Our Goals</h1>
                <p className='about-details'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nobis voluptate sunt ducimus placeat rerum consectetur corporis, animi aliquam pariatur earum illo sint ipsum officia nam beatae ullam culpa reprehenderit asperiores quisquam molestiae! Praesentium enim eaque voluptatibus est nobis nesciunt cumque. Nemo labore et neque ex blanditiis ducimus nesciunt alias excepturi.</p>
            </div>
         
        </div>
    );
};

export default AboutPage;