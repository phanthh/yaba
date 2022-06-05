import { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { fetcher } from "../../../utils/fetcher";
import {
  AuthContext,
  authStateSchema,
  initialState,
} from "../context/authContext";

const useAuth = () => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  if (context === undefined) {
    throw new Error("useAuth must be used in an AuthProvider!");
  }

  const { state, setState } = useMemo(() => context, [context]);

  const isLogin = state.id !== -1;

  const login = (info: { email: string; password: string }) => {
    fetcher("/api/login", {
      method: "POST",
      schema: authStateSchema,
      body: info,
    }).then((data) => {
      window.localStorage.setItem("authState", JSON.stringify(data));
      navigate("/");
      setState(data);
    });
  };

  const logout = (redirect = "/") => {
    window.localStorage.removeItem("authState");
    setState(initialState);
    navigate(redirect);
  };

  return { ...state, isLogin, login, logout };
};

export default useAuth;
