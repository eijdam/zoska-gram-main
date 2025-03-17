'use client';

import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { createTheme, ThemeOptions } from '@mui/material/styles';
import { ReactNode, useState, useMemo, useEffect, createContext, useContext } from 'react';

// Extend the Palette interface to include custom colors
declare module '@mui/material/styles' {
  interface Palette {
    blue: Palette['primary'];
  }
  interface PaletteOptions {
    blue?: PaletteOptions['primary'];
  }
}

interface ColorModeContextType {
  toggleColorMode: () => void;
  mode: 'light' | 'dark';
}

const ColorModeContext = createContext<ColorModeContextType>({
  toggleColorMode: () => {},
  mode: 'light',
});

export const useColorMode = () => useContext(ColorModeContext);

const getThemeOptions = (mode: 'light' | 'dark'): ThemeOptions => ({
  palette: {
    mode,
    primary: {
      main: mode === 'light' ? '#1976d2' : '#0d47a1',
    },
    blue: {
      main: mode === 'light' ? '#1976d2' : '#0d47a1',
    },
    background: {
      default: mode === 'light' ? '#ffffff' : '#121212',
      paper: mode === 'light' ? '#f5f5f5' : '#1e1e1e',
    },
    text: {
      primary: mode === 'light' ? '#000000' : '#ffffff',
      secondary: mode === 'light' ? '#555555' : '#bbbbbb',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    allVariants: {
      color: mode === 'light' ? '#000000' : '#ffffff',
    },
    h1: { color: mode === 'light' ? '#000000' : '#ffffff' },
    h2: { color: mode === 'light' ? '#000000' : '#ffffff' },
    h3: { color: mode === 'light' ? '#000000' : '#ffffff' },
    h4: { color: '#000000' },
    h5: { color: mode === 'light' ? '#000000' : '#ffffff' },
    h6: { color: mode === 'light' ? '#000000' : '#ffffff' },
    body1: { color: mode === 'light' ? '#000000' : '#ffffff' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        'p': {
          color: mode === 'light' ? '#000000 !important' : '#ffffff !important',
        },
      },
    },
  },
});

type ThemeProviderProps = {
  children: ReactNode;
};

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [isClient, setIsClient] = useState(false);
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    setIsClient(true);
    const savedMode = localStorage.getItem('theme-mode');
    if (savedMode === 'light' || savedMode === 'dark') {
      setMode(savedMode);
    }
  }, []);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          localStorage.setItem('theme-mode', newMode);
          return newMode;
        });
      },
      mode,
    }),
    [mode]
  );

  const themeOptions = useMemo(() => createTheme(getThemeOptions(mode)), [mode]);

  if (!isClient) {
    return <>{children}</>;
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={themeOptions}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ColorModeContext.Provider>
  );
}
