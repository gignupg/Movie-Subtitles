import React from 'react';
import { styled } from '@material-ui/core/styles';
import Draggable from 'react-draggable';

const Container = styled('div')({
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  bottom: '50px',
  maxWidth: '90%',
  zIndex: 2147483647,
});

const SubtitleWrapper = styled('div')({
  color: 'white',
  fontSize: '24px',
  backgroundColor: 'rgba(0,0,0,0.5)',
  borderRadius: '40px',
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

function Subtitles({ video }) {
  const pauseHandler = () => {
    if (!video.paused) {
      video.pause();
    }
  };

  const playHandler = () => {
    if (video.paused) {
      video.play();
    }
  };

  return (
    <Container>
      <Draggable axis="y">
        <SubtitleWrapper onMouseEnter={pauseHandler} onMouseLeave={playHandler}>
          <SubtitleButton id="prev-button">«</SubtitleButton>
          <SubtitleText>No subtitles loaded</SubtitleText>
          <SubtitleButton id="next-button">»</SubtitleButton>
        </SubtitleWrapper>
      </Draggable>
    </Container>
  );
}

export default Subtitles;
