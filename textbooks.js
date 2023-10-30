//import commands
const fs = require("fs");
const { parse } = require("csv-parse");

fs.createReadStream("./textbooks.csv");
const textbookData = []; // textbook price bible (holds all textbook information)

//reads into textbookData array
fs.createReadStream("./textbooks.csv")
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
    console.log(error.message);
  })
  // result array
  .on("end", function () {
    console.log("parsed textbook data:");
    console.log(textbookData);
  });