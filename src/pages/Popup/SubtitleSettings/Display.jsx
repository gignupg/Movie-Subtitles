import React, { useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import MenuHeading from '../MenuHeading';
import Box from '@material-ui/core/Box';

const fontFamilies = [
  { label: 'Default', value: 'sans-serif' },
  { label: 'Serif', value: 'serif' },
  { label: 'Monospace', value: 'monospace' },
  { label: 'Cursive', value: 'cursive' },
  { label: 'Fantasy', value: 'fantasy' },
  { label: 'System UI', value: 'system-ui' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Arial Black', value: "'Arial Black', sans-serif" },
  { label: 'Verdana', value: 'Verdana, sans-serif' },
  { label: 'Tahoma', value: 'Tahoma, sans-serif' },
  { label: 'Trebuchet MS', value: "'Trebuchet MS', sans-serif" },
  { label: 'Impact', value: 'Impact, sans-serif' },
  { label: 'Times New Roman', value: "'Times New Roman', serif" },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Palatino', value: 'Palatino, serif' },
  { label: 'Garamond', value: 'Garamond, serif' },
  { label: 'Courier New', value: "'Courier New', monospace" },
  { label: 'Lucida Console', value: "'Lucida Console', monospace" },
  { label: 'Comic Sans MS', value: "'Comic Sans MS', cursive" },
  { label: 'Brush Script MT', value: "'Brush Script MT', cursive" },
];

const Display = ({ popup }) => {
  const [listening, setListening] = useState(false);
  const [fontFamily, setFontFamily] = useState(fontFamilies[0].value);

  function fontFamilyHandler(e) {
    const value = e.target.value;
    setFontFamily(value);
    displaySettingsHandler({ type: 'font-family', value });
  }

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
    chrome.storage.sync.get(null, function (storage) {
      if (storage.fontFamily !== undefined) {
        setFontFamily(storage.fontFamily);
      }
    });
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
          <ListItem button>
            <ListItemText style={{ color: 'black' }} primary="Font Family" />
            <ListItemSecondaryAction>
              <Select
                value={fontFamily}
                onChange={fontFamilyHandler}
                disableUnderline
                style={{ maxWidth: 120, color: 'black' }}
                aria-label="font-family"
              >
                {fontFamilies.map((font) => (
                  <MenuItem
                    key={font.value}
                    value={font.value}
                    style={{ fontFamily: font.value }}
                  >
                    {font.label}
                  </MenuItem>
                ))}
              </Select>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Box>
    </>
  );
};

export default Display;
