import s from './sites';

interface Position {
  [site: string]: Site
}

interface Site {
  [element: string]: Element
}

interface Element {
  selector: string,
  index?: number,
  spacing?: string,
}

const elementPosition: Position = {
  [s.youtube]: {
    video: { selector: 'video' },
    container: { selector: '#movie_player' },
    iconWrapper: { selector: '.ytp-right-controls', spacing: '8px' },
  },
  [s.amazon]: {
    video: { selector: 'video', index: 1 },
    container: { selector: '.cascadesContainer' },
    iconWrapper: {
      selector: '.hideableTopButtons div:first-child',
      spacing: '18px',
    },
  },
  [s.default]: {
    video: { selector: 'video' },
    container: { selector: 'video' },
    iconWrapper: { selector: ''},
  },
};

export default elementPosition;
