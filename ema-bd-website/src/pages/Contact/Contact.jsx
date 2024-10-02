// import { useState} from 'react';
// import emailjs from '@emailjs/browser';
// import './Contact.css'



// const Contact = () => {
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [email, setEmail] = useState('');
//   const [message, setMessage] = useState('');
//   const [sent, setSent] = useState(true);
//   const [successMessage, setSuccessMessage] = useState('Email sent successfully!');


//   const sendEmail = (e) => {
//     e.preventDefault()
    

//     const serviceId = 'service_waz13gr';
//     const templateId = 'template_165m7gg';
 

//     const templateParams = {
//       name : firstName + " " + lastName,
//       email : email,
//       to_name: "EMA BD",
//       message: message
//     }
//     // console.log(templateParams);

//     emailjs
//       .send(serviceId, templateId, templateParams, {publicKey: 'user_WQMcSNLI0hjkIK9BzfhAF'})
//       .then(
//         (response) => { 
//           console.log('Email sent successfully!', response);
//           setSent(true);
//           setSuccessMessage("Email sent successfully!");
//           setTimeout(() => {
//             setSent(false);
//           }, 3000);
//           setFirstName('');
//           setLastName('');
//           setEmail('');
//           setMessage('');
//           e.target.reset();
//         })
//         .catch((error) => {
//           console.log('Something went wrong!', error.text);
//           setSent(true);
//           setSuccessMessage("Something went wrong!");
//           setTimeout(() => {
//             setSent(false);
//           }, 3000);
//           e.target.reset();
//         });
        
//   }



//     return (
//         <div className="mt-10">
          
//             <div className="contact-header">
           
//                 <h1 className="section-header text-center montserrat">Contact EMA-BD</h1>
//                 <p className="text-center">If you have any questions, please check the <i>Frequently Asked Questions </i> page first. If you can&#39;t, contact us by filling the form below. We will try to get back as soon as possible! </p>
//             </div>
           
//             <div className='contact-form mt-10'>
//             <form  onSubmit={sendEmail}>
//               <div className='d-flex input-wrapper'>
             
//               <div className='contact-left'>
//                 <input 
//                 name='first_name'
//                 type='text' 
//                 placeholder='First Name'
//                 value = {firstName}
//                 onChange={(e) => setFirstName(e.target.value)}
//                 ></input>
//                 <input 
//                 name='last_name' 
//                 type='text' 
//                 placeholder='Last Name'
//                 value={lastName} 
//                 onChange={(e) => setLastName(e.target.value)}
//                 ></input>
//                 <input 
//                 name='user_email' 
//                 type='email' 
//                 placeholder='Email Address'
//                 value={email} 
//                 onChange={(e) => setEmail(e.target.value)}
//                 ></input>
//               </div>
//               <div className='contact-right'>
//                 <textarea 
//                 name='message' 
//                 placeholder='Type your message' 
//                 rows={11} cols={80}
//                 value={message} 
//                 onChange={(e) => setMessage(e.target.value)}
//                 ></textarea>
//               </div>
//               </div>
//             <div className='submit-div'>
//             <button className='btn-submit text-center' type='submit'>Send</button>
//             </div>
//             </form>
//             </div>
//             {sent && successMessage == "success" && (
//                  <div className="toast mt-10">
//                    <p>Email sent successfully!</p>
//                  </div>
//                )}
//             {sent && successMessage == "failed" && (
//                  <div className="toast-failed mt-10">
//                    <p>Something went wrong! Please try again.</p>
//                  </div>
//                )}
            
//         </div>
//     );
// };

// export default Contact;

import { useState } from 'react';
import emailjs from '@emailjs/browser';
import './Contact.css';

const Contact = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let formErrors = {};
    let valid = true;

    // First name validation
    if (!firstName.trim()) {
      formErrors.firstName = 'First name is required';
      valid = false;
    }

    // Last name validation
    if (!lastName.trim()) {
      formErrors.lastName = 'Last name is required';
      valid = false;
    }

    // Email validation
    if (!email.trim()) {
      formErrors.email = 'Email is required';
      valid = false;
    } else {
      // Simple email regex pattern for validation
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        formErrors.email = 'Invalid email address';
        valid = false;
      }
    }

    // Message validation
    if (!message.trim()) {
      formErrors.message = 'Message is required';
      valid = false;
    }

    setErrors(formErrors);
    return valid;
  };

  const sendEmail = (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    const serviceId = 'service_waz13gr';
    const templateId = 'template_165m7gg';

    const templateParams = {
      name: firstName + ' ' + lastName,
      email: email,
      to_name: 'EMA BD',
      message: message,
    };

    emailjs
      .send(serviceId, templateId, templateParams, {
        publicKey: 'user_WQMcSNLI0hjkIK9BzfhAF',
      })
      .then(
        (response) => {
          console.log('Email sent successfully!', response);
          setSent(true);
          setSuccessMessage('success');
          setTimeout(() => {
            setSent(false);
          }, 3000);
          setFirstName('');
          setLastName('');
          setEmail('');
          setMessage('');
          e.target.reset();
        },
        (error) => {
          console.log('Something went wrong!', error.text);
          setSent(true);
          setSuccessMessage('failed');
          setTimeout(() => {
            setSent(false);
          }, 3000);
        }
      );
  };

  return (
    <div className="mt-10">
      <div className="contact-header">
        <h1 className="section-header text-center montserrat">Contact EMA-BD</h1>
        <p className="text-center">
          If you have any questions, please check the <i>Frequently Asked Questions</i> page first. If you can&#39;t find the answer, contact us by filling out the form below. We will try to get back as soon as possible!
        </p>
      </div>

      <div className="contact-form mt-10">
        <form onSubmit={sendEmail}>
          <div className="d-flex input-wrapper">
            <div className="contact-left">
              <input
                name="first_name"
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              {errors.firstName && <span className="error">{errors.firstName}</span>}
              
              <input
                name="last_name"
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              {errors.lastName && <span className="error">{errors.lastName}</span>}

              <input
                name="user_email"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="contact-right">
              <textarea
                name="message"
                placeholder="Type your message"
                rows={11}
                cols={80}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
              {errors.message && <span className="error text-error">{errors.message}</span>}
            </div>
          </div>

          <div className="submit-div">
            <button className="btn-submit text-center" type="submit">
              Send
            </button>
          </div>
        </form>
      </div>

      {sent && successMessage === 'success' && (
        <div className="toast mt-10">
          <p>Email sent successfully!</p>
        </div>
      )}
      {sent && successMessage === 'failed' && (
        <div className="toast-failed mt-10">
          <p>Something went wrong! Please try again.</p>
        </div>
      )}
    </div>
  );
};

export default Contact;
