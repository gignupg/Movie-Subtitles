import React from 'react';
import PublishIcon from '@material-ui/icons/Publish';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

const LoadSubtitles = () => {
  return (
    <Box mb={4} mt={2}>
      <Grid container justify="center" my={8}>
        <Button variant="contained" color="secondary" endIcon={<PublishIcon />}>
          Load Subtitles
        </Button>
      </Grid>
    </Box>
  );
};

export default LoadSubtitles;
