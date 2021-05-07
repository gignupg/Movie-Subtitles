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
  const displaySubtitleRef = useRef(true);
  const [displaySubtitles, setDisplaySubtitles] = useState(
    displaySubtitleRef.current
  );
  const speedRef = useRef(0);
  const [speedDisplay, setSpeedDisplay] = useState(false);
  const [menu, setMenu] = useState(false);
  const [netflix] = useState(window.location.hostname === 'www.netflix.com');

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
        const key = event.key.toLowerCase();

        if (key === 'c') {
          // Toggle Subtitles
          displaySubtitleRef.current = !displaySubtitleRef.current;
          setDisplaySubtitles(displaySubtitleRef.current);
          event.preventDefault();
          event.stopPropagation();
        } else if (key === 'z' && !netflix) {
          // Rewind 2.5 Seconds
          video.currentTime = video.currentTime - 2.5;
          event.preventDefault();
          event.stopPropagation();
        } else if (key === 'x' && !netflix) {
          // Fast-Forward 2.5 Seconds
          video.currentTime = video.currentTime + 2.5;
          event.preventDefault();
          event.stopPropagation();
        } else if (key === 'ArrowLeft' && !netflix) {
          // Rewind 5 Seconds
          video.currentTime = video.currentTime - 5;
          event.preventDefault();
          event.stopPropagation();
        } else if (key === 'ArrowRight' && !netflix) {
          // Fast-Forward 5 Seconds
          video.currentTime = video.currentTime + 5;
          event.preventDefault();
          event.stopPropagation();
        } else if (key === 'a' && !netflix) {
          // Previous Sentence
          document.getElementById('movie-subtitles-prev-button').click();
          event.preventDefault();
          event.stopPropagation();
        } else if (key === 's' && !netflix) {
          // Next Sentence
          document.getElementById('movie-subtitles-next-button').click();
          event.preventDefault();
          event.stopPropagation();
        } else if (key === 'q') {
          // Decrease Playback Speed
          video.playbackRate = Number((video.playbackRate - 0.1).toFixed(1));
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
          video.playbackRate = Number((video.playbackRate + 0.1).toFixed(1));
          setSpeedDisplay(video.playbackRate);
          speedRef.current++;
          setTimeout(() => {
            speedRef.current--;
            if (!speedRef.current) setSpeedDisplay(false);
          }, 2000);
          event.preventDefault();
          event.stopPropagation();
        }
      },
      true
    );
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {menu && <BlurredBackground onClick={() => setMenu(false)} />}
      {displaySubtitles && (
        <Subtitles video={video} speedDisplay={speedDisplay} />
      )}
      <PopupWrapper
        popup={false}
        setMenu={setMenu}
        display={menu ? 'block' : 'none'}
      />
    </>
  );
}
