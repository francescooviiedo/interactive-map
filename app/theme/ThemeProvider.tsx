'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createTheme, CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material';
import type { ReactNode } from 'react';

type ThemeMode = 'light' | 'dark';

type ThemeModeContextValue = {
  mode: ThemeMode;
  toggleMode: () => void;
};

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

export function useAppThemeMode() {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error('useAppThemeMode must be used within ThemeProvider');
  }
  return context;
}

type Props = Readonly<{ children: ReactNode }>;

export default function ThemeProvider({ children }: Props) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') {
      return 'dark';
    }
    const savedMode = window.localStorage.getItem('theme-mode');
    if (savedMode === 'light' || savedMode === 'dark') {
      return savedMode;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', mode === 'dark');
    root.classList.toggle('light', mode === 'light');
    window.localStorage.setItem('theme-mode', mode);
  }, [mode]);

  const toggleMode = () => {
    setMode((previousMode) => (previousMode === 'dark' ? 'light' : 'dark'));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#ff1f95',
            light: '#ff4aac',
            dark: '#c9006d',
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#a855f7',
            light: '#c084fc',
            dark: '#7e22ce',
            contrastText: '#ffffff',
          },
          background:
            mode === 'dark'
              ? {
                  default: '#150d16',
                  paper: '#231329',
                }
              : {
                  default: '#fdf2fb',
                  paper: '#fff8fd',
                },
          text:
            mode === 'dark'
              ? {
                  primary: '#f8ecf7',
                  secondary: '#d7b8d4',
                }
              : {
                  primary: '#36152f',
                  secondary: '#7d456f',
                },
          divider: mode === 'dark' ? 'rgba(255, 184, 233, 0.18)' : 'rgba(201, 0, 109, 0.2)',
        },
        shape: {
          borderRadius: 12,
        },
        typography: {
          fontFamily: 'var(--font-sans), Arial, Helvetica, sans-serif',
          button: {
            textTransform: 'none',
            fontWeight: 600,
          },
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                backgroundImage:
                  mode === 'dark'
                    ? 'radial-gradient(circle at 20% 20%, rgba(255, 31, 149, 0.16), transparent 42%), radial-gradient(circle at 80% 10%, rgba(168, 85, 247, 0.14), transparent 35%), radial-gradient(circle at 50% 80%, rgba(255, 31, 149, 0.10), transparent 45%)'
                    : 'radial-gradient(circle at 20% 20%, rgba(255, 31, 149, 0.12), transparent 42%), radial-gradient(circle at 80% 10%, rgba(168, 85, 247, 0.08), transparent 35%), radial-gradient(circle at 50% 80%, rgba(255, 31, 149, 0.08), transparent 45%)',
                backgroundAttachment: 'fixed',
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
                backdropFilter: 'blur(10px)',
                border:
                  mode === 'dark'
                    ? '1px solid rgba(255, 184, 233, 0.18)'
                    : '1px solid rgba(201, 0, 109, 0.22)',
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                background:
                  mode === 'dark' ? 'rgba(34, 20, 37, 0.82)' : 'rgba(255, 244, 252, 0.88)',
                color: mode === 'dark' ? '#f8ecf7' : '#36152f',
                backdropFilter: 'blur(12px)',
                borderBottom:
                  mode === 'dark'
                    ? '1px solid rgba(255, 184, 233, 0.22)'
                    : '1px solid rgba(201, 0, 109, 0.18)',
              },
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                background:
                  mode === 'dark' ? 'rgba(35, 19, 41, 0.88)' : 'rgba(255, 248, 253, 0.9)',
                backdropFilter: 'blur(14px)',
                borderRight:
                  mode === 'dark'
                    ? '1px solid rgba(255, 184, 233, 0.18)'
                    : '1px solid rgba(201, 0, 109, 0.18)',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              containedPrimary: {
                boxShadow:
                  mode === 'dark'
                    ? '0 0 6px rgba(255, 31, 149, 0.5), 0 0 22px rgba(255, 31, 149, 0.26), inset 0 0 0 1px rgba(255,255,255,0.08)'
                    : '0 0 6px rgba(255, 31, 149, 0.25), 0 0 16px rgba(255, 31, 149, 0.16), inset 0 0 0 1px rgba(255,255,255,0.35)',
              },
            },
          },
          MuiTextField: {
            defaultProps: {
              variant: 'outlined',
            },
          },
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                background: mode === 'dark' ? 'rgba(35, 19, 41, 0.52)' : 'rgba(255, 255, 255, 0.62)',
                '& fieldset': {
                  borderColor:
                    mode === 'dark' ? 'rgba(255, 184, 233, 0.28)' : 'rgba(201, 0, 109, 0.24)',
                },
                '&:hover fieldset': {
                  borderColor:
                    mode === 'dark' ? 'rgba(255, 184, 233, 0.42)' : 'rgba(201, 0, 109, 0.34)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#ff1f95',
                  boxShadow: '0 0 0 2px rgba(255, 31, 149, 0.16)',
                },
              },
              input: {
                color: mode === 'dark' ? '#f8ecf7' : '#36152f',
              },
            },
          },
          MuiInputLabel: {
            styleOverrides: {
              root: {
                color: mode === 'dark' ? '#d7b8d4' : '#7d456f',
              },
            },
          },
          MuiListItemButton: {
            styleOverrides: {
              root: {
                borderRadius: 10,
                '&.Mui-selected, &:hover': {
                  backgroundColor:
                    mode === 'dark' ? 'rgba(255, 31, 149, 0.14)' : 'rgba(255, 31, 149, 0.1)',
                },
              },
            },
          },
        },
      }),
    [mode],
  );

  const value = useMemo(() => ({ mode, toggleMode }), [mode]);

  return (
    <ThemeModeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeModeContext.Provider>
  );
}
