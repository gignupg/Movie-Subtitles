export default function openPage(popup, link) {
  if (popup) {
    chrome.tabs.create({
      active: true,
      url: link,
    });
  } else {
    // Send message to background script and open the link from there.
    chrome.runtime.sendMessage({
      link: link,
    });
  }
}
