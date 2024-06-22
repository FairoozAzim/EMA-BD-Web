import { useContext } from 'react';
import { AuthContext } from '../../providers/AuthProvider';
import './Login.css';
import { useNavigate } from 'react-router-dom';



const Login = () => {
  const {login, setRole} = useContext(AuthContext)
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    // console.log(email,password);
    fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
      .then(res => res.json())
      .then(data => {
        if(data.email)
          {
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            login();
            // console.log(data.role);
            setRole(data.role);
            navigate('/dashboard'); 
            
          }
      })
      .catch((error)=> {
        console.log(error.message);
      })
  };

  return (
  <div className='container'>
  <div className="mt login-container">
    <h3 className='text-center'>Welcome Admin!</h3>
    <p className='text-center'>Please login to access the dashboard.</p>
      <form onSubmit={handleSubmit}>
     <div className='login-form'>
     <input
        name="email"
        type="text"
        placeholder="Email"
       
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        
      />
       <button type="submit">Login</button>
     </div>
     
    </form>
  </div>
  </div>
  );
};

export default Login;
