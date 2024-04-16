fetch('http://localhost:3000/data')
.then(response => response.json())
.then(data => {
  const dataContainer = document.getElementById("dataContainer");
  const totalCostsContainer = document.getElementById("totalCostsContainer");

  if (!dataContainer) {
    console.error('No container element found for the data');
    return;
  }
  if (!totalCostsContainer) {
    console.error('No container for total costs found');
    return;
  }

  if (data.length === 0) {
    console.log('No data received');
    return;
  }

  // Create a table and its header
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

  const totalCostDisplay = document.getElementById('overallTotalCost') || document.createElement('div');
  totalCostDisplay.id = 'overallTotalCost';
  totalCostDisplay.textContent = `Overall Total Cost: ${overallTotal.toFixed(2)}`;
  document.getElementById("totalCostsContainer").appendChild(totalCostDisplay);
}
