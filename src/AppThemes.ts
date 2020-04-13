import { createMuiTheme } from '@material-ui/core';
import { deepPurple, green, blue, pink } from '@material-ui/core/colors';

export const AppTheme = {
  DARK: 'dark',
  LIGHT: 'light'
};

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: blue,
    secondary: pink
  }
});

const lightTheme = createMuiTheme({
  palette: {
    type: 'light',
    primary: deepPurple,
    secondary: green
  }
});

export const AppThemes = {
  [AppTheme.LIGHT]: lightTheme,
  [AppTheme.DARK]: darkTheme
};
