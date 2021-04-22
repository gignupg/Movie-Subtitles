import React from 'react';
import MenuHeading from '../MenuHeading';
import PublishIcon from '@material-ui/icons/Publish';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

const LoadSubtitles = () => {
  return (
    <>
      <MenuHeading heading="Subtitles:" />
      <Grid container justify="center">
        <Button variant="contained" color="secondary" endIcon={<PublishIcon />}>
          Load from PC
        </Button>
      </Grid>
    </>
  );
};

export default LoadSubtitles;
