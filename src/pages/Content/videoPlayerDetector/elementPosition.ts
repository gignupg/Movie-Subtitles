import s from './sites'

interface VideoPlayer {
  [site: string]: PlayerElement
}

export interface PlayerElement {
  video: ElementInfo,
  container: ElementInfo,
  iconWrapper: IconInfo | null,
}

interface ElementInfo {
  selector: string,
  index: number,
}

interface IconInfo extends ElementInfo {
  spacing: string,
}

const elementPosition: VideoPlayer = {
  [s.youtube]: {
    video: { selector: 'video', index: 0 },
    container: { selector: '#movie_player', index: 0 },
    iconWrapper: { selector: '.ytp-right-controls', index: 0, spacing: '0 8px' },
  },
  [s.amazon]: {
    video: { selector: 'video', index: 1 },
    container: { selector: '.scalingVideoContainer', index: 0 },
    iconWrapper: {
      selector: '.hideableTopButtons div:first-child',
      index: 0,
      spacing: '0 18px',
    },
  },
  [s.amazonATV]: {
    video: { selector: 'video', index: 0 },
    container: { selector: '.scalingVideoContainer', index: 0 },
    iconWrapper: {
      selector: '.atvwebplayersdk-hideabletopbuttons-container div:first-child',
      index: 0,
      spacing: '0 18px',
    },
  },
  [s.vimeo]: {
    video: { selector: 'video', index: 0 },
    container: { selector: '.js-player-fullscreen', index: 0 },
    iconWrapper: { selector: '.play-bar', index: 0, spacing: '0 0 0 12px' },
  },
  [s.twitch]: {
    video: { selector: 'video', index: 0 },
    container: { selector: '.video-player__container', index: 0 },
    iconWrapper: { selector: '.player-controls__right-control-group', index: 0, spacing: '0 10px' },
  },
  [s.dailymotion]: {
    video: { selector: 'video', index: 0 },
    container: { selector: '.np_Main', index: 0 },
    iconWrapper: null,
  },
  [s.tubi]: {
    video: { selector: 'video', index: 0 },
    container: { selector: '._13syz', index: 0 },
    iconWrapper: null,
  },
  [s.default]: {
    video: { selector: 'video', index: 0 },
    container: { selector: 'video', index: 0 },
    iconWrapper: null,
  },
};

export default elementPosition;
