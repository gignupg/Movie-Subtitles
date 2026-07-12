import React from 'react';
import { render } from 'react-dom';
import Content from './Content';
import videoPlayerDetector from './videoPlayerDetector/videoPlayerDetector';

let displayingExtension = false;

// Wait for the popup message
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.activation) {
    // Some sites replace the entire player DOM when switching episodes
    // without a page reload, which removes the injected container. In that
    // case the extension has to be re-attached and re-rendered.
    const containerAttached = document.getElementById(
      'npm-video-player-detector-container'
    );

    if (!displayingExtension || !containerAttached) {
      // Try to detect the video and display the subtitles
      const video = videoPlayerDetector('video');
      const container = videoPlayerDetector('container');
      const iconWrapper = videoPlayerDetector('iconWrapper');

      if (video && container) {
        // Video detected
        sendResponse(true);
        // Render the subtitles and the menu
        render(<Content video={video} iconWrapper={iconWrapper} />, container);
        // Make sure only to inject the extension code once!
        displayingExtension = true;
      }
    } else if (displayingExtension) {
      // The video has already been detected and the subtitles are already being displayed
      sendResponse(true);
    }
  }
});
