



  
const textbookData = []; // Create an array to store book information
const selectedCourses = new Set(); // Create a Set to store selected course names

fetch("./data/textbooks.csv")
    .then((response) => response.text())
    .then((data) => {
        Papa.parse(data, {
            delimiter: ",",
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            ltrim: true,
            complete: function (results) {
                const textbookData1 = results.data;
                // Loop through each row of data and extract the desired information for each book
                textbookData1.forEach((textbook) => {
                    const bookInfo = {
                        department: textbook['Department'],
                        courseName: textbook['Course Name'],
                        title: textbook['Title'],
                        buyLink: textbook['buy link'],
                        price: textbook['book price'],
                        teachers: textbook['Teacher'],
                    };
                    textbookData.push(bookInfo);
                });
                // Now, you have an array containing book information for each book
                console.log(textbookData);
                // Call the function to generate the checklist after the data is loaded
                generateChecklist();
            },
        });
    });

// Function to generate the checklist items
function generateChecklist() {
    console.log("generating checklist")
    const classesList = document.getElementById('classesList');
    const clearRectangle = document.querySelector("#column_selected_Classes .clear_rectangle");
    const costsContainer = document.querySelector("#column_Costs .clear_rectangle");

    // Create a dictionary to store checklist items by course and teacher
    const checklistItems = {};

    // Loop through the textbookData array and group items by course and teacher
    textbookData.forEach((textbook) => {
        const key = `${textbook.courseName}_${textbook.teachers}`;

        if (!checklistItems[key]) {
            checklistItems[key] = {
                courseName: textbook.courseName,
                teachers: textbook.teachers,
                textbooks: [], // Create an array to store associated textbooks
            };
        }
        checklistItems[key].textbooks.push(textbook); // Store associated textbooks
    });

    // Generate checklist items from the grouped data
    for (const key in checklistItems) {
        if (checklistItems.hasOwnProperty(key)) {
            const item = checklistItems[key];
            const listItem = document.createElement('li');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = item.courseName + " " + item.teachers;
            const label = document.createElement('label');
            label.htmlFor = item.courseName;
            label.textContent = `${item.courseName} (Teacher: ${item.teachers})`;

            listItem.appendChild(checkbox);
            listItem.appendChild(label);

            classesList.appendChild(listItem);


            // Add a click event to show associated textbooks and costs when the label is clicked
            label.addEventListener('click', () => {
              if (selectedCourses.has(item.courseName + " " + item.teachers)) {

                checkbox.checked = false; // Uncheck the checkbox

                item.textbooks.forEach((textbook) => {
                    const textbookElement = document.createElement("div");
                    textbookElement.textContent = `Textbook: ${textbook.title} (Cost: $${textbook.price})`;
                    handleCourseSelection(item.courseName + " " + item.teachers, textbook.price, false); // Manually call unselect handler\
                }); 

            
              } else {

                checkbox.checked = true;           
                  // Display the selected course in the "Selected Courses" column
                  const selectedCourseItem = document.createElement("div");
                  selectedCourseItem.textContent = item.courseName + " " + item.teachers;
                  selectedCourseItem.style.fontSize = "22px"; // Set the font size
                  clearRectangle.appendChild(selectedCourseItem);
          
                  // Display the associated textbooks and their costs
                  item.textbooks.forEach((textbook) => {
                      const textbookElement = document.createElement("div");
                      textbookElement.textContent = `Textbook: ${textbook.title} (Cost: $${textbook.price})`;
                      textbookElement.style.fontSize = "18px"; // Set the font size
                      
                      costsContainer.appendChild(textbookElement);
                      console.log(costsContainer)
                  });
                  // Add the selected course to the Set
                  selectedCourses.add(item.courseName + " " + item.teachers);
              }
          });
          
        }
    }


    // function populateOptions(){
    //     var select = document.getElementById("classesList");
    //     select.innerHTML='';
    //     for(var i=0; i<checklistItems.length;i++){
    //         var option = document.createElement("class");
    //         option.value=checklistItems[i];
    //         option.text=checklistItems[i];
    //         select.appendChild(option);
    //     }
    // }
    
    // populateOptions();

    // function searchOptions(){
    //     var input,filter, select, classes, clase, i;

    //     input=document.getElementById("searchBar");
    //     filter=input.value.toUpperCase();
    //     select=document.getElementById("classesList");
    //     classes=select.classes;

    //     for(i=0;i<classes.length;i++){
    //         clase=classes[i];
    //         if(clase.text.toUpperCase().indexOf(filter) > -1){
    //             clase.style.display="";
    //         }
    //         else{
    //             clase.style.display="none";
             
    //         }
    //     }
    // }

  function clearRectangleContains(text) {
    let children = clearRectangle.children;
    for (let i = 0; i < children.length; i++) {
      if (children[i].textContent === text) {
        return true;
      }
     }
     return false;
   }
   

  function removeSelectedClass(courseName) {
    let children = clearRectangle.children;
    for (let i = 0; i < children.length; i++) {
      if (extractCourseName(children[i].textContent) === courseName) {
        clearRectangle.removeChild(children[i]);
        return;
      }
    }
  }


  function removeCost(price) {
    const costElements = costsContainer.querySelectorAll("div");
    costElements.forEach((element) => {
      if (element.textContent.includes(price)) {
        costsContainer.removeChild(element);
        return;
      }
    });
  }

  function extractCourseName(text) {
        // Extract the course name from the text
        const match = text.match(/^(.*?) \(Teacher: .*\)$/);
        return match ? match[1] : text;
      }

  function handleCourseSelection(courseName, price, isChecked) {
    if (isChecked) {
      if (!selectedCourses.has(courseName)) {
        const selectedCourseItem = document.createElement("div");
        selectedCourseItem.textContent = courseName;
        selectedCourseItem.style.fontSize = "22px"; // Set the font size
        clearRectangle.appendChild(selectedCourseItem);

       // Find the matching textbooks for the selected class
       const selectedTextbooks = textbookData.filter((textbook) => textbook.courseName === courseName);
       const selectedTextbooks2 = textbookData.filter((textbook) => textbook.price === price);

       // Add the selected course to the Set
       selectedCourses.add(courseName);
     }
   } else { //else, if the user unclicks the selected course, we want to remove it from the selected courses and costs column

        removeSelectedClass(courseName);
        removeCost(price);
        selectedCourses.delete(courseName);

   }
 }
}


