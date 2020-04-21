import { createMuiTheme } from '@material-ui/core';
import { green, indigo, lightGreen, blueGrey } from '@material-ui/core/colors';

export const AppTheme = {
  DARK: 'dark',
  LIGHT: 'light',
};

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: green,
    secondary: indigo,
  },
});

const lightTheme = createMuiTheme({
  palette: {
    type: 'light',
    primary: lightGreen,
    secondary: blueGrey,
  },
});

export const AppThemes = {
  [AppTheme.LIGHT]: lightTheme,
  [AppTheme.DARK]: darkTheme,
};
