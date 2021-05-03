import React, { useState, useEffect, useRef } from 'react';
import Subtitles from './subtitles/Subtitles';

export default function Content({ video }) {
  const displaySubtitleRef = useRef(true);
  const [displaySubtitles, setDisplaySubtitles] = useState(
    displaySubtitleRef.current
  );
  const speedRef = useRef(0);
  const [speedDisplay, setSpeedDisplay] = useState(false);

  // Listen for shortcut keypress events
  useEffect(() => {
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
        } else if (key === 'z') {
          // Rewind 2.5 Seconds
          video.currentTime = video.currentTime - 2.5;
          event.preventDefault();
          event.stopPropagation();
        } else if (key === 'x') {
          // Fast-Forward 2.5 Seconds
          video.currentTime = video.currentTime + 2.5;
          event.preventDefault();
          event.stopPropagation();
        } else if (key === 'ArrowLeft') {
          // Rewind 5 Seconds
          video.currentTime = video.currentTime - 5;
          event.preventDefault();
          event.stopPropagation();
        } else if (key === 'ArrowRight') {
          // Fast-Forward 5 Seconds
          video.currentTime = video.currentTime + 5;
          event.preventDefault();
          event.stopPropagation();
        } else if (key === 'a') {
          // Previous Sentence
          document.getElementById('movie-subtitles-prev-button').click();
          event.preventDefault();
          event.stopPropagation();
        } else if (key === 's') {
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
      <div id="movie-subtitles-blurred-background"></div>
      {displaySubtitles && (
        <Subtitles video={video} speedDisplay={speedDisplay} />
      )}
      <div id="movie-subtitles-menu-container"></div>
    </>
  );
}
