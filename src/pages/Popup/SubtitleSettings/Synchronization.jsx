import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FormHelperText from '@material-ui/core/FormHelperText';
import MenuHeading from '../MenuHeading';
import Container from '@material-ui/core/Container';

const Synchronization = () => {
  const [state, setState] = React.useState({
    checkedC: false,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  return (
    <>
      <MenuHeading heading="Synchronization:" />
      <Container>
        <FormControl component="fieldset">
          <FormHelperText>Display Subtitles:</FormHelperText>
          <FormGroup>
            <Typography component="div">
              <Grid component="label" container alignItems="center" spacing={1}>
                <Grid item>Earlier</Grid>
                <Grid item>
                  <Switch
                    checked={state.checkedC}
                    onChange={handleChange}
                    color="default"
                    name="checkedC"
                  />
                </Grid>
                <Grid item>Later</Grid>
              </Grid>
            </Typography>
          </FormGroup>
        </FormControl>
      </Container>
    </>
  );
};

export default Synchronization;
