import React from 'react';
import { render } from 'react-dom';
import Content from './Content';
import videoPlayerDetector from './videoPlayerDetector/videoPlayerDetector';

let displayingExtension = false;

// Wait for the popup message
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.activation && !displayingExtension) {
    const video = videoPlayerDetector('video');
    const container = videoPlayerDetector('container');
    const iconWrapper = videoPlayerDetector('iconWrapper');

    if (container) {
      // Render the subtitles and the menu
      render(<Content video={video} iconWrapper={iconWrapper} />, container);
    }

    // Make sure only to inject the extension code once!
    displayingExtension = true;
  } else if (msg.videoCheck) {
    const container = videoPlayerDetector('container');
    if (container) {
      sendResponse(true);
    } else {
      sendResponse(false);
    }
  }
});
