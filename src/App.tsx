import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import NewPost from "./pages/NewPost";
import { Theme } from "./components/Layout";
import Profile from "./pages/Profile";

function App() {
  return (
    <Router>
      <Theme>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/new-post" element={<NewPost />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Theme>
    </Router>
  );
}

export default App;
