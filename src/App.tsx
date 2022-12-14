import "./styles/App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import NewPost from "./pages/NewPost";
import { Theme } from "./components/Theme";

function App() {
  return (
    <Router>
      <Theme>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/new-post" element={<NewPost />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Theme>
    </Router>
  );
}

export default App;
