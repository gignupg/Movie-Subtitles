import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Header from './Header';
import SubtitleSettings from './SubtitleSettings/index';
import GeneralSection from './GeneralSection';

const msTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#ba000d',
    },
    secondary: {
      main: '#ff5722',
    },
  },
});

const Popup = () => {
  console.log('Popup component called');
  return (
    <ThemeProvider theme={msTheme}>
      <Header />
      <SubtitleSettings />
      <GeneralSection />
    </ThemeProvider>
  );
};

export default Popup;
