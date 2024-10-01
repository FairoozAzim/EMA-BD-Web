import { Link } from 'react-router-dom';
import logo from '../../../Assets/EMA BD LOGO.png';
import './Header.css';
import { CiMenuFries } from 'react-icons/ci';
import { useState } from 'react';

const Header = () => {
  const [isActive, setIsActive] = useState(false);

  const toggleMobileNav = () => {
    setIsActive(!isActive);
  };

  const removeActive = () => {
    setIsActive(false);
  };

  return (
    <header className='header-wrapper'>
      <div className='header'>
        <div className="logo">
          <Link to='/'><img src={logo} alt="Erasmus Mundus Association - Bangladesh logo" /></Link>
        </div>
        <div className='menu-icon' onClick={toggleMobileNav}>
          <CiMenuFries />
        </div>
        <div className={`nav ${isActive ? 'menu-show' : 'menu-hide'}`}>
          <ul className="nav-list">
            <li onClick={removeActive} className="nav-item montserrat"><Link to='/'>Home</Link></li>
            <li className="nav-item montserrat dropdown-wrapper">
              <Link to='about'>About Us </Link>
              <div className='dropdown'>
                <Link to='/keynoteEud'> Speech from EUD </Link>
                <Link to='/keynoteCR'> Speech from EMA-BD CR</Link>
              </div>
            </li>
            <li onClick={removeActive} className="nav-item montserrat"><Link to='team'>Our Team</Link></li>
            <li onClick={removeActive} className="nav-item montserrat"><Link to='alumni'>Student and Alumni</Link></li>
            <li onClick={removeActive} className="nav-item montserrat"><Link to='events'>Events</Link></li>
            <li onClick={removeActive} className="nav-item montserrat"><Link to='blogs'>Blog</Link></li>
            <li onClick={removeActive} className="nav-item montserrat"><Link to='faq'>FAQ</Link></li>
            <li onClick={removeActive} className="nav-item montserrat"><Link to='contact'>Contact</Link></li>
          </ul>
        </div>
      </div>
      <hr className="header-divider" />
    </header>
  );
};

export default Header;
