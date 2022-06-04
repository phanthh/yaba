import { Link } from "react-router-dom";
import useAuth from "../auth/hooks/useAuth";

const Header: React.FC = () => {
  const { isLogin, username, logout } = useAuth();
  return (
    <div className="header">
      <h1 className="header-title">YABA</h1>
      <h4 className="header-subtitle">Yet Another Blog App</h4>
      <ul className="navbar">
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/">Blog</Link>
        </li>
        {isLogin ? (
          <>
            <li>
              <Link to="/profile">{`@${username}`}</Link>
            </li>
            <li>
              <button
                className="logout-button"
                onClick={() => {
                  if (window.confirm("Are you sure you want to logout ?")) {
                    logout();
                  }
                }}
              >
                Log out
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Log in</Link>
            </li>
            <li>
              <Link to="/signup">Sign up</Link>
            </li>
          </>
        )}
      </ul>
      <p className="header-subtile"></p>
    </div>
  );
};

export default Header;
