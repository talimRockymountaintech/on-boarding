'use client';
import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  palette: {
    primary: {
      main: "#f26720",
      contrastText: '#fff',
    },
    text: {
      primary: "#373A40",
      secondary: `#535353`,
      disabled: 'rgba(60, 72, 88, 0.38)',
    },
  },
});

export default theme;