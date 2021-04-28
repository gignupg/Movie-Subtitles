import React from 'react';
import { styled } from '@material-ui/core/styles';

const Title = styled('h1')({
  color: 'black !important',
  marginTop: '20px !important',
  textAlign: 'center !important',
  fontSize: '24px !important',
  fontWeight: '400 !important',
});

const Icon = styled('img')({
  display: 'block !important',
  margin: '30px auto 40px auto !important',
});

const Header = () => {
  return (
    <>
      <Title>Movie Subtitles</Title>
      <Icon
        src={chrome.runtime.getURL('movie-subtitles-48.png')}
        alt="Logo"
      ></Icon>
    </>
  );
};

export default Header;
