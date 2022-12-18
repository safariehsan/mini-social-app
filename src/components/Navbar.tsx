import { Link } from "react-router-dom";
import { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Spinner } from "./Spinner";
import AppLogo from "../assets/images/logo.png";

const Navbar = () => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const signUserOut = async () => {
    await signOut(auth);
    navigate("/login");
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src={AppLogo} alt="logo" width={40} />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-between"
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <Link className="nav-link" to="/">
                Home{" "}
              </Link>
            </li>
            {loading ? (
              <li className="nav-item">
                <Spinner />
              </li>
            ) : !user ? (
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/new-post">
                  New Post
                </Link>
              </li>
            )}
          </ul>
          <span className="navbar-text">
            {loading ? (
              <Spinner />
            ) : user ? (
              <>
                <Link to="/profile" className="no-underline">
                  <img width={20} src={user?.photoURL || ""} />{" "}
                  {user?.displayName}{" "}
                </Link>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={signUserOut}
                >
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-power"
                      viewBox="0 0 16 16"
                    >
                      <path d="M7.5 1v7h1V1h-1z" />
                      <path d="M3 8.812a4.999 4.999 0 0 1 2.578-4.375l-.485-.874A6 6 0 1 0 11 3.616l-.501.865A5 5 0 1 1 3 8.812z" />
                    </svg>{" "}
                    <span>Log Out</span>
                  </>
                </button>
              </>
            ) : (
              <>
                <span>Guest </span>
                <Link to="/login">Login</Link>
              </>
            )}
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
