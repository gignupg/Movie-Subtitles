import React, { useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import MenuHeading from '../MenuHeading';
import Box from '@material-ui/core/Box';

const Display = ({ popup }) => {
  const [listening, setListening] = useState(false);

  function displaySettingsHandler(action) {
    if (popup) {
      // Send message to content script (this file but content script)
      chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
        chrome.tabs.sendMessage(tab[0].id, { displaySettings: action });
      });
    } else {
      // Dispatch event
      const displaySettings = new CustomEvent('displaySettings', {
        detail: action,
      });
      document.dispatchEvent(displaySettings);
    }
  }

  if (!listening) {
    setListening(true);
    if (!popup) {
      // Listening for messages from the popup (this file but popup)
      chrome.runtime.onMessage.addListener((msg) => {
        if (msg.displaySettings) {
          displaySettingsHandler(msg.displaySettings);
        }
      });
    }
  }

  return (
    <>
      <MenuHeading heading="Display:" />
      <Box mb={1}>
        <List component="nav" aria-label="main mailbox folders">
          <ListItem button>
            <ListItemText style={{ color: 'black' }} primary="Font Size" />
            <ListItemSecondaryAction>
              <IconButton
                onClick={() => displaySettingsHandler('font-smaller')}
                edge="end"
                aria-label="font-smaller"
              >
                <RemoveCircleIcon />
              </IconButton>
              <IconButton
                onClick={() => displaySettingsHandler('font-bigger')}
                edge="end"
                aria-label="font-bigger"
              >
                <AddCircleIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem button>
            <ListItemText style={{ color: 'black' }} primary="Background" />
            <ListItemSecondaryAction>
              <IconButton
                onClick={() => displaySettingsHandler('opacity-minus')}
                edge="end"
                aria-label="opacity-minus"
              >
                <RemoveCircleIcon />
              </IconButton>
              <IconButton
                onClick={() => displaySettingsHandler('opacity-plus')}
                edge="end"
                aria-label="opacity-plus"
              >
                <AddCircleIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Box>
    </>
  );
};

export default Display;
