function injectScript(file, node) {
  const th = document.getElementsByTagName(node)[0];
  if (!th) {
      console.error(`No ${node} element found to append the script.`);
      return;
  }
  const s = document.createElement('script');
  s.setAttribute('type', 'text/javascript');
  s.setAttribute('src', chrome.runtime.getURL(file));
  th.appendChild(s);
}

injectScript('inject.js', 'head');
