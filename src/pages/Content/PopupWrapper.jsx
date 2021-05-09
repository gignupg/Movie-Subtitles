import React from 'react';
import Popup from '../Popup/Popup';
import { styled } from '@material-ui/core/styles';

const Wrapper = styled('div')({
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  background: 'white',
  width: '280px',
  overflow: 'auto',
  zIndex: 2147483647,
});

const PopupWrapper = ({ popup, display, setMenu }) => {
  const thisSite = window.location.hostname;

  return (
    <Wrapper id="movie-subtitles-scroll-anchor" style={{ display: display }}>
      <Popup setMenu={setMenu} popup={popup} thisSite={thisSite} />
    </Wrapper>
  );
};

export default PopupWrapper;
