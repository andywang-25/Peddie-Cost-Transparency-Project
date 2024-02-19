



  
const textbookData = []; // Create an array to store book information
const selectedCourses = new Set(); // Create a Set to store selected course names
let english = false; 
let totalCost = 0;
let test = false; 

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

                    if(bookInfo.courseName.indexOf("[") > 0) {
                      let indexOne = bookInfo.courseName.indexOf("[");
                      let indexTwo = bookInfo.courseName.indexOf("]");
                      bookInfo.courseName = bookInfo.courseName.substring(0, indexOne) + bookInfo.courseName.substring(indexTwo + 1); 
                      console.log(bookInfo.courseName)
                    }

                    bookInfo.department = bookInfo.department + ":";

                    if (bookInfo.price === null) {
                      bookInfo.price = "0";
                    }
                  
                    textbookData.push(bookInfo);
                });
                // Now, you have an array containing book information for each book
                console.log(textbookData);
                alert("Book information is available. Check the console for details.");
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
              department: textbook.department, 
              textbooks: [], // Create an array to store associated textbooks
          };
      }
      checklistItems[key].textbooks.push(textbook); // Store associated textbooks
  });


  const departmentDropdown = document.createElement('select');
  departmentDropdown.id = 'departmentDropdown';
  const defaultOption = document.createElement('option');
  defaultOption.textContent = 'Select Department';
  defaultOption.value = '';
  departmentDropdown.appendChild(defaultOption);

  // 2. Populate the Dropdown
  const departments = ['English', 'History', 'Art', 'Math','Language','Science'];
  departments.forEach(dept => {
      const option = document.createElement('option');
      option.value = dept;
      option.textContent = dept;
      departmentDropdown.appendChild(option);
  });

  const parentOfClassesList = classesList.parentNode;


  // Add the dropdown to your DOM
  parentOfClassesList.insertBefore(departmentDropdown, classesList);

  // 3. Add Event Listener
  departmentDropdown.addEventListener('change', (event) => {
      const selectedDepartment = event.target.value;
      filterClassesByDepartment(selectedDepartment);
  });

    for (const key in checklistItems) {
      if (checklistItems.hasOwnProperty(key)) {
          const item = checklistItems[key];
          const listItem = document.createElement('li');
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.id = item.department + " " + item.courseName + " " + item.teachers;
          const label = document.createElement('label');
          label.htmlFor = item.courseName;
          label.textContent = `${item.department} ${item.courseName} (Teacher: ${item.teachers})`;
          
  
          // Conditionally set the CSS class based on item.department
          // ... [Your existing department CSS class code]
                    // Conditionally set the CSS class based on item.department
          if (item.department === 'English:') {
              label.classList.add('english-department');
          } 
          else if (item.department === 'Science:') {
              label.classList.add('science-department');
          }
          else if (item.department === 'History:') {
            label.classList.add('history-department');
          }
          else if (item.department === 'Math:') {
            label.classList.add('math-department');
          }
          else if (item.department === 'Language:') {
            label.classList.add('language-department');
          }
          else if (item.department === 'Art:') {
            label.classList.add('art-department');
          }
  
          listItem.appendChild(checkbox);
          listItem.appendChild(label);
          listItem.style.textAlign = "left";
          classesList.appendChild(listItem);
  
          // Event listener for the label
          label.addEventListener('click', () => {
              handleClassSelection(checkbox, item);
          });
  
          // Event listener for the checkbox
          checkbox.addEventListener('change', () => {
              handleClassSelection(checkbox, item);
          });


          
            
            // Add a click event to show associated textbooks and costs when the label is clicked
            function handleClassSelection(checkbox, item) {

              if (selectedCourses.has(item.courseName + " " + item.teachers)) { //this is called when you are removing a class 

                console.log("this checkbox is currently checked: " + checkbox.checked);

                checkbox.checked = false; // Uncheck the checkbox

                console.log("this checkbox is not checked anymore: " + checkbox.checked);

               
                //removing english class 
                if (item.department === 'English:') {
                  english = false; 
                } 
                
                

                item.textbooks.forEach((textbook) => {
                    const textbookElement = document.createElement("div");
                    textbookElement.textContent = `${textbook.title} (Cost: $${textbook.price})`;
                    handleCourseSelection(item.courseName + " " + item.teachers, textbook.price, false, textbook.title); // Manually call unselect handler
                    alterTotalCost(parseFloat(textbook.price),false);
                    
                    console.log("Total cost after removing course:" + totalCost)

                    // Update (or set) total cost text
                    totalCostElement.textContent = `Total Cost: ${totalCost.toFixed(2)}`;

                    // After the loop, update totalCostElement text
                    totalCostElement.style.position = 'absolute';
                    totalCostElement.style.right = '10px';
                    totalCostElement.style.bottom = '10px';
                    totalCostElement.style.padding = "5px";

                    // Append the totalCostElement to the costsContainer
                    costsContainer.appendChild(totalCostElement);
                    costsContainer.style.position = 'relative';
                });
              }
              
              else { //called when adding a class 

                //only let user choose one english class 
                if (item.department === "English:" && english) { 

                  checkbox.checked = false; 
                  return; 
                }


                if (item.department === "English:") {
                  english = true; 
                } 

                checkbox.checked = true;           

                // Display the selected course in the "Selected Courses" column
                const selectedCourseItem = document.createElement("div");
                selectedCourseItem.textContent = item.courseName + " " + item.teachers;
                selectedCourseItem.style.fontSize = "22px"; // Set the font size
                clearRectangle.appendChild(selectedCourseItem);
                            
                // Check if totalCostElement already exists
                let totalCostElement = document.getElementById('totalCostElement');

                // Display the associated textbooks and their costs
                item.textbooks.forEach((textbook) => {
                  const textbookElement = document.createElement("div");
                  const titleWidth = 50; // Adjust the width based on your needs
                  const priceWidth = 10;
                  
                  // Create separate elements for the title and the price
                  const titleElement = document.createElement("span");
                  const priceElement = document.createElement("span");
              
                  // Add content to these elements
                  titleElement.textContent = textbook.title;
                  priceElement.textContent = `$${textbook.price}`;

                  alterTotalCost(parseFloat(textbook.price),true);
            
                  console.log("total Cost:" + totalCost);

                  titleElement.style.padding = "5px"; // Adjust the padding value as needed
                  priceElement.style.padding = "5px"; // Adjust the padding value as needed

                  // Style the elements
                  textbookElement.style.display = "flex";
                  textbookElement.style.justifyContent = "space-between";
                  textbookElement.style.width = "100%"; // Adjust as needed
                  textbookElement.style.fontSize = "18px"; // Set the font size
                  
              
                  titleElement.style.textAlign = "left";
                  titleElement.style.flexGrow = "1"; // Allows title to take up the available space
              
                  priceElement.style.textAlign = "right";
                  priceElement.style.width = `${priceWidth}em`; // Adjust width for price element
              
                  // Append the title and price elements to the textbook element
                  textbookElement.appendChild(titleElement);
                  textbookElement.appendChild(priceElement);
                  
                  // Append the textbook element to the container
                  costsContainer.appendChild(textbookElement);
              });


                // If it doesn't exist, create it
                if (!totalCostElement) {
                    totalCostElement = document.createElement("span");
                    totalCostElement.id = 'totalCostElement'; // Set an ID for future reference
                    totalCostElement.style.position = 'absolute';
                    totalCostElement.style.right = '10px';
                    totalCostElement.style.bottom = '10px';
                    totalCostElement.style.padding = "5px";
                    totalCostElement.style.fontSize = "26px"

                    // Append the totalCostElement to the costsContainer
                  
                    costsContainer.appendChild(totalCostElement);
                    costsContainer.style.position = 'relative';
                }

                // Update (or set) total cost text
                totalCostElement.textContent = `Total Cost: ${totalCost.toFixed(2)}`;

                // After the loop, update totalCostElement text
                totalCostElement.style.position = 'absolute';
                totalCostElement.style.right = '10px';
                totalCostElement.style.bottom = '10px';
                totalCostElement.style.padding = "5px";

                // Append the totalCostElement to the costsContainer


                costsContainer.appendChild(totalCostElement);
                costsContainer.style.position = 'relative';

                
                selectedCourses.add(item.courseName + " " + item.teachers); //add the course to selected courses 
              }
          }
        }
    }














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


  function removeCost(price,title) {
    const costElements = costsContainer.querySelectorAll("div");
    console.log("name of removing title: " + title)
    console.log("cost elements:" + price)
    let flag = true; 
    costElements.forEach((element) => {
      if (element.textContent.includes(price) && element.textContent.includes(title) && flag) {
        costsContainer.removeChild(element);
        flag = false; 
        return;
      }
      return;
    });
  }

  function extractCourseName(text) {
        // Extract the course name from the text
        const match = text.match(/^(.*?) \(Teacher: .*\)$/);
        return match ? match[1] : text;
      }

  function handleCourseSelection(courseName, price, isChecked, title) {
        removeSelectedClass(courseName);
        console.log("here is the price we are passing: " + price)

        console.log("here is the title we are passing: " + title)
        removeCost(price, title);
        selectedCourses.delete(courseName);
 }
   // 4. Filter Classes by Department
function filterClassesByDepartment(department) {
  const allClassItems = document.querySelectorAll('#classesList li');

  allClassItems.forEach(item => {
      if (department === '' || item.textContent.indexOf(department) == 0) {
          item.style.display = ''; // Show item
      } else {
          item.style.display = 'none'; // Hide item
      }
  });
}
function alterTotalCost(textbookPrice,isAdd){
  if(isAdd) {
    totalCost = totalCost + textbookPrice; 
  }
  else{
    totalCost = totalCost - textbookPrice;
  }
  console.log("Total Cost:" + totalCost)
}
}
        