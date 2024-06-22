import { createContext, useState } from "react";

// creating a context
export const AuthContext = createContext();


const AuthProvider = ({children}) => {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(()=> {
    const token = localStorage.getItem("token");
    return token !== null;
  });
  const adminRole = localStorage.getItem("role");
  const [role, setRole] = useState([adminRole]);
  console.log(role);

  // useEffect(() => {
  //   // Check if token exists in localStorage
  //   const storedToken = localStorage.getItem('token');
  //   if (storedToken) {
  //     // Validate token on the server (e.g., using an API call)
  //     // If token is valid, setToken(storedToken);
  //     setToken(storedToken);
  //   }
  // }, []);

  const login = () => {
    setIsLoggedIn(true);
    
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('token');
  };

    const authInfo  = {isLoggedIn, login, logout, role, setRole};
    return (
        // set provider with value
        <AuthContext.Provider value={authInfo}>
          {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;