import { auth, provider } from "../config/firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import GoogleLogo from "../assets/images/google_logo.png"

const Login = () => {
  const navigate = useNavigate();
  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, provider);
    console.log(result);
    navigate("/");
  };
  return (
    <div className="d-flex justify-content-center">
      <div className="w-50 text-center">
        <div className="card text-center">
          <div className="card-header"><img src={GoogleLogo} alt="Google Sign In" width={200} /></div>
          <div className="card-body">
            <p className="card-title">In order to access to the posts and create one, please sign in with your Google account</p>
            <button className="btn btn-primary btn-sm" onClick={signInWithGoogle}>Sign in with Google</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
