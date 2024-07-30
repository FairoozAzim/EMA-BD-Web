
import './Newsletter.css';
const Newsletter = () => {
    return (
        <div className="">
            <div className="newsletter">
             <p className="text-center">Subscribe to EMA-BD &apos;s Newsletter</p>
             <div className="d-flex email-box mt-5">
              <input type='email' placeholder='Enter Your Email'></input>
              <button className='btn-blue'>Subscribe</button>
             </div>
            </div>
        </div>
    );
};

export default Newsletter;