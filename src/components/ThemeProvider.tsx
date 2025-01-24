// src/components/ThemeProvider.tsx

'use client';

import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { createTheme, ThemeOptions } from '@mui/material/styles';
import { ReactNode, useState, useMemo, useEffect, createContext, useContext } from 'react';

// Extend the Palette interface to include custom colors
declare module '@mui/material/styles' {
  interface Palette {
    pink: Palette['primary'];
  }
  interface PaletteOptions {
    pink?: PaletteOptions['primary'];
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
      main: mode === 'light' ? '#1976d2' : '#FF4081', // Change to pink in dark mode
    },
    secondary: {
      main: mode === 'light' ? '#dc004e' : '#FF4081', // Change to pink in dark mode
    },
    pink: {
      main: '#FF4081', // Custom pink color
    },
    background: {
      default: mode === 'light' ? '#ffffff' : '#121212',
      paper: mode === 'light' ? '#f5f5f5' : '#1e1e1e',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
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

// // src/components/ThemeProvider.tsx

// 'use client';

// import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
// import { createTheme, ThemeOptions } from '@mui/material/styles';
// import { ReactNode, useState, useMemo, useEffect, createContext, useContext } from 'react';

// // Extend the Palette interface to include custom colors
// declare module '@mui/material/styles' {
//   interface Palette {
//     pink: Palette['primary'];
//   }
//   interface PaletteOptions {
//     pink?: PaletteOptions['primary'];
//   }
// }

// interface ColorModeContextType {
//   toggleColorMode: () => void;
//   mode: 'light' | 'dark';
// }

// const ColorModeContext = createContext<ColorModeContextType>({
//   toggleColorMode: () => {},
//   mode: 'light',
// });

// export const useColorMode = () => useContext(ColorModeContext);

// const getThemeOptions = (mode: 'light' | 'dark'): ThemeOptions => ({
//   palette: {
//     mode,
//     primary: {
//       main: mode === 'light' ? '#1976d2' : '#90caf9',
//     },
//     secondary: {
//       main: mode === 'light' ? '#dc004e' : '#f48fb1',
//     },
//     pink: {
//       main: '#FF4081', // Custom pink color
//     },
//     background: {
//       default: mode === 'light' ? '#ffffff' : '#121212',
//       paper: mode === 'light' ? '#f5f5f5' : '#1e1e1e',
//     },
//   },
//   typography: {
//     fontFamily: 'Roboto, Arial, sans-serif',
//   },
// });

// type ThemeProviderProps = {
//   children: ReactNode;
// };

// export default function ThemeProvider({ children }: ThemeProviderProps) {
//   const [isClient, setIsClient] = useState(false);
//   const [mode, setMode] = useState<'light' | 'dark'>('light');

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   const colorMode = useMemo(
//     () => ({
//       toggleColorMode: () => {
//         setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
//       },
//       mode,
//     }),
//     [mode]
//   );

//   const themeOptions = useMemo(() => createTheme(getThemeOptions(mode)), [mode]);

//   if (!isClient) {
//     return <>{children}</>;
//   }

//   return (
//     <ColorModeContext.Provider value={colorMode}>
//       <MuiThemeProvider theme={themeOptions}>
//         <CssBaseline />
//         {children}
//       </MuiThemeProvider>
//     </ColorModeContext.Provider>
//   );
// }

// // src/components/ThemeProvider.tsx

// 'use client';

// import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
// import { createTheme, ThemeOptions } from '@mui/material/styles';
// import { ReactNode, useState, useMemo, useEffect, createContext, useContext } from 'react';

// interface ColorModeContextType {
//   toggleColorMode: () => void;
//   mode: 'light' | 'dark';
// }

// const ColorModeContext = createContext<ColorModeContextType>({
//   toggleColorMode: () => {},
//   mode: 'light',
// });

// export const useColorMode = () => useContext(ColorModeContext);

// const getThemeOptions = (mode: 'light' | 'dark'): ThemeOptions => ({
//   palette: {
//     mode,
//     primary: {
//       main: mode === 'light' ? '#1976d2' : '#90caf9',
//     },
//     secondary: {
//       main: mode === 'light' ? '#dc004e' : '#f48fb1',
//     },
//     background: {
//       default: mode === 'light' ? '#ffffff' : '#121212',
//       paper: mode === 'light' ? '#f5f5f5' : '#1e1e1e',
//     },
//   },
//   typography: {
//     fontFamily: 'Roboto, Arial, sans-serif',
//   },
// });

// type ThemeProviderProps = {
//   children: ReactNode;
// };

// export default function ThemeProvider({ children }: ThemeProviderProps) {
//   const [isClient, setIsClient] = useState(false);
//   const [mode, setMode] = useState<'light' | 'dark'>('light');

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   const colorMode = useMemo(
//     () => ({
//       toggleColorMode: () => {
//         setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
//       },
//       mode,
//     }),
//     [mode]
//   );

//   const themeOptions = useMemo(() => createTheme(getThemeOptions(mode)), [mode]);

//   if (!isClient) {
//     return <>{children}</>;
//   }

//   return (
//     <ColorModeContext.Provider value={colorMode}>
//       <MuiThemeProvider theme={themeOptions}>
//         <CssBaseline />
//         {children}
//       </MuiThemeProvider>
//     </ColorModeContext.Provider>
//   );
// }