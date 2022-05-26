import React, { useEffect, useState } from 'react';
import { styled } from '@material-ui/core/styles';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';

const Container = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  margin: 0,
  fontFamily: 'sans-serif',
});

const Title = styled('h1')({
  color: 'black !important',
  margin: '20px !important',
  textAlign: 'center !important',
  fontSize: '24px !important',
  fontWeight: '400 !important',
});

const ShortcutWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  margin: '20px',
});

const ShortcutItem = styled('div')({
  fontSize: '16px',
  color: 'black',
});

const useStyles = makeStyles({
  icon: {
    position: 'absolute',
    top: '23px',
    left: '15px',
    color: 'black',
    cursor: 'pointer',
    pointerEvents: 'all !important',
  },
});

export default function Shortcuts({ setDisplayShortcuts, thisSite }) {
  const classes = useStyles();
  const netflix = thisSite === 'www.netflix.com';
  const amazon = /amazon/.test(thisSite);

  useEffect(() => {
    // Reset the scroll
    document.getElementById('movie-subtitles-scroll-anchor').scrollTo(0, 0);
  }, []);

  return (
    <Container>
      <Title>Shortcuts</Title>
      <KeyboardBackspaceIcon
        onClick={() => setDisplayShortcuts(false)}
        className={classes.icon}
      />
      {!netflix && (
        <>
          <Divider />
          <ShortcutWrapper>
            <ShortcutItem>Previous sentence</ShortcutItem>
            <ShortcutItem>a</ShortcutItem>
          </ShortcutWrapper>
          <Divider />
          <ShortcutWrapper>
            <ShortcutItem>Next sentence</ShortcutItem>
            <ShortcutItem>s</ShortcutItem>
          </ShortcutWrapper>
          <Divider />
          <ShortcutWrapper>
            <ShortcutItem>Rewind 2.5 seconds</ShortcutItem>
            <ShortcutItem>z</ShortcutItem>
          </ShortcutWrapper>
          <Divider />
          <ShortcutWrapper>
            <ShortcutItem>Fast-forward 2.5 seconds</ShortcutItem>
            <ShortcutItem>x</ShortcutItem>
          </ShortcutWrapper>
          {!amazon && (
            <>
              <Divider />
              <ShortcutWrapper>
                <ShortcutItem>Rewind 5 seconds</ShortcutItem>
                <ShortcutItem
                  dangerouslySetInnerHTML={{ __html: '&#8678;' }}
                ></ShortcutItem>
              </ShortcutWrapper>
              <Divider />
              <ShortcutWrapper>
                <ShortcutItem>Fast-forward 5 seconds</ShortcutItem>
                <ShortcutItem
                  dangerouslySetInnerHTML={{ __html: '&#8680;' }}
                ></ShortcutItem>
              </ShortcutWrapper>
            </>
          )}
        </>
      )}
      <Divider />
      <ShortcutWrapper>
        <ShortcutItem>Subtitles on/off</ShortcutItem>
        <ShortcutItem>c</ShortcutItem>
      </ShortcutWrapper>
      <Divider />
      <ShortcutWrapper>
        <ShortcutItem>Speed (slower)</ShortcutItem>
        <ShortcutItem>q</ShortcutItem>
      </ShortcutWrapper>
      <Divider />
      <ShortcutWrapper>
        <ShortcutItem>Speed (faster)</ShortcutItem>
        <ShortcutItem>w</ShortcutItem>
      </ShortcutWrapper>
      <Divider />
      <ShortcutWrapper>
        <ShortcutItem>Sync subtitles (1s earlier)</ShortcutItem>
        <ShortcutItem>g</ShortcutItem>
      </ShortcutWrapper>
      <Divider />
      <ShortcutWrapper>
        <ShortcutItem>Sync subtitles (1s later)</ShortcutItem>
        <ShortcutItem>h</ShortcutItem>
      </ShortcutWrapper>
      <Divider />
    </Container>
  );
}
