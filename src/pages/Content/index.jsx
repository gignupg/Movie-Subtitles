import React from 'react';
import { render } from 'react-dom';
import Subtitles from './Subtitles';

let subtitlesInjected = false;

// Wait for the popup message
chrome.runtime.onMessage.addListener(function (msg) {
  if (msg === 'activation' && !subtitlesInjected) {
    // Inject the #movie-subtitles div!
    const container = document.createElement('div');
    container.id = 'movie-subtitles';
    container.style =
      'position: absolute; top: 0; background: transparent; width: 100%; height: 100%;';
    document.querySelector('#movie_player').prepend(container);

    // Display the subtitles
    render(<Subtitles />, document.querySelector('#movie-subtitles'));

    // Make sure only to inject the subtitles once!
    subtitlesInjected = true;
  }
});
