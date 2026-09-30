/**
 * Conformity Alliance - Dynamic Unified Navbar & Header System (navbar.js)
 * Single Source of Truth for Top Utility Bar, Main Mega-Menu, and Navigation.
 * Based on About.html navbar, unlinking service sub-pages and presenting services as offerings.
 */

(function(window, document) {
    // Master Services Catalog (displayed as services offered by Conformity Alliance)
    const defaultServiceCatalog = [
        {
            category: "Registrations & Licences",
            icon: "fa-solid fa-id-card",
            services: [
                "Shop & Establishment License",
                "Factory Act License",
                "BOCW License (Building & Other Construction)",
                "Contract Labour Principal RC & Contractor License",
                "Inter-State Migrant Workmen Registration",
                "Municipal Trade License",
                "Electrical Contractor & Inspector Approvals",
                "Pollution Certification (CTE & CTO NOC)",
                "Fire & Safety Certification / NOC",
                "PASARA Private Security Agency License",
                "Catering & FSSAI Food Business License"
            ]
        },
        {
            category: "Advisory & Payroll",
            icon: "fa-solid fa-scale-balanced",
            services: [
                "PF Advisory, Filings & Inspection Defense",
                "ESI Advisory, Governance & Claims",
                "Professional Tax Advisory & State Filings",
                "Payroll Processing & CTC Structuring",
                "Statutory Returns, Challans & Registers",
                "Certified Standing Orders & Rule Drafting",
                "Night Shift Exemption Approvals for Women",
                "Factory Plan & Building Map Approvals",
                "CTE / CTO Environmental Clearances",
                "Corporate Labour Law Advisory"
            ]
        },
        {
            category: "Compliance Audits",
            icon: "fa-solid fa-clipboard-check",
            services: [
                "Factory & Industrial Safety Compliance Audits",
                "Contract Labour (CLRA) Vendor Audits",
                "Commercial Establishment Compliance Audits",
                "EHS (Environment, Health & Safety) Audits",
                "PASARA Agency Regulatory Audits",
                "Supply Chain & Sub-Contractor Audits",
                "POSH Internal Committee Audit & Filings",
                "DPDP Act Workplace Data Privacy Audits"
            ]
        },
        {
            category: "Liaison & Legal Defense",
            icon: "fa-solid fa-gavel",
            services: [
                "Representation Before Labour Commissioners",
                "Statutory Inspection & Audit Defense",
                "Show-Cause & Demand Notice Replies",
                "EPFO Section 7A & 14B Quasi-Judicial Proceedings",
                "ESIC Section 45A & 85B Legal Defense",
                "Industrial Dispute Resolution & Conciliation"
            ]
        }
    ];

    function getSettings() {
        if (window.CADB && typeof window.CADB.getSettings === 'function') {
            return window.CADB.getSettings();
        }
        return {
            phone: "+91 7701901010",
            phoneRaw: "+917701901010",
            email: "info@conformityalliance.in",
            whatsapp: "917701901010",
            announcement: {
                enabled: true,
                badge: "Legal Notice",
                text: "India's Leading Advocate-Led Labour Law Practice — Pan-India Statutory Compliance & Advisory."
            }
        };
    }

    function generateHeaderHTML() {
        const settings = getSettings();
        const currentPath = window.location.pathname.toLowerCase();
        
        // Active item detection
        const isHome = currentPath.endsWith('index.html') || currentPath.endsWith('/') || currentPath === '';
        const isAbout = currentPath.includes('about');
        const isBlogs = currentPath.includes('blog');
        const isContact = currentPath.includes('contact');
        const isCalendar = currentPath.includes('compliancecalender') || currentPath.includes('compliancecalendar');

        // Build Services Mega Columns
        const serviceColsHTML = defaultServiceCatalog.map((col, idx) => {
            const listItems = col.services.map(srv => `
                <li class="ca-service-list-item">
                    <span class="ca-service-item">
                        <i class="fa-solid fa-angle-right"></i>
                        <span>${srv}</span>
                    </span>
                </li>
            `).join('');

            return `
                <div class="ca-mega-col">
                    <h6><i class="${col.icon}"></i> ${col.category}</h6>
                    <ul>
                        ${listItems}
                    </ul>
                </div>
            `;
        }).join('');

        return `
            <!-- Top Utility Bar -->
            <header class="ca-utility-bar">
                <div class="ca-utility-inner">
                    <div class="ca-utility-badge">
                        <span class="ca-status-dot"></span>
                        <span id="caDynamicAnnounceText">${settings.announcement?.text || "India's Leading Advocate-Led Labour Law Practice"}</span>
                    </div>
                    <div class="ca-utility-contact">
                        <a href="tel:${settings.phoneRaw || '+917701901010'}"><i class="fas fa-phone"></i> ${settings.phone || '+91 7701901010'}</a>
                        <a href="mailto:${settings.email || 'info@conformityalliance.in'}"><i class="fas fa-envelope"></i> ${settings.email || 'info@conformityalliance.in'}</a>
                    </div>
                </div>
            </header>

            <!-- Floating WhatsApp Contact -->
            <aside class="whatsapp_img">
                <a href="https://wa.me/${settings.whatsapp || '917701901010'}" target="_blank" rel="noopener noreferrer" class="whatsapp-fab" aria-label="Chat with our Compliance Experts on WhatsApp">
                    <img src="assets/images/whatsapp.svg" alt="WhatsApp" class="img-whsapp" />
                    <span>Chat with Expert</span>
                </a>
            </aside>

            <!-- Main Sticky Navigation -->
            <nav class="navbar navbar-expand-lg ca-navbar" aria-label="Main Navigation">
                <div class="container-fluid ca-navbar-inner">
                    <a class="navbar-brand ca-brand" href="index.html" aria-label="Conformity Alliance Home">
                        <img src="assets/images/Picture1.png" alt="Conformity Alliance Logo" class="nav-img">
                        <img src="assets/images/logo.png" alt="Conformity Alliance" class="vg-width">
                    </a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#mainNav" aria-controls="mainNav"
                        aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="mainNav">
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0 ms-auto align-items-lg-center gap-lg-1">
                            <li class="nav-item">
                                <a class="nav-link hrhover ${isHome ? 'active' : ''}" href="index.html">Home</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link hrhover ${isAbout ? 'active' : ''}" href="about.html">About</a>
                            </li>
                            <li class="nav-item dropdown ca-mega-dropdown">
                                <a class="nav-link dropdown-toggle hrhover" href="#" role="button"
                                    data-bs-toggle="dropdown" aria-expanded="false">Services Offered</a>
                                <div class="dropdown-menu ca-mega-panel">
                                    <div class="ca-mega-grid">
                                        ${serviceColsHTML}
                                        <div class="ca-mega-feature">
                                            <div class="ca-mega-feature-box">
                                                <div class="ca-mega-feature-icon"><i class="fa-solid fa-comments"></i></div>
                                                <h6>Need Statutory Guidance?</h6>
                                                <p>Our senior advocates review your organizational structure and handle all filings &amp; licenses end-to-end.</p>
                                                <a href="contact.html">Talk to an Advocate</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle hrhover" href="#" role="button"
                                    data-bs-toggle="dropdown" aria-expanded="false">More</a>
                                <ul class="dropdown-menu ca-more-menu">
                                    <li><a class="dropdown-item" href="#">Library</a></li>
                                    <li><a class="dropdown-item" href="#">Blogs</a></li>
                                    <li><a class="dropdown-item" href="contact.html">Contact Us</a></li>
                                </ul>
                            </li>
                        </ul>
                        <button class="nav-but"><a href="contact.html">Book a Consultation</a></button>
                        <div class="nav-right-icons">
                            <a href="https://www.facebook.com/people/Conformity-Alliance/61574098757164/?sk=about" class="icon-btn" aria-label="Facebook" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-facebook"></i></a>
                            <a href="https://www.linkedin.com/company/conformity-alliance/" class="icon-btn" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-linkedin"></i></a>
                        </div>
                    </div>
                </div>
            </nav>
        `;
    }

    function initMegaMenuBehavior() {
        const navbar = document.querySelector('.ca-navbar');
        const panel = document.querySelector('.ca-mega-panel');
        const megaLi = document.querySelector('.ca-mega-dropdown');
        const trigger = document.querySelector('.ca-mega-dropdown > .dropdown-toggle');

        if (!megaLi || !panel) return;

        let closeTimer = null;

        function alignPanel() {
            if (!navbar || !panel) return;
            if (window.innerWidth >= 992) {
                const rect = navbar.getBoundingClientRect();
                panel.style.top = '';
            } else {
                panel.style.top = '';
            }
        }

        function openMenu() {
            clearTimeout(closeTimer);
            if (window.innerWidth < 992) return;
            alignPanel();
            megaLi.classList.add('ca-mega-open');
        }

        function scheduleClose() {
            closeTimer = setTimeout(function () {
                megaLi.classList.remove('ca-mega-open');
            }, 150);
        }

        megaLi.addEventListener('mouseenter', openMenu);
        megaLi.addEventListener('mouseleave', scheduleClose);

        panel.addEventListener('mouseenter', function () { clearTimeout(closeTimer); });
        panel.addEventListener('mouseleave', scheduleClose);

        document.addEventListener('show.bs.dropdown', function(e) {
            if (e.target === trigger || (trigger && trigger.contains(e.target))) {
                alignPanel();
            }
        });

        window.addEventListener('resize', alignPanel, { passive: true });
        window.addEventListener('scroll', alignPanel, { passive: true });
        alignPanel();
    }

    function renderDynamicNavbar() {
        // Find or create target container
        let headerPlaceholder = document.getElementById('caHeaderPlaceholder');
        const existingUtil = document.querySelector('.ca-utility-bar');
        const existingNav = document.querySelector('.ca-navbar');
        const existingWhatsapp = document.querySelector('.whatsapp_img');

        if (headerPlaceholder) {
            headerPlaceholder.innerHTML = generateHeaderHTML();
        } else if (existingUtil && existingNav) {
            // Replace existing static navbar & utility bar with dynamic master template
            const temp = document.createElement('div');
            temp.innerHTML = generateHeaderHTML();
            
            existingUtil.replaceWith(temp.querySelector('.ca-utility-bar'));
            if (existingWhatsapp) {
                existingWhatsapp.replaceWith(temp.querySelector('.whatsapp_img'));
            }
            existingNav.replaceWith(temp.querySelector('.ca-navbar'));
        }

        // Initialize hover & positioning logic
        initMegaMenuBehavior();
    }

    // Auto-run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderDynamicNavbar);
    } else {
        renderDynamicNavbar();
    }

    // Listen for database updates
    window.addEventListener('ca_db_updated', renderDynamicNavbar);

    // Export to global
    window.renderDynamicNavbar = renderDynamicNavbar;

})(window, document);
