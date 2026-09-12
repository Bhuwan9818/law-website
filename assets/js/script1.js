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

    // ── Mega-panel: hover-open with position:fixed support ─────────────────
    // Problem: the panel is position:fixed so it's outside the li's box.
    // Moving the mouse from the li into the panel briefly triggers mouseleave
    // on the li, which would close the panel before it can be reached.
    // Solution: share a close-timer between the li and the panel.
    //   mouseenter → cancel timer → add .ca-mega-open
    //   mouseleave → start 150ms timer → remove .ca-mega-open (if not cancelled)
    (function () {
        var navbar  = document.querySelector('.ca-navbar');
        var panel   = document.querySelector('.ca-mega-panel');
        var megaLi  = document.querySelector('.ca-mega-dropdown');
        var trigger = document.querySelector('.ca-mega-dropdown > .dropdown-toggle');

        if (!megaLi || !panel) return;

        var closeTimer = null;

        // ── Helpers ──────────────────────────────────────────────────────────
        function alignPanel() {
            if (!navbar || !panel) return;
            if (window.innerWidth >= 992) {
                var rect = navbar.getBoundingClientRect();
                panel.style.top = rect.bottom + 'px';
            } else {
                panel.style.top = '';
            }
        }

        function openMenu() {
            clearTimeout(closeTimer);
            if (window.innerWidth < 992) return;   // mobile: use Bootstrap toggle
            alignPanel();
            megaLi.classList.add('ca-mega-open');
        }

        function scheduleClose() {
            closeTimer = setTimeout(function () {
                megaLi.classList.remove('ca-mega-open');
            }, 150);   // 150 ms grace — enough time to move mouse into panel
        }

        // ── Trigger <li> ─────────────────────────────────────────────────────
        megaLi.addEventListener('mouseenter', openMenu);
        megaLi.addEventListener('mouseleave', scheduleClose);

        // ── Fixed panel itself ────────────────────────────────────────────────
        panel.addEventListener('mouseenter', function () {
            clearTimeout(closeTimer);   // mouse arrived in panel — stay open
        });
        panel.addEventListener('mouseleave', scheduleClose);

        // ── Keyboard / click fallback (Bootstrap events) ──────────────────────
        document.addEventListener('show.bs.dropdown', function (e) {
            if (trigger && (e.target === trigger || trigger.contains(e.target))) {
                alignPanel();
            }
        });

        // ── Re-align on resize / orientation change ────────────────────────────
        window.addEventListener('resize', alignPanel, { passive: true });

        // Initial alignment
        alignPanel();
    })();

});
