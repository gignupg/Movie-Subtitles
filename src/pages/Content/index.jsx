import React from 'react';
import { render } from 'react-dom';
import Subtitles from './Subtitles';
import Icon from './Icon';
import videoPlayerDetector from './videoPlayerDetector';
import Popup from '../Popup/Popup';

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
    render(<Icon />, iconWrapper);

    console.log('container:', container);

    // When the icon gets clicked
    iconWrapper.addEventListener('click', function () {
      render(<Popup />, document.querySelectorAll('.ytp-panel-menu')[0]);
    });

    // Make sure only to inject the extension code once!
    displayingExtension = true;
  }
});
