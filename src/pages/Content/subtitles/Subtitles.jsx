import React, { useState, useEffect } from 'react';
import { styled } from '@material-ui/core/styles';
import Draggable from 'react-draggable';
import eventBus from '../EventBus';
import languageEncoding from 'detect-file-encoding-and-language';
import processSubtitles from './processSubtitles';
import timeUpdate from './timeUpdate';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

const Container = styled('div')({
  position: 'absolute',
  bottom: '75px',
  width: '100%',
  overflow: 'visible',
  background: 'none !important',
  textAlign: 'center',
  color: 'white',
  cursor: 'default',
  zIndex: 9999999,
});

const SubtitleWrapper = styled('div')({
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: 'white',
  fontSize: '24px',
  backgroundColor: 'rgba(0,0,0,0.5)',
  borderRadius: '40px',
});

const SubtitleButton = styled('div')({
  display: 'inline-block',
  backgroundColor: 'transparent',
  fontWeight: 900,
  marginLeft: '10px',
  marginRight: '10px',
  color: 'white',
  border: 'none',
  cursor: 'pointer',
  userSelect: 'none',
});

const SubtitleText = styled('div')({
  display: 'inline-block',
  margin: '7px 0 7px 0',
  userSelect: 'none',
  textAlign: 'center',
});

const MusicWrapper = styled('div')({
  display: 'block',
  margin: 0,
});

function Subtitles({ video }) {
  const [videoPlaying, setVideoPlaying] = useState(true);
  const [currentSubtitles, setCurrentSubtitles] = useState(
    'No subtitles loaded'
  );
  const [subtitleArr, setSubtitleArr] = useState([]);
  const [pos, setPos] = useState(0);
  const [musicButton, setMusicButton] = useState(false);

  useEffect(() => {
    prepareTimeUpdate();
    // eslint-disable-next-line
  }, [subtitleArr]);

  eventBus.on('fileUpload', (file) => {
    languageEncoding(file)
      .then((fileInfo) => {
        const reader = new FileReader();

        reader.onload = function (evt) {
          const content = evt.target.result;
          setSubtitleArr(processSubtitles(content.split('\n')));
        };
        reader.readAsText(file, fileInfo.encoding);
      })
      .catch((err) => {
        console.log('Error caught:', err);
      });
  });

  video.ontimeupdate = prepareTimeUpdate;

  function prepareTimeUpdate() {
    if (subtitleArr.length > 1) {
      setCurrentSubtitles(
        timeUpdate(subtitleArr, video, pos, setPos, setMusicButton)
      );
    }
  }

  const pauseHandler = () => {
    if (!video.paused) {
      video.pause();
      setVideoPlaying(false);
    }
  };

  const playHandler = () => {
    if (!videoPlaying) {
      video.play();
      setVideoPlaying(true);
    }
  };

  const handlePrevButton = () => {
    if (video.currentTime > subtitleArr[pos].start + 1) {
      video.currentTime = subtitleArr[pos].start;
    } else if (pos !== 0) {
      video.currentTime = subtitleArr[pos - 1].start;
    }
    prepareTimeUpdate();
  };

  const handleNextButton = () => {
    if (pos !== subtitleArr.length - 1) {
      video.currentTime = subtitleArr[pos + 1].start;
    }
    prepareTimeUpdate();
  };

  return (
    <Container>
      <Draggable axis="y">
        <SubtitleWrapper onMouseEnter={pauseHandler} onMouseLeave={playHandler}>
          <SubtitleButton onClick={handlePrevButton}>«</SubtitleButton>
          <MusicWrapper>
            <SubtitleText
              dangerouslySetInnerHTML={{ __html: currentSubtitles }}
            ></SubtitleText>
            {musicButton && (
              <Grid container justify="center" style={{ marginBottom: '7px' }}>
                <Button variant="contained" color="primary">
                  Music (26 seconds)
                </Button>
              </Grid>
            )}
          </MusicWrapper>
          <SubtitleButton onClick={handleNextButton}>»</SubtitleButton>
        </SubtitleWrapper>
      </Draggable>
    </Container>
  );
}

export default Subtitles;
