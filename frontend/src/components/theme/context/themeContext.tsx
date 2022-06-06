import React, { createContext, useEffect, useMemo, useState } from "react";
import { InferType, mixed, object } from "yup";

export type Theme = "light" | "dark" | "nord";

export const themeStateSchema = object({
  theme: mixed<Theme>().oneOf(["light", "dark", "nord"]).required(),
});

export type ThemeState = InferType<typeof themeStateSchema>;

type ThemeContextState = {
  state: ThemeState;
  setState: React.Dispatch<React.SetStateAction<ThemeState>>;
};

type ThemeProviderProps = {
  readonly children: React.ReactNode;
};

export const ThemeContext = createContext<ThemeContextState | undefined>(
  undefined
);

export const initialState: ThemeState = { theme: "light" };

export const ThemeProivder: React.FC<ThemeProviderProps> = ({ children }) => {
  const [state, setState] = useState<ThemeState>(initialState);
  const value = useMemo(() => ({ state, setState }), [state]);

  useEffect(() => {
    const state = window.localStorage.getItem("themeState");
    if (state !== null) {
      themeStateSchema
        .validate(JSON.parse(state))
        .then((themeState) => setState(themeState));
    }
  }, []);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
