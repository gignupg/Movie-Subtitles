import React from 'react';
import Subtitles from './subtitles/Subtitles';

export default function Content({ video }) {
  return (
    <>
      <div id="movie-subtitles-blurred-background"></div>
      <Subtitles video={video} />
      <div id="movie-subtitles-menu-container"></div>
    </>
  );
}
