// Toggle dark mode
async function toggleDarkMode() {

  
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


  //filtered link
  var filteredLinks = [];

  //get all links and get the href
  var links = document.getElementsByTagName('a'); 
  for (var i = 0; i < links.length; i++) {
    //get href starts with https://spot.upi.edu/mhs/dashboard
    if (links[i].href.startsWith("https://spot.upi.edu/mhs/dashboard")) {
      //save the href to array string
      filteredLinks.push(links[i].href);
    }
  }

  //fetch the data from the filtered links
  var data = [];
  for (var i = 0; i < filteredLinks.length; i++) {
    await fetch(filteredLinks[i])
    .then(response => response.text())
    .then(text => {
      //get the data from the text
      var parser = new DOMParser();
      var doc = parser.parseFromString(text, 'text/html');
      
      //get links starts with https://spot.upi.edu/mhs/topik
      var links = doc.getElementsByTagName('a');
      for (var i = 0; i < links.length; i++) {
        if (links[i].href.startsWith("https://spot.upi.edu/mhs/topik")) {
          //save the href to array string
          data.push(links[i].href);
        }
      }
    });
  }

  //change link contains topik to tugas
  for (var i = 0; i < data.length; i++) {
    data[i] = data[i].replace("topik", "tugas");
  }
  

  //fetch data from tugas links
  var newData = [];
  for(var i = 0; i < data.length; i++) {
    await fetch(data[i])
    .then(response => response.text())
    .then(text => {
      //get the data from the text
      var parser = new DOMParser();
      var doc = parser.parseFromString(text, 'text/html');
      
      //get table row contains 'Waktu Pengumpulan'
      var table = doc.getElementsByTagName('tr');
      for (var i = 0; i < table.length; i++) {
        if (table[i].innerText.includes("Waktu Pengumpulan")) {
          //save the href to array string
          //console.log(table[i].innerText) 

          //filter innerText to get the date
          var date = table[i].innerText;
          date = date.split("\n");
          date = date[2];
          date = date.split("S/D");

          //clear space from date
          deadlineDate = date[1].trim();
          
          //get class sidebar and add deadlinedate as p element
          var sidebar = doc.getElementsByClassName('sidebar');
          console.log(sidebar)
          
          //add p to sidebar
          var p = document.createElement("p");
          var text = document.createTextNode(deadlineDate);
          p.appendChild(text);
          sidebar[0].appendChild(p);
          console.log(sidebar[0])
          
        
        }
      }
    });
  }

  console.log(newData)
}

// Call the function to toggle dark mode
toggleDarkMode();
