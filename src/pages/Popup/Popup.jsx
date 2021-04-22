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
  // Send a message to the content script to display the subtitles
  chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
    let site = tab[0].url.replace(/^.*\/\//, '').replace(/\/.*/, '');
    if (!/^www/.test(site)) site = 'www.' + site;
    chrome.tabs.sendMessage(tab[0].id, { activation: true, site: site });
  });

  return (
    <ThemeProvider theme={msTheme}>
      <Header />
      <SubtitleSettings />
      <GeneralSection />
    </ThemeProvider>
  );
};

export default Popup;
