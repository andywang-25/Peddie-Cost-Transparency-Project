
function filterClasses() {
    const input = document.querySelector("input[type='text']");
    const filter = input.value.toLowerCase();
    const ul = document.getElementById("classesList");
    const li = ul.getElementsByTagName("li");

    for (let i = 0; i < li.length; i++) {
        let label = li[i].getElementsByTagName("label")[0];
        let txtValue = label.textContent || label.innerText;
        if (txtValue.toLowerCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

/*

document.addEventListener("DOMContentLoaded", function () {
    const ul = document.getElementById("classesList");
    const li = ul.getElementsByTagName("li");
    const clearRectangle = document.querySelector("#column_selected_Classes .clear_rectangle");

    for (let i = 0; i < li.length; i++) {
        const checkbox = li[i].querySelector("input[type='checkbox']");

        checkbox.addEventListener("change", function () {
            if (checkbox.checked) {
                let label = li[i].getElementsByTagName("label")[0];
                let txtValue = label.textContent || label.innerText;

                //alert("Selected class: " + txtValue);

                // Create a new div for the selected class
                const selectedCourseItem = document.createElement("div");
                selectedCourseItem.textContent = txtValue;

                // Append the selected class to the "clear_rectangle" div
                clearRectangle.appendChild(selectedCourseItem);
            }
        });
    }
});
*/


document.addEventListener("DOMContentLoaded", function () {
    const ul = document.getElementById("classesList");
    const li = ul.getElementsByTagName("li");
    const clearRectangle = document.querySelector("#column_selected_Classes .clear_rectangle");

    for (let i = 0; i < li.length; i++) {
        const checkbox = li[i].querySelector("input[type='checkbox']");
        let label = li[i].getElementsByTagName("label")[0];
        let txtValue = label.textContent || label.innerText;

        checkbox.addEventListener("change", function () {
            if (checkbox.checked) {
                // Check if a duplicate is not already added
                if (!clearRectangleContains(txtValue)) {
                    // Create a new div for the selected class
                    const selectedCourseItem = document.createElement("div");
                    selectedCourseItem.textContent = txtValue;
                    selectedCourseItem.style.fontSize = "30px"; // Set the font size


                    // Append the selected class to the "clear_rectangle" div
                    clearRectangle.appendChild(selectedCourseItem);
                }
            } else {
                // Remove the text when the checkbox is unchecked
                removeSelectedClass(txtValue);
            }
        });
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

    function removeSelectedClass(text) {
        let children = clearRectangle.children;
        for (let i = 0; i < children.length; i++) {
            if (children[i].textContent === text) {
                clearRectangle.removeChild(children[i]);
                return;
            }
        }
    }
});
