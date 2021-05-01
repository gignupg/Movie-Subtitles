import React from 'react';
import LoadSubtitles from './LoadSubtitles';
import DisplaySettings from './DisplaySettings';
import Synchronization from './Synchronization';

const SubtitleSettings = ({ popup, setMenu }) => {
  return (
    <>
      <LoadSubtitles popup={popup} setMenu={setMenu} />
      <DisplaySettings popup={popup} />
      <Synchronization />
    </>
  );
};

export default SubtitleSettings;
