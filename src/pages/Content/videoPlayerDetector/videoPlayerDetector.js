// Sites object. Import this from a seperate file in the future!
const s = {
  youtube: 'www.youtube.com',
  amazon: 'www.amazon',
  default: 'default',
};

const npmPackageUrl =
  'https://www.npmjs.com/package/detect-file-encoding-and-language';

export default function videoPlayerDetector(element) {
  let site = window.location.hostname;
  site = updateSite(site);

  const elem = elementPosition[site][element];

  if (!elem) return null;

  const selector = elem.selector;
  const index = elem.index || 0;

  if (element === 'video') {
    const video = document.querySelectorAll(selector)[index];

    if (!video) return null;

    // Check if the dataset has already been injected
    if (!video.dataset.npmVideoPlayerDetector) {
      video.dataset.npmVideoPlayerDetector =
        'https://www.npmjs.com/package/detect-file-encoding-and-language';
    }
    return video;
  } else if (element === 'container') {
    const rootElement = document.querySelectorAll(selector)[index];

    if (!rootElement) return null;

    const container = attachContainer(rootElement, site);
    return container;
  } else if (element === 'iconWrapper') {
    const rootElement = document.querySelectorAll(selector)[index];

    if (!rootElement) return null;

    const spacing = elementPosition[site].iconWrapper.spacing;
    const iconWrapper = attachIconWrapper(rootElement, spacing);
    return iconWrapper;
  }
}

function attachIconWrapper(rootElement, spacing) {
  const iconWrapperId = 'npm-video-player-detector-icon-wrapper';

  // Check if the id has already been injected
  if (!document.querySelector('#' + iconWrapperId)) {
    rootElement.style.display = 'flex';
    const iconWrapper = document.createElement('div');
    iconWrapper.id = iconWrapperId;
    iconWrapper.classList.add('ytp-button');
    iconWrapper.dataset.npmVideoPlayerDetector = npmPackageUrl;
    iconWrapper.style = `display: flex; flex-direction: row; align-items: center; justify-content: center; overflow: visible; margin-right: ${spacing}; cursor: pointer;`; // Not sure if this is necessary. I should check!
    rootElement.prepend(iconWrapper);
  }
  return document.querySelector('#' + iconWrapperId);
}

function attachContainer(rootElement, site) {
  const containerId = 'npm-video-player-detector-container';

  // Check if the id has already been injected
  if (!document.querySelector('#' + containerId)) {
    const container = document.createElement('div');
    container.id = containerId;
    container.dataset.npmVideoPlayerDetector = npmPackageUrl;
    container.style =
      'position: absolute; top: 0; background: transparent; width: 100%; height: 100%;';

    if (site === 'default') {
      rootElement.parentElement.prepend(container); // Returning this would result in undefined. The prepend() method always returns undefined!
    } else {
      rootElement.prepend(container); // Returning this would result in undefined. The prepend() method always returns undefined!
    }
  }
  return document.querySelector('#' + containerId);
}

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

function updateSite(site) {
  let modifiedSite = '';

  // Take care of special cases
  if (/www.amazon/.test(site)) {
    modifiedSite = s.amazon;
  } else {
    modifiedSite = site;
  }

  // Set default if the site is unknown
  if (elementPosition[modifiedSite]) {
    return modifiedSite;
  } else {
    return 'default';
  }
}
