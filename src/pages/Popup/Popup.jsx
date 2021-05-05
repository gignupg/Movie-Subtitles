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
  const [videoDetected, setVideoDetected] = useState(false);

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
