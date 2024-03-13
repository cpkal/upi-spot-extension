document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('toggleButton').addEventListener('click', async function() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // Get the tab ID of the first active tab
      const tabId = tabs[0].id;
      
      // Execute content script on the active tab
      chrome.scripting.executeScript({
        target: {tabId: tabId},
        files: ['content.js']
      });
    });
  });
});
