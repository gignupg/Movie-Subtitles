import npmPackageUrl from './npmPackageUrl';

export default function attachIconWrapper(rootElement, spacing) {
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
