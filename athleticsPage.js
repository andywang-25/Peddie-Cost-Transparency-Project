





// how to load in the SQL data
// 1. open command prompt, cd into my-node-project, and run "node app.js". This command connects to the SQL database (needs to be running) from your computer 
// 2. run this code, code below takes the data from your computer (that was retrieved with the app.js code) and displays it onto the HTML website




fetch('http://localhost:3000/data')
  .then(response => response.json())
  .then(data => {
    const dataContainer = document.getElementById("dataContainer"); // Renamed for generality

    if (!dataContainer) {
      console.error('No container element found for the data');
      return;
    }

    if (data.length === 0) {
      console.log('No data received');
      return;
    }

    // Create a table element
    const table = document.createElement("table");

    // Create the table header based on the keys of the first data object
    const thead = document.createElement("thead");
    const headerRow = thead.insertRow();
    Object.keys(data[0]).forEach(key => {
      const th = document.createElement("th");
      th.textContent = key; // Set the column name as the header
      headerRow.appendChild(th);
    });
    table.appendChild(thead);

    // Create the table body with fetched data
    const tbody = document.createElement("tbody");

    data.forEach(item => {
      const row = tbody.insertRow();
      Object.values(item).forEach(text => {
        const cell = row.insertCell();
        cell.textContent = text;
      });
    });

    table.appendChild(tbody);

    // Append the table to the container
    dataContainer.appendChild(table);
  })
  .catch(error => console.error('Error:', error));
