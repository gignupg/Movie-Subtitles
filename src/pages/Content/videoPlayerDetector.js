// Sites object. Import this from a seperate file in the future!
const s = {
  youtube: 'www.youtube.com',
  amazon: 'www.amazon',
};

export default function videoPlayerDetector(element) {
  let site = window.location.hostname;
  site = updateSite(site);

  const elem = elementPosition[site][element];
  const selector = elem.selector;
  const index = elem.index || 0;

  console.log('element:', element);
  console.log('index', index);

  if (element === 'video') {
    const video = document.querySelectorAll(selector)[index];
    video.dataset.npmVideoPlayerDetector =
      'https://www.npmjs.com/package/detect-file-encoding-and-language';
    return video;
  } else if (element === 'container') {
    const container = attachContainer(
      document.querySelectorAll(selector)[index]
    );
    return container;
  } else if (element === 'iconBar') {
    // Inject a link to the npm package
    // iconBar.dataset.npmVideoPlayerDetector =
    //   'https://www.npmjs.com/package/detect-file-encoding-and-language';
    // return iconBar;
  }
}

function attachContainer(elem) {
  const container = document.createElement('div');
  container.id = 'npm-video-player-detector-container';
  container.dataset.npmVideoPlayerDetector =
    'https://www.npmjs.com/package/detect-file-encoding-and-language';
  container.style =
    'position: absolute; top: 0; background: transparent; width: 100%; height: 100%;';
  elem.prepend(container); // Returning this would result in undefined. The prepend() method always returns undefined!
  return document.querySelector('#npm-video-player-detector-container');
}

const elementPosition = {
  [s.youtube]: {
    video: { selector: 'video' },
    container: { selector: '#movie_player' },
    iconBar: { selector: '.ytp-right-controls' },
  },
  [s.amazon]: {
    video: { selector: 'video', index: 2 },
    container: { selector: '.cascadesContainer' },
    iconBar: { selector: '.hideableTopButtons', children: 1 },
  },
};

function updateSite(site) {
  if (/www.amazon/.test(site)) {
    return s.amazon;
  } else {
    return site;
  }
}

/*
IconBar ---------------------------------------------

const iconBarRoot = document.createElement('div');

  if (site === 'www.youtube.com') {
    // Inject the icon on youtube
    iconBarRoot.id = 'movie-subtitles-icon-bar';
    iconBarRoot.classList.add('ytp-button');
    iconBarRoot.style = 'z-index: 2147483647;';
  } else if (site === 'www.amazon') {
    // Inject icons on Amazon Prime
    iconBarRoot.style =
      'position: relative; display: inline-block; margin-right: 8px; z-index: 2147483647;';

    const tooltipButton = document.createElement('div');
    tooltipButton.classList.add('tooltipButton');

    const imageButtonWrapper = document.createElement('div');
    imageButtonWrapper.classList.add('imageButtonWrapper');

    const imageButton = document.createElement('div');
    imageButton.id = 'movie-subtitles-icon-bar';
    imageButton.classList.add('imageButton');
    imageButton.style = 'margin-top: 7px; width: 42px; height: 42px;';

    imageButtonWrapper.appendChild(imageButton);
    tooltipButton.appendChild(imageButtonWrapper);
    iconBarRoot.appendChild(tooltipButton);
  }



      // if (element.children === 1) {
    //   result.firstElementChild.prepend(iconBarRoot);
    // } else {
    //   result.prepend(iconBarRoot);
    // }

*/
