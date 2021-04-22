import React from 'react';
import LoadSubtitles from './LoadSubtitles';
import DisplaySettings from './DisplaySettings';
import Synchronization from './Synchronization';

const SubtitleSettings = () => {
  return (
    <>
      <LoadSubtitles />
      <DisplaySettings />
      <Synchronization />
    </>
  );
};

export default SubtitleSettings;
