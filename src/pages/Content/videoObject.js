const videoObject = {
  'www.youtube.com': {
    container: { selector: { name: '#movie_player', nr: 0 } },
    video: { selector: { name: 'video', nr: 0 } },
    iconBar: { selector: { name: 'video', nr: 0 } },
  },
  'www.amazon': {
    container: { selector: { name: '.cascadesContainer', nr: 0 } },
    video: { selector: { name: 'video', nr: 1 } },
    iconBar: { selector: { name: 'video', nr: 0 } },
  },
};

export default function findVideo(element) {
  let site = window.location.hostname; // Has to be improved to make it actually work
  site = updateSite(site);

  const e = videoObject[site][element];
  const s = e.selector;

  return document.querySelectorAll(s.name)[s.nr];
}

function updateSite(site) {
  if (/www.amazon/.test(site)) {
    return 'www.amazon';
  } else {
    return site;
  }
}
