import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import PopupWrapper from './PopupWrapper';
import { styled } from '@material-ui/core/styles';

const BlurredBackground = styled('div')({
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  userSelect: 'none',
  backdropFilter: 'blur(10px)',
  zIndex: 2147483647,
});

export default function Img() {
  const [menu, setMenu] = useState(false);
  const menuContainer = document.getElementById(
    'movie-subtitles-menu-container'
  );
  const blurContainer = document.getElementById(
    'movie-subtitles-blurred-background'
  );

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg === 'activation') {
      setMenu(false);
    }
  });

  function toggleMenu() {
    setMenu(menu ? false : true);
  }

  useEffect(() => {
    // Always render the menu but hide it conditionally
    render(
      <PopupWrapper popup={false} display={menu ? 'block' : 'none'} />,
      menuContainer
    );
    // Conditionally blur the video
    render(menu && <BlurredBackground onClick={toggleMenu} />, blurContainer);
  });

  return (
    <img
      onClick={toggleMenu}
      src={chrome.runtime.getURL('icons8-settings-32.png')}
      alt="Logo"
    />
  );
}
