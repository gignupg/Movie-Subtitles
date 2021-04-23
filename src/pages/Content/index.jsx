import React from 'react';
import { render } from 'react-dom';
import Subtitles from './Subtitles';
import findVideo from './videoObject';

let subtitlesInjected = false;

// Wait for the popup message
chrome.runtime.onMessage.addListener(function (msg) {
  if (msg === 'activation' && !subtitlesInjected) {
    const video = findVideo('video');

    // Inject the #movie-subtitles div!
    const subtitleContainer = document.createElement('div');
    subtitleContainer.id = 'movie-subtitles';
    subtitleContainer.style =
      'position: absolute; top: 0; background: transparent; width: 100%; height: 100%;';
    findVideo('container').prepend(subtitleContainer);

    // Display the subtitles
    render(
      <Subtitles video={video} />,
      document.querySelector('#movie-subtitles')
    );

    // Make sure only to inject the subtitles once!
    subtitlesInjected = true;
  }
});
