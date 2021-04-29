import React from 'react';
import { render } from 'react-dom';
import Popup from './Popup';
import './index.css';

// Send a message to the content script to display the subtitles
chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
  chrome.tabs.sendMessage(tab[0].id, 'activation');
});

render(<Popup />, window.document.querySelector('#app-container'));

if (module.hot) module.hot.accept();
