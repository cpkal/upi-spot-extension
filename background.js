chrome.action.onClicked.addListener(async function(tab) {
  await chrome.scripting.executeScript({
    file: 'content.js'
  });

  // Send a message to toggle dark mode state
  chrome.tabs.sendMessage(tab.id, { action: 'toggleDarkMode' });
});
