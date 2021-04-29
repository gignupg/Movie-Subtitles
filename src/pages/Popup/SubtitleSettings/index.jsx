import React from 'react';
import LoadSubtitles from './LoadSubtitles';
import DisplaySettings from './DisplaySettings';
import Synchronization from './Synchronization';

const SubtitleSettings = ({ popup }) => {
  return (
    <>
      <LoadSubtitles popup={popup} />
      <DisplaySettings />
      <Synchronization />
    </>
  );
};

export default SubtitleSettings;
