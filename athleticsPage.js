fetch('http://localhost:3000/data')
  .then(response => response.json())
  .then(data => {
    const dataContainer = document.getElementById("dataContainer");

    if (!dataContainer) {
      console.error('No container element found for the data');
      return;
    }

    // Create the "Total Costs" container
    const totalCostsContainer = document.createElement("div");
    totalCostsContainer.id = "totalCostsContainer";
    dataContainer.appendChild(totalCostsContainer);

    data.forEach(item => {
      // Create a container for each sport
      const sportContainer = document.createElement("div");
      sportContainer.style.display = "flex";
      sportContainer.style.alignItems = "center";
      sportContainer.style.marginBottom = "10px";

      // Create a checkbox for each sport
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = item.Sport; // Assuming 'Sport' is a property in your data

      // Create a label for the checkbox
      const label = document.createElement("label");
      label.htmlFor = item.Sport;
      label.textContent = item.Sport;

      // Event listener for the checkbox
      checkbox.addEventListener('change', function() {
        if (this.checked) {
          totalCostsContainer.innerHTML = ''; // Clear previous content
          Object.entries(item).forEach(([key, value]) => {
            if (key !== 'Sport') { // Assuming 'Sport' is the key for the sport name
              const p = document.createElement("p");
              p.textContent = `${key}: ${value}`;
              totalCostsContainer.appendChild(p);
            }
          });
        } else {
          // Clear the "Total Costs" container if the checkbox is unchecked
          totalCostsContainer.innerHTML = '';
        }
      });

      // Append checkbox and label to the sport container
      sportContainer.appendChild(checkbox);
      sportContainer.appendChild(label);

      // Append the sport container to the data container
      dataContainer.appendChild(sportContainer);
    });
  })
  .catch(error => console.error('Error:', error));
