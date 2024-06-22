import { Link } from 'react-router-dom';
import './Footer.css';
function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <p>© 2024 My Website. All rights reserved.</p>
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