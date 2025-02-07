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

// Update in ThemeProvider

const getThemeOptions = (mode: 'light' | 'dark'): ThemeOptions => ({
  palette: {
    mode,
    primary: {
      main: mode === 'light' ? '#1976d2' : '#0d47a1', // Blue in light, Dark Blue in dark
    },
    blue: {
      main: mode === 'light' ? '#1976d2' : '#0d47a1', // Custom blue for both light and dark mode
    },
    background: {
      default: mode === 'light' ? '#ffffff' : '#121212', // White in light, Dark background in dark
      paper: mode === 'light' ? '#f5f5f5' : '#1e1e1e',
    },
    text: {
      primary: mode === 'light' ? '#000000' : '#ffffff', // Black text in light, White text in dark
      secondary: mode === 'light' ? '#555555' : '#bbbbbb', // Grey text for secondary in both light and dark
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    allVariants: {
      color: mode === 'light' ? '#000000' : '#ffffff', // Black in light, White in dark for text
    },
    h1: { color: mode === 'light' ? '#000000' : '#ffffff' }, // Ensure h1 stays black or white
    h2: { color: mode === 'light' ? '#000000' : '#ffffff' },
    h3: { color: mode === 'light' ? '#000000' : '#ffffff' },
    h4: { color: '#000000' }, // h4 is always black regardless of theme
    h5: { color: mode === 'light' ? '#000000' : '#ffffff' },
    h6: { color: mode === 'light' ? '#000000' : '#ffffff' },
    body1: { color: mode === 'light' ? '#000000' : '#ffffff' }, // Body text will be white in dark mode
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        'p': {
          color: mode === 'light' ? '#000000 !important' : '#ffffff !important', // Override default text color for paragraphs
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
  }, []);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
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
