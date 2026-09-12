document.addEventListener("DOMContentLoaded", function () {
    // ── Legacy mega-menu (old markup) ───────────────────────────────────────
    let menuItem = document.querySelector(".menu-item");
    let megaMenu = document.querySelector(".mega-menu");
    let megaicon = document.querySelector(".icon-up");

    if (menuItem && megaMenu && megaicon) {
        menuItem.addEventListener("mouseenter", function () {
            megaMenu.style.display = "block";
            megaicon.style.transform = "rotate(360deg)";
        });
        menuItem.addEventListener("mouseleave", function () {
            megaMenu.style.display = "none";
            megaicon.style.transform = "rotate(0deg)";
        });
    }

    // ── Mega-panel positioning for position:fixed dropdown ─────────────────
    // The .ca-mega-panel uses position:fixed on desktop so it can escape any
    // overflow:hidden ancestor. We calculate its top from the navbar rect.
    (function () {
        var navbar  = document.querySelector('.ca-navbar');
        var panel   = document.querySelector('.ca-mega-panel');
        var trigger = document.querySelector('.ca-mega-dropdown > .dropdown-toggle');

        function alignPanel() {
            if (!navbar || !panel) return;
            if (window.innerWidth >= 992) {
                var rect = navbar.getBoundingClientRect();
                panel.style.top = rect.bottom + 'px';
            } else {
                panel.style.top = '';
            }
        }

        // Align when Bootstrap fires the dropdown-show event
        document.addEventListener('show.bs.dropdown', function (e) {
            if (trigger && (e.target === trigger || trigger.contains(e.target))) {
                alignPanel();
            }
        });

        // Re-align on resize (e.g. orientation change on tablet)
        window.addEventListener('resize', alignPanel, { passive: true });

        // Initial alignment
        alignPanel();
    })();
});
