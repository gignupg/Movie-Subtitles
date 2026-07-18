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
      format: 'Wrong format! Please, use .srt, .sub, .txt, .ass, or .ssa subtitles!',
      damagedFile: 'Damaged subtitle file! Please, try another one!'
    },
    success: 'Synchronisation successful!',
  },
  types: ['application/x-subrip', 'text/plain', 'text/x-microdvd'],   // .srt, .txt, .sub, .ass, .ssa
}

const useStyles = makeStyles(() => ({
  root: {
    fontSize: (props) => props.fontSize,
    fontFamily: (props) => props.fontFamily,
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

function Subtitles({ video, subsEnabled, speedDisplay, netflix, disney, editRef }) {
  const [shouldResumeOnMouseLeave, setShouldResumeOnMouseLeave] = useState(false);
  const subsRef = useRef([{ text: subtitles.text.default }]);
  const [subs, setSubs] = useState(subsRef.current);
  const currentOffsetRef = useRef(0);
  const [pos, setPos] = useState(0);
  const [musicHover, setMusicHover] = useState(false);
  const [silenceIndicator, setSilenceIndicator] = useState(false);
  const [sentenceNavigationButtons, setSentenceNavigationButtons] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [pauseOnHover, setPauseOnHover] = useState(false);
  const [displaySubtitles, setDisplaySubtitles] = useState(true);
  const [infoDialog, setInfoDialog] = useState('');
  const [subtitleColor, setSubtitleColor] = useState(subtitles.color.default);
  const fontRef = useRef(24);
  const [fontSize, setFontSize] = useState(fontRef.current);
  const fontFamilyRef = useRef('sans-serif');
  const [fontFamily, setFontFamily] = useState(fontFamilyRef.current);
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

  function notifySubtitleOffsetChanged() {
    document.dispatchEvent(
      new CustomEvent('subtitleOffsetChanged', {
        detail: currentOffsetRef.current,
      })
    );
  }

  function applySynchronization(data, displaySuccess = true) {
    if (data.syncValue !== undefined && subsRef.current.length > 1) {
      synchronize(data, subsRef, setSubs, null, currentOffsetRef);
      notifySubtitleOffsetChanged();

      if (displaySuccess) {
        // Displaying success message for 2 seconds
        setSubtitleColor(subtitles.color.success);

        const syncInterval = setInterval(() => {
          setSubtitleColor(subtitles.color.default);
          clearInterval(syncInterval);
        }, 100)
      }
    }
  }

  // By using classes (useStyles) we can overwrite global css rules.
  // In this case the Chrome Extension 'TubeBuddy' was overwriting the fontSize...
  const props = { fontSize: fontSize, fontFamily: fontFamily };
  const classes = useStyles(props);

  // Retrieving user specific settings from chrome storage
  chrome.storage.sync.get(null, function (storage) {
    if (storage.fontSize !== undefined) {
      fontRef.current = storage.fontSize;
      setFontSize(storage.fontSize);
    }
    if (storage.fontFamily !== undefined) {
      fontFamilyRef.current = storage.fontFamily;
      setFontFamily(storage.fontFamily);
    }
    if (storage.opacity !== undefined) {
      opacityRef.current = storage.opacity;
      setOpacity(storage.opacity);
    }
    if (storage.silence !== undefined && silenceIndicator !== storage.silence) {
      setSilenceIndicator(storage.silence);
    }
    if (storage.sentenceNavigationButtons !== undefined && sentenceNavigationButtons !== storage.sentenceNavigationButtons) {
      setSentenceNavigationButtons(storage.sentenceNavigationButtons);
    }
    if (storage.editMode !== undefined && editMode !== storage.editMode) {
      editRef.current = storage.editMode;
      setEditMode(storage.editMode);
    }
    if (storage.pauseOnHover !== undefined && pauseOnHover !== storage.pauseOnHover) {
      setPauseOnHover(storage.pauseOnHover);
    }
  });

  useEffect(() => {
    if (subsEnabled) {
      if (!silenceIndicator && /Silence \(.*\)/.test(subs[pos].text)) {
        setDisplaySubtitles(false);
      } else {
        setDisplaySubtitles(true);
      }
    }

  }, [pos, silenceIndicator, subs, subsEnabled]);

  useEffect(() => {
    prepareTimeUpdate();

    if (amazon && upload) {
      setUpload(false);
      const data = { syncValue: 10 };
      applySynchronization(data, false);
    }
    // eslint-disable-next-line
  }, [subs]);

  if (!listening) {
    // Make sure only to set up one listener!
    setListening(true);

    // Updating advanced settings whenever they are changed
    chrome.storage.onChanged.addListener(function (changes) {
      for (let [key, { _, newValue }] of Object.entries(changes)) {
        if (key === 'silence') {
          setSilenceIndicator(newValue);
        } else if (key === 'sentenceNavigationButtons') {
          setSentenceNavigationButtons(newValue);
        } else if (key === 'editMode') {
          editRef.current = newValue;
          setEditMode(newValue);
        } else if (key === 'pauseOnHover') {
          setPauseOnHover(newValue);
        }
      }
    });

    // Let the in-video Sync menu pull the real current offset on demand—
    // it never unmounts (only hidden), so it can't rely on mount alone to
    // discard an edit that was never confirmed via Sync Now.
    document.addEventListener('requestSubtitleOffset', notifySubtitleOffsetChanged, false);

    // Listen for fileUploads
    document.addEventListener(
      'fileUpload',
      function (e) {
        const file = e.detail;
        const extRegEx = new RegExp('^.*\.(srt|sub|txt|ass|ssa)$', 'i');
        const validExt = extRegEx.test(file.name);

        setPos(0);
        subsRef.current = [{ text: subtitles.text.default }];
        setSubs(subsRef.current);
        currentOffsetRef.current = 0;
        notifySubtitleOffsetChanged();

        if (subtitles.types.includes(file.type) || validExt) {
          // Making sure it's a supported subtitle format.
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

        if (action && action.type === 'font-family') {
          fontFamilyRef.current = action.value;
          setFontFamily(action.value);
          chrome.storage.sync.set({
            fontFamily: action.value,
          });
          return;
        }

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
        applySynchronization(e.detail);
      },
      false
    );

    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      if (msg.getSubtitleOffset) {
        sendResponse({ syncValue: currentOffsetRef.current });
        return;
      }

      if (msg.syncValue !== undefined) {
        applySynchronization(msg);
      }
    });
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
      setShouldResumeOnMouseLeave(true);
    }
  };

  const playHandler = () => {
    if (shouldResumeOnMouseLeave) {
      video.play();
      setShouldResumeOnMouseLeave(false);
    }
  };

  const keepPausedAfterSentenceNavigation = () => {
    // A different-length subtitle can resize the wrapper and move it out from
    // under the pointer, triggering mouse leave without deliberate mouse movement.
    // Keep the video paused so the user can navigate through several sentences.
    setShouldResumeOnMouseLeave(false);
  };

  const handlePrevButton = () => {
    keepPausedAfterSentenceNavigation();
    if (video.currentTime > subs[pos].start + 1) {
      video.currentTime = subs[pos].start;
      setPos(pos);
    } else if (pos !== 0) {
      const previousPos = pos - 1;
      video.currentTime = subs[previousPos].start;
      setPos(previousPos);
    }
  };

  const handleNextButton = () => {
    keepPausedAfterSentenceNavigation();
    if (pos !== subs.length - 1) {
      const nextPos = pos + 1;
      video.currentTime = subs[nextPos].start;
      setPos(nextPos);
    }
  };

  useEffect(() => {
    function handleSentenceNavigation(e) {
      if (e.detail === 'previous') {
        handlePrevButton();
      } else if (e.detail === 'next') {
        handleNextButton();
      }
    }

    document.addEventListener('sentenceNavigation', handleSentenceNavigation, false);

    return () => {
      document.removeEventListener('sentenceNavigation', handleSentenceNavigation, false);
    };
  }, [handlePrevButton, handleNextButton]);

  return (
    <Draggable axis="y" disabled={editMode}>
      <Container>
        {(subsEnabled && displaySubtitles) && (
          <SubtitleWrapper
            style={{
              backgroundColor: `rgba(0,0,0,${opacity})`,
            }}
            onMouseEnter={pauseOnHover ? pauseHandler : undefined}
            onMouseLeave={playHandler}
          >
            {(!netflix && !disney && !infoDialog && sentenceNavigationButtons) && (
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
                      !netflix && !disney
                        ? (video.currentTime = subs[pos].music.end)
                        : null
                    }
                    onMouseEnter={() => setMusicHover(true)}
                    onMouseLeave={() => setMusicHover(false)}
                  >
                    {musicHover && !netflix && !disney
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
            {(!netflix && !disney && !infoDialog && sentenceNavigationButtons) && (
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
