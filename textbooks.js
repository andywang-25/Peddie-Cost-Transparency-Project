//import commands
const fs = require("fs");
const { parse } = require("csv-parse");

fs.createReadStream("./data/textbooks.csv");
const textbookData = []; // textbook price bible (holds all textbook information)

//reads into textbookData array
fs.createReadStream("./data/textbooks.csv")
  .pipe(
    parse({
      delimiter: ",",
      from_line: 3, //starts @ line 3
      columns: true, //makes columns into key
      ltrim: true //removes white space
    })
  )
  // push specific columns into array
  .on("data", function (row) {
    const desiredColumns = {
      "Department":row["Department"],
      "Course Name": row["Course Name"],
      "Teacher": row["Teacher"],
      "Title": row["Title"],
      "buy link": row["buy link"],
      "book price": row["book price"]
    }
    textbookData.push(desiredColumns);
  })
  // in case of errors
  .on("error", function (error) {
    //console.log(error.message);
  })
  // result array
  .on("end", function () {
    //prints out textbookData
    console.log("parsed textbook data:");
    console.log(textbookData);
  }); 


console.log("test");

console.log("textbookData:", textbookData);



const textbookDataContainer = document.getElementById("textbookDataContainer");

// Create a table element
const table = document.createElement("table");

// Create the table header
const thead = document.createElement("thead");
const headerRow = thead.insertRow();
headerRow.innerHTML = "<th>Department</th><th>Course Name</th><th>Teacher</th><th>Title</th><th>Buy Link</th><th>Book Price</th>";
table.appendChild(thead);

// Create the table body with textbook data
const tbody = document.createElement("tbody");

textbookData.forEach((textbook) => {
  const row = tbody.insertRow();
  row.innerHTML = `<td>${textbook.Department}</td><td>${textbook["Course Name"]}</td><td>${textbook.Teacher}</td><td>${textbook.Title}</td><td><a href="${textbook['buy link']}" target="_blank">Buy</a></td><td>${textbook['book price']}</td>`;
});

table.appendChild(tbody);

// Append the table to the container
textbookDataContainer.appendChild(table);





