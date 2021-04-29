import React, { useState } from 'react';
import Subtitles from './Subtitles';
import PopupWrapper from './PopupWrapper';

const Content = ({ video, icon }) => {
  const [menu, setMenu] = useState(false);

  // When the icon gets clicked
  icon.addEventListener('click', function () {
    setMenu(menu ? false : true);
  });

  return (
    <>
      <Subtitles video={video} />
      {menu && <PopupWrapper />}
    </>
  );
};

export default Content;
