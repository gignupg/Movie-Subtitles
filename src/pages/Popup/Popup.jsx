import React, { useState } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Header from './Header';
import SubtitleSettings from './SubtitleSettings/index';
import GeneralSection from './GeneralSection';
import Shortcuts from './Shortcuts';
import NoVideoDetected from './NoVideoDetected';

// For consistency across websites with different global styles
const msTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#ba000d',
    },
    secondary: {
      main: '#ff5722',
    },
  },
  overrides: {
    MuiButton: {
      root: {
        fontSize: '14px !important',
      },
      containedPrimary: {
        backgroundColor: '#ba000d !important',
      },
    },
    MuiButtonBase: {
      root: {
        color: '#000000',
      },
    },
    MuiInputBase: {
      input: {
        fontSize: '16px',
        border: 'none !important',
      },
    },
    MuiContainer: {
      root: {
        paddingLeft: '16px !important',
        paddingRight: '16px !important',
      },
    },
    MuiSvgIcon: {
      root: {
        fontSize: '24px !important',
      },
    },
    MuiTypography: {
      body1: {
        fontSize: '16px !important',
      },
    },
    MuiSwitch: {
      input: {
        position: 'absolute !important',
      },
    },
  },
});

const Popup = ({ popup, setMenu }) => {
  const [displayShortcuts, setDisplayShortcuts] = useState(false);
  const [videoDetected, setVideoDetected] = useState(true);
  const [activating, setActivating] = useState(true);

  if (popup && activating) {
    setActivating(false);
    // Send a message to the content script to display the subtitles
    chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
      // Send a new message every 500 milliseconds until the popup closes or a video can be detected
      const intervalId = setInterval(() => {
        chrome.tabs.sendMessage(
          tab[0].id,
          { activation: true },
          function (response) {
            // Display an error if no video can be detected
            if (response) {
              setVideoDetected(true);
              clearInterval(intervalId);
            } else {
              setVideoDetected(false);
            }
          }
        );
      }, 500);
    });
  }

  return (
    <ThemeProvider theme={msTheme}>
      {displayShortcuts ? (
        <Shortcuts setDisplayShortcuts={setDisplayShortcuts} />
      ) : (
        <>
          <Header popup={popup} />
          {popup && !videoDetected ? (
            <NoVideoDetected />
          ) : (
            <SubtitleSettings popup={popup} setMenu={setMenu} />
          )}
          <GeneralSection
            setDisplayShortcuts={setDisplayShortcuts}
            popup={popup}
          />
        </>
      )}
    </ThemeProvider>
  );
};

export default Popup;
