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
  const [subs, setSubs] = useState([{ text: 'No subtitles loaded' }]);
  const [pos, setPos] = useState(0);
  const [musicHover, setMusicHover] = useState(false);

  useEffect(() => {
    prepareTimeUpdate();
    // eslint-disable-next-line
  }, [subs]);

  eventBus.on('fileUpload', (file) => {
    languageEncoding(file)
      .then((fileInfo) => {
        const reader = new FileReader();

        reader.onload = function (evt) {
          const content = evt.target.result;
          setSubs(processSubtitles(content.split('\n')));
        };
        reader.readAsText(file, fileInfo.encoding);
      })
      .catch((err) => {
        console.log('Error caught:', err);
      });
  });

  video.ontimeupdate = prepareTimeUpdate;

  function prepareTimeUpdate() {
    if (subs.length > 1) {
      timeUpdate(subs, video, pos, setPos);
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
    if (video.currentTime > subs[pos].start + 1) {
      video.currentTime = subs[pos].start;
    } else if (pos !== 0) {
      video.currentTime = subs[pos - 1].start;
    }
    prepareTimeUpdate();
  };

  const handleNextButton = () => {
    if (pos !== subs.length - 1) {
      video.currentTime = subs[pos + 1].start;
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
              dangerouslySetInnerHTML={{ __html: subs[pos].text }}
            ></SubtitleText>
            {subs[pos].music && (
              <Grid container justify="center" style={{ marginBottom: '7px' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => (video.currentTime = subs[pos].music.end)}
                  onMouseEnter={() => setMusicHover(true)}
                  onMouseLeave={() => setMusicHover(false)}
                >
                  {musicHover ? 'Skip the music!' : subs[pos].music.text}
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
