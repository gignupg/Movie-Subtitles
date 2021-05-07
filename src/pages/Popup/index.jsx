import React from 'react';
import { render } from 'react-dom';
import Popup from './Popup';
import './index.css';

// Check if the video on this page has been detected previously
// If so, make sure not to display the error message "no video detected"
chrome.storage.sync.get('sitesWithSubtitles', function (storage) {
  // Get the url of this site
  chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
    const thisSite = tab[0].url.replace(/^.*\/\//, '').replace(/\/.*/, '');
    let previouslyDetected = false;
    let sitesWithSubtitles = [];

    if (storage.sitesWithSubtitles) {
      sitesWithSubtitles = storage.sitesWithSubtitles;

      // Check if sitesWithSubtitles contains the url of this page
      if (sitesWithSubtitles.includes(thisSite)) {
        previouslyDetected = true;
      }
    }

    render(
      <Popup
        popup={true}
        previouslyDetected={previouslyDetected}
        sitesWithSubtitles={sitesWithSubtitles}
        thisSite={thisSite}
      />,
      window.document.querySelector('#app-container')
    );
  });
});

if (module.hot) module.hot.accept();
