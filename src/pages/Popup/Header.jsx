import React from 'react';
import { styled } from '@material-ui/core/styles';

const Title = styled('h1')({
  marginTop: '20px',
  textAlign: 'center',
  fontSize: '24px',
  fontWeight: 400,
});

const Icon = styled('img')({
  display: 'block',
  margin: '30px auto 20px auto',
});

const Header = () => {
  return (
    <>
      <Title>Movie Subtitles</Title>
      <Icon src="movie-subtitles-38.png" alt="Logo"></Icon>
    </>
  );
};

export default Header;
