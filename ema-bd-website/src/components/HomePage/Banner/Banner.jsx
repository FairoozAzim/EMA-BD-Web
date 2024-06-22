import React, { useState, useEffect } from 'react';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import Image1 from '../../../Assets/images/Slider2.jpg';
import Image2 from '../../../Assets/images/Slider1.jpg';
import Image3 from '../../../Assets/images/slider4.jpg';

import './Banner.css';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';

const Banner = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = [Image1, Image2, Image3];

    const nextSlide = () => {
        setCurrentSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
    };

    const prevSlide = () => {
        setCurrentSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
    };

    useEffect(() => {
        const intervalId = setInterval(nextSlide, 5000); // Change slide every 5 seconds
        return () => clearInterval(intervalId); // Clean up the interval on component unmount
    }, [currentSlide]); // Re-run effect whenever currentSlide changes

    return (
        <div className="banner-wrapper">
            <div className="banner">
                <div className="slider">
                    <img src={slides[currentSlide]} alt={`Slide ${currentSlide + 1}`} />
                
                </div>
                <div className='overlay'></div>
                <div className='banner-text'>
                    <h1 className="banner-header montserrat">Erasmus Mundus Association Bangladesh</h1>
                    <p>EMA is the Erasmus Mundus Students and Alumni Association. EMA was founded in 2008 and is registered as an AISBL non-profit organization. Our aims are to help EMJMD students and alumni promote higher education and be a go-to network for our Alumni across the world.</p>
                </div>
            </div>
            <div className='contact-bar'>
                <div className='socials'>
                    <a href='https://www.facebook.com/groups/105556129476392'><FaFacebookF /></a>
                    <a href='https://www.facebook.com/ErasmusMundusAssociation.Bangladesh'><FaLinkedinIn /></a>
                    <a href='https://www.facebook.com/ErasmusMundusAssociation.Bangladesh'><FaInstagram /></a>
                </div>
            </div>
        </div>
    );
};

export default Banner;
