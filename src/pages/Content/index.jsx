import React from 'react';
import { render } from 'react-dom';
import Content from './Content';
import videoPlayerDetector from './videoPlayerDetector/videoPlayerDetector';

let displayingExtension = false;

// Wait for the popup message
chrome.runtime.onMessage.addListener(function (msg) {
  console.log('displayingExtension before if', displayingExtension);
  if (msg.activation && !displayingExtension) {
    console.log('Calling video, container, and iconWrapper');
    const video = videoPlayerDetector('video');
    const container = videoPlayerDetector('container');
    const iconWrapper = videoPlayerDetector('iconWrapper');

    // Render the subtitles and the menu
    render(<Content video={video} iconWrapper={iconWrapper} />, container);

    // Make sure only to inject the extension code once!
    displayingExtension = true;
  }
  console.log('displayingExtension after if', displayingExtension);
});
