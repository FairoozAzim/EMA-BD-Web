import { useContext } from "react";

import { Navigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";

const ProtectedRoute = ({children}) => {
    const {isLoggedIn} = useContext(AuthContext)
    if(isLoggedIn)
        {
            return children
        }
    return <Navigate to ='/login'></Navigate>
};

export default ProtectedRoute;