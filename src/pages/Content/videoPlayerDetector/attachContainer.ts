import npmPackageUrl from './npmPackageUrl';

export default function attachContainer(rootElement: HTMLElement, site: string) {
  const containerId = 'npm-video-player-detector-container';

  // Check if the id has already been injected
  if (!document.querySelector('#' + containerId)) {
    const container = document.createElement('div');
    container.id = containerId;
    container.dataset.npmVideoPlayerDetector = npmPackageUrl;
    container.setAttribute('style', 'position: absolute; top: 0; background: transparent; width: 100%; height: 100%;');

    if (site === 'default') {
      rootElement.parentElement?.prepend(container); // Returning this would result in undefined. The prepend() method always returns undefined!
    } else {
      rootElement.prepend(container); // Returning this would result in undefined. The prepend() method always returns undefined!
    }
  }
  return document.querySelector('#' + containerId);
}
