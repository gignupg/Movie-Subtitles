import React, { useState, useEffect, useRef } from 'react';
import { render } from 'react-dom';
import Subtitles from './subtitles/Subtitles';
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

export default function Content({ video, iconWrapper }) {
  const subsEnabledRef = useRef(true);
  const [subsEnabled, setSubsEnabled] = useState(subsEnabledRef.current);
  const speedRef = useRef(0);
  const [speedDisplay, setSpeedDisplay] = useState(false);
  const [menu, setMenu] = useState(false);
  const netflix = window.location.hostname === 'www.netflix.com';
  const disney = window.location.hostname === 'www.disneyplus.com';
  const amazon = /www\.amazon/.test(window.location.hostname) || /smile\.amazon/.test(window.location.hostname);
  const editRef = useRef(false);

  // Close the in-video popup menu when the real popup is opened
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.activation) {
      setMenu(false);
    }
  });

  // Listen for shortcut keypress events
  useEffect(() => {
    // Display the icon
    if (iconWrapper) {
      render(
        <img
          onClick={() => setMenu(true)}
          src={chrome.runtime.getURL('movie-subtitles-24.png')}
          alt="Logo"
        />,
        iconWrapper
      );
    }

    // Shortcuts
    document.addEventListener(
      'keydown',
      function (event) {
        const focusedElement = event.target.nodeName;
        const elementId = event.target.id;

        if (focusedElement !== 'INPUT' && elementId !== 'contenteditable-root') {
          // Disabling shortcuts when user is typing in search box or writing comments on YouTube
          const key = event.key.toLowerCase();

          if (key === 'c') {
            if (editRef.current) {
              // The execCommand is deprecated though the copy functionality is still supported by all major web browsers!
              document.execCommand('copy');
            } else {
              // Making sure only to toggle subtitles when not in editMode. In edit mode we copy the subtitles instead of toggling them.
              subsEnabledRef.current = !subsEnabledRef.current;
              setSubsEnabled(subsEnabledRef.current);
            }
            event.preventDefault();
            event.stopPropagation();
          } else if (key === 'z' && !netflix && !disney) {
            // Rewind 2.5 Seconds
            video.currentTime = video.currentTime - 2.5;
            event.preventDefault();
            event.stopPropagation();
          } else if (key === 'x' && !netflix && !disney) {
            // Fast-Forward 2.5 Seconds
            video.currentTime = video.currentTime + 2.5;
            event.preventDefault();
            event.stopPropagation();
          } else if (key === 'ArrowLeft' && !netflix && !disney) {
            // Rewind 5 Seconds
            video.currentTime = video.currentTime - 5;
            event.preventDefault();
            event.stopPropagation();
          } else if (key === 'ArrowRight' && !netflix && !disney) {
            // Fast-Forward 5 Seconds
            video.currentTime = video.currentTime + 5;
            event.preventDefault();
            event.stopPropagation();
          } else if (key === 'a' && !netflix && !disney && !amazon) {
            // Previous Sentence
            document.dispatchEvent(new CustomEvent('sentenceNavigation', { detail: 'previous' }));
            event.preventDefault();
            event.stopPropagation();
          } else if (key === 's' && !netflix && !disney && !amazon) {
            // Next Sentence
            document.dispatchEvent(new CustomEvent('sentenceNavigation', { detail: 'next' }));
            event.preventDefault();
            event.stopPropagation();
          } else if (key === 's' && amazon) {
            // Previous Sentence (Amazon)
            document.dispatchEvent(new CustomEvent('sentenceNavigation', { detail: 'previous' }));
            event.preventDefault();
            event.stopPropagation();
          } else if (key === 'd' && amazon) {
            // Next Sentence (Amazon)
            document.dispatchEvent(new CustomEvent('sentenceNavigation', { detail: 'next' }));
            event.preventDefault();
            event.stopPropagation();
          } else if (key === 'q') {
            // Decrease Playback Speed
            video.playbackRate = Number((video.playbackRate - 0.25).toFixed(2));
            setSpeedDisplay(video.playbackRate);
            speedRef.current++;
            setTimeout(() => {
              speedRef.current--;
              if (!speedRef.current) setSpeedDisplay(false);
            }, 2000);
            event.preventDefault();
            event.stopPropagation();
          } else if (key === 'w') {
            // Increase Playback Speed
            video.playbackRate = Number((video.playbackRate + 0.25).toFixed(2));
            setSpeedDisplay(video.playbackRate);
            speedRef.current++;
            setTimeout(() => {
              speedRef.current--;
              if (!speedRef.current) setSpeedDisplay(false);
            }, 2000);
            event.preventDefault();
            event.stopPropagation();
          } else if (key === 'g') {
            // Sync subtitles (display them 1 second earlier)
            const syncNow = new CustomEvent('syncNow', { detail: { syncValue: -1, relative: true } });
            document.dispatchEvent(syncNow);
            event.preventDefault();
            event.stopPropagation();
          } else if (key === 'h') {
            // Sync subtitles (display them 1 second later)
            const syncNow = new CustomEvent('syncNow', { detail: { syncValue: 1, relative: true } });
            document.dispatchEvent(syncNow);
            event.preventDefault();
            event.stopPropagation();
          }
        }
      },
      true
    );
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {menu && <BlurredBackground onClick={() => setMenu(false)} />}
        <Subtitles
          video={video}
          subsEnabled={subsEnabled}
          speedDisplay={speedDisplay}
          netflix={netflix}
          disney={disney}
          editRef={editRef}
        />
      <PopupWrapper
        popup={false}
        setMenu={setMenu}
        display={menu ? 'block' : 'none'}
      />
    </>
  );
}
