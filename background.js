chrome.runtime.onStartup.addListener(async function() {
  await chrome.scripting.executeScript({
    file: 'content.js'
  });
});