import React from 'react';
import PublishIcon from '@material-ui/icons/Publish';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

const LoadSubtitles = ({ popup }) => {
  function uploadHandler() {
    if (popup) {
      // Upload button clicked
      // Sending a message to the content script, then opening the file upload window from there
      chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
        chrome.tabs.sendMessage(tab[0].id, 'fileUpload');
      });
    }
  }

  if (!popup) {
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg === 'fileUpload') {
        console.log('msg', msg);
      }
    });
  }

  return (
    <Box mb={4} mt={2}>
      <Grid container justify="center" my={8}>
        <Button
          onClick={uploadHandler}
          variant="contained"
          color="secondary"
          endIcon={<PublishIcon />}
        >
          Load Subtitles
        </Button>
      </Grid>
    </Box>
  );
};

export default LoadSubtitles;
