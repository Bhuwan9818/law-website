function filterServices() {
    let input = document.getElementById("searchBar").value.toLowerCase();
    let serviceSections = document.querySelectorAll(".sidebar-first");

    serviceSections.forEach(section => {
        let category = section.getAttribute("data-category").toLowerCase();
        let items = section.querySelectorAll("ul li");
        let matchFound = false;

        items.forEach(item => {
            let text = item.textContent.toLowerCase();
            if (text.includes(input)) {
                item.style.display = "block";
                matchFound = true;
            } else {
                item.style.display = "none";
            }
        });

        // Show or hide entire section based on matches
        section.style.display = matchFound ? "block" : "none";
    });
}


document.addEventListener("DOMContentLoaded", function () {
    let navLinks = document.querySelectorAll(".right-active a");
    let currentUrl = window.location.pathname;

    navLinks.forEach(link => {
        if (link.href.includes(currentUrl)) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
});