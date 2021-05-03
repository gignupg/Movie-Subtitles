import React from 'react';
import MenuHeading from './MenuHeading';
import KeyboardIcon from '@material-ui/icons/Keyboard';
import FeedbackIcon from '@material-ui/icons/Feedback';
import InfoIcon from '@material-ui/icons/Info';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import openPage from './openPage';

const GeneralSection = ({ setDisplayShortcuts, popup }) => {
  return (
    <>
      <MenuHeading heading="General:" />
      <List component="nav" aria-label="main mailbox folders">
        <ListItem button>
          <ListItemText
            onClick={() => setDisplayShortcuts(true)}
            style={{ color: 'black' }}
            primary="Shortcuts"
          />
          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="shortcuts">
              <KeyboardIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem
          button
          onClick={() =>
            openPage(
              popup,
              'https://github.com/gignupg/Movie-Subtitles-Chrome-Extension/issues'
            )
          }
        >
          <ListItemText style={{ color: 'black' }} primary="Feedback" />
          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="feedback">
              <FeedbackIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem
          button
          onClick={() =>
            openPage(
              popup,
              'https://github.com/gignupg/Movie-Subtitles-Chrome-Extension'
            )
          }
        >
          <ListItemText style={{ color: 'black' }} primary="About" />
          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="about">
              <InfoIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    </>
  );
};

export default GeneralSection;
