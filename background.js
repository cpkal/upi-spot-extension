chrome.runtime.onInstalled.addListener(async function(details) {
  if(details.reason === 'install') {
    // Code to run when the extension is installed
    console.log('Extension installed!');
    await chrome.scripting.executeScript({
      file: 'content.js'
    });
  }
});

//run extension everytime
chrome.runtime.onStartup.addListener(async function() {
  // Code to run when the browser starts up
  console.log('Extension started!');
  await chrome.scripting.executeScript({
    file: 'content.js'
  });
});


// chrome.action.onClicked.addListener(async function(tab) {
//   await chrome.scripting.executeScript({
//     file: 'content.js'
//   });

//   console.log('Extension clicked!');

//   // Send a message to toggle dark mode state
//   chrome.tabs.sendMessage(tab.id, { action: 'toggleDarkMode' });
// });
