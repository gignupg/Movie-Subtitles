import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import MenuHeading from '../MenuHeading';
import Container from '@material-ui/core/Container';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import SyncIcon from '@material-ui/icons/Sync';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles({
  input: {
    width: 50,
  },
});

const sliderLabelStyle = {
  fontSize: '0.6rem',
  color: '#666',
};

const Sync = ({ popup }) => {
  const classes = useStyles();
  const [syncValue, setSyncValue] = useState(0);

  useEffect(() => {
    if (popup) {
      chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
        chrome.tabs.sendMessage(tab[0].id, { getSubtitleOffset: true }, function (response) {
          if (chrome.runtime.lastError) {
            return;
          }

          if (response && response.syncValue !== undefined) {
            setSyncValue(response.syncValue);
          }
        });
      });
      return;
    }

    function handleSubtitleOffsetChanged(event) {
      setSyncValue(event.detail);
    }

    document.addEventListener('subtitleOffsetChanged', handleSubtitleOffsetChanged, false);

    return () => {
      document.removeEventListener('subtitleOffsetChanged', handleSubtitleOffsetChanged, false);
    };
  }, [popup]);

  const handleSliderChange = (event, newValue) => {
    setSyncValue(newValue);
  };

  const handleInputChange = (event) => {
    setSyncValue(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleBlur = () => {
    if (syncValue === '' || isNaN(syncValue)) {
      setSyncValue(0);
    }
  };

  function handleSync(synchronization) {
    if (popup) {
      chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
        chrome.tabs.sendMessage(tab[0].id, synchronization);
      });
    } else {
      // Dispatch message to the subtitle component
      const syncNow = new CustomEvent('syncNow', {
        detail: synchronization,
      });
      document.dispatchEvent(syncNow);
    }
  }

  return (
    <>
      <MenuHeading heading="Synchronization:" />
      <List component="nav" aria-label="main mailbox folders">
        <ListItem button>
          <ListItemText
            style={{ color: 'black' }}
            primary="Total Subtitle Offset"
          />
          <ListItemSecondaryAction>
            <Input
              className={classes.input}
              value={syncValue}
              margin="dense"
              onChange={handleInputChange}
              onBlur={handleBlur}
              inputProps={{
                step: 0.1,
                type: 'number',
                'aria-labelledby': 'input-slider',
              }}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
      <Container>
        <Box mb={1}>
          <Slider
            value={typeof syncValue === 'number' ? syncValue : 0}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            step={0.1}
            min={-10}
            max={10}
          />
          <Grid container justify="space-between">
            <Grid item>
              <Typography style={sliderLabelStyle}>Earlier</Typography>
            </Grid>
            <Grid item>
              <Typography style={sliderLabelStyle}>Later</Typography>
            </Grid>
          </Grid>
        </Box>
        <Box my={4}>
          <Grid container justify="center">
            <Button
              onClick={() => handleSync({ syncValue: syncValue })}
              variant="contained"
              color="primary"
              endIcon={<SyncIcon />}
            >
              Sync Now
            </Button>
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default Sync;
