fetch('http://localhost:3000/data')
.then(response => response.json())
.then(data => {
  const dataContainer = document.getElementById("dataContainer");
  const totalCostsContainer = document.getElementById("totalCostsContainer");

  if (!dataContainer) {
    console.error('No container element found for the data');
    return;
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
    });

    sportContainer.appendChild(checkbox);
    sportContainer.appendChild(label);
    dataContainer.appendChild(sportContainer);
  });
})
.catch(error => console.error('Error:', error));
