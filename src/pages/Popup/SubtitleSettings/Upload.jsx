import React, { useEffect, useRef } from 'react';
import { styled } from '@material-ui/core/styles';
import PublishIcon from '@material-ui/icons/Publish';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

const InvisibleInput = styled('input')({
  display: 'none',
});

// Module-scoped so the listener survives re-renders of the content UI (e.g.
// after an episode switch replaces the player DOM) without being duplicated
let listening = false;

const Upload = ({ popup, setMenu }) => {
  const fileInputRef = useRef(null);

  // The invisible input lives inside the video player's DOM, so the click()
  // used to open the file dialog bubbles into the player - and some players
  // toggle play/pause on any click inside their area. Stop it at the source
  // (native listener, since React's delegated handlers fire too late for
  // listeners the player attached between the input and the root).
  useEffect(() => {
    const input = fileInputRef.current;
    if (!input) return;
    const stopClick = (e) => e.stopPropagation();
    input.addEventListener('click', stopClick);
    return () => input.removeEventListener('click', stopClick);
  }, []);

  function invisibleUploadHandler(e) {
    const file = e.target.files[0];
    const fileUpload = new CustomEvent('fileUpload', { detail: file });
    document.dispatchEvent(fileUpload);
    setMenu(false);
  }

  function uploadButtonHandler() {
    if (popup) {
      // Sending message to the content script, then opening the file upload window from there
      chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
        chrome.tabs.sendMessage(tab[0].id, { fileUpload: true });
      });
    } else {
      document.getElementById('movie-subtitles-file-upload').click();
    }
  }

  if (!popup && !listening) {
    listening = true;
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.fileUpload) {
        // Looked up at message time because the input is re-created whenever
        // the player DOM is replaced (e.g. after switching episodes)
        const fileInput = document.getElementById(
          'movie-subtitles-file-upload'
        );
        if (fileInput) fileInput.click();
      }
    });
  }

  return (
    <Box mb={4} mt={2}>
      <Grid container justify="center" my={8}>
        <InvisibleInput
          ref={fileInputRef}
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

export default Upload;
