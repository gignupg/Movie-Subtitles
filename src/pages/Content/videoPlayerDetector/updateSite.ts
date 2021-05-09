import s from './sites';
import elementPosition from './elementPosition'

export default function updateSite(site: string, element: string) {
  let modifiedSite = '';

  // Take care of special cases
  if (/www\.amazon/.test(site) || /smile\.amazon/.test(site)) {
    if (element === 'video') {
      modifiedSite = document.querySelectorAll('video')[1] ? s.amazon : s.amazonATV

    } else if (element === 'container') {
      modifiedSite = s.amazon

    } else if (element === 'iconWrapper') {
      modifiedSite = document.querySelector('.hideableTopButtons') ? s.amazon : s.amazonATV
    }

  } else {
    modifiedSite = site;
  }

  // Set default if the site is unknown
  if (elementPosition[modifiedSite]) {
    return modifiedSite;
  } else {
    return s.default;
  }
}
