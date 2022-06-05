import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./components/auth/context/authContext";
import Container from "./components/layout/Container";
import About from "./components/pages/about/About";
import Blog from "./components/pages/blog/Blog";
import Login from "./components/pages/login/Login";
import Profile from "./components/pages/profile/Profile";
import Signup from "./components/pages/signup/Signup";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Container>
          <Routes>
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile/*" element={<Profile />} />
            <Route path="/" element={<Blog />} />
          </Routes>
        </Container>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
