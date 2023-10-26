
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