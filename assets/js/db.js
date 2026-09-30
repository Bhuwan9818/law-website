/**
 * Conformity Alliance - Dynamic Site Database & Storage Layer (db.js)
 * Manages Services, Blogs, Categories, Website Settings, Leads, Testimonials and Admin Session.
 */

(function(window) {
    const DB_KEY = 'ca_site_database_v1';
    const SESSION_KEY = 'ca_admin_session_v1';
    const API_URL = 'assets/php/api.php';

    // Default Seed Data
    const defaultData = {
        settings: {
            companyName: "Conformity Alliance",
            tagline: "Premier Labour Law, Statutory Audits, Licensing & Corporate Compliance",
            phone: "+91 7701901010",
            phoneRaw: "+917701901010",
            email: "info@conformityalliance.in",
            address: "Kh 88, Pn 4, 20 - Point Colony, Ashram Road, Village Budhpur, New Delhi-110036",
            whatsapp: "917701901010",
            businessHours: "Mon - Sat: 9:30 AM - 6:30 PM",
            googleMapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2763.7694643184755!2d77.13539999999999!3d28.7843723!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d011ceba9032f%3A0xad18d9b6c4ed88b4!2sConformity%20Alliance!5e1!3m2!1sen!2sin!4v1746280131269!5m2!1sen!2sin",
            social: {
                facebook: "https://www.facebook.com/people/Conformity-Alliance/61574098757164/?sk=about",
                linkedin: "https://www.linkedin.com/company/conformity-alliance/",
                whatsapp: "https://wa.me/917701901010",
                twitter: ""
            },
            announcement: {
                enabled: true,
                badge: "Legal Notice",
                text: "India's Leading Advocate-Led Labour Law Practice — Pan-India Statutory Compliance & Advisory.",
                linkText: "Schedule Consultation",
                linkUrl: "contact.html"
            },
            hero: {
                badge: "Advocate-Led Corporate Labour Compliance",
                title: "Statutory Precision. Flawless Licensing. Unrivalled Legal Protection.",
                subtitle: "Empowering 500+ enterprises, factories, IT establishments, and multinational corporations across 28 Indian states with bulletproof labour law compliances, licensing, and advisory.",
                primaryBtnText: "Explore Services",
                primaryBtnLink: "#services",
                secondaryBtnText: "Book Advocate Consultation",
                secondaryBtnLink: "contact.html"
            },
            stats: {
                clients: "500+",
                complianceRate: "100%",
                experienceYears: "15+",
                statesCovered: "28+"
            },
            leadsNotificationEmail: "leads@conformityalliance.in"
        },
        admin: {
            username: "admin",
            passwordHash: "admin123", // Default credentials: admin / admin123
            name: "Senior Compliance Administrator",
            role: "Master Administrator",
            lastLogin: new Date().toISOString()
        },
        categories: [
            {
                id: "cat-1",
                slug: "registrations-licences",
                name: "Registrations & Licences",
                type: "service",
                icon: "fa-solid fa-id-card",
                color: "#c69a4e",
                description: "Statutory trade, factory, labour, and environmental license acquisitions across all Indian states."
            },
            {
                id: "cat-2",
                slug: "advisory-payroll",
                name: "Advisory & Payroll",
                type: "service",
                icon: "fa-solid fa-scale-balanced",
                color: "#3b82f6",
                description: "End-to-end PF, ESI, wage structuring, standing orders, and corporate advisory services."
            },
            {
                id: "cat-3",
                slug: "labour-audits",
                name: "Labour & Compliance Audits",
                type: "service",
                icon: "fa-solid fa-clipboard-check",
                color: "#10b981",
                description: "Independent statutory audits for factories, contractor establishments, and vendor supply chains."
            },
            {
                id: "cat-4",
                slug: "authority-liaison",
                name: "Authority Liaison & Litigation",
                type: "service",
                icon: "fa-solid fa-gavel",
                color: "#8b5cf6",
                description: "Representation before Labour Commissioners, inspection defenses, and dispute advocacy."
            },
            {
                id: "cat-5",
                slug: "labour-law-updates",
                name: "Labour Law Updates & Reforms",
                type: "blog",
                icon: "fa-solid fa-newspaper",
                color: "#f59e0b",
                description: "Critical analysis of new Labour Codes, notifications, and statutory gazette amendments."
            },
            {
                id: "cat-6",
                slug: "compliance-guides",
                name: "Statutory Compliance Guides",
                type: "blog",
                icon: "fa-solid fa-book-bookmark",
                color: "#ec4899",
                description: "Step-by-step practical compliance guides for HR managers, directors, and plant heads."
            },
            {
                id: "cat-7",
                slug: "corporate-governance",
                name: "Corporate Governance & Case Law",
                type: "blog",
                icon: "fa-solid fa-landmark",
                color: "#6366f1",
                description: "High Court and Supreme Court landmark rulings on industrial employment and contractor liabilities."
            }
        ],
        services: [
            {
                id: "srv-1",
                slug: "posh-act-compliance",
                title: "POSH Act Compliance & Internal Committee (IC) Governance",
                categoryId: "cat-2",
                badge: "Mandatory for 10+ Employees",
                icon: "fa-solid fa-shield-halved",
                excerpt: "Comprehensive Prevention of Sexual Harassment (POSH) Act advisory, IC constitution, external member representation, and annual statutory filings.",
                fullDescription: "Under the Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013, every enterprise employing 10 or more individuals is legally obligated to constitute an Internal Committee (IC) headed by a senior woman employee and an independent External Member with legal expertise. Non-compliance invites penal sanctions of up to ₹50,000 and potential cancellation of business registrations. Conformity Alliance provides advocate-level governance, drafting compliant gender-neutral policies, conducting IC conciliation workshops, and preparing statutory Annual District Officer reports.",
                acts: [
                    "Sexual Harassment of Women at Workplace Act, 2013",
                    "POSH Rules & State Gazetted Directives",
                    "Industrial Employment (Standing Orders) POSH Integration",
                    "District Officer Statutory Compliance Reporting Framework"
                ],
                processSteps: [
                    { step: "1", title: "Diagnostic Assessment", desc: "Review corporate employee headcount, multi-location branch counts, and existing grievance mechanisms." },
                    { step: "2", title: "Internal Committee (IC) Formal Constitution", desc: "Draft official appointment orders and designate a qualified External Legal Member from our advocate panel." },
                    { step: "3", title: "Drafting POSH Policy & Display Notices", desc: "Formulate customized workplace safety rules, complaint protocols, and statutory multilingual notice boards." },
                    { step: "4", title: "Sensitization & Annual Filings", desc: "Conduct employee webinars, train committee members on inquiry procedures, and submit annual returns to the District Officer." }
                ],
                requiredDocuments: [
                    { title: "Certificate of Incorporation / GST", desc: "Corporate identification and registered address proof." },
                    { title: "Total Headcount Schedule", desc: "Gender-wise break-up of permanent, contract, and trainee workforce." },
                    { title: "Nominated IC Members List", desc: "Names, designations, and official contact emails of internal presiding officers." },
                    { title: "Branch Office Addresses", desc: "List of all active operating units and regional offices across India." }
                ],
                faqs: [
                    { q: "Is POSH compliance required for remote and IT companies?", a: "Yes. The law explicitly defines the 'workplace' to encompass virtual workspaces, videoconferencing, client sites, and official transit." },
                    { q: "Who can serve as the External Member in the Internal Committee?", a: "The External Member must be an independent advocate, NGO member, or specialist with at least 5 years of demonstrated experience in women's rights and labour laws." },
                    { q: "What is the deadline for filing the POSH Annual Return?", a: "The Annual Return must be submitted to the designated District Officer (Women & Child Development Department) by 31st January for the preceding calendar year." }
                ],
                metaTitle: "POSH Act Compliance Services India | Internal Committee Legal Governance",
                metaDesc: "End-to-end POSH Act 2013 compliance by Conformity Alliance. Expert IC External Member appointment, policy drafting, sensitization, and annual filings across India.",
                metaKeywords: "POSH Act compliance, Internal Committee external member, POSH annual return filing, POSH policy drafting India",
                status: "published",
                isFeatured: true,
                views: 1420,
                createdAt: "2026-01-10T10:00:00.000Z",
                updatedAt: "2026-03-20T14:30:00.000Z"
            },
            {
                id: "srv-2",
                slug: "dpdp-act-workplace-data-privacy",
                title: "Digital Personal Data Protection (DPDP) HR Compliance",
                categoryId: "cat-2",
                badge: "New Regulatory Mandate",
                icon: "fa-solid fa-user-lock",
                excerpt: "Legal audit and structuring of employee biometric records, background checks, and payroll data processing under the Digital Personal Data Protection Act.",
                fullDescription: "The Digital Personal Data Protection (DPDP) Act imposes stringent fiduciary obligations on employers collecting, processing, and storing employee personal and biometric data. From pre-employment background verifications, Aadhaar-linked payroll registries, to CCTV monitoring and health insurance records, organizations must establish lawful consent architectures, data retention schedules, and grievance redressal mechanisms. Our corporate compliance attorneys structure robust data protection agreements and privacy notices to safeguard your enterprise against multi-crore penalty liabilities.",
                acts: [
                    "Digital Personal Data Protection Act (DPDP Act)",
                    "Information Technology (Reasonable Security Practices) Rules",
                    "Aadhaar (Targeted Delivery of Financial Subsidies) Regulations",
                    "Equal Remuneration & Employee Confidentiality Governance"
                ],
                processSteps: [
                    { step: "1", title: "HR Data Flow Mapping", desc: "Audit all employee touchpoints including hiring portals, attendance biometrics, payroll software, and cloud drives." },
                    { step: "2", title: "Employee Privacy Notice & Consent Formats", desc: "Draft compliant bilingual consent templates detailing data purpose, retention timelines, and withdrawal rights." },
                    { step: "3", title: "Vendor Data Processing Agreements", desc: "Update contracts with third-party background checkers, payroll providers, and insurance brokers with strict indemnities." },
                    { step: "4", title: "Data Protection Officer (DPO) Advisory", desc: "Establish statutory escalation protocols and employee data subject access request (DSAR) workflows." }
                ],
                requiredDocuments: [
                    { title: "Current HR & Payroll Software Architecture", desc: "List of digital portals, vendors, and database servers handling staff details." },
                    { title: "Employee Offer Letter & Handbook", desc: "Existing employment agreement clauses on data privacy and surveillance." },
                    { title: "Background Verification Contracts", desc: "Agreements with third-party verification agencies." }
                ],
                faqs: [
                    { q: "Can an employer process employee data without explicit consent under DPDP?", a: "The DPDP Act permits processing for certain legitimate employment uses, but strict notifications and lawful limitations apply. Transparent privacy notices are mandatory." },
                    { q: "What is the penalty for employee data breaches under DPDP?", a: "Penalties imposed by the Data Protection Board can extend up to ₹250 Crores for significant non-compliances and failure to implement reasonable security safeguards." }
                ],
                metaTitle: "DPDP Act HR Data Compliance & Workplace Privacy | Conformity Alliance",
                metaDesc: "Comprehensive DPDP Act 2023 compliance for HR departments, biometric data handling, background checks, and employee privacy agreements.",
                metaKeywords: "DPDP Act HR compliance, employee data privacy, workplace data protection India, DPO advisory",
                status: "published",
                isFeatured: true,
                views: 980,
                createdAt: "2026-02-01T11:20:00.000Z",
                updatedAt: "2026-03-22T09:15:00.000Z"
            },
            {
                id: "srv-3",
                slug: "inter-state-migrant-workmen-license",
                title: "Inter-State Migrant Workmen (ISMW) Central & State Licensing",
                categoryId: "cat-1",
                badge: "Statutory Licence",
                icon: "fa-solid fa-people-arrows",
                excerpt: "Principal Employer Registration and Contractor Licensing under the Inter-State Migrant Workmen (RECS) Act with complete inspection compliance.",
                fullDescription: "Enterprises engaging 5 or more migrant workers from other Indian states directly or through contractors must obtain mandatory ISMW Registration as a Principal Employer and ensure that individual labour contractors hold valid Form VI licenses. Conformity Alliance handles nationwide portal applications, documentation vetting, statutory displacement allowances calculations, journey allowances registers, and liaison with State and Central Labour Commissioners.",
                acts: [
                    "Inter-State Migrant Workmen (RECS) Act, 1979",
                    "Inter-State Migrant Workmen Central Rules",
                    "Contract Labour (Regulation & Abolition) Act, 1970",
                    "Equal Remuneration Act & Minimum Wages Provisions"
                ],
                processSteps: [
                    { step: "1", title: "Contractor & Manpower Audit", desc: "Assess home-state origin of deployed workforce, contractor agreements, and wage rates." },
                    { step: "2", title: "Form I Principal Employer Filing", desc: "Prepare and submit Form I on the Shram Suvidha portal or State Labour Gateway." },
                    { step: "3", title: "Form V Contractor Certificate Issuance", desc: "Generate requisite Form V authorization certificates to enable contractor licensing." },
                    { step: "4", title: "Liaison & Grant of Form VI License", desc: "Coordinate with the Registering Officer to secure timely approvals and maintain statutory muster registers." }
                ],
                requiredDocuments: [
                    { title: "Principal Employer Incorporation Proof", desc: "PAN, Certificate of Incorporation, Electricity Bill of establishment." },
                    { title: "Contractor Agreement Copy", desc: "Signed service level agreement indicating deployment duration and numbers." },
                    { title: "Form V Certificate", desc: "Principal Employer endorsement in prescribed statutory format." },
                    { title: "Treasury Challan / Fee Receipt", desc: "Proof of government license fees payment." }
                ],
                faqs: [
                    { q: "When is an ISMW license mandatory?", a: "Whenever an establishment or contractor recruits 5 or more inter-state migrant workmen for employment in an establishment in another state." },
                    { q: "What is displacement allowance under ISMW?", a: "Every inter-state migrant workman is entitled to a displacement allowance equal to 50% of the monthly wage payable at the time of recruitment, which is non-refundable." }
                ],
                metaTitle: "Inter-State Migrant Workmen License (ISMW) Consultants | Conformity Alliance",
                metaDesc: "Obtain Form I Principal Employer Registration and Form VI Contractor Licenses under ISMW Act. Advocate-backed licensing across India.",
                metaKeywords: "ISMW license, inter state migrant workmen registration, Form V contractor license, Shram Suvidha portal",
                status: "published",
                isFeatured: false,
                views: 740,
                createdAt: "2026-02-15T14:00:00.000Z",
                updatedAt: "2026-03-24T16:45:00.000Z"
            }
        ],
        blogs: [
            {
                id: "blg-1",
                slug: "four-labour-codes-implementation-roadmap",
                title: "The Four Labour Codes in India: Employer Preparedness & Wage Definition Impact",
                categoryId: "cat-5",
                excerpt: "An in-depth legal breakdown of the 50% basic wage rule, gratuity changes for fixed-term employees, and single-window licensing under the new Labour Codes.",
                authorName: "Adv. B. Sharma",
                authorRole: "Head of Labour Practice",
                authorAvatar: "assets/images/Picture1.png",
                featuredImage: "assets/images/consultation1.jpg",
                readTime: "7 min read",
                tags: ["Labour Codes", "Wage Code", "PF Impact", "Corporate HR"],
                content: `
                    <p class="lead">India's statutory labour framework is witnessing its most monumental overhaul with the consolidation of 29 central labour enactments into four unified codes: the Code on Wages (2019), Industrial Relations Code (2020), Social Security Code (2020), and Occupational Safety, Health and Working Conditions (OSH) Code (2020).</p>
                    
                    <h3>1. The 50% Wage Ceiling Rule & Cost-to-Company (CTC) Impact</h3>
                    <p>Under the standardized definition of 'Wages', all allowances (including HRA, conveyance, special allowances) exceeding 50% of the total remuneration will be deemed as wages. Consequently, employers will need to restructure their compensation matrices to ensure that basic pay + dearness allowance constitutes at least 50% of total CTC.</p>
                    <div class="ca-article-callout">
                        <strong>Key Compliance Takeaway:</strong> A higher basic salary directly increases the employer's statutory Provident Fund (PF) and Gratuity liabilities. Corporate CFOs and HR directors must compute the projected financial outflow and prepare revised salary slip structures well in advance.
                    </div>

                    <h3>2. Gratuity Rights for Fixed-Term Employees</h3>
                    <p>Under the Social Security Code, fixed-term employees (FTE) engaged under contractual terms will now be eligible for pro-rata gratuity upon completion of one year of continuous service, eliminating the archaic 5-year mandatory threshold for permanent staff.</p>

                    <h3>3. Pan-India Single Window Licensing & Inspections</h3>
                    <p>The OSH Code replaces multiple state-level factory, contract labour, and establishment licenses with a single centralized electronic registration. Furthermore, the arbitrary physical inspection regime is replaced by a randomized web-based inspection system with prior computer-generated intimations.</p>

                    <h3>Action Items for Employers</h3>
                    <ul>
                        <li>Perform an enterprise-wide compensation audit to model financial exposure under the 50% wage cap.</li>
                        <li>Update employment contracts and standard appointment letters to include Fixed-Term Employment clauses.</li>
                        <li>Standardize contractor agreements to align with unified licensing mandates under the OSH Code.</li>
                    </ul>
                `,
                metaTitle: "Four Labour Codes in India: Comprehensive HR & Legal Guide 2026",
                metaDesc: "Detailed legal analysis of India's 4 Labour Codes, 50% wage definition rule, PF restructuring, and fixed-term gratuity entitlements.",
                status: "published",
                views: 2840,
                publishedAt: "2026-03-15T09:00:00.000Z",
                updatedAt: "2026-03-24T12:00:00.000Z"
            },
            {
                id: "blg-2",
                slug: "contract-labour-clra-compliance-checklist",
                title: "CLRA Compliance for Principal Employers: Avoiding Deemed Permanent Employment Risks",
                categoryId: "cat-6",
                excerpt: "How corporate establishments and factory owners can safeguard against contractor worker regularization claims and statutory wage liability defaults.",
                authorName: "CS Priya Mehra",
                authorRole: "Partner - Statutory Audits",
                authorAvatar: "assets/images/Picture1.png",
                featuredImage: "assets/images/compliance.jpg",
                readTime: "5 min read",
                tags: ["CLRA Act", "Contract Labour", "Labour Audits", "Risk Mitigation"],
                content: `
                    <p class="lead">Under the Contract Labour (Regulation and Abolition) Act, 1970, the Principal Employer bears ultimate statutory responsibility for unpaid minimum wages, delayed PF/ESI remittances, and safety defaults committed by third-party manpower contractors.</p>
                    
                    <h3>The Peril of 'Supervision and Control'</h3>
                    <p>One of the most frequent litigation triggers before Industrial Tribunals is the claim of 'Sham and Nominal' contract arrangements. If the Principal Employer directly supervises daily duties, conducts disciplinary hearings, or sanctions leave for contractor workers, courts have consistently held that the contractual veil is pierced, rendering such workers permanent employees.</p>

                    <div class="ca-article-callout">
                        <strong>Golden Rule of CLRA Management:</strong> Never issue direct reprimands or allocate job cards directly to contractor workmen. All operational instructions must flow exclusively through the authorized contractor supervisor.
                    </div>

                    <h3>Mandatory Monthly Audit Checklist</h3>
                    <ul>
                        <li><strong>Form VI License Validity:</strong> Ensure contractor licenses are renewed before expiration and worker headcounts do not exceed licensed limits.</li>
                        <li><strong>Electronic ECR Filings:</strong> Verify establishment-specific PF and ESI electronic challans with matching wage registers prior to clearing monthly vendor invoices.</li>
                        <li><strong>Statutory Registers:</strong> Maintain Form XVII (Register of Wages), Form XX (Register of Deductions), and Form XXII (Muster Roll) on site.</li>
                    </ul>
                `,
                metaTitle: "CLRA Compliance Guide for Principal Employers | Labour Audit Insights",
                metaDesc: "Learn how to manage contract labour compliances, verify PF/ESI challans, and mitigate permanent employment claims under the CLRA Act.",
                status: "published",
                views: 1650,
                publishedAt: "2026-03-01T10:30:00.000Z",
                updatedAt: "2026-03-21T18:00:00.000Z"
            },
            {
                id: "blg-3",
                slug: "pf-esi-damages-interest-section-14b-defense",
                title: "Responding to Section 7A & 14B Notices Under EPF Act: Advocate Insights",
                categoryId: "cat-7",
                excerpt: "Practical legal defense strategies against penal damages and interest assessments under the Employees' Provident Funds and Miscellaneous Provisions Act.",
                authorName: "Adv. Rajesh Verma",
                authorRole: "Senior Litigation Counsel",
                authorAvatar: "assets/images/Picture1.png",
                featuredImage: "assets/images/legal-handshake.jpg",
                readTime: "6 min read",
                tags: ["EPFO", "Section 7A", "Section 14B", "Labour Litigation"],
                content: `
                    <p class="lead">Receiving a summons under Section 7A (Determination of moneys due) or a show-cause notice under Section 14B (Damages for delayed payment) from the Employees' Provident Fund Organisation (EPFO) requires prompt, evidence-backed legal action.</p>
                    
                    <h3>Mens Rea and Financial Hardship Defense</h3>
                    <p>Following landmark Supreme Court jurisprudence (including <em>Hindustan Times Ltd. vs. Union of India</em> and <em>Mcleod Russel India Ltd.</em>), the presence of <em>mens rea</em> (deliberate or contumacious conduct) is a necessary prerequisite before imposing maximum punitive damages under Section 14B. Delayed remittances arising from genuine liquidity crunches or external client defaults can serve as mitigating grounds.</p>

                    <h3>Critical Steps upon Receipt of Notice:</h3>
                    <ul>
                        <li>Immediately compute period-specific interest under Section 7Q and damages under Section 14B.</li>
                        <li>Collate historical ECR receipts, audited balance sheets showing cash-flow distress, and reconciliation statements.</li>
                        <li>Engage authorized legal representation before the Assistant Provident Fund Commissioner (APFC) to record detailed written objections.</li>
                    </ul>
                `,
                metaTitle: "EPF Section 7A & 14B Notice Legal Defense Guide | Conformity Alliance",
                metaDesc: "Comprehensive guide on representing enterprises before the EPFO for Section 7A assessments and Section 14B penalty waivers.",
                status: "published",
                views: 1210,
                publishedAt: "2026-02-18T14:15:00.000Z",
                updatedAt: "2026-03-10T11:00:00.000Z"
            }
        ],
        testimonials: [
            {
                id: "tst-1",
                clientName: "Vikram Malhotra",
                designation: "VP - Human Resources",
                company: "Apex Global Logistics Ltd.",
                review: "Conformity Alliance transformed our multi-state labour compliance across 14 warehouse hubs. Their advocate team resolved complex factory licensing bottlenecks within record time.",
                rating: 5,
                avatar: ""
            },
            {
                id: "tst-2",
                clientName: "Ananya Deshmukh",
                designation: "Director & General Counsel",
                company: "TechMatrix Solutions Pvt. Ltd.",
                review: "Their POSH Act governance and Internal Committee advisory is flawless. Having their seasoned advocates on our panel gave our board complete legal peace of mind.",
                rating: 5,
                avatar: ""
            },
            {
                id: "tst-3",
                clientName: "Rajeev Singhal",
                designation: "Managing Director",
                company: "Precision Autotech Components",
                review: "Outstanding contractor labour audits and prompt representation during labour department inspections. Highly recommended for any manufacturing plant in India.",
                rating: 5,
                avatar: ""
            }
        ],
        leads: [
            {
                id: "ld-101",
                name: "Rohit Srivastava",
                email: "rohit.s@enterprisecorp.in",
                phone: "+91 98112 34567",
                service: "POSH Act Compliance & Internal Committee (IC) Governance",
                company: "Enterprise Corp India",
                message: "We need external advocate member appointment for our Delhi and Bengaluru IT offices with immediate effect.",
                source: "Service Page Form",
                status: "new",
                createdAt: "2026-03-25T14:20:00.000Z"
            },
            {
                id: "ld-102",
                name: "Sunil Kapoor",
                email: "s.kapoor@manufacind.com",
                phone: "+91 99201 88344",
                service: "Inter-State Migrant Workmen (ISMW) Central & State Licensing",
                company: "Manufac Industries Ltd",
                message: "Require Form I and Form V filing assistance for 120 contract workers deployed from UP to Haryana.",
                source: "Homepage Consultation",
                status: "contacted",
                createdAt: "2026-03-24T10:15:00.000Z"
            },
            {
                id: "ld-103",
                name: "Neha Gupta",
                email: "hr@cloudtechlabs.io",
                phone: "+91 97177 55432",
                service: "Digital Personal Data Protection (DPDP) HR Compliance",
                company: "CloudTech Labs",
                message: "Requesting compliance audit of our employee biometric attendance and background verification policies under DPDP.",
                source: "Contact Page",
                status: "in-progress",
                createdAt: "2026-03-22T16:40:00.000Z"
            }
        ]
    };

    // DB Manager Object
    const CADB = {
        // Load data from localStorage or fallback
        getData: function() {
            try {
                const stored = localStorage.getItem(DB_KEY);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    // ensure all keys exist
                    return Object.assign({}, defaultData, parsed);
                }
            } catch (e) {
                console.error("Error reading localStorage database:", e);
            }
            this.saveData(defaultData);
            return JSON.parse(JSON.stringify(defaultData));
        },

        // Save data to localStorage and asynchronously sync with PHP backend
        saveData: function(data) {
            try {
                localStorage.setItem(DB_KEY, JSON.stringify(data));
                this.syncToBackend(data);
                window.dispatchEvent(new CustomEvent('ca_db_updated', { detail: data }));
                return true;
            } catch (e) {
                console.error("Error saving database:", e);
                return false;
            }
        },

        // Sync with PHP backend if available
        syncToBackend: function(data) {
            if (window.fetch) {
                fetch(API_URL + '?action=save_all', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                }).then(res => res.json()).then(res => {
                    // background sync successful
                }).catch(err => {
                    // running on static server or offline - local storage handles everything seamlessly
                });
            }
        },

        // Reset database to initial sample data
        resetToDefault: function() {
            this.saveData(defaultData);
            return defaultData;
        },

        // ----------------- SERVICES -----------------
        getServices: function(filter) {
            const data = this.getData();
            let services = data.services || [];
            if (filter) {
                if (filter.status) services = services.filter(s => s.status === filter.status);
                if (filter.categoryId) services = services.filter(s => s.categoryId === filter.categoryId);
                if (filter.isFeatured !== undefined) services = services.filter(s => s.isFeatured === filter.isFeatured);
                if (filter.search) {
                    const q = filter.search.toLowerCase();
                    services = services.filter(s => 
                        s.title.toLowerCase().includes(q) || 
                        s.excerpt.toLowerCase().includes(q) || 
                        (s.metaKeywords && s.metaKeywords.toLowerCase().includes(q))
                    );
                }
            }
            return services;
        },

        getServiceBySlug: function(slug) {
            const data = this.getData();
            return (data.services || []).find(s => s.slug === slug || s.id === slug) || null;
        },

        saveService: function(service) {
            const data = this.getData();
            data.services = data.services || [];
            
            if (!service.slug) {
                service.slug = this.slugify(service.title);
            }
            
            if (!service.id) {
                service.id = 'srv-' + Date.now();
                service.createdAt = new Date().toISOString();
                service.updatedAt = new Date().toISOString();
                service.views = service.views || 0;
                data.services.unshift(service);
            } else {
                const index = data.services.findIndex(s => s.id === service.id);
                service.updatedAt = new Date().toISOString();
                if (index >= 0) {
                    data.services[index] = Object.assign({}, data.services[index], service);
                } else {
                    data.services.unshift(service);
                }
            }
            this.saveData(data);
            return service;
        },

        deleteService: function(id) {
            const data = this.getData();
            data.services = (data.services || []).filter(s => s.id !== id);
            this.saveData(data);
            return true;
        },

        // ----------------- BLOGS -----------------
        getBlogs: function(filter) {
            const data = this.getData();
            let blogs = data.blogs || [];
            if (filter) {
                if (filter.status) blogs = blogs.filter(b => b.status === filter.status);
                if (filter.categoryId) blogs = blogs.filter(b => b.categoryId === filter.categoryId);
                if (filter.search) {
                    const q = filter.search.toLowerCase();
                    blogs = blogs.filter(b => 
                        b.title.toLowerCase().includes(q) || 
                        b.excerpt.toLowerCase().includes(q) ||
                        (b.tags && b.tags.some(t => t.toLowerCase().includes(q)))
                    );
                }
            }
            return blogs;
        },

        getBlogBySlug: function(slug) {
            const data = this.getData();
            return (data.blogs || []).find(b => b.slug === slug || b.id === slug) || null;
        },

        saveBlog: function(blog) {
            const data = this.getData();
            data.blogs = data.blogs || [];

            if (!blog.slug) {
                blog.slug = this.slugify(blog.title);
            }

            if (!blog.id) {
                blog.id = 'blg-' + Date.now();
                blog.publishedAt = blog.publishedAt || new Date().toISOString();
                blog.updatedAt = new Date().toISOString();
                blog.views = blog.views || 0;
                data.blogs.unshift(blog);
            } else {
                const index = data.blogs.findIndex(b => b.id === blog.id);
                blog.updatedAt = new Date().toISOString();
                if (index >= 0) {
                    data.blogs[index] = Object.assign({}, data.blogs[index], blog);
                } else {
                    data.blogs.unshift(blog);
                }
            }
            this.saveData(data);
            return blog;
        },

        deleteBlog: function(id) {
            const data = this.getData();
            data.blogs = (data.blogs || []).filter(b => b.id !== id);
            this.saveData(data);
            return true;
        },

        // ----------------- CATEGORIES -----------------
        getCategories: function(type) {
            const data = this.getData();
            let cats = data.categories || [];
            if (type) {
                cats = cats.filter(c => c.type === type || c.type === 'both');
            }
            return cats;
        },

        getCategoryById: function(id) {
            const data = this.getData();
            return (data.categories || []).find(c => c.id === id || c.slug === id) || null;
        },

        saveCategory: function(category) {
            const data = this.getData();
            data.categories = data.categories || [];

            if (!category.slug) {
                category.slug = this.slugify(category.name);
            }

            if (!category.id) {
                category.id = 'cat-' + Date.now();
                data.categories.push(category);
            } else {
                const index = data.categories.findIndex(c => c.id === category.id);
                if (index >= 0) {
                    data.categories[index] = Object.assign({}, data.categories[index], category);
                } else {
                    data.categories.push(category);
                }
            }
            this.saveData(data);
            return category;
        },

        deleteCategory: function(id) {
            const data = this.getData();
            data.categories = (data.categories || []).filter(c => c.id !== id);
            this.saveData(data);
            return true;
        },

        // ----------------- LEADS -----------------
        getLeads: function(filter) {
            const data = this.getData();
            let leads = data.leads || [];
            if (filter) {
                if (filter.status) leads = leads.filter(l => l.status === filter.status);
                if (filter.search) {
                    const q = filter.search.toLowerCase();
                    leads = leads.filter(l => 
                        l.name.toLowerCase().includes(q) || 
                        l.email.toLowerCase().includes(q) || 
                        l.phone.toLowerCase().includes(q) ||
                        (l.company && l.company.toLowerCase().includes(q))
                    );
                }
            }
            return leads;
        },

        submitLead: function(lead) {
            const data = this.getData();
            data.leads = data.leads || [];
            lead.id = 'ld-' + Date.now();
            lead.status = 'new';
            lead.createdAt = new Date().toISOString();
            data.leads.unshift(lead);
            this.saveData(data);
            return lead;
        },

        updateLeadStatus: function(id, status) {
            const data = this.getData();
            const lead = (data.leads || []).find(l => l.id === id);
            if (lead) {
                lead.status = status;
                this.saveData(data);
                return true;
            }
            return false;
        },

        deleteLead: function(id) {
            const data = this.getData();
            data.leads = (data.leads || []).filter(l => l.id !== id);
            this.saveData(data);
            return true;
        },

        // ----------------- SETTINGS & TESTIMONIALS -----------------
        getSettings: function() {
            const data = this.getData();
            return data.settings || defaultData.settings;
        },

        saveSettings: function(settings) {
            const data = this.getData();
            data.settings = Object.assign({}, data.settings, settings);
            this.saveData(data);
            return data.settings;
        },

        getTestimonials: function() {
            const data = this.getData();
            return data.testimonials || [];
        },

        saveTestimonial: function(testimonial) {
            const data = this.getData();
            data.testimonials = data.testimonials || [];
            if (!testimonial.id) {
                testimonial.id = 'tst-' + Date.now();
                data.testimonials.push(testimonial);
            } else {
                const index = data.testimonials.findIndex(t => t.id === testimonial.id);
                if (index >= 0) {
                    data.testimonials[index] = testimonial;
                } else {
                    data.testimonials.push(testimonial);
                }
            }
            this.saveData(data);
            return testimonial;
        },

        deleteTestimonial: function(id) {
            const data = this.getData();
            data.testimonials = (data.testimonials || []).filter(t => t.id !== id);
            this.saveData(data);
            return true;
        },

        // ----------------- AUTHENTICATION -----------------
        authenticate: function(username, password) {
            const data = this.getData();
            const admin = data.admin || defaultData.admin;
            if (username === admin.username && password === admin.passwordHash) {
                const session = {
                    username: admin.username,
                    name: admin.name,
                    role: admin.role,
                    token: 'tok_' + Math.random().toString(36).substring(2) + Date.now(),
                    loginTime: new Date().toISOString()
                };
                sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
                localStorage.setItem(SESSION_KEY, JSON.stringify(session));
                admin.lastLogin = new Date().toISOString();
                this.saveData(data);
                return { success: true, session: session };
            }
            return { success: false, error: 'Invalid Administrator Username or Password' };
        },

        getSession: function() {
            try {
                const s = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
                return s ? JSON.parse(s) : null;
            } catch (e) {
                return null;
            }
        },

        logout: function() {
            sessionStorage.removeItem(SESSION_KEY);
            localStorage.removeItem(SESSION_KEY);
            return true;
        },

        updateAdminCredentials: function(newUsername, newPassword, adminName) {
            const data = this.getData();
            data.admin = data.admin || defaultData.admin;
            if (newUsername) data.admin.username = newUsername.trim();
            if (newPassword) data.admin.passwordHash = newPassword.trim();
            if (adminName) data.admin.name = adminName.trim();
            this.saveData(data);
            return true;
        },

        // ----------------- UTILITIES -----------------
        slugify: function(text) {
            return (text || '')
                .toString()
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '-')
                .replace(/[^\w\-]+/g, '')
                .replace(/\-\-+/g, '-')
                .replace(/^-+/, '')
                .replace(/-+$/, '');
        },

        exportDatabaseJson: function() {
            const data = this.getData();
            const str = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", str);
            downloadAnchor.setAttribute("download", `conformity_alliance_backup_${new Date().toISOString().slice(0,10)}.json`);
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
        },

        importDatabaseJson: function(jsonString) {
            try {
                const parsed = JSON.parse(jsonString);
                if (parsed && typeof parsed === 'object') {
                    this.saveData(parsed);
                    return { success: true };
                }
                return { success: false, error: 'Invalid JSON file schema.' };
            } catch (err) {
                return { success: false, error: err.message };
            }
        }
    };

    // Expose to window
    window.CADB = CADB;

})(window);
