import React, { useState } from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import Switch from '@material-ui/core/Switch';
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
});

const Sync = ({ popup }) => {
  const classes = useStyles();
  const [direction, setDirection] = useState(false);
  const [syncValue, setSyncValue] = useState(0);
  const [listening, setListening] = useState(false);

  const handleSliderChange = (event, newValue) => {
    setSyncValue(newValue);
  };

  const handleInputChange = (event) => {
    setSyncValue(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleBlur = () => {
    if (syncValue < 0) {
      setSyncValue(0);
    } else if (syncValue > 10) {
      setSyncValue(10);
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
      if (msg.syncValue) {
        // This time calling handleSync from the content script instead of from the popup
        handleSync(msg);
      }
    });
  }

  return (
    <>
      <MenuHeading heading="Synchronization:" />
      <Container>
        <Box my={2}>
          <FormControl component="fieldset">
            <FormGroup>
              <Typography component="div">
                <Grid
                  component="label"
                  container
                  alignItems="center"
                  spacing={1}
                >
                  <Grid item style={{ color: 'black', fontWeight: '400' }}>
                    Earlier
                  </Grid>
                  <Grid item>
                    <Switch
                      checked={direction}
                      onChange={() => setDirection(direction ? false : true)}
                      color="default"
                    />
                  </Grid>
                  <Grid item style={{ color: 'black', fontWeight: '400' }}>
                    Later
                  </Grid>
                </Grid>
              </Typography>
            </FormGroup>
          </FormControl>
        </Box>
        <Box my={2}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs>
              <Slider
                value={typeof syncValue === 'number' ? syncValue : 0}
                onChange={handleSliderChange}
                aria-labelledby="input-slider"
                step={0.1}
                min={0}
                max={10}
              />
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
                  min: 0,
                  max: 10,
                  type: 'number',
                  'aria-labelledby': 'input-slider',
                }}
              />
            </Grid>
          </Grid>
        </Box>
        <Box my={4}>
          <Grid container justify="center">
            <Button
              onClick={() =>
                handleSync({ syncValue: syncValue, syncLater: direction })
              }
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
