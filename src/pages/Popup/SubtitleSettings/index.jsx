import React from 'react';
import Upload from './Upload';
import Display from './Display';
import Sync from './Sync';
import Advanced from './Advanced';

const SubtitleSettings = ({ popup, setMenu, menuOpen }) => {
  return (
    <>
      <Upload popup={popup} setMenu={setMenu} />
      <Sync popup={popup} menuOpen={menuOpen} />
      <Display popup={popup} />
      <Advanced />
    </>
  );
};

export default SubtitleSettings;
