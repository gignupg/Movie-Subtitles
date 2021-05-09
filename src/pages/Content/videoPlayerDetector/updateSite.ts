import s from './sites';
import elementPosition from './elementPosition'

export default function updateSite(site: string) {
  let modifiedSite = '';

  // Take care of special cases
  if (/www\.amazon/.test(site) || /smile\.amazon/.test(site)) {
    if (document.querySelector('.hideableTopButtons')) {
      modifiedSite = s.amazon;
    } else {
      modifiedSite = s.amazonATV;
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
