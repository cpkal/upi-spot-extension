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
}

toggleDarkMode();

(function addListOfAssignmentTitleToSidebar() {
  var sidebar = document.getElementsByClassName('scroll-sidebar');
  var div = document.createElement('div');
  //add padding to div
  div.style.padding = "10px";
  //add top border to div with 1px solid white
  div.style.borderTop = "1px solid white";
  //create h4 element
  var h4 = document.createElement('h4');
  h4.innerHTML = "Daftar Tugas";
  div.appendChild(h4);
  sidebar[0].appendChild(div);
})();

(async function getDeadlineOfAssignments() {
  //add text loading animation to the sidebar and remove it after the data is fetched
  var sidebar = document.getElementsByClassName('scroll-sidebar');
  var divLoading = document.createElement('div');
  divLoading.style.padding = "10px";
  divLoading.style.textAlign = "center";
  var p = document.createElement('p');
  p.innerHTML = "Loading...";
  divLoading.appendChild(p);
  sidebar[0].appendChild(divLoading);

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
          // console.log(links[i].href)
        }
      }
    });
  }

  //change link contains topik to tugas
  for (var i = 0; i < data.length; i++) {
    data[i] = data[i].replace("topik", "tugas");
    // console.log(data[i])
  }

  
  //fetch data from tugas links
  var newData = [];
  for(var i = 0; i < data.length; i++) {

    fetch(data[i])
    .then(response => response.text())
    .then(text => {
      //get the data from the text
      var parser = new DOMParser();
      var doc = parser.parseFromString(text, 'text/html');
      
      //get second element h3
      var h3 = doc.getElementsByTagName('h3');
      var collegeSubjectTitle = h3[1].innerText;

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

          startDate = date[0].trim()

          //remove 2 first character from startDate
          startDate = startDate.substring(2);

          //clear space from date
          deadlineDate = date[1].trim();

          var parts = deadlineDate.split(/[- :]/);
          // Note: months are 0-based
          var dateObject = new Date(parts[2], parts[1] - 1, parts[0], parts[3], parts[4]);
          var currentDate = new Date();

          //check if there's a deadline assingment
          if (currentDate < dateObject) {
           //get class sidebar and add deadlinedate as p element
            var sidebar = document.getElementsByClassName('scroll-sidebar');
            
            //create div element and make it like card with border radius
            var div = document.createElement('div');
            //add padding to div
            div.style.padding = "10px";
            //add top border to div with 1px solid white
            div.style.border = "1px solid white";
            //add border radius to div
            div.style.borderRadius = "10px";
            //add 10px margin left
            div.style.marginLeft = "10px";
            //add 10px margin right
            div.style.marginRight = "10px";
            //add margin bottom 10px
            div.style.marginBottom = "10px";
            //center text
            div.style.textAlign = "center";
            //create h4 element
            var h4 = document.createElement('h5');
            //add college subject title to h4
            h4.innerHTML = collegeSubjectTitle;
            //append h4 to div
            div.appendChild(h4);

            //append deadline date to the sidebar
            var p = document.createElement('p');
            
            p.innerHTML = "Deadline: " + deadlineDate;

            div.appendChild(p);

            sidebar[0].appendChild(div);
          }
        }
      }

      //remove divLoading
      
    });

  }
  
  sidebar[0].removeChild(divLoading);
  divLoading.remove();
})();
