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
  maxHeight: '757px',
  overflow: 'auto',
  zIndex: 2147483647,
});

const PopupWrapper = ({ popup, display }) => {
  return (
    <Wrapper style={{ display: display }}>
      <Popup popup={popup} />
    </Wrapper>
  );
};

export default PopupWrapper;
