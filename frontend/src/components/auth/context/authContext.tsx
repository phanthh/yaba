import React, { createContext, useEffect, useMemo, useState } from "react";
import { string, number, InferType, object } from "yup";

export const authStateSchema = object({
  token: string().required(),
  username: string().required(),
  email: string().email().required(),
  id: number().integer().positive().required(),
});

export type AuthState = InferType<typeof authStateSchema>;

type AuthContextState = {
  state: AuthState;
  setState: React.Dispatch<React.SetStateAction<AuthState>>;
};

type AuthProviderProps = {
  readonly children: React.ReactNode;
};

export const AuthContext = createContext<AuthContextState | undefined>(
  undefined
);

export const initialState = { token: "", username: "", email: "", id: -1 };

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);
  const value = useMemo(() => ({ state, setState }), [state]);

  useEffect(() => {
    const state = window.localStorage.getItem("authState");
    if (state !== null) {
      authStateSchema
        .validate(JSON.parse(state))
        .then((authState) => setState(authState));
    }
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
