import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { getThemeConfig } from "@utils/mui-theme.config";
import { CssBaseline } from "@mui/material";

export enum ThemeType {
  LIGHT = "light",
  DARK = "dark",
}

interface ThemeContextType {
  currentTheme: ThemeType;
  changeCurrentTheme: (newTheme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  currentTheme: ThemeType.LIGHT,
  changeCurrentTheme: () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const persistedTheme = localStorage.getItem("theme") as ThemeType | null;
  const [theme, setTheme] = useState<ThemeType>(
    persistedTheme || ThemeType.LIGHT
  );
  const changeCurrentTheme = (newTheme: ThemeType) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.documentElement.classList.add("[&_*]:!transition-none");
    if (theme === ThemeType.LIGHT) {
      document.documentElement.classList.remove(ThemeType.DARK);
      document.documentElement.style.colorScheme = ThemeType.LIGHT;
    } else {
      document.documentElement.classList.add(ThemeType.DARK);
      document.documentElement.style.colorScheme = ThemeType.DARK;
    }

    const transitionTimeout = setTimeout(() => {
      document.documentElement.classList.remove("[&_*]:!transition-none");
    }, 1);

    return () => clearTimeout(transitionTimeout);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ currentTheme: theme, changeCurrentTheme }}>
      <MuiThemeProvider theme={getThemeConfig(theme)}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export const useThemeProvider = () => useContext(ThemeContext);
