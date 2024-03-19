var sidebar = document.getElementsByClassName('scroll-sidebar');

function addListOfAssignmentToSidebar(assignment) {
  var a = document.createElement('a');
  a.href = assignment.linkToAssignmentPage
  a.target = "_blank"; 
  var div = document.createElement('div');
  var h4 = document.createElement('h5');
  var p = document.createElement('p');
  //create icon that implies assignment done or not inside div 
  
  div.style.padding = "10px";
  div.style.border = "1px solid white";
  div.style.borderRadius = "10px";
  div.style.marginLeft = "10px";
  div.style.marginRight = "10px";
  div.style.marginBottom = "10px";
  div.style.textAlign = "center";
  var circle = document.createElement('div');
  div.appendChild(circle);
  h4.innerHTML = assignment.collegeSubjectName;
  p.innerHTML = `Deadline: ${assignment.deadlineAssignmentString}   Status: ${assignment.assignmentStatus}`;
  div.appendChild(h4);
  div.appendChild(p);
  a.appendChild(div);
  sidebar[0].appendChild(a);
}

function addListOfAssignmentToLocalStorage(assignment) {
  var assignments = JSON.parse(localStorage.getItem('assignments')) || [];
  assignments.push(assignment);
  localStorage.setItem('assignments', JSON.stringify(assignments));
}

(function toggleDarkMode() {
  const darkModeStyles = `
    /* Example dark mode styles */
    * {
      background-color: #121212 !important;
      background: #121212 !important;
      color: #ffffff !important;
    }
  `;

  let styleTag = document.getElementById('dark-mode-style');
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.setAttribute('id', 'dark-mode-style');
    document.head.appendChild(styleTag);
  }
  styleTag.textContent = darkModeStyles;
})();

(function addListOfAssignmentTitleToSidebar() {
  var div = document.createElement('div');
  div.style.padding = "10px";
  div.style.borderTop = "1px solid white";
  var h4 = document.createElement('h4');
  h4.innerHTML = "Daftar Tugas";
  div.appendChild(h4);
  sidebar[0].appendChild(div);
})();

(async function getDeadlineOfAssignments() {
  var mainPageLinks = document.getElementsByTagName('a'); 

  Array.from(mainPageLinks).forEach(async mainPageLink => {
    if (mainPageLink.href.startsWith("https://spot.upi.edu/mhs/dashboard")) {
      await fetch(mainPageLink.href)
      .then(async response => response.text())
      .then(async text => {
        var parser = new DOMParser();
        var doc = parser.parseFromString(text, 'text/html');  
        var dashboardLinks = doc.getElementsByTagName('a');

        Array.from(dashboardLinks).forEach(async dashboardLink => {
          if (dashboardLink.href.startsWith("https://spot.upi.edu/mhs/topik")) {
            let topicLink = new URL(dashboardLink.href.replace("topik", "tugas"))

            await fetch(topicLink)
            .then(response => response.text())
            .then(text => {
              var parser = new DOMParser();
              var doc = parser.parseFromString(text, 'text/html');
              var h3 = doc.getElementsByTagName('h3');
              var collegeSubjectName = h3[1].innerText;

              //filter array of tr that contains td that contains "Waktu Pengumpulan"

              Array.from(doc.getElementsByTagName('tr')).forEach(td => {
                var trAssignmentStatus = doc.getElementsByTagName('tr')[5].children[1].innerText;
                
                var assignmentStatus = trAssignmentStatus.includes("Terkirim") ? "FINISHED" : "UNFINISHED"

                if(td !== undefined) {
                  if(td.innerText.includes("Waktu Pengumpulan")) {
                    var date = td.innerText.split("\n")[2].split("S/D");
                    createdAssignmentString = date[0].trim().substring(2)
                    deadlineAssignmentString = date[1].trim();
  
                    var splitDeadlineAssignmentString = deadlineAssignmentString.split(/[- :]/);
                    var deadlineAssignmentDateObject = 
                      new Date(splitDeadlineAssignmentString[2], 
                        splitDeadlineAssignmentString[1] - 1, 
                        splitDeadlineAssignmentString[0],                                           
                        splitDeadlineAssignmentString[3], 
                        splitDeadlineAssignmentString[4]);
  
                    var currentDateObject = new Date();
  
                    //show all unfinished assignments to sidebar
                    if(currentDateObject < deadlineAssignmentDateObject) {
                      var assignment = {
                        collegeSubjectName: collegeSubjectName,
                        createdAssignmentString: createdAssignmentString,
                        deadlineAssignmentString: deadlineAssignmentString,
                        linkToAssignmentPage: topicLink.href,
                        assignmentStatus: assignmentStatus
                      }
                      addListOfAssignmentToSidebar(assignment);
                      addListOfAssignmentToLocalStorage(assignment);
                    }
                  }
                }
                
              });
            });
          }
        });
      });
    }
  });
})();
