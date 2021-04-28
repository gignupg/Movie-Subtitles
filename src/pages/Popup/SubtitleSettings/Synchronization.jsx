import React from 'react';
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

const Synchronization = () => {
  const classes = useStyles();

  const [state, setState] = React.useState({
    checkedC: false,
  });

  const [value, setValue] = React.useState(0);

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (event) => {
    setValue(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 10) {
      setValue(10);
    }
  };

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
                  <Grid item style={{ color: 'black' }}>
                    Earlier
                  </Grid>
                  <Grid item>
                    <Switch
                      checked={state.checkedC}
                      onChange={handleChange}
                      color="default"
                      name="checkedC"
                    />
                  </Grid>
                  <Grid item style={{ color: 'black' }}>
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
                value={typeof value === 'number' ? value : 0}
                onChange={handleSliderChange}
                aria-labelledby="input-slider"
              />
            </Grid>
            <Grid item>
              <Input
                className={classes.input}
                value={value}
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
            <Button variant="contained" color="primary" endIcon={<SyncIcon />}>
              Sync Now
            </Button>
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default Synchronization;
