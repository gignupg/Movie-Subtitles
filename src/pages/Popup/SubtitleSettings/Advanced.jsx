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
  const [editMode, setEditMode] = useState(false);

  // Retrieving the silence and editMode settings from chrome storage
  chrome.storage.sync.get(null, function (storage) {
    if (storage.silence !== undefined && silenceIndicator !== storage.silence) {
      setSilenceIndicator(storage.silence);

    } else if (storage.editMode !== undefined && editMode !== storage.editMode) {
      setEditMode(storage.editMode)
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
            primary="Edit Mode"
          />
          <ListItemSecondaryAction>
            <FormControlLabel
              control={<Switch checked={editMode} />}
              onClick={editModeHandler}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    </>
  );
};

export default Advanced;
