import { Link } from 'react-router-dom';
import './Footer.css';
import Newsletter from '../../../components/HomePage/Newsletter/Newsletter';
function Footer() {
  return (
    <footer className='mt'>
      <div className="footer-content">
        <Newsletter></Newsletter>
        <p className='mt rights'>© EMA BD 2024. All rights reserved.</p>
        <ul className="footer-links">
          <li><Link to='/terms'>Terms of Service</Link></li>
          <li><Link to="/privacy">Privacy Policy</Link></li>
          <li><Link to='/contact'>Contact Us</Link></li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;