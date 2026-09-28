/**
 * Conformity Alliance - Executive Admin Dashboard Controller (admin.js)
 * High-performance, full-featured dynamic site management application.
 */

document.addEventListener('DOMContentLoaded', function() {
    // 1. Authentication & State Initialization
    const session = CADB.getSession();
    const loginSection = document.getElementById('adminLoginSection');
    const appSection = document.getElementById('adminAppSection');

    if (!session) {
        showLoginScreen();
    } else {
        showDashboardApp(session);
    }

    // ----------------- AUTHENTICATION FLOW -----------------
    function showLoginScreen() {
        if (loginSection) loginSection.style.display = 'flex';
        if (appSection) appSection.style.display = 'none';
        
        const loginForm = document.getElementById('adminLoginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const u = document.getElementById('loginUsername').value;
                const p = document.getElementById('loginPassword').value;
                const res = CADB.authenticate(u, p);
                if (res.success) {
                    showToast('Welcome back, ' + res.session.name, 'success');
                    setTimeout(() => {
                        window.location.reload();
                    }, 400);
                } else {
                    const errEl = document.getElementById('loginError');
                    if (errEl) {
                        errEl.textContent = res.error || 'Invalid credentials';
                        errEl.style.display = 'block';
                    }
                    showToast('Authentication failed', 'error');
                }
            });
        }
    }

    function showDashboardApp(userSession) {
        if (loginSection) loginSection.style.display = 'none';
        if (appSection) appSection.style.display = 'flex';

        // Set user info
        const userDisplay = document.getElementById('adminUserNameDisplay');
        const roleDisplay = document.getElementById('adminUserRoleDisplay');
        if (userDisplay) userDisplay.textContent = userSession.name || 'Administrator';
        if (roleDisplay) roleDisplay.textContent = userSession.role || 'Compliance Admin';

        // Setup Router & Event Handlers
        initNavigation();
        initOverview();
        initServicesManager();
        initBlogsManager();
        initCategoriesManager();
        initWebsiteSettingsManager();
        initLeadsManager();
        initSystemTools();
        initDynamicFormBuilders();

        // Responsive Sidebar Toggle
        const toggleBtn = document.getElementById('mobileNavToggle');
        const sidebar = document.querySelector('.admin-sidebar');
        if (toggleBtn && sidebar) {
            toggleBtn.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });
        }

        // Global Logout
        const logoutBtns = document.querySelectorAll('.admin-logout-btn');
        logoutBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm('Are you sure you want to log out of the Admin Dashboard?')) {
                    CADB.logout();
                    window.location.reload();
                }
            });
        });
    }

    // ----------------- NAVIGATION ROUTER -----------------
    function initNavigation() {
        const navLinks = document.querySelectorAll('.admin-nav-item a[data-view]');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const viewName = this.getAttribute('data-view');
                switchView(viewName);
            });
        });
    }

    function switchView(viewName) {
        // Update nav active classes
        document.querySelectorAll('.admin-nav-item').forEach(li => li.classList.remove('active'));
        const activeLink = document.querySelector(`.admin-nav-item a[data-view="${viewName}"]`);
        if (activeLink && activeLink.parentElement) {
            activeLink.parentElement.classList.add('active');
        }

        // Update breadcrumb
        const breadcrumb = document.getElementById('currentViewBreadcrumb');
        if (breadcrumb) {
            breadcrumb.textContent = viewName.charAt(0).toUpperCase() + viewName.slice(1);
        }

        // Show view section
        document.querySelectorAll('.admin-view-pane').forEach(pane => pane.style.display = 'none');
        const targetPane = document.getElementById(`view-${viewName}`);
        if (targetPane) {
            targetPane.style.display = 'block';
        }

        // Close mobile sidebar if open
        const sidebar = document.querySelector('.admin-sidebar');
        if (sidebar) sidebar.classList.remove('open');

        // Refresh view data
        if (viewName === 'overview') renderOverviewStats();
        if (viewName === 'services') renderServicesList();
        if (viewName === 'blogs') renderBlogsList();
        if (viewName === 'categories') renderCategoriesList();
        if (viewName === 'website') renderWebsiteSettings();
        if (viewName === 'leads') renderLeadsList();
    }

    // ----------------- 1. DASHBOARD OVERVIEW -----------------
    function initOverview() {
        renderOverviewStats();
    }

    function renderOverviewStats() {
        const data = CADB.getData();
        const services = data.services || [];
        const blogs = data.blogs || [];
        const categories = data.categories || [];
        const leads = data.leads || [];

        const statServices = document.getElementById('statTotalServices');
        const statBlogs = document.getElementById('statTotalBlogs');
        const statCategories = document.getElementById('statTotalCategories');
        const statLeads = document.getElementById('statTotalLeads');

        if (statServices) statServices.textContent = services.length;
        if (statBlogs) statBlogs.textContent = blogs.length;
        if (statCategories) statCategories.textContent = categories.length;
        if (statLeads) statLeads.textContent = leads.length;

        // Render Recent Inquiries in Overview
        const overviewLeadsContainer = document.getElementById('overviewRecentLeads');
        if (overviewLeadsContainer) {
            const recent = leads.slice(0, 5);
            if (recent.length === 0) {
                overviewLeadsContainer.innerHTML = `<tr><td colspan="5" style="text-align:center; color: var(--admin-text-muted);">No inquiries yet.</td></tr>`;
            } else {
                overviewLeadsContainer.innerHTML = recent.map(l => `
                    <tr>
                        <td><strong>${escapeHtml(l.name)}</strong></td>
                        <td>${escapeHtml(l.phone || l.email)}</td>
                        <td><span class="badge-category">${escapeHtml(l.service || 'General')}</span></td>
                        <td><span class="badge-status badge-${l.status}">${l.status}</span></td>
                        <td>${new Date(l.createdAt).toLocaleDateString()}</td>
                    </tr>
                `).join('');
            }
        }
    }

    // ----------------- 2. SERVICES MANAGER -----------------
    let currentEditingServiceId = null;

    function initServicesManager() {
        renderServicesList();

        // Search and Filter Listeners
        const searchInput = document.getElementById('serviceSearchInput');
        const catSelect = document.getElementById('serviceCategoryFilter');
        const statusSelect = document.getElementById('serviceStatusFilter');

        if (searchInput) searchInput.addEventListener('input', renderServicesList);
        if (catSelect) catSelect.addEventListener('change', renderServicesList);
        if (statusSelect) statusSelect.addEventListener('change', renderServicesList);

        // Add Service Button
        const addBtn = document.getElementById('btnAddNewService');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                openServiceModal(null);
            });
        }

        // Service Form Submission
        const form = document.getElementById('serviceEditorForm');
        if (form) {
            form.addEventListener('submit', handleServiceFormSubmit);
        }
    }

    function renderServicesList() {
        const searchVal = (document.getElementById('serviceSearchInput')?.value || '').trim();
        const catVal = document.getElementById('serviceCategoryFilter')?.value || '';
        const statusVal = document.getElementById('serviceStatusFilter')?.value || '';

        const categories = CADB.getCategories('service');
        populateCategoryDropdown('serviceCategoryFilter', categories, true, 'All Categories');
        populateCategoryDropdown('srvInputCategory', categories, false);

        const filter = {};
        if (searchVal) filter.search = searchVal;
        if (catVal) filter.categoryId = catVal;
        if (statusVal) filter.status = statusVal;

        const services = CADB.getServices(filter);
        const container = document.getElementById('servicesGridContainer');
        if (!container) return;

        if (services.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 50px 20px; background: var(--admin-bg-surface); border-radius: var(--admin-radius-md); border: 1px dashed var(--admin-border);">
                    <i class="fa-solid fa-briefcase" style="font-size: 2.5rem; color: var(--admin-gold-light); margin-bottom: 12px; display: block;"></i>
                    <h3 style="color: #fff; margin-bottom: 8px;">No Services Found</h3>
                    <p style="color: var(--admin-text-secondary); margin-bottom: 20px;">Get started by adding your first compliance or legal service page.</p>
                    <button class="btn-gold" onclick="document.getElementById('btnAddNewService').click()">
                        <i class="fa-solid fa-plus"></i> Create Service
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = services.map(srv => {
            const cat = CADB.getCategoryById(srv.categoryId);
            const catName = cat ? cat.name : 'General Compliance';
            const catColor = cat ? cat.color : 'var(--admin-gold)';
            const isPublished = srv.status === 'published';

            return `
                <div class="admin-item-card" data-id="${srv.id}">
                    <div class="admin-item-card-top">
                        <div class="admin-item-icon">
                            <i class="${escapeHtml(srv.icon || 'fa-solid fa-scale-balanced')}"></i>
                        </div>
                        <div style="display: flex; gap: 8px; align-items: center;">
                            <span class="badge-status badge-${srv.status}">${srv.status}</span>
                            ${srv.isFeatured ? '<span class="badge-category" style="background: rgba(198,154,78,0.2); color: var(--admin-gold-light);"><i class="fa-solid fa-star"></i> Featured</span>' : ''}
                        </div>
                    </div>
                    <h4>${escapeHtml(srv.title)}</h4>
                    <p class="desc">${escapeHtml(srv.excerpt || srv.fullDescription || '')}</p>
                    <div style="margin-bottom: 14px;">
                        <span class="badge-category" style="border-color: ${catColor}; color: ${catColor};">
                            <i class="${cat?.icon || 'fa-solid fa-tag'}"></i> ${escapeHtml(catName)}
                        </span>
                    </div>
                    <div class="admin-item-footer">
                        <div class="admin-item-meta">
                            <i class="fa-regular fa-clock"></i> Updated ${new Date(srv.updatedAt || srv.createdAt).toLocaleDateString()}
                        </div>
                        <div class="action-btns">
                            <a href="service.html?slug=${encodeURIComponent(srv.slug)}" target="_blank" class="icon-btn" title="View Public Page">
                                <i class="fa-solid fa-arrow-up-right-from-square"></i>
                            </a>
                            <button type="button" class="icon-btn btn-preview-srv" data-slug="${escapeHtml(srv.slug)}" title="Live Preview">
                                <i class="fa-solid fa-eye"></i>
                            </button>
                            <button type="button" class="icon-btn btn-export-srv" data-id="${srv.id}" title="Export Standalone HTML">
                                <i class="fa-solid fa-file-code"></i>
                            </button>
                            <button type="button" class="icon-btn btn-edit-srv" data-id="${srv.id}" title="Edit Service">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button type="button" class="icon-btn btn-delete btn-delete-srv" data-id="${srv.id}" title="Delete Service">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Attach action handlers
        container.querySelectorAll('.btn-edit-srv').forEach(b => {
            b.addEventListener('click', () => openServiceModal(b.getAttribute('data-id')));
        });
        container.querySelectorAll('.btn-preview-srv').forEach(b => {
            b.addEventListener('click', () => openLivePreviewModal('service.html?slug=' + b.getAttribute('data-slug')));
        });
        container.querySelectorAll('.btn-export-srv').forEach(b => {
            b.addEventListener('click', () => exportServiceAsStandaloneHtml(b.getAttribute('data-id')));
        });
        container.querySelectorAll('.btn-delete-srv').forEach(b => {
            b.addEventListener('click', () => {
                if (confirm('Are you sure you want to delete this service page? This action cannot be undone.')) {
                    CADB.deleteService(b.getAttribute('data-id'));
                    showToast('Service deleted successfully', 'info');
                    renderServicesList();
                    renderOverviewStats();
                }
            });
        });
    }

    function openServiceModal(serviceId) {
        currentEditingServiceId = serviceId;
        const modal = document.getElementById('serviceEditorModal');
        const modalTitle = document.getElementById('serviceModalTitle');
        const form = document.getElementById('serviceEditorForm');
        form.reset();

        // Clear dynamic builders
        document.getElementById('srvActsContainer').innerHTML = '';
        document.getElementById('srvStepsContainer').innerHTML = '';
        document.getElementById('srvDocsContainer').innerHTML = '';
        document.getElementById('srvFaqsContainer').innerHTML = '';

        if (serviceId) {
            modalTitle.textContent = 'Edit Compliance Service Page';
            const srv = CADB.getServices().find(s => s.id === serviceId);
            if (srv) {
                document.getElementById('srvInputId').value = srv.id;
                document.getElementById('srvInputTitle').value = srv.title || '';
                document.getElementById('srvInputSlug').value = srv.slug || '';
                document.getElementById('srvInputCategory').value = srv.categoryId || '';
                document.getElementById('srvInputBadge').value = srv.badge || '';
                document.getElementById('srvInputIcon').value = srv.icon || 'fa-solid fa-scale-balanced';
                document.getElementById('srvInputExcerpt').value = srv.excerpt || '';
                document.getElementById('srvInputFullDesc').value = srv.fullDescription || '';
                document.getElementById('srvInputMetaTitle').value = srv.metaTitle || '';
                document.getElementById('srvInputMetaDesc').value = srv.metaDesc || '';
                document.getElementById('srvInputMetaKeywords').value = srv.metaKeywords || '';
                document.getElementById('srvInputStatus').value = srv.status || 'published';
                document.getElementById('srvInputFeatured').checked = !!srv.isFeatured;

                // Populate Acts
                (srv.acts || []).forEach(act => addActRow(act));
                // Populate Steps
                (srv.processSteps || []).forEach(step => addStepRow(step.step, step.title, step.desc));
                // Populate Docs
                (srv.requiredDocuments || []).forEach(doc => addDocRow(doc.title, doc.desc));
                // Populate FAQs
                (srv.faqs || []).forEach(faq => addFaqRow(faq.q, faq.a));
            }
        } else {
            modalTitle.textContent = 'Create New Compliance Service Page';
            document.getElementById('srvInputId').value = '';
            document.getElementById('srvInputIcon').value = 'fa-solid fa-scale-balanced';
            document.getElementById('srvInputStatus').value = 'published';

            // Add default starter rows
            addActRow('The Factories Act, 1948 / State Rules');
            addStepRow('1', 'Statutory Assessment', 'Initial diagnostic review of records and legal obligations.');
            addDocRow('Certificate of Incorporation / GST', 'Primary business identification documents.');
            addFaqRow('What is the turnaround time for this licence?', 'Standard government approval is granted within 7 to 15 working days upon complete documentation.');
        }

        modal.classList.add('active');
    }

    function handleServiceFormSubmit(e) {
        e.preventDefault();

        const title = document.getElementById('srvInputTitle').value.trim();
        if (!title) {
            alert('Please enter a service title');
            return;
        }

        const id = document.getElementById('srvInputId').value;
        const slug = document.getElementById('srvInputSlug').value.trim() || CADB.slugify(title);

        // Gather Acts
        const acts = [];
        document.querySelectorAll('#srvActsContainer input').forEach(inp => {
            if (inp.value.trim()) acts.push(inp.value.trim());
        });

        // Gather Steps
        const processSteps = [];
        document.querySelectorAll('#srvStepsContainer .dynamic-item-row').forEach((row, i) => {
            const stepNum = row.querySelector('.step-num')?.value || (i + 1).toString();
            const stepTitle = row.querySelector('.step-title')?.value || '';
            const stepDesc = row.querySelector('.step-desc')?.value || '';
            if (stepTitle.trim()) {
                processSteps.push({ step: stepNum, title: stepTitle, desc: stepDesc });
            }
        });

        // Gather Docs
        const requiredDocuments = [];
        document.querySelectorAll('#srvDocsContainer .dynamic-item-row').forEach(row => {
            const docTitle = row.querySelector('.doc-title')?.value || '';
            const docDesc = row.querySelector('.doc-desc')?.value || '';
            if (docTitle.trim()) {
                requiredDocuments.push({ title: docTitle, desc: docDesc });
            }
        });

        // Gather FAQs
        const faqs = [];
        document.querySelectorAll('#srvFaqsContainer .dynamic-item-row').forEach(row => {
            const faqQ = row.querySelector('.faq-q')?.value || '';
            const faqA = row.querySelector('.faq-a')?.value || '';
            if (faqQ.trim()) {
                faqs.push({ q: faqQ, a: faqA });
            }
        });

        const serviceData = {
            id: id || undefined,
            title: title,
            slug: slug,
            categoryId: document.getElementById('srvInputCategory').value,
            badge: document.getElementById('srvInputBadge').value,
            icon: document.getElementById('srvInputIcon').value || 'fa-solid fa-scale-balanced',
            excerpt: document.getElementById('srvInputExcerpt').value,
            fullDescription: document.getElementById('srvInputFullDesc').value,
            acts: acts,
            processSteps: processSteps,
            requiredDocuments: requiredDocuments,
            faqs: faqs,
            metaTitle: document.getElementById('srvInputMetaTitle').value || `${title} | Conformity Alliance`,
            metaDesc: document.getElementById('srvInputMetaDesc').value || document.getElementById('srvInputExcerpt').value,
            metaKeywords: document.getElementById('srvInputMetaKeywords').value,
            status: document.getElementById('srvInputStatus').value,
            isFeatured: document.getElementById('srvInputFeatured').checked
        };

        CADB.saveService(serviceData);
        document.getElementById('serviceEditorModal').classList.remove('active');
        showToast('Service saved & published successfully!', 'success');
        renderServicesList();
        renderOverviewStats();
    }

    // Dynamic Form Row Builders
    function addActRow(val = '') {
        const div = document.createElement('div');
        div.className = 'dynamic-item-row';
        div.innerHTML = `
            <input type="text" class="form-control" placeholder="e.g. Contract Labour (Regulation & Abolition) Act, 1970" value="${escapeHtml(val)}">
            <button type="button" class="icon-btn btn-delete" onclick="this.parentElement.remove()"><i class="fa-solid fa-trash-can"></i></button>
        `;
        document.getElementById('srvActsContainer').appendChild(div);
    }

    function addStepRow(num = '', title = '', desc = '') {
        const div = document.createElement('div');
        div.className = 'dynamic-item-row';
        div.innerHTML = `
            <input type="text" class="form-control step-num" placeholder="#" value="${escapeHtml(num)}" style="max-width: 60px;">
            <input type="text" class="form-control step-title" placeholder="Step Title (e.g., Audit & Documentation)" value="${escapeHtml(title)}" style="flex: 1;">
            <input type="text" class="form-control step-desc" placeholder="Step Description" value="${escapeHtml(desc)}" style="flex: 2;">
            <button type="button" class="icon-btn btn-delete" onclick="this.parentElement.remove()"><i class="fa-solid fa-trash-can"></i></button>
        `;
        document.getElementById('srvStepsContainer').appendChild(div);
    }

    function addDocRow(title = '', desc = '') {
        const div = document.createElement('div');
        div.className = 'dynamic-item-row';
        div.innerHTML = `
            <input type="text" class="form-control doc-title" placeholder="Document Name (e.g., PAN & GST Certificate)" value="${escapeHtml(title)}" style="flex: 1;">
            <input type="text" class="form-control doc-desc" placeholder="Brief requirement notes" value="${escapeHtml(desc)}" style="flex: 2;">
            <button type="button" class="icon-btn btn-delete" onclick="this.parentElement.remove()"><i class="fa-solid fa-trash-can"></i></button>
        `;
        document.getElementById('srvDocsContainer').appendChild(div);
    }

    function addFaqRow(q = '', a = '') {
        const div = document.createElement('div');
        div.className = 'dynamic-item-row';
        div.innerHTML = `
            <input type="text" class="form-control faq-q" placeholder="Question (e.g., Who is liable for contractor PF?)" value="${escapeHtml(q)}" style="flex: 1;">
            <input type="text" class="form-control faq-a" placeholder="Clear Legal Answer" value="${escapeHtml(a)}" style="flex: 2;">
            <button type="button" class="icon-btn btn-delete" onclick="this.parentElement.remove()"><i class="fa-solid fa-trash-can"></i></button>
        `;
        document.getElementById('srvFaqsContainer').appendChild(div);
    }

    function initDynamicFormBuilders() {
        document.getElementById('btnAddActRow')?.addEventListener('click', () => addActRow());
        document.getElementById('btnAddStepRow')?.addEventListener('click', () => addStepRow());
        document.getElementById('btnAddDocRow')?.addEventListener('click', () => addDocRow());
        document.getElementById('btnAddFaqRow')?.addEventListener('click', () => addFaqRow());

        // Modal Close handlers
        document.querySelectorAll('.admin-modal-close, .admin-modal-cancel').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.admin-modal-overlay').forEach(m => m.classList.remove('active'));
            });
        });
    }

    // ----------------- 3. BLOGS & ARTICLES MANAGER -----------------
    let currentEditingBlogId = null;

    function initBlogsManager() {
        renderBlogsList();

        const searchInput = document.getElementById('blogSearchInput');
        const catSelect = document.getElementById('blogCategoryFilter');

        if (searchInput) searchInput.addEventListener('input', renderBlogsList);
        if (catSelect) catSelect.addEventListener('change', renderBlogsList);

        document.getElementById('btnAddNewBlog')?.addEventListener('click', () => {
            openBlogModal(null);
        });

        document.getElementById('blogEditorForm')?.addEventListener('submit', handleBlogFormSubmit);
    }

    function renderBlogsList() {
        const searchVal = (document.getElementById('blogSearchInput')?.value || '').trim();
        const catVal = document.getElementById('blogCategoryFilter')?.value || '';

        const categories = CADB.getCategories('blog');
        populateCategoryDropdown('blogCategoryFilter', categories, true, 'All Categories');
        populateCategoryDropdown('blogInputCategory', categories, false);

        const filter = {};
        if (searchVal) filter.search = searchVal;
        if (catVal) filter.categoryId = catVal;

        const blogs = CADB.getBlogs(filter);
        const container = document.getElementById('blogsGridContainer');
        if (!container) return;

        if (blogs.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 50px 20px; background: var(--admin-bg-surface); border-radius: var(--admin-radius-md); border: 1px dashed var(--admin-border);">
                    <i class="fa-solid fa-newspaper" style="font-size: 2.5rem; color: var(--admin-gold-light); margin-bottom: 12px; display: block;"></i>
                    <h3 style="color: #fff; margin-bottom: 8px;">No Blog Articles Found</h3>
                    <p style="color: var(--admin-text-secondary); margin-bottom: 20px;">Publish legal advisories, case law analyses, and compliance gazette updates.</p>
                    <button class="btn-gold" onclick="document.getElementById('btnAddNewBlog').click()">
                        <i class="fa-solid fa-plus"></i> Write Legal Article
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = blogs.map(b => {
            const cat = CADB.getCategoryById(b.categoryId);
            const catName = cat ? cat.name : 'Legal Insight';

            return `
                <div class="admin-item-card" data-id="${b.id}">
                    <div class="admin-item-card-top">
                        <span class="badge-category"><i class="fa-solid fa-bookmark"></i> ${escapeHtml(catName)}</span>
                        <span class="badge-status badge-${b.status}">${b.status}</span>
                    </div>
                    <h4>${escapeHtml(b.title)}</h4>
                    <p class="desc">${escapeHtml(b.excerpt || '')}</p>
                    <div style="font-size: 0.78rem; color: var(--admin-text-secondary); margin-bottom: 12px;">
                        <i class="fa-solid fa-user-pen" style="color: var(--admin-gold);"></i> ${escapeHtml(b.authorName || 'Advocate')} &bull; ${escapeHtml(b.readTime || '5 min read')}
                    </div>
                    <div class="admin-item-footer">
                        <div class="admin-item-meta">
                            ${new Date(b.publishedAt || b.updatedAt).toLocaleDateString()}
                        </div>
                        <div class="action-btns">
                            <a href="blog-detail.html?slug=${encodeURIComponent(b.slug)}" target="_blank" class="icon-btn" title="View Public Article">
                                <i class="fa-solid fa-arrow-up-right-from-square"></i>
                            </a>
                            <button type="button" class="icon-btn btn-preview-blg" data-slug="${escapeHtml(b.slug)}" title="Live Preview">
                                <i class="fa-solid fa-eye"></i>
                            </button>
                            <button type="button" class="icon-btn btn-edit-blg" data-id="${b.id}" title="Edit Article">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button type="button" class="icon-btn btn-delete btn-delete-blg" data-id="${b.id}" title="Delete Article">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        container.querySelectorAll('.btn-edit-blg').forEach(b => {
            b.addEventListener('click', () => openBlogModal(b.getAttribute('data-id')));
        });
        container.querySelectorAll('.btn-preview-blg').forEach(b => {
            b.addEventListener('click', () => openLivePreviewModal('blog-detail.html?slug=' + b.getAttribute('data-slug')));
        });
        container.querySelectorAll('.btn-delete-blg').forEach(b => {
            b.addEventListener('click', () => {
                if (confirm('Delete this article?')) {
                    CADB.deleteBlog(b.getAttribute('data-id'));
                    showToast('Article deleted', 'info');
                    renderBlogsList();
                    renderOverviewStats();
                }
            });
        });
    }

    function openBlogModal(blogId) {
        currentEditingBlogId = blogId;
        const modal = document.getElementById('blogEditorModal');
        const modalTitle = document.getElementById('blogModalTitle');
        const form = document.getElementById('blogEditorForm');
        form.reset();

        if (blogId) {
            modalTitle.textContent = 'Edit Legal Blog & Article';
            const b = CADB.getBlogs().find(item => item.id === blogId);
            if (b) {
                document.getElementById('blogInputId').value = b.id;
                document.getElementById('blogInputTitle').value = b.title || '';
                document.getElementById('blogInputSlug').value = b.slug || '';
                document.getElementById('blogInputCategory').value = b.categoryId || '';
                document.getElementById('blogInputAuthorName').value = b.authorName || '';
                document.getElementById('blogInputAuthorRole').value = b.authorRole || '';
                document.getElementById('blogInputReadTime').value = b.readTime || '';
                document.getElementById('blogInputImage').value = b.featuredImage || '';
                document.getElementById('blogInputTags').value = (b.tags || []).join(', ');
                document.getElementById('blogInputExcerpt').value = b.excerpt || '';
                document.getElementById('blogInputContent').value = b.content || '';
                document.getElementById('blogInputStatus').value = b.status || 'published';
            }
        } else {
            modalTitle.textContent = 'Publish New Legal Article';
            document.getElementById('blogInputId').value = '';
            document.getElementById('blogInputAuthorName').value = 'Adv. Senior Counsel';
            document.getElementById('blogInputAuthorRole').value = 'Partner - Labour Law Practice';
            document.getElementById('blogInputReadTime').value = '5 min read';
            document.getElementById('blogInputStatus').value = 'published';
        }

        modal.classList.add('active');
    }

    function handleBlogFormSubmit(e) {
        e.preventDefault();

        const title = document.getElementById('blogInputTitle').value.trim();
        if (!title) {
            alert('Please enter an article title');
            return;
        }

        const id = document.getElementById('blogInputId').value;
        const slug = document.getElementById('blogInputSlug').value.trim() || CADB.slugify(title);
        const tagsRaw = document.getElementById('blogInputTags').value;
        const tags = tagsRaw.split(',').map(t => t.trim()).filter(t => t);

        const blogData = {
            id: id || undefined,
            title: title,
            slug: slug,
            categoryId: document.getElementById('blogInputCategory').value,
            authorName: document.getElementById('blogInputAuthorName').value,
            authorRole: document.getElementById('blogInputAuthorRole').value,
            readTime: document.getElementById('blogInputReadTime').value,
            featuredImage: document.getElementById('blogInputImage').value,
            tags: tags,
            excerpt: document.getElementById('blogInputExcerpt').value,
            content: document.getElementById('blogInputContent').value,
            metaTitle: `${title} | Conformity Alliance`,
            metaDesc: document.getElementById('blogInputExcerpt').value,
            status: document.getElementById('blogInputStatus').value
        };

        CADB.saveBlog(blogData);
        document.getElementById('blogEditorModal').classList.remove('active');
        showToast('Blog article saved successfully!', 'success');
        renderBlogsList();
        renderOverviewStats();
    }

    // ----------------- 4. CATEGORIES MANAGER -----------------
    function initCategoriesManager() {
        renderCategoriesList();

        document.getElementById('btnAddNewCategory')?.addEventListener('click', () => {
            openCategoryModal(null);
        });

        document.getElementById('categoryEditorForm')?.addEventListener('submit', handleCategoryFormSubmit);
    }

    function renderCategoriesList() {
        const categories = CADB.getCategories();
        const container = document.getElementById('categoriesTableBody');
        if (!container) return;

        container.innerHTML = categories.map(c => `
            <tr>
                <td><i class="${escapeHtml(c.icon || 'fa-solid fa-tag')}" style="color: ${escapeHtml(c.color || 'var(--admin-gold)')}; font-size: 1.2rem;"></i></td>
                <td><strong>${escapeHtml(c.name)}</strong></td>
                <td><code>${escapeHtml(c.slug)}</code></td>
                <td><span class="badge-category" style="text-transform: capitalize;">${escapeHtml(c.type)}</span></td>
                <td>${escapeHtml(c.description || '-')}</td>
                <td>
                    <div class="action-btns">
                        <button type="button" class="icon-btn btn-edit-cat" data-id="${c.id}" title="Edit Category"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button type="button" class="icon-btn btn-delete btn-delete-cat" data-id="${c.id}" title="Delete Category"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');

        container.querySelectorAll('.btn-edit-cat').forEach(b => {
            b.addEventListener('click', () => openCategoryModal(b.getAttribute('data-id')));
        });
        container.querySelectorAll('.btn-delete-cat').forEach(b => {
            b.addEventListener('click', () => {
                if (confirm('Delete this category?')) {
                    CADB.deleteCategory(b.getAttribute('data-id'));
                    showToast('Category deleted', 'info');
                    renderCategoriesList();
                    renderServicesList();
                    renderBlogsList();
                }
            });
        });
    }

    function openCategoryModal(catId) {
        const modal = document.getElementById('categoryEditorModal');
        const form = document.getElementById('categoryEditorForm');
        form.reset();

        if (catId) {
            const cat = CADB.getCategoryById(catId);
            if (cat) {
                document.getElementById('catInputId').value = cat.id;
                document.getElementById('catInputName').value = cat.name || '';
                document.getElementById('catInputSlug').value = cat.slug || '';
                document.getElementById('catInputType').value = cat.type || 'service';
                document.getElementById('catInputIcon').value = cat.icon || 'fa-solid fa-tag';
                document.getElementById('catInputColor').value = cat.color || '#c69a4e';
                document.getElementById('catInputDesc').value = cat.description || '';
            }
        } else {
            document.getElementById('catInputId').value = '';
            document.getElementById('catInputType').value = 'service';
            document.getElementById('catInputIcon').value = 'fa-solid fa-scale-balanced';
            document.getElementById('catInputColor').value = '#c69a4e';
        }

        modal.classList.add('active');
    }

    function handleCategoryFormSubmit(e) {
        e.preventDefault();
        const name = document.getElementById('catInputName').value.trim();
        if (!name) return;

        const catData = {
            id: document.getElementById('catInputId').value || undefined,
            name: name,
            slug: document.getElementById('catInputSlug').value.trim() || CADB.slugify(name),
            type: document.getElementById('catInputType').value,
            icon: document.getElementById('catInputIcon').value || 'fa-solid fa-tag',
            color: document.getElementById('catInputColor').value,
            description: document.getElementById('catInputDesc').value
        };

        CADB.saveCategory(catData);
        document.getElementById('categoryEditorModal').classList.remove('active');
        showToast('Category saved successfully', 'success');
        renderCategoriesList();
    }

    // ----------------- 5. WEBSITE SETTINGS & CMS -----------------
    function initWebsiteSettingsManager() {
        renderWebsiteSettings();

        document.getElementById('siteSettingsForm')?.addEventListener('submit', function(e) {
            e.preventDefault();
            const s = {
                companyName: document.getElementById('setCompanyName').value,
                tagline: document.getElementById('setTagline').value,
                phone: document.getElementById('setPhone').value,
                email: document.getElementById('setEmail').value,
                address: document.getElementById('setAddress').value,
                whatsapp: document.getElementById('setWhatsapp').value,
                businessHours: document.getElementById('setHours').value,
                announcement: {
                    enabled: document.getElementById('setAnnounceEnabled').checked,
                    badge: document.getElementById('setAnnounceBadge').value,
                    text: document.getElementById('setAnnounceText').value,
                    linkText: document.getElementById('setAnnounceLinkText').value,
                    linkUrl: document.getElementById('setAnnounceLinkUrl').value
                },
                hero: {
                    badge: document.getElementById('setHeroBadge').value,
                    title: document.getElementById('setHeroTitle').value,
                    subtitle: document.getElementById('setHeroSubtitle').value,
                    primaryBtnText: document.getElementById('setHeroBtn1Text').value,
                    primaryBtnLink: document.getElementById('setHeroBtn1Link').value,
                    secondaryBtnText: document.getElementById('setHeroBtn2Text').value,
                    secondaryBtnLink: document.getElementById('setHeroBtn2Link').value
                },
                stats: {
                    clients: document.getElementById('setStatClients').value,
                    complianceRate: document.getElementById('setStatCompliance').value,
                    experienceYears: document.getElementById('setStatExp').value,
                    statesCovered: document.getElementById('setStatStates').value
                }
            };
            CADB.saveSettings(s);
            showToast('Website content & settings updated live!', 'success');
        });

        // Testimonial Form
        document.getElementById('testimonialEditorForm')?.addEventListener('submit', function(e) {
            e.preventDefault();
            const t = {
                id: document.getElementById('tstInputId').value || undefined,
                clientName: document.getElementById('tstInputName').value,
                designation: document.getElementById('tstInputRole').value,
                company: document.getElementById('tstInputCompany').value,
                review: document.getElementById('tstInputReview').value,
                rating: 5
            };
            CADB.saveTestimonial(t);
            document.getElementById('testimonialEditorModal').classList.remove('active');
            renderTestimonialsList();
            showToast('Testimonial added', 'success');
        });

        document.getElementById('btnAddNewTestimonial')?.addEventListener('click', () => {
            document.getElementById('testimonialEditorForm').reset();
            document.getElementById('tstInputId').value = '';
            document.getElementById('testimonialEditorModal').classList.add('active');
        });
    }

    function renderWebsiteSettings() {
        const s = CADB.getSettings();
        if (!s) return;

        if (document.getElementById('setCompanyName')) document.getElementById('setCompanyName').value = s.companyName || '';
        if (document.getElementById('setTagline')) document.getElementById('setTagline').value = s.tagline || '';
        if (document.getElementById('setPhone')) document.getElementById('setPhone').value = s.phone || '';
        if (document.getElementById('setEmail')) document.getElementById('setEmail').value = s.email || '';
        if (document.getElementById('setAddress')) document.getElementById('setAddress').value = s.address || '';
        if (document.getElementById('setWhatsapp')) document.getElementById('setWhatsapp').value = s.whatsapp || '';
        if (document.getElementById('setHours')) document.getElementById('setHours').value = s.businessHours || '';

        // Announcement
        if (s.announcement) {
            if (document.getElementById('setAnnounceEnabled')) document.getElementById('setAnnounceEnabled').checked = !!s.announcement.enabled;
            if (document.getElementById('setAnnounceBadge')) document.getElementById('setAnnounceBadge').value = s.announcement.badge || '';
            if (document.getElementById('setAnnounceText')) document.getElementById('setAnnounceText').value = s.announcement.text || '';
            if (document.getElementById('setAnnounceLinkText')) document.getElementById('setAnnounceLinkText').value = s.announcement.linkText || '';
            if (document.getElementById('setAnnounceLinkUrl')) document.getElementById('setAnnounceLinkUrl').value = s.announcement.linkUrl || '';
        }

        // Hero
        if (s.hero) {
            if (document.getElementById('setHeroBadge')) document.getElementById('setHeroBadge').value = s.hero.badge || '';
            if (document.getElementById('setHeroTitle')) document.getElementById('setHeroTitle').value = s.hero.title || '';
            if (document.getElementById('setHeroSubtitle')) document.getElementById('setHeroSubtitle').value = s.hero.subtitle || '';
            if (document.getElementById('setHeroBtn1Text')) document.getElementById('setHeroBtn1Text').value = s.hero.primaryBtnText || '';
            if (document.getElementById('setHeroBtn1Link')) document.getElementById('setHeroBtn1Link').value = s.hero.primaryBtnLink || '';
            if (document.getElementById('setHeroBtn2Text')) document.getElementById('setHeroBtn2Text').value = s.hero.secondaryBtnText || '';
            if (document.getElementById('setHeroBtn2Link')) document.getElementById('setHeroBtn2Link').value = s.hero.secondaryBtnLink || '';
        }

        // Stats
        if (s.stats) {
            if (document.getElementById('setStatClients')) document.getElementById('setStatClients').value = s.stats.clients || '';
            if (document.getElementById('setStatCompliance')) document.getElementById('setStatCompliance').value = s.stats.complianceRate || '';
            if (document.getElementById('setStatExp')) document.getElementById('setStatExp').value = s.stats.experienceYears || '';
            if (document.getElementById('setStatStates')) document.getElementById('setStatStates').value = s.stats.statesCovered || '';
        }

        renderTestimonialsList();
    }

    function renderTestimonialsList() {
        const tests = CADB.getTestimonials();
        const container = document.getElementById('testimonialsListContainer');
        if (!container) return;

        container.innerHTML = tests.map(t => `
            <div style="background: var(--admin-bg-card); border: 1px solid var(--admin-border); border-radius: var(--admin-radius-sm); padding: 16px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                    <h5 style="color: #fff; margin-bottom: 2px;">${escapeHtml(t.clientName)} <span style="font-size: 0.8rem; color: var(--admin-text-secondary); font-weight: normal;">— ${escapeHtml(t.designation || '')}, ${escapeHtml(t.company || '')}</span></h5>
                    <p style="color: var(--admin-text-secondary); font-size: 0.88rem; margin: 4px 0 0 0; font-style: italic;">"${escapeHtml(t.review)}"</p>
                </div>
                <button type="button" class="icon-btn btn-delete btn-del-tst" data-id="${t.id}"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        `).join('');

        container.querySelectorAll('.btn-del-tst').forEach(b => {
            b.addEventListener('click', () => {
                CADB.deleteTestimonial(b.getAttribute('data-id'));
                renderTestimonialsList();
            });
        });
    }

    // ----------------- 6. LEADS & INQUIRIES HUB -----------------
    function initLeadsManager() {
        renderLeadsList();

        const searchInput = document.getElementById('leadSearchInput');
        const statusFilter = document.getElementById('leadStatusFilter');

        if (searchInput) searchInput.addEventListener('input', renderLeadsList);
        if (statusFilter) statusFilter.addEventListener('change', renderLeadsList);

        document.getElementById('btnExportLeadsCsv')?.addEventListener('click', exportLeadsCsv);
    }

    function renderLeadsList() {
        const search = (document.getElementById('leadSearchInput')?.value || '').trim();
        const status = document.getElementById('leadStatusFilter')?.value || '';

        const filter = {};
        if (search) filter.search = search;
        if (status) filter.status = status;

        const leads = CADB.getLeads(filter);
        const container = document.getElementById('leadsTableBody');
        if (!container) return;

        if (leads.length === 0) {
            container.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--admin-text-muted); padding: 40px;">No inquiries found matching criteria.</td></tr>`;
            return;
        }

        container.innerHTML = leads.map(l => `
            <tr>
                <td><strong>${escapeHtml(l.name)}</strong><br><small style="color: var(--admin-text-muted);">${escapeHtml(l.company || '')}</small></td>
                <td><a href="tel:${escapeHtml(l.phone || '')}" style="color: var(--admin-gold-light);">${escapeHtml(l.phone || '-')}</a></td>
                <td><a href="mailto:${escapeHtml(l.email || '')}" style="color: #93c5fd;">${escapeHtml(l.email || '-')}</a></td>
                <td><span class="badge-category">${escapeHtml(l.service || 'General')}</span></td>
                <td>
                    <select class="admin-select lead-status-select" data-id="${l.id}" style="padding: 4px 8px; font-size: 0.78rem;">
                        <option value="new" ${l.status === 'new' ? 'selected' : ''}>New Lead</option>
                        <option value="contacted" ${l.status === 'contacted' ? 'selected' : ''}>Contacted</option>
                        <option value="in-progress" ${l.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                        <option value="closed" ${l.status === 'closed' ? 'selected' : ''}>Closed / Resolved</option>
                    </select>
                </td>
                <td>${new Date(l.createdAt).toLocaleDateString()}</td>
                <td>
                    <div class="action-btns">
                        <button type="button" class="icon-btn btn-view-lead" data-id="${l.id}" title="View Message"><i class="fa-solid fa-envelope-open-text"></i></button>
                        <button type="button" class="icon-btn btn-delete btn-del-lead" data-id="${l.id}" title="Delete Lead"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');

        container.querySelectorAll('.lead-status-select').forEach(sel => {
            sel.addEventListener('change', function() {
                CADB.updateLeadStatus(this.getAttribute('data-id'), this.value);
                showToast('Lead status updated', 'info');
                renderOverviewStats();
            });
        });

        container.querySelectorAll('.btn-view-lead').forEach(b => {
            b.addEventListener('click', () => {
                const lead = CADB.getLeads().find(l => l.id === b.getAttribute('data-id'));
                if (lead) {
                    alert(`Inquiry from: ${lead.name}\nCompany: ${lead.company || 'N/A'}\nPhone: ${lead.phone}\nEmail: ${lead.email}\nService: ${lead.service}\nSource: ${lead.source}\n\nMessage:\n${lead.message || 'No additional notes provided.'}`);
                }
            });
        });

        container.querySelectorAll('.btn-del-lead').forEach(b => {
            b.addEventListener('click', () => {
                if (confirm('Delete this inquiry record?')) {
                    CADB.deleteLead(b.getAttribute('data-id'));
                    renderLeadsList();
                    renderOverviewStats();
                }
            });
        });
    }

    function exportLeadsCsv() {
        const leads = CADB.getLeads();
        if (!leads.length) {
            alert('No inquiries to export');
            return;
        }

        const headers = ["ID", "Name", "Company", "Phone", "Email", "Service", "Status", "Date", "Message"];
        const rows = leads.map(l => [
            l.id,
            `"${(l.name || '').replace(/"/g, '""')}"`,
            `"${(l.company || '').replace(/"/g, '""')}"`,
            `"${(l.phone || '').replace(/"/g, '""')}"`,
            `"${(l.email || '').replace(/"/g, '""')}"`,
            `"${(l.service || '').replace(/"/g, '""')}"`,
            l.status,
            l.createdAt,
            `"${(l.message || '').replace(/"/g, '""')}"`
        ]);

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `conformity_alliance_leads_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    // ----------------- 7. SYSTEM TOOLS & BACKUP -----------------
    function initSystemTools() {
        document.getElementById('btnExportDatabaseJson')?.addEventListener('click', () => {
            CADB.exportDatabaseJson();
            showToast('Site database backup exported successfully', 'success');
        });

        document.getElementById('importDatabaseFile')?.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(evt) {
                const res = CADB.importDatabaseJson(evt.target.result);
                if (res.success) {
                    showToast('Site database restored successfully!', 'success');
                    setTimeout(() => window.location.reload(), 600);
                } else {
                    alert('Failed to import database: ' + res.error);
                }
            };
            reader.readAsText(file);
        });

        document.getElementById('btnResetDatabaseFactory')?.addEventListener('click', () => {
            if (confirm('CAUTION: This will reset all services, blogs, categories, and settings to the initial master template. All custom data will be replaced. Proceed?')) {
                CADB.resetToDefault();
                showToast('Database reset to defaults', 'info');
                setTimeout(() => window.location.reload(), 500);
            }
        });

        document.getElementById('adminSecurityForm')?.addEventListener('submit', function(e) {
            e.preventDefault();
            const u = document.getElementById('secAdminUsername').value.trim();
            const p = document.getElementById('secAdminPassword').value.trim();
            const n = document.getElementById('secAdminName').value.trim();

            if (!u || !p) {
                alert('Username and password cannot be empty.');
                return;
            }

            CADB.updateAdminCredentials(u, p, n);
            showToast('Administrator credentials updated securely!', 'success');
        });
    }

    // ----------------- STANDALONE HTML EXPORTER -----------------
    function exportServiceAsStandaloneHtml(serviceId) {
        const srv = CADB.getServices().find(s => s.id === serviceId);
        if (!srv) return;

        const cat = CADB.getCategoryById(srv.categoryId);
        const catName = cat ? cat.name : 'Compliance Service';

        // Generate full standalone HTML markup matching Conformity Alliance design
        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(srv.metaTitle || srv.title)}</title>
    <meta name="description" content="${escapeHtml(srv.metaDesc || srv.excerpt || '')}">
    <meta name="keywords" content="${escapeHtml(srv.metaKeywords || '')}">
    <link rel="icon" href="assets/images/last-favicon.png" type="image/x-icon">
    
    <!-- Stylesheets -->
    <link rel="stylesheet" href="assets/vendor/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/vendor/fontawesome/css/all.min.css">
    <link rel="stylesheet" href="assets/vendor/fonts/fonts.css">
    <link rel="stylesheet" href="assets/css/site.css">
</head>
<body>
    <div id="main">
        <!-- Top Utility Bar -->
        <header class="ca-utility-bar">
            <div class="ca-utility-inner">
                <div class="ca-utility-badge">
                    <span class="ca-status-dot"></span>
                    <span>India's Leading Advocate-Led Labour Law Practice</span>
                </div>
                <div class="ca-utility-links">
                    <a href="tradeLicence.html">Labour Law Services</a>
                    <span class="ca-utility-sep">|</span>
                    <a href="registration.html">Registrations &amp; Licences</a>
                    <span class="ca-utility-sep">|</span>
                    <a href="audit&advisory.html">Audit &amp; Advisory</a>
                    <span class="ca-utility-sep">|</span>
                    <a href="complianceCalender.html">Compliance Calendar</a>
                </div>
                <div class="ca-utility-contact">
                    <a href="tel:+917701901010"><i class="fas fa-phone"></i> +91 7701901010</a>
                    <a href="mailto:info@conformityalliance.in"><i class="fas fa-envelope"></i> info@conformityalliance.in</a>
                </div>
            </div>
        </header>

        <!-- Dynamic Service Hero -->
        <section class="ca-service-hero-section" style="background: linear-gradient(135deg, #090e1a 0%, #14203b 100%); color: #fff; padding: 70px 0 60px 0; border-bottom: 2px solid #c69a4e;">
            <div class="container">
                <div style="display: inline-block; background: rgba(198,154,78,0.15); border: 1px solid #c69a4e; color: #dfb76c; font-size: 0.82rem; font-weight: 700; padding: 4px 14px; border-radius: 9999px; text-transform: uppercase; margin-bottom: 16px;">
                    <i class="${escapeHtml(srv.icon || 'fa-solid fa-scale-balanced')}"></i> ${escapeHtml(catName)} &bull; ${escapeHtml(srv.badge || 'Statutory Compliance')}
                </div>
                <h1 style="font-size: 2.8rem; font-family: 'Playfair Display', Georgia, serif; color: #fff; margin-bottom: 18px;">${escapeHtml(srv.title)}</h1>
                <p style="font-size: 1.15rem; color: #cbd5e1; max-width: 860px; line-height: 1.8; margin-bottom: 28px;">${escapeHtml(srv.excerpt || '')}</p>
                <div style="display: flex; gap: 14px; flex-wrap: wrap;">
                    <a href="contact.html" class="btn btn-warning" style="background: linear-gradient(135deg, #e5c37e, #c69a4e); border: none; color: #090e1a; font-weight: 700; padding: 12px 28px; border-radius: 8px;">Schedule Legal Consultation</a>
                    <a href="tel:+917701901010" class="btn btn-outline-light" style="padding: 12px 24px; border-radius: 8px;"><i class="fas fa-phone"></i> Call +91 7701901010</a>
                </div>
            </div>
        </section>

        <!-- Main Body -->
        <section style="padding: 60px 0; background: #faf6ee;">
            <div class="container">
                <div class="row">
                    <div class="col-lg-8">
                        <div style="background: #fff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); margin-bottom: 30px;">
                            <h2 style="font-family: 'Playfair Display', serif; color: #0d1629; margin-bottom: 20px;">Statutory Regulatory Overview</h2>
                            <p style="color: #475569; font-size: 1.05rem; line-height: 1.8;">${escapeHtml(srv.fullDescription || '')}</p>
                            
                            <h3 style="margin-top: 36px; margin-bottom: 16px; color: #0d1629;">Applicable Acts & Regulatory Framework</h3>
                            <ul style="padding-left: 20px; color: #334155; line-height: 1.9;">
                                ${(srv.acts || []).map(a => `<li><strong>${escapeHtml(a)}</strong></li>`).join('')}
                            </ul>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div style="background: #0d1629; color: #fff; padding: 30px; border-radius: 16px; border: 1px solid #c69a4e;">
                            <h4 style="color: #dfb76c; font-family: 'Playfair Display', serif;">Request Advocate Assistance</h4>
                            <p style="color: #cbd5e1; font-size: 0.9rem;">Speak directly with our senior compliance advocates.</p>
                            <a href="contact.html" class="btn btn-warning w-100" style="background: linear-gradient(135deg, #e5c37e, #c69a4e); color: #090e1a; font-weight: 700;">Get Started Now</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</body>
</html>`;

        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${srv.slug || 'service'}.html`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        showToast('Exported standalone ' + srv.slug + '.html', 'success');
    }

    // ----------------- LIVE PREVIEW MODAL -----------------
    function openLivePreviewModal(url) {
        let modal = document.getElementById('adminLivePreviewModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'adminLivePreviewModal';
            modal.className = 'admin-modal-overlay';
            modal.innerHTML = `
                <div class="admin-modal-dialog preview-modal-dialog">
                    <div class="admin-modal-header">
                        <h3><i class="fa-solid fa-display" style="color: var(--admin-gold);"></i> Live Page Preview</h3>
                        <div style="display: flex; gap: 8px;">
                            <a id="previewNewTabBtn" href="#" target="_blank" class="btn-secondary-dark" style="padding: 4px 12px; font-size: 0.8rem;"><i class="fa-solid fa-arrow-up-right-from-square"></i> Open in New Tab</a>
                            <button type="button" class="admin-modal-close" onclick="document.getElementById('adminLivePreviewModal').classList.remove('active')"><i class="fa-solid fa-xmark"></i></button>
                        </div>
                    </div>
                    <div class="admin-modal-body" style="padding: 0; background: #fff;">
                        <iframe id="previewIframe" class="preview-frame" src="about:blank"></iframe>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        const iframe = document.getElementById('previewIframe');
        const newTabBtn = document.getElementById('previewNewTabBtn');
        if (iframe) iframe.src = url;
        if (newTabBtn) newTabBtn.href = url;
        modal.classList.add('active');
    }

    // ----------------- HELPERS & UTILS -----------------
    function populateCategoryDropdown(selectId, categories, includeAll = false, allLabel = 'All') {
        const sel = document.getElementById(selectId);
        if (!sel) return;

        let html = '';
        if (includeAll) {
            html += `<option value="">${allLabel}</option>`;
        }
        categories.forEach(c => {
            html += `<option value="${c.id}">${escapeHtml(c.name)}</option>`;
        });
        sel.innerHTML = html;
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function showToast(message, type = 'success') {
        let container = document.getElementById('caAdminToasts');
        if (!container) {
            container = document.createElement('div');
            container.id = 'caAdminToasts';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `ca-toast ${type}`;
        const icon = type === 'success' ? 'fa-circle-check' : (type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-info');
        toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${escapeHtml(message)}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3200);
    }

    // Expose preview
    window.openLivePreviewModal = openLivePreviewModal;
});
