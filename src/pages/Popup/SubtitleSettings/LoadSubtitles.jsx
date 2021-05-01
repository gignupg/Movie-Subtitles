import React, { useState } from 'react';
import { styled } from '@material-ui/core/styles';
import PublishIcon from '@material-ui/icons/Publish';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

const InvisibleInput = styled('input')({
  display: 'none',
});

const LoadSubtitles = ({ popup, setMenu }) => {
  const [listening, setListening] = useState(false);

  function invisibleUploadHandler(e) {
    const file = e.target.files[0];
    const fileUpload = new CustomEvent('fileUpload', { detail: file });
    document.dispatchEvent(fileUpload);
    setMenu(false);
  }

  function uploadButtonHandler() {
    if (popup) {
      // Upload button clicked
      // Sending a message to the content script, then opening the file upload window from there
      chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
        chrome.tabs.sendMessage(tab[0].id, { fileUpload: true });
      });
    } else {
      document.getElementById('movie-subtitles-file-upload').click();
    }
  }

  if (!popup && !listening) {
    setListening(true);
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.fileUpload) {
        document.getElementById('movie-subtitles-file-upload').click();
      }
    });
  }

  return (
    <Box mb={4} mt={2}>
      <Grid container justify="center" my={8}>
        <InvisibleInput
          onChange={invisibleUploadHandler}
          type="file"
          id="movie-subtitles-file-upload"
        />
        <Button
          onClick={uploadButtonHandler}
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
