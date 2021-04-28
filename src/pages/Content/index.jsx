import React from 'react';
import { render } from 'react-dom';
import Subtitles from './Subtitles';
import Img from './Img';
import videoPlayerDetector from './videoPlayerDetector/videoPlayerDetector';
import PopupWrapper from './PopupWrapper';

let displayingExtension = false;

// Wait for the popup message
chrome.runtime.onMessage.addListener(function (msg) {
  if (msg === 'activation' && !displayingExtension) {
    const video = videoPlayerDetector('video');
    const container = videoPlayerDetector('container');
    const iconWrapper = videoPlayerDetector('iconWrapper');

    // Display the subtitles
    render(<Subtitles video={video} />, container);

    // Display the icon
    render(<Img />, iconWrapper);

    // When the icon gets clicked
    iconWrapper.addEventListener('click', function () {
      render(<PopupWrapper />, container);
    });

    // Make sure only to inject the extension code once!
    displayingExtension = true;
  }
});
