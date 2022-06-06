import { useContext, useMemo } from "react";
import { Theme, ThemeContext, ThemeState } from "../context/themeContext";

const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used in an ThemeProvider!");
  }

  const { state, setState } = useMemo(() => context, [context]);
  const themed = (className: string) => {
    switch (state.theme) {
      case "light": {
        return className;
      }
      case "dark": {
        return className + " dark";
      }
      case "nord": {
        return className + " nord";
      }
    }
  };

  const setTheme = (theme: Theme) => {
    const newState: ThemeState = { theme };
    window.localStorage.setItem("themeState", JSON.stringify(newState));
    setState({ theme });
  };

  return { themed, setTheme, theme: state.theme };
};

export default useTheme;
