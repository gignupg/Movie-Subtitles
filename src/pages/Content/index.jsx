import React from 'react';
import { render } from 'react-dom';
import Subtitles from './Subtitles';
import videoObject from './videoObject';

let subtitlesInjected = false;

// Wait for the popup message
chrome.runtime.onMessage.addListener(function (msg) {
  if (msg.activation && !subtitlesInjected) {
    const video = videoObject[msg.site].controller;

    // Inject the #movie-subtitles div!
    const subtitleContainer = document.createElement('div');
    subtitleContainer.id = 'movie-subtitles';
    subtitleContainer.style =
      'position: absolute; top: 0; background: transparent; width: 100%; height: 100%;';
    videoObject[msg.site].container.prepend(subtitleContainer);
    // Display(site).prepend(subtitleContainer);
    // document.querySelector('#movie_player').prepend(container);

    // Display the subtitles
    render(
      <Subtitles video={video} />,
      document.querySelector('#movie-subtitles')
    );

    // Make sure only to inject the subtitles once!
    subtitlesInjected = true;
  }
});
