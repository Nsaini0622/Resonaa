import { createTheme } from '@mui/material/styles';

const poppinsFont = '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

// Custom Colors based on your preference
const colors = {
  blue: {
    main: '#0F52BA',   // Sapphire
    light: '#87CEEB',  // Sky
    dark: '#000080',   // Navy
  },
  pink: {
    main: '#FF007F',   // Rose
    light: '#F8C8DC',  // Petal
  },
  green: {
    main: '#008080',   // Teal
    light: '#9FE2BF',  // Seafoam
  }
};

const commonSettings = {
  typography: {
    fontFamily: poppinsFont,
    h2: { fontWeight: 800, letterSpacing: '-1px' },
    h3: { fontWeight: 700, letterSpacing: '-0.5px' },
    h4: { fontWeight: 700, letterSpacing: '-0.5px' },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none', letterSpacing: '0.5px' },
  },
  shape: { borderRadius: 24 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          padding: '10px 28px',
          boxShadow: 'none',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 8px 20px ${colors.blue.main}40`, // Blue glow on hover
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          backdropFilter: 'saturate(180%) blur(20px)', // Glassmorphism
        },
      },
    },
  },
};

export const lightTheme = createTheme({
  ...commonSettings,
  palette: {
    mode: 'light',
    primary: {
      main: colors.blue.main,
      light: colors.blue.light,
      dark: colors.blue.dark,
    },
    secondary: { main: colors.pink.main, light: colors.pink.light },
    success: { main: colors.green.main },
    background: {
      default: '#F0F8FF', // Alice Blue (very light blue)
      paper: '#FFFFFF',
    },
    text: {
      primary: '#001F3F',
      secondary: '#4A5568',
    },
  },
  components: {
    ...commonSettings.components,
    MuiAppBar: {
      styleOverrides: {
        root: {
          ...commonSettings.components.MuiAppBar.styleOverrides.root,
          background: 'rgba(255, 255, 255, 0.75)',
          borderBottom: '1px solid rgba(15, 82, 186, 0.1)',
          color: '#001F3F',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          ...commonSettings.components.MuiPaper.styleOverrides.root,
          boxShadow: '0 10px 40px rgba(15, 82, 186, 0.08)',
          border: '1px solid rgba(15, 82, 186, 0.05)',
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  ...commonSettings,
  palette: {
    mode: 'dark',
    primary: {
      main: '#4169E1', // Royal Blue for better dark mode visibility
      light: colors.blue.light,
      dark: colors.blue.main,
    },
    secondary: { main: colors.pink.main, light: colors.pink.light },
    success: { main: colors.green.light },
    background: {
      default: '#000E29', // Very dark blue (Midnight)
      paper: '#001A4D', // Slightly lighter blue for cards
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0C4DE',
    },
  },
  components: {
    ...commonSettings.components,
    MuiAppBar: {
      styleOverrides: {
        root: {
          ...commonSettings.components.MuiAppBar.styleOverrides.root,
          background: 'rgba(0, 14, 41, 0.75)',
          borderBottom: '1px solid rgba(135, 206, 235, 0.1)',
          color: '#FFFFFF',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          ...commonSettings.components.MuiPaper.styleOverrides.root,
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(135, 206, 235, 0.05)',
        },
      },
    },
  },
});