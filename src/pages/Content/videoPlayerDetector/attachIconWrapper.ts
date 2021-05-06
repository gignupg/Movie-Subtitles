import npmPackageUrl from './npmPackageUrl';
import s from './sites'

export default function attachIconWrapper(rootElement: HTMLElement, spacing: string, site: string) {
  const iconWrapperId = 'npm-video-player-detector-icon-wrapper';

  // Check if the id has already been injected
  if (!document.querySelector('#' + iconWrapperId)) {
    rootElement.style.display = 'flex';
    const iconWrapper = document.createElement('div');
    iconWrapper.id = iconWrapperId;
    iconWrapper.classList.add('ytp-button');
    iconWrapper.dataset.npmVideoPlayerDetector = npmPackageUrl;
    iconWrapper.setAttribute("style", `display: flex; flex-direction: row; align-items: center; justify-content: center; overflow: visible; margin: ${spacing}; cursor: pointer;`);
    // iconWrapper.style = `display: flex; flex-direction: row; align-items: center; justify-content: center; overflow: visible; margin-right: ${spacing}; cursor: pointer;`; // Not sure if this is necessary. I should check!
    if (site === s.vimeo) {
      rootElement.insertBefore(iconWrapper, document.querySelectorAll('.volume')[0])
    } else if (site === s.tubi) {
      rootElement.insertBefore(iconWrapper, document.getElementById('volumeArea'))
    } else {
      rootElement.prepend(iconWrapper);
    }
  }
  return document.querySelector('#' + iconWrapperId);
}
