import React, { useState, useCallback } from 'react';
import './App.css';
import Playlists from './components/playlists';
import { ThemeProvider } from '@material-ui/core/styles';
import ButtonAppBar from './components/ButtonAppBar';
import { AppTheme, AppThemes } from './AppThemes';
import { useMediaQuery, CssBaseline } from '@material-ui/core';

const App: React.FC = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [theme, setTheme] = useState<string>(
    prefersDarkMode ? AppTheme.DARK : AppTheme.LIGHT
  );

  const toggleTheme = useCallback(() => {
    setTheme(theme === AppTheme.LIGHT ? AppTheme.DARK : AppTheme.LIGHT);
  }, [theme]);

  return (
    <ThemeProvider theme={AppThemes[theme]}>
      <CssBaseline />
      <ButtonAppBar toggleTheme={toggleTheme} />
      <Playlists />
    </ThemeProvider>
  );
};

export default App;
