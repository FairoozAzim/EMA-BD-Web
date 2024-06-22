
import './Newsletter.css';
const Newsletter = () => {
    return (
        <div className="mt">
            <div className="newsletter">
             <h1 className="section-header text-center">Subscribe to EMA-BD &apos;s Newsletter</h1>
             <div className="d-flex email-box mt-5">
              <input type='email' placeholder='Enter Your Email'></input>
              <button className='btn-blue'>Subscribe</button>
             </div>
            </div>
        </div>
    );
};

export default Newsletter;