import React from 'react';

export default function Img() {
  return (
    <img src={chrome.runtime.getURL('icons8-settings-32.png')} alt="Logo" />
  );
}
