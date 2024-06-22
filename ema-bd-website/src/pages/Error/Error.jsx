import { Link, useRouteError } from "react-router-dom";
import './Error.css'

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="error-page" id="error-page">
      <div>
      <h1 className="section-header">Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <button className="btn-red"><Link to='/'>Return to Home</Link></button>
      </div>
    
    </div>
  );
}