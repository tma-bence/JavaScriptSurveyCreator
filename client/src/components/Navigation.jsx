import Logout from "./auth/Logout";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Navigation() {
    const { loggedIn } = useSelector((state) => state.auth);
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <Link className="navbar-brand" style={{ marginLeft: "10px" }} to="/">Surveys</Link>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {
              loggedIn ?
              <>
                <li className="nav-item">
                  <Link to="/profile" className="nav-link">Profile</Link>
                </li>
                <li className="nav-item">
                  <Link to="/mysurveys" className="nav-link">Surveys</Link>
                </li>
                <li className="nav-item">
                  <Logout />
                </li>
              </>
              :
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">Login</Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link">Register</Link>
                </li>
              </>
            }
          </ul>
        </nav>
    );
};