// Toggle dark mode
function toggleDarkMode() {

  
  // Your custom dark mode styles
  const darkModeStyles = `
    /* Example dark mode styles */
    * {
      background-color: #121212 !important;
      color: #ffffff !important;
    }
  `;

  // Create or remove dark mode style tag
  let styleTag = document.getElementById('dark-mode-style');
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.setAttribute('id', 'dark-mode-style');
    document.head.appendChild(styleTag);
  }
  styleTag.textContent = darkModeStyles;
}

// Call the function to toggle dark mode
toggleDarkMode();
