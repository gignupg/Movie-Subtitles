import s from './sites';

const elementPosition = {
  [s.youtube]: {
    video: { selector: 'video' },
    container: { selector: '#movie_player' },
    iconWrapper: { selector: '.ytp-right-controls', spacing: '8px' },
  },
  [s.amazon]: {
    video: { selector: 'video', index: 2 },
    container: { selector: '.cascadesContainer' },
    iconWrapper: {
      selector: '.hideableTopButtons div:first-child',
      spacing: '18px',
    },
  },
  [s.default]: {
    video: { selector: 'video' },
    container: { selector: 'video' },
    iconWrapper: null,
  },
};

export default elementPosition;
