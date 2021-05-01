import React from 'react';
import { render } from 'react-dom';
import Content from './Content';
import Img from './Img';
import videoPlayerDetector from './videoPlayerDetector/videoPlayerDetector';

let displayingExtension = false;

// Wait for the popup message
chrome.runtime.onMessage.addListener(function (msg) {
  if (msg.activation && !displayingExtension) {
    const video = videoPlayerDetector('video');
    const container = videoPlayerDetector('container');
    const iconWrapper = videoPlayerDetector('iconWrapper');

    // Display the subtitles
    render(<Content video={video} />, container);

    // Display the icon
    render(<Img />, iconWrapper);

    // Make sure only to inject the extension code once!
    displayingExtension = true;
  }
});
