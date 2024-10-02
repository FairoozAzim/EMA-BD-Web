import { useState } from 'react';
import './Newsletter.css';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Simple email validation function
  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate email input
    if (!email) {
      setError('Email is required');
      setSuccess(false);
      return;
    } else if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      setSuccess(false);
      return;
    }

    // Handle successful submission
    setError(''); // Clear previous errors
    setSuccess(true);
    console.log('Subscribed successfully with email:', email);

    // Clear input field after submission
    setEmail('');
  };

  return (
    <div className="">
        <div className="newsletter">
              <p className="text-center">Subscribe to EMA-BD &apos;s Newsletter</p>
                <form onSubmit={handleSubmit} className="d-flex email-box mt-5">
               <input type='email' placeholder='Enter Your Email'></input>
               <button className='btn-blue'>Subscribe</button>
               </form>
            
             </div>
         </div>
  );
};

export default Newsletter;
