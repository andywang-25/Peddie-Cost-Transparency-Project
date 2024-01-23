// // how to load in the SQL data
// // 1. open command prompt, cd into my-node-project, and run "node app.js". This command connects to the SQL database (needs to be running) from your computer 
// // 2. run this code, code below takes the data from your computer (that was retrieved with the app.js code) and displays it onto the HTML website



fetch('http://localhost:3000/data')
  .then(response => response.json())
  .then(data => {
    const dataContainer = document.getElementById("dataContainer");

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
    table.className = 'data-table';

    // Create the table header
    const thead = document.createElement("thead");
    const headerRow = thead.insertRow();
    Object.keys(data[0]).forEach(key => {
      const th = document.createElement("th");
      th.textContent = key;
      headerRow.appendChild(th);
    });
    // Add a header for the total cost column
    const totalCostHeader = document.createElement("th");
    totalCostHeader.textContent = "Total Cost";
    headerRow.appendChild(totalCostHeader);
    
    table.appendChild(thead);

    // Create the table body with fetched data
    const tbody = document.createElement("tbody");

    data.forEach(item => {
      const row = tbody.insertRow();
      let totalCost = 0;

      Object.values(item).forEach((text, index) => {
        const cell = row.insertCell();
        cell.textContent = text;

           // Check if the cell is empty and set it to '0'
        if (text === '' || text == null) {
          cell.textContent = '0';
        } else {
          cell.textContent = text;
        }


        // Sum numeric values, skipping the first column (Sport Name)
        if (index > 0) {
          totalCost += parseFloat(text) || 0;
        }
      });

      // Add a cell for the total cost
      const totalCell = row.insertCell();
      totalCell.textContent = totalCost.toFixed(2); // Formats the total cost to 2 decimal places
    });

    table.appendChild(tbody);

    dataContainer.appendChild(table);
  })
  .catch(error => console.error('Error:', error));
