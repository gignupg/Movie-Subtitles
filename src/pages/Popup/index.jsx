import React from 'react';
import { render } from 'react-dom';
import Popup from './Popup';
import './index.css';

render(
  <Popup popup={true} menu={false} />,
  window.document.querySelector('#app-container')
);

if (module.hot) module.hot.accept();
