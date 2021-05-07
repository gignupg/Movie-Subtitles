import React, { useState, useEffect, useRef } from 'react';
import { styled } from '@material-ui/core/styles';
import Draggable from 'react-draggable';
import languageEncoding from 'detect-file-encoding-and-language';
import processSubtitles from './processSubtitles';
import timeUpdate from './timeUpdate';
import synchronize from './synchronize';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

const Container = styled('div')({
  position: 'absolute',
  bottom: '75px',
  left: 0,
  right: 0,
  width: '100%',
  margin: 'auto',
  pointerEvents: 'none',
  textAlign: 'center',
  zIndex: 2147483647,
});

const SubtitleWrapper = styled('div')({
  display: 'inline-flex',
  alignItems: 'center',
  paddingLeft: '15px',
  paddingRight: '15px',
  borderRadius: '40px',
  pointerEvents: 'all',
  fontFamily: 'sans-serif',
  color: 'white',
});

const SubtitleButton = styled('div')({
  display: 'inline-block',
  backgroundColor: 'transparent',
  fontWeight: 900,
  marginLeft: '0',
  marginRight: '0',
  border: 'none',
  cursor: 'pointer',
  userSelect: 'none',
});

const SubtitleText = styled('div')({
  display: 'inline-block',
  margin: '7px 10px 7px 10px',
  userSelect: 'none',
  textAlign: 'center',
});

const MusicWrapper = styled('div')({
  display: 'block',
  margin: 0,
});

function Subtitles({ video, speedDisplay }) {
  const [forcedPause, setForcedPause] = useState(false);
  const subsRef = useRef([{ text: 'No subtitles loaded' }]);
  const [subs, setSubs] = useState(subsRef.current);
  const [pos, setPos] = useState(0);
  const [musicHover, setMusicHover] = useState(false);
  const fontRef = useRef(24);
  const [fontSize, setFontSize] = useState(fontRef.current);
  const opacityRef = useRef(0.5);
  const [opacity, setOpacity] = useState(opacityRef.current);
  const [listening, setListening] = useState(false);
  const [netflix] = useState(window.location.hostname === 'www.netflix.com');

  // Retrieve user specific settings from chrome storage
  chrome.storage.sync.get(null, function (storage) {
    if (storage.fontSize !== undefined) {
      fontRef.current = storage.fontSize;
      setFontSize(storage.fontSize);
    }
    if (storage.opacity !== undefined) {
      opacityRef.current = storage.opacity;
      setOpacity(storage.opacity);
    }
  });

  useEffect(() => {
    prepareTimeUpdate();
    // eslint-disable-next-line
  }, [subs]);

  if (!listening) {
    // Make sure only to set up one listener!
    setListening(true);

    // Listen for fileUploads
    document.addEventListener(
      'fileUpload',
      function (e) {
        const file = e.detail;
        languageEncoding(file)
          .then((fileInfo) => {
            const reader = new FileReader();

            reader.onload = function (evt) {
              const content = evt.target.result;
              processSubtitles(content.split('\n'), subsRef, setSubs);
            };
            reader.readAsText(file, fileInfo.encoding);
          })
          .catch((err) => {
            console.log('Error caught:', err);
          });
      },
      false
    );

    // Listen for displaySettings
    document.addEventListener(
      'displaySettings',
      function (e) {
        const action = e.detail;

        switch (action) {
          case 'font-smaller':
            if (fontRef.current > 0) {
              fontRef.current -= 2;
              setFontSize(fontRef.current);
              chrome.storage.sync.set({
                fontSize: fontRef.current,
              });
            }
            break;
          case 'font-bigger':
            fontRef.current += 2;
            setFontSize(fontRef.current);
            chrome.storage.sync.set({
              fontSize: fontRef.current,
            });
            break;
          case 'opacity-minus':
            if (opacityRef.current > 0) {
              opacityRef.current -= 0.1;
              setOpacity(opacityRef.current);
              chrome.storage.sync.set({
                opacity: opacityRef.current,
              });
            }
            break;
          case 'opacity-plus':
            if (opacityRef.current < 1) {
              opacityRef.current += 0.1;
              setOpacity(opacityRef.current);
              chrome.storage.sync.set({
                opacity: opacityRef.current,
              });
            }
            break;
          default:
          // Do nothing
        }
      },
      false
    );

    // Listen for subtitle synchronization
    document.addEventListener(
      'syncNow',
      function (e) {
        const data = e.detail;

        if (data.syncValue && subsRef.current.length > 1) {
          synchronize(data, subsRef, setSubs);
        }
      },
      false
    );
  }

  video.ontimeupdate = prepareTimeUpdate;

  function prepareTimeUpdate() {
    if (subs.length > 1) {
      timeUpdate(subs, video, pos, setPos);
    }
  }

  const pauseHandler = () => {
    if (!video.paused) {
      video.pause();
      setForcedPause(true);
    }
  };

  const playHandler = () => {
    if (forcedPause) {
      video.play();
      setForcedPause(false);
    }
  };

  const handlePrevButton = () => {
    setForcedPause(false);
    if (video.currentTime > subs[pos].start + 1) {
      video.currentTime = subs[pos].start;
    } else if (pos !== 0) {
      video.currentTime = subs[pos - 1].start;
    }
    prepareTimeUpdate();
  };

  const handleNextButton = () => {
    setForcedPause(false);
    if (pos !== subs.length - 1) {
      video.currentTime = subs[pos + 1].start;
    }
    prepareTimeUpdate();
  };

  return (
    <Draggable axis="y">
      <Container>
        <SubtitleWrapper
          style={{
            fontSize: fontSize + 'px',
            backgroundColor: `rgba(0,0,0,${opacity})`,
          }}
          onMouseEnter={pauseHandler}
          onMouseLeave={playHandler}
        >
          {!netflix && (
            <SubtitleButton
              onClick={handlePrevButton}
              id="movie-subtitles-prev-button"
            >
              «
            </SubtitleButton>
          )}
          <MusicWrapper>
            <SubtitleText
              dangerouslySetInnerHTML={{ __html: subs[pos].text }}
            ></SubtitleText>
            {subs[pos].music && (
              <Grid container justify="center" style={{ marginBottom: '7px' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    !netflix ? (video.currentTime = subs[pos].music.end) : null
                  }
                  onMouseEnter={() => setMusicHover(true)}
                  onMouseLeave={() => setMusicHover(false)}
                >
                  {musicHover && !netflix
                    ? 'Skip the music!'
                    : subs[pos].music.text}
                </Button>
              </Grid>
            )}
            {speedDisplay && (
              <Grid container justify="center" style={{ marginBottom: '7px' }}>
                <Button variant="contained" color="secondary">
                  {speedDisplay}
                </Button>
              </Grid>
            )}
          </MusicWrapper>
          {!netflix && (
            <SubtitleButton
              onClick={handleNextButton}
              id="movie-subtitles-next-button"
            >
              »
            </SubtitleButton>
          )}
        </SubtitleWrapper>
      </Container>
    </Draggable>
  );
}

export default Subtitles;
