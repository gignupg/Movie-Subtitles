import React from 'react';
import { render } from 'react-dom';
// import Subtitles from './Subtitles';
import IconBar from './IconBar';
import videoPlayerDetector from './videoPlayerDetector';
import Popup from '../Popup/Popup';

let displayingExtension = false;

// Wait for the popup message
chrome.runtime.onMessage.addListener(function (msg) {
  if (msg === 'activation' && !displayingExtension) {
    const video = videoPlayerDetector('video');
    const container = videoPlayerDetector('container');

    console.log('video:', video);
    console.log('container:', container);

    // const iconBar = videoPlayerDetector('iconBar');

    // Inject the icon on youtube or prime

    // // Display the subtitles
    // render(
    //   <Subtitles video={video} />,
    //   document.querySelector('#movie-subtitles-container')
    // );

    // // Display the icon
    // render(<IconBar />, document.querySelector('#movie-subtitles-icon-bar'));

    // // When the icon gets clicked
    // document
    //   .querySelector('#movie-subtitles-icon-bar')
    //   .addEventListener('click', function () {
    //     render(<Popup />, document.querySelector('#movie-subtitles-container'));
    //   });

    // Make sure only to inject the extension code once!
    displayingExtension = true;
  }
});
