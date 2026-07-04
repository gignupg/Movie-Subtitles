import React, { useState } from 'react';
import MenuHeading from '../MenuHeading';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const Advanced = () => {
  const [silenceIndicator, setSilenceIndicator] = useState(false);
  const [sentenceNavigationButtons, setSentenceNavigationButtons] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [pauseOnHover, setPauseOnHover] = useState(false);

  // Retrieving advanced settings from chrome storage
  chrome.storage.sync.get(null, function (storage) {
    if (storage.silence !== undefined && silenceIndicator !== storage.silence) {
      setSilenceIndicator(storage.silence);
    }
    if (storage.sentenceNavigationButtons !== undefined && sentenceNavigationButtons !== storage.sentenceNavigationButtons) {
      setSentenceNavigationButtons(storage.sentenceNavigationButtons);
    }
    if (storage.editMode !== undefined && editMode !== storage.editMode) {
      setEditMode(storage.editMode)
    }
    if (storage.pauseOnHover !== undefined && pauseOnHover !== storage.pauseOnHover) {
      setPauseOnHover(storage.pauseOnHover);
    }
  });

  function silenceSwitchHandler(e) {
    e.preventDefault();
    setSilenceIndicator(!silenceIndicator);
    chrome.storage.sync.set({
      silence: !silenceIndicator,
    });
  }

  function editModeHandler(e) {
    e.preventDefault();
    setEditMode(!editMode);
    chrome.storage.sync.set({
      editMode: !editMode,
    });
  }

  function sentenceNavigationButtonsHandler(e) {
    e.preventDefault();
    setSentenceNavigationButtons(!sentenceNavigationButtons);
    chrome.storage.sync.set({
      sentenceNavigationButtons: !sentenceNavigationButtons,
    });
  }

  function pauseOnHoverHandler(e) {
    e.preventDefault();
    setPauseOnHover(!pauseOnHover);
    chrome.storage.sync.set({
      pauseOnHover: !pauseOnHover,
    });
  }

  return (
    <>
      <MenuHeading heading="Advanced:" />
      <List component="nav" aria-label="main mailbox folders">
        <ListItem button>
          <ListItemText
            style={{ color: 'black' }}
            primary="Silence Indicator"
          />
          <ListItemSecondaryAction>
            <FormControlLabel
              control={<Switch checked={silenceIndicator} />}
              onClick={silenceSwitchHandler}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem button>
          <ListItemText
            style={{ color: 'black' }}
            primary="Sentence Nav Buttons"
          />
          <ListItemSecondaryAction>
            <FormControlLabel
              control={<Switch checked={sentenceNavigationButtons} />}
              onClick={sentenceNavigationButtonsHandler}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem button>
          <ListItemText
            style={{ color: 'black' }}
            primary="Edit Mode"
          />
          <ListItemSecondaryAction>
            <FormControlLabel
              control={<Switch checked={editMode} />}
              onClick={editModeHandler}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem button>
          <ListItemText
            style={{ color: 'black' }}
            primary="Pause On Hover"
          />
          <ListItemSecondaryAction>
            <FormControlLabel
              control={<Switch checked={pauseOnHover} />}
              onClick={pauseOnHoverHandler}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    </>
  );
};

export default Advanced;
