import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import NewPost from "./pages/NewPost";
import { Theme } from "./components/Layout";
import Profile from "./pages/Profile";
import { createContext, useState } from "react";

interface AppContextInterface {
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
}

const initialValue = {
  darkMode: false,
  setDarkMode: () => {},
};

export const ThemeContext = createContext<AppContextInterface>(initialValue);

function App() {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  return (
    <Router>
      <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
        <Theme mode={`${darkMode ? "dark" : "light"}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/new-post" element={<NewPost />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Theme>
      </ThemeContext.Provider>
    </Router>
  );
}

export default App;
