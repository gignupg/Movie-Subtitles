import React from 'react';
import Upload from './Upload';
import Display from './Display';
import Sync from './Sync';
import Advanced from './Advanced';

const SubtitleSettings = ({ popup, setMenu }) => {
  return (
    <>
      <Upload popup={popup} setMenu={setMenu} />
      <Display popup={popup} />
      <Sync popup={popup} />
      <Advanced />
    </>
  );
};

export default SubtitleSettings;
