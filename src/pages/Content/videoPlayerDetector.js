// Sites object. Import this from a seperate file in the future!
const s = {
  youtube: 'www.youtube.com',
  amazon: 'www.amazon',
};

const npmPackageUrl =
  'https://www.npmjs.com/package/detect-file-encoding-and-language';

export default function videoPlayerDetector(element) {
  let site = window.location.hostname;
  site = updateSite(site);

  const elem = elementPosition[site][element];
  const selector = elem.selector;
  const index = elem.index || 0;

  if (element === 'video') {
    const video = document.querySelectorAll(selector)[index];

    // Check if the dataset has already been injected
    if (!video.dataset.npmVideoPlayerDetector) {
      video.dataset.npmVideoPlayerDetector =
        'https://www.npmjs.com/package/detect-file-encoding-and-language';
    }
    return video;
  } else if (element === 'container') {
    const container = attachContainer(
      document.querySelectorAll(selector)[index]
    );
    return container;
  } else if (element === 'iconWrapper') {
    const iconWrapper = attachIconWrapper(
      site,
      document.querySelectorAll(selector)[index]
    );
    return iconWrapper;
  }
}

function attachIconWrapper(site, attachRootElementHere) {
  const iconWrapperId = 'npm-video-player-detector-icon-wrapper';

  // Check if the id has already been injected
  if (!document.querySelector('#' + iconWrapperId)) {
    if (site === s.youtube) {
      const rootElement = document.createElement('div');
      rootElement.id = iconWrapperId;
      rootElement.classList.add('ytp-button');
      rootElement.dataset.npmVideoPlayerDetector = npmPackageUrl;
      rootElement.style = 'z-index: 2147483647;'; // Not sure if this is necessary. I should check!
      attachRootElementHere.prepend(rootElement);
    } else if (site === s.amazon) {
      const rootElement = document.createElement('div');
      rootElement.style =
        'position: relative; display: inline-block; margin-right: 8px; z-index: 2147483647;';
      const tooltipButton = document.createElement('div');
      tooltipButton.classList.add('tooltipButton');
      const imageButtonWrapper = document.createElement('div');
      imageButtonWrapper.classList.add('imageButtonWrapper');
      const iconWrapper = document.createElement('div');
      iconWrapper.id = iconWrapperId;
      iconWrapper.classList.add('imageButton');
      iconWrapper.dataset.npmVideoPlayerDetector = npmPackageUrl;
      iconWrapper.style = 'width: 42px; height: 42px; margin-top: 7px;';
      imageButtonWrapper.prepend(iconWrapper);
      tooltipButton.prepend(imageButtonWrapper);
      rootElement.prepend(tooltipButton);
      attachRootElementHere.prepend(rootElement);
    }
  }
  return document.querySelector('#' + iconWrapperId);
}

function attachContainer(attachContainerHere) {
  const containerId = 'npm-video-player-detector-container';

  // Check if the id has already been injected
  if (!document.querySelector('#' + containerId)) {
    const container = document.createElement('div');
    container.id = containerId;
    container.dataset.npmVideoPlayerDetector = npmPackageUrl;
    container.style =
      'position: absolute; top: 0; background: transparent; width: 100%; height: 100%;';
    attachContainerHere.prepend(container); // Returning this would result in undefined. The prepend() method always returns undefined!
  }
  return document.querySelector('#' + containerId);
}

const elementPosition = {
  [s.youtube]: {
    video: { selector: 'video' },
    container: { selector: '#movie_player' },
    iconWrapper: { selector: '.ytp-right-controls' },
  },
  [s.amazon]: {
    video: { selector: 'video', index: 2 },
    container: { selector: '.cascadesContainer' },
    iconWrapper: { selector: '.hideableTopButtons div:first-child' },
  },
};

function updateSite(site) {
  if (/www.amazon/.test(site)) {
    return s.amazon;
  } else {
    return site;
  }
}
