import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import MenuHeading from '../MenuHeading';
import Container from '@material-ui/core/Container';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import SyncIcon from '@material-ui/icons/Sync';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles({
  input: {
    width: 42,
  },
  offsetLabel: {
    fontSize: '0.85rem',
    color: '#555',
    fontWeight: '500',
  },
  offsetValue: {
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  sliderLabel: {
    fontSize: '0.75rem',
    color: '#666',
  },
});

const Sync = ({ popup }) => {
  const classes = useStyles();
  const [syncValue, setSyncValue] = useState(0);
  const [listening, setListening] = useState(false);

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

  if (!popup && !listening) {
    setListening(true);
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.syncValue !== undefined) {
        handleSync(msg);
      }
    });
  }

  return (
    <>
      <MenuHeading heading="Synchronization:" />
      <Container>
        <Box mt={1} mb={2}>
          <Grid container alignItems="center" justify="space-between">
            <Grid item>
              <Typography className={classes.offsetLabel}>
                Total Subtitle Offset:
              </Typography>
            </Grid>
            <Grid item style={{ lineHeight: '10px' }}>
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
            </Grid>
          </Grid>
        </Box>
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
              <Typography className={classes.sliderLabel}>Earlier</Typography>
            </Grid>
            <Grid item>
              <Typography className={classes.sliderLabel}>Later</Typography>
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
