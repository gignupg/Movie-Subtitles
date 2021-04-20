import React from 'react';
import { styled } from '@material-ui/core/styles';

const Container = styled('div')({
  position: 'absolute',
  bottom: '50px',
  width: '100%',
  overflow: 'visible',
  background: 'none !important',
  textAlign: 'center',
  color: 'white',
  cursor: 'default',
  zIndex: 9999999999,
});

const SubtitleWrapper = styled('div')({
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '24px',
  backgroundColor: 'rgba(0,0,0,0.5)',
  borderRadius: '40px',
  maxWidth: '90%',
});

const SubtitleButton = styled('div')({
  display: 'inline-block',
  backgroundColor: 'transparent',
  fontWeight: 900,
  marginLeft: '5px',
  marginRight: '5px',
  color: 'white',
  border: 'none',
  userSelect: 'none',
});

const SubtitleText = styled('div')({
  display: 'inline-block',
  marginLeft: 0,
  marginRight: 0,
  marginTop: '5px',
  marginBottom: '5px',
  userSelect: 'none',
});

function Content() {
  return (
    <Container>
      <SubtitleWrapper>
        <SubtitleButton id="prev-button">«</SubtitleButton>
        <SubtitleText>No subtitles loaded</SubtitleText>
        <SubtitleButton id="next-button">»</SubtitleButton>
      </SubtitleWrapper>
    </Container>
  );
}

export default Content;
