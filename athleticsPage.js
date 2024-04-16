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
    totalCostDisplay.id = 'overallTotalCost'; // Ensure the div has an ID if it's newly created
    totalCostDisplay.textContent = `Overall Total Cost: ${overallTotal.toFixed(2)}`;
    totalCostsContainer.appendChild(totalCostDisplay); // Append or update the displayed overall total
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
  table.className = 'data-table';
  const thead = document.createElement("thead");
  const headerRow = thead.insertRow();
  Object.keys(data[0]).forEach(key => {
    const th = document.createElement("th");
    th.textContent = key;
    headerRow.appendChild(th);
  });
  const totalCostHeader = document.createElement("th");
  totalCostHeader.textContent = "Total Cost";
  headerRow.appendChild(totalCostHeader);
  table.appendChild(thead);

  // Create table body
  const tbody = document.createElement("tbody");
  data.forEach(item => {
    const row = tbody.insertRow();
    let totalCost = 0;
    Object.values(item).forEach((text, index) => {
      const cell = row.insertCell();
      cell.textContent = text || '0';
      if (index > 0) {
        totalCost += parseFloat(text) || 0;
      }
    });
    const totalCell = row.insertCell();
    totalCell.textContent = totalCost.toFixed(2);
  });
  table.appendChild(tbody);
  dataContainer.appendChild(table);

  updateOverallTotalCost();
})
.catch(error => console.error('Error:', error));

function updateOverallTotalCost() {
  const tbody = document.querySelector('.data-table tbody');
  let overallTotal = 0;
  const rows = tbody.getElementsByTagName('tr');
  for (const row of rows) {
    const totalCostCell = row.cells[row.cells.length - 1];
    overallTotal += parseFloat(totalCostCell.textContent) || 0;
  }
}

function displayGlobalCostInNavBar() {
  const globalCost = parseFloat(localStorage.getItem('globalCost') || '0').toFixed(2);
  const globalCostDisplayElement = document.createElement('span');
  globalCostDisplayElement.textContent = `Global Cost: $${globalCost}`;
  // Optionally, add a class or ID for styling
  globalCostDisplayElement.className = 'global-cost-display';

  // Select the globalCostContainer within the nav bar
  const globalCostContainer = document.getElementById('globalCostContainer');
  if (globalCostContainer) {
    // Clear previous content (if any) and append the new global cost display
    globalCostContainer.innerHTML = ''; // This ensures that the container is empty before adding the new content
    globalCostContainer.appendChild(globalCostDisplayElement);
  } else {
    console.error('No container found for displaying global costs in the nav bar.');
  }
}
