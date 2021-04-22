import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import MenuHeading from '../MenuHeading';
import Box from '@material-ui/core/Box';

const DisplaySettings = () => {
  return (
    <>
      <MenuHeading heading="Display:" />
      <Box mb={1}>
        <List component="nav" aria-label="main mailbox folders">
          <ListItem button>
            <ListItemText primary="Font Size" />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="font-smaller">
                <RemoveCircleIcon />
              </IconButton>
              <IconButton edge="end" aria-label="font-bigger">
                <AddCircleIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem button>
            <ListItemText primary="Background" />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="opacity-minus">
                <RemoveCircleIcon />
              </IconButton>
              <IconButton edge="end" aria-label="opacity-plus">
                <AddCircleIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Box>
    </>
  );
};

export default DisplaySettings;
