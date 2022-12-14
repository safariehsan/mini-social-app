import { Link } from "react-router-dom";
import { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";

const Navbar = () => {
  const [user, loading] = useAuthState(auth);
  const signUserOut = async () => {
    await signOut(auth);
  };
  return (
    <div className="navbar">
      <div className="links">
        <Link to="/">Home </Link>
        {!user ? (
          <Link to="/login">Login</Link>
        ) : (
          <Link to="/new-post">New Post</Link>
        )}
      </div>
      <div className="profile">
        {loading ? (
          <span>loading...</span>
        ) : user ? (
          <>
            <img width={20} src={user?.photoURL || ""} />
            {user?.displayName}
            <button onClick={signUserOut}>Log Out</button>
          </>
        ) : (
          <>
            <span>Guest</span>
            <Link to="/login">Login</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
