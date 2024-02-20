fetch('http://localhost:3000/data')
.then(response => response.json())
.then(data => {
  const dataContainer = document.getElementById("dataContainer");
  const totalCostsContainer = document.getElementById("totalCostsContainer");

  if (!dataContainer) {
    console.error('No container element found for the data');
    return;
  }


  // Use it as needed
  function updateOverallTotalCost() {
    let overallTotal = 0; // Initialize the sum of all total costs
    const rows = tbody.getElementsByTagName('tr');
    // Iterate over each row to sum up the total costs
    for (const row of rows) {
      if (row.style.display !== 'none') { // Check if the row is visible
        const totalCostCell = row.cells[row.cells.length - 1]; // Get the last cell, assuming it's the total cost
        const totalCostValue = parseFloat(totalCostCell.textContent) || 0;
        overallTotal += totalCostValue; // Add the row's total cost to the overall total
      }
    }
  
    // Display the overall total cost
    const totalCostDisplay = document.getElementById('overallTotalCost') || document.createElement('div');
    totalCostDisplay.id = 'overallTotalCost';
    totalCostDisplay.textContent = `Overall Total Cost: ${overallTotal.toFixed(2)}`;
    totalCostsContainer.appendChild(totalCostDisplay);

    // Update globalCost in localStorage
    updateGlobalCost(overallTotal);
  }

  // New function to update the globalCost in localStorage
  function updateGlobalCost(overallTotal) {
    let globalCost = parseFloat(localStorage.getItem('globalCost') || '0');
    globalCost += overallTotal; // Add the overall total cost of athletics to the global cost
    localStorage.setItem('globalCost', globalCost.toFixed(2)); // Update localStorage
    displayGlobalCostInNavBar(); // Update the display of global cost in the navigation bar, if applicable
  }
  
  // Function to display global cost in the navigation bar
function displayGlobalCostInNavBar() {
  const globalCost = parseFloat(localStorage.getItem('globalCost') || '0').toFixed(2);
  const globalCostDisplayElement = document.getElementById('globalCostDisplay') || document.createElement('span');
  globalCostDisplayElement.id = 'globalCostDisplay';
  globalCostDisplayElement.textContent = `Global Cost: $${globalCost}`;
  // Append or update the displayed global cost in the nav bar
  const globalCostContainer = document.getElementById('globalCostContainer');
  if (globalCostContainer) {
    globalCostContainer.innerHTML = '';
    globalCostContainer.appendChild(globalCostDisplayElement);
  } else {
    console.error('No container found for displaying global costs in the nav bar.');
  }
}


  // Deduplicate data based on the 'Sport' property
  const seen = new Set();
  const deduplicatedData = data.filter(item => {
    const duplicate = seen.has(item.Sport);
    seen.add(item.Sport);
    return !duplicate;
  });

  // Initialize table structure
  const table = document.createElement("table");
  table.className = "data-table"; // Use the class for styling
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  table.appendChild(thead);
  table.appendChild(tbody);
  totalCostsContainer.appendChild(table);

  // Determine unique keys (excluding 'Sport') from the data for table columns
  let uniqueKeys = new Set();
  deduplicatedData.forEach(item => {
    Object.keys(item).forEach(key => {
      if (key !== 'Sport') uniqueKeys.add(key);
    });
  });
  uniqueKeys = [...uniqueKeys]; // Convert Set to Array

  // Create table headers with "Sport" as the first column
  const trHead = document.createElement("tr");
  const sportTh = document.createElement("th");
  sportTh.textContent = "Sport";
  trHead.appendChild(sportTh);
  uniqueKeys.forEach(key => {
    const th = document.createElement("th");
    th.textContent = key;
    trHead.appendChild(th);
  });
  // Add a column for Total Cost
  const totalCostTh = document.createElement("th");
  totalCostTh.textContent = "Total Cost";
  trHead.appendChild(totalCostTh);
  thead.appendChild(trHead);

  // Event listener to update table based on selected sport
  deduplicatedData.forEach(item => {
    const sportContainer = document.createElement("div");
    sportContainer.style.display = "flex";
    sportContainer.style.alignItems = "center";
    sportContainer.style.marginBottom = "10px";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = item.Sport;

    const label = document.createElement("label");
    label.htmlFor = item.Sport;
    label.textContent = item.Sport;

    checkbox.addEventListener('change', function() {
      // Check if this sport's row already exists
      let existingRow = tbody.querySelector(`tr[data-sport="${item.Sport}"]`);
      if (this.checked) {
        if (!existingRow) {
          const tr = document.createElement("tr");
          tr.setAttribute("data-sport", item.Sport);
          // Add sport name cell as the first column
          const sportNameTd = document.createElement("td");
          sportNameTd.textContent = item.Sport;
          tr.appendChild(sportNameTd);
          let totalCost = 0;
          uniqueKeys.forEach(key => {
            const td = document.createElement("td");
            const cost = parseFloat(item[key]) || 0;
            td.textContent = cost.toFixed(2); // Assuming costs are numerical
            totalCost += cost;
            tr.appendChild(td);
          });
          // Add total cost cell
          const totalCostTd = document.createElement("td");
          totalCostTd.textContent = totalCost.toFixed(2);
          tr.appendChild(totalCostTd);

          tbody.appendChild(tr);
          let globalCost = parseFloat(localStorage.getItem('globalCost') || '0'); // If null, default to 0
          console.log("upon click: " + globalCost);
          
        } else {
          // Show the existing row if it was previously hidden
          existingRow.style.display = "";
        }
      } else {
        if (existingRow) {
          // Hide the row instead of removing to preserve state
          existingRow.style.display = "none";
        }
      }
      updateOverallTotalCost();
    });

    sportContainer.appendChild(checkbox);
    sportContainer.appendChild(label);
    dataContainer.appendChild(sportContainer);
  });

  displayGlobalCost();

})
.catch(error => console.error('Error:', error));

document.addEventListener('DOMContentLoaded', () => {
  displayGlobalCostInNavBar();
});

