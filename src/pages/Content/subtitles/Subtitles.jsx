import React, { useState, useEffect, useRef } from 'react';
import { styled, makeStyles } from '@material-ui/core/styles';
import Draggable from 'react-draggable';
import languageEncoding from 'detect-file-encoding-and-language';
import processSubtitles from './processSubtitles';
import timeUpdate from './timeUpdate';
import synchronize from './synchronize';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

const subtitles = {
  color: {
    default: 'white',
    error: 'red',
    success: 'lime',
  },
  text: {
    default: 'No subtitles loaded',
    error: {
      format: 'Wrong format! Please, use .srt, .sub, or .txt subtitles!',
      damagedFile: 'Damaged subtitle file! Please, try another one!'
    },
    success: 'Synchronisation successful!',
  },
  types: ['application/x-subrip', 'text/plain', 'text/x-microdvd'],   // .srt, .txt, .sub
}

const useStyles = makeStyles(() => ({
  root: {
    fontSize: (props) => props.fontSize,
  },
}));

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
  color: subtitles.color.default,
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
  textAlign: 'center',
});

const SubtitleArea = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  margin: 0,
});

function Subtitles({ video, speedDisplay, netflix, editRef }) {
  const [forcedPause, setForcedPause] = useState(false);
  const subsRef = useRef([{ text: subtitles.text.default }]);
  const [subs, setSubs] = useState(subsRef.current);
  const [pos, setPos] = useState(0);
  const [musicHover, setMusicHover] = useState(false);
  const [silenceIndicator, setSilenceIndicator] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [displaySubtitles, setDisplaySubtitles] = useState(true);
  const [infoDialog, setInfoDialog] = useState('');
  const [subtitleColor, setSubtitleColor] = useState(subtitles.color.default);
  const fontRef = useRef(24);
  const [fontSize, setFontSize] = useState(fontRef.current);
  const opacityRef = useRef(0.5);
  const [opacity, setOpacity] = useState(opacityRef.current);
  const [listening, setListening] = useState(false);
  const [upload, setUpload] = useState(false);
  // We want to know whether it's amazon or atv amazon.
  // Atv amazon is using the atv web player sdk and works differently than amazon.
  // On amazon we got to make sure to display the subtitles 10 seconds later.
  const [amazon] = useState(
    Boolean(document.querySelector('.hideableTopButtons'))
  );

  // By using classes (useStyles) we can overwrite global css rules.
  // In this case the Chrome Extension 'TubeBuddy' was overwriting the fontSize...
  const props = { fontSize: fontSize };
  const classes = useStyles(props);

  // Retrieving user specific settings from chrome storage
  chrome.storage.sync.get(null, function (storage) {
    if (storage.fontSize !== undefined) {
      fontRef.current = storage.fontSize;
      setFontSize(storage.fontSize);
    }
    if (storage.opacity !== undefined) {
      opacityRef.current = storage.opacity;
      setOpacity(storage.opacity);
    }
    if (storage.silence !== undefined && silenceIndicator !== storage.silence) {
      setSilenceIndicator(storage.silence);
    }
    if (storage.editMode !== undefined && editMode !== storage.editMode) {
      editRef.current = storage.editMode;
      setEditMode(storage.editMode);
    }
  });

  useEffect(() => {
    if (!silenceIndicator && /Silence \(.*\)/.test(subs[pos].text)) {
      setDisplaySubtitles(false);
    } else {
      setDisplaySubtitles(true);
    }
  }, [pos, silenceIndicator, subs]);

  useEffect(() => {
    prepareTimeUpdate();

    if (amazon && upload) {
      setUpload(false);
      const data = { syncValue: 10, syncLater: true };
      synchronize(data, subsRef, setSubs);
    }
    // eslint-disable-next-line
  }, [subs]);

  if (!listening) {
    // Make sure only to set up one listener!
    setListening(true);

    // Updating the silence indicator whenever it is changed
    chrome.storage.onChanged.addListener(function (changes) {
      for (let [key, { _, newValue }] of Object.entries(changes)) {
        if (key === 'silence') {
          setSilenceIndicator(newValue);
        } else if (key === 'editMode') {
          editRef.current = newValue;
          setEditMode(newValue);
        }
      }
    });

    // Listen for fileUploads
    document.addEventListener(
      'fileUpload',
      function (e) {
        const file = e.detail;
        const extRegEx = new RegExp('^.*\.(srt|sub|txt)$', 'i');
        const validExt = extRegEx.test(file.name);

        // Resetting any previously loaded subtitles
        setPos(0);
        subsRef.current = [{ text: subtitles.text.default }];
        setSubs(subsRef.current);

        if (subtitles.types.includes(file.type) || validExt) {
          // Making sure it's either .srt, .txt, or .sub
          languageEncoding(file)
          .then((fileInfo) => {
            const reader = new FileReader();

            reader.onload = function (evt) {
              const content = evt.target.result;
              setUpload(true);
              
              try {
                processSubtitles(content.split('\n'), subsRef, setSubs);
                setInfoDialog('');
                setSubtitleColor(subtitles.color.default);

              } catch(err) {
                console.log('Catch in processSubtitles()!', err);
                setInfoDialog(subtitles.text.error.damagedFile);
                setSubtitleColor(subtitles.color.error);
              }
            };

            reader.readAsText(file, fileInfo.encoding);

          })
          .catch((err) => {
            console.warn('Error caught:', err);
          });

        } else {
          // Displaying error message (wrong format)
          setInfoDialog(subtitles.text.error.format)
          setSubtitleColor(subtitles.color.error);
        }

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

          // Displaying success message for 2 seconds
          setInfoDialog(subtitles.text.success)
          setSubtitleColor(subtitles.color.success);

          const syncInterval = setInterval(() => {
            setInfoDialog('');
            setSubtitleColor(subtitles.color.default);
            clearInterval(syncInterval);
          }, 2000)
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
    <Draggable axis="y" disabled={editMode}>
      <Container>
        {displaySubtitles && (
          <SubtitleWrapper
            style={{
              backgroundColor: `rgba(0,0,0,${opacity})`,
            }}
            onMouseEnter={pauseHandler}
            onMouseLeave={playHandler}
          >
            {(!netflix && !infoDialog) && (
              <SubtitleButton
                onClick={handlePrevButton}
                id="movie-subtitles-prev-button"
                className={classes.root}
              >
                «
              </SubtitleButton>
            )}
            <SubtitleArea>
              <SubtitleText
                dangerouslySetInnerHTML={{ __html: infoDialog ? infoDialog : subs[pos].text }}
                className={classes.root}
                style={{
                  userSelect: editMode ? 'text' : 'none',
                  color: subtitleColor,
                }}
              ></SubtitleText>
              {subs[pos].music && (
                <Grid
                  container
                  justify="center"
                  style={{ marginBottom: '7px' }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      !netflix
                        ? (video.currentTime = subs[pos].music.end)
                        : null
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
                <Grid
                  container
                  justify="center"
                  style={{ marginBottom: '7px' }}
                >
                  <Button variant="contained" color="secondary">
                    {speedDisplay}
                  </Button>
                </Grid>
              )}
            </SubtitleArea>
            {(!netflix && !infoDialog) && (
              <SubtitleButton
                onClick={handleNextButton}
                id="movie-subtitles-next-button"
                className={classes.root}
              >
                »
              </SubtitleButton>
            )}
          </SubtitleWrapper>
        )}
      </Container>
    </Draggable>
  );
}

export default Subtitles;
