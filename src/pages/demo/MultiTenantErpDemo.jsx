import { useMemo, useState } from "react";
import SectionHeader from "../../components/ui/SectionHeader.jsx";

const users = [
  { id: "u-elise", displayName: "Elise Tan", email: "elise@ksleow.com.my", authStatus: "Verified" },
  { id: "u-ch", displayName: "Leow Chuen Hock", email: "chleow@ksleow.com.my", authStatus: "Verified" },
  { id: "u-audit", displayName: "Audit Reviewer", email: "audit@ksleow.com.my", authStatus: "Pending" },
];

const companies = [
  {
    id: "ksl",
    category: "Business",
    isLocal: true,
    tin: "C25845678010",
    brn: "202401005119",
    msicCode: "62010",
    registeredName: "KSL BUSINESS SOLUTIONS SDN. BHD.",
    tradeName: "KSL Business Solutions",
    businessActivityDesc: "Software implementation, IT services, and business process support",
    phone: "017-905 2323",
    email: "support@ksleow.com.my",
    address: "No.8, 2nd Floor, Taman Zabidin, Kampung Catin",
    postCode: "28400",
    city: "Mentakab",
    state: "Pahang",
    country: "MALAYSIA",
    role: "Admin",
    joinedAt: "2026-01-10",
  },
  {
    id: "greenden",
    category: "Business",
    isLocal: true,
    tin: "C99871045080",
    brn: "201701024560",
    msicCode: "31001",
    registeredName: "GREENDEN PRODUCT SDN BHD",
    tradeName: "Greenden Product",
    businessActivityDesc: "Furniture trading and distribution",
    phone: "09-275 0338",
    email: "sales@greenden.test",
    address: "Temerloh Industrial Area",
    postCode: "28000",
    city: "Temerloh",
    state: "Pahang",
    country: "MALAYSIA",
    role: "Standard",
    joinedAt: "2026-02-12",
  },
  {
    id: "supaprintz",
    category: "Business",
    isLocal: true,
    tin: "C33190021470",
    brn: "202301018822",
    msicCode: "18110",
    registeredName: "SUPAPRINTZ MY ENTERPRISE",
    tradeName: "Supaprintz.my",
    businessActivityDesc: "Printing, advertising, and design services",
    phone: "011-5585 9576",
    email: "supaprintz.my@gmail.com",
    address: "No. 8, Ground Floor, Jalan Dagang Utama",
    postCode: "28000",
    city: "Temerloh",
    state: "Pahang",
    country: "MALAYSIA",
    role: "ReadOnly",
    joinedAt: "2026-03-08",
  },
];

const customers = [
  {
    id: "c-aurora",
    companyId: "ksl",
    registeredName: "AURORA RETAIL SDN BHD",
    tradeName: "Aurora Retail",
    brn: "201901004781",
    tin: "C201901004781",
    msicCode: "47190",
    phone: "03-7721 8820",
    email: "finance@aurora.test",
    status: "Active",
    ownerId: "u-elise",
    city: "Kuala Lumpur",
    state: "W.P. Kuala Lumpur",
    updatedAt: "2026-06-24",
  },
  {
    id: "c-pahang-foods",
    companyId: "ksl",
    registeredName: "PAHANG FOODS TRADING",
    tradeName: "Pahang Foods",
    brn: "KT0491801-X",
    tin: "IG7718290350",
    msicCode: "46309",
    phone: "09-295 1188",
    email: "ops@pahangfoods.test",
    status: "Lead",
    ownerId: "u-ch",
    city: "Temerloh",
    state: "Pahang",
    updatedAt: "2026-06-28",
  },
  {
    id: "c-citrine",
    companyId: "ksl",
    registeredName: "CITRINE MEDICAL SUPPLY SDN BHD",
    tradeName: "Citrine Medical",
    brn: "202101019553",
    tin: "C202101019553",
    msicCode: "46497",
    phone: "04-502 3301",
    email: "admin@citrine.test",
    status: "Inactive",
    ownerId: "u-elise",
    city: "Penang",
    state: "Pulau Pinang",
    updatedAt: "2026-06-16",
  },
  {
    id: "c-skyline",
    companyId: "greenden",
    registeredName: "SKYLINE PROJECT SDN BHD",
    tradeName: "Skyline Project",
    brn: "201801033019",
    tin: "C201801033019",
    msicCode: "41001",
    phone: "03-8899 2200",
    email: "procurement@skyline.test",
    status: "Active",
    ownerId: "u-audit",
    city: "Shah Alam",
    state: "Selangor",
    updatedAt: "2026-06-25",
  },
  {
    id: "c-kopi",
    companyId: "supaprintz",
    registeredName: "KOPI BUKIT ANGIN",
    tradeName: "Kopi Bukit Angin",
    brn: "CA0301883-A",
    tin: "IG9901241100",
    msicCode: "56101",
    phone: "011-3312 0900",
    email: "hello@kopibukit.test",
    status: "Lead",
    ownerId: "u-elise",
    city: "Temerloh",
    state: "Pahang",
    updatedAt: "2026-06-21",
  },
];

const networkLinks = [
  { id: "n-1", initiatorCompanyId: "ksl", targetCompanyId: "greenden", linkedCustomerId: "c-skyline", status: "Pending" },
  { id: "n-2", initiatorCompanyId: "ksl", targetCompanyId: "supaprintz", linkedCustomerId: "c-kopi", status: "Accepted" },
];

const navItems = ["Overview", "CRM", "Invoices", "B2B Network", "Audit Log"];

function Icon({ name }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-5" /></>,
    link: <><path d="M10 13a5 5 0 0 0 7.07 0l2.12-2.12a5 5 0 0 0-7.07-7.07L11 4.93" /><path d="M14 11a5 5 0 0 0-7.07 0L4.81 13.12a5 5 0 0 0 7.07 7.07L13 19.07" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    chevron: <path d="m6 9 6 6 6-6" />,
    search: <><circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" /></>,
    google: <><circle cx="12" cy="12" r="9" /><path d="M12 12h8" /><path d="M17.5 17.5A7.5 7.5 0 1 1 17.5 6.5" /></>,
    microsoft: <><path d="M4 4h7v7H4z" /><path d="M13 4h7v7h-7z" /><path d="M4 13h7v7H4z" /><path d="M13 13h7v7h-7z" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  };

  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {paths[name] || paths.grid}
    </svg>
  );
}

function statusClass(status) {
  return `erp-status erp-status--${String(status).toLowerCase()}`;
}

function getOwnerName(ownerId) {
  return users.find((user) => user.id === ownerId)?.displayName || "Unassigned";
}

export function CRMCustomerListView({ customers: rows, activeCompany }) {
  const [query, setQuery] = useState("");
  const filteredRows = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text) return rows;
    return rows.filter((row) =>
      [row.registeredName, row.tradeName, row.brn, row.tin, row.phone, row.status, row.city]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(text))
    );
  }, [query, rows]);

  return (
    <section className="erp-crm-panel" aria-labelledby="erp-crm-title">
      <div className="erp-crm-toolbar">
        <div>
          <div className="ks-eyebrow">CRM customer list</div>
          <h3 id="erp-crm-title">Tenant-filtered customer records</h3>
          <p>Showing customers where <strong>CompanyId</strong> matches {activeCompany.tradeName || activeCompany.registeredName}.</p>
        </div>
        <label className="erp-search-field">
          <Icon name="search" />
          <span className="sr-only">Search customers</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search customer, BRN, TIN..."
          />
        </label>
      </div>

      <div className="erp-breakpoint-row" aria-label="Responsive breakpoints">
        <span>sm cards</span>
        <span>md compressed grid</span>
        <span>lg data table</span>
      </div>

      <div className="erp-table-wrap">
        <table className="erp-crm-table">
          <thead>
            <tr>
              <th>Registered Name</th>
              <th>BRN</th>
              <th>TIN</th>
              <th>Phone</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((customer) => (
              <tr key={customer.id}>
                <td>
                  <strong>{customer.registeredName}</strong>
                  <span>{customer.tradeName} / Owner: {getOwnerName(customer.ownerId)}</span>
                </td>
                <td>{customer.brn}</td>
                <td>{customer.tin}</td>
                <td>{customer.phone}</td>
                <td><span className={statusClass(customer.status)}>{customer.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="erp-customer-cards">
        {filteredRows.map((customer) => (
          <article className="erp-customer-card" key={`card-${customer.id}`}>
            <div>
              <span className={statusClass(customer.status)}>{customer.status}</span>
              <h4>{customer.registeredName}</h4>
              <p>{customer.tradeName} / {customer.city}, {customer.state}</p>
            </div>
            <dl>
              <div><dt>BRN</dt><dd>{customer.brn}</dd></div>
              <div><dt>TIN</dt><dd>{customer.tin}</dd></div>
              <div><dt>Phone</dt><dd>{customer.phone}</dd></div>
              <div><dt>Owner</dt><dd>{getOwnerName(customer.ownerId)}</dd></div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}

export function MultiTenantDashboardShell() {
  const [activeCompanyId, setActiveCompanyId] = useState(companies[0].id);
  const [tenantOpen, setTenantOpen] = useState(false);
  const activeCompany = companies.find((company) => company.id === activeCompanyId) || companies[0];
  const tenantCustomers = customers.filter((customer) => customer.companyId === activeCompany.id);
  const activeLinks = networkLinks.filter((link) => link.initiatorCompanyId === activeCompany.id || link.targetCompanyId === activeCompany.id);

  return (
    <section id="demo-dashboard" className="erp-demo-section erp-demo-section--dashboard">
      <div className="content-wrap">
        <SectionHeader
          eyebrow="Multi-tenant workplace"
          title="Dashboard shell with active tenant context"
          align="center"
        >
          Workspace switching, RBAC role visibility, tenant-scoped CRM records, and LHDN profile checks are tied to the provided schema.
        </SectionHeader>

        <div className="erp-app-shell">
          <header className="erp-topbar">
            <div className="erp-brand-lockup">
              <span className="erp-brand-mark">KS</span>
              <div>
                <strong>KSL ERP Demo</strong>
                <span>Auditable multi-tenant workspace</span>
              </div>
            </div>

            <div className="erp-tenant-switcher">
              <button
                type="button"
                className="erp-tenant-button"
                onClick={() => setTenantOpen((open) => !open)}
                aria-expanded={tenantOpen}
              >
                <span>
                  <small>Active workspace</small>
                  {activeCompany.tradeName || activeCompany.registeredName}
                </span>
                <Icon name="chevron" />
              </button>
              {tenantOpen && (
                <div className="erp-tenant-menu">
                  {companies.map((company) => (
                    <button
                      type="button"
                      key={company.id}
                      className={company.id === activeCompany.id ? "is-active" : ""}
                      onClick={() => {
                        setActiveCompanyId(company.id);
                        setTenantOpen(false);
                      }}
                    >
                      <strong>{company.tradeName || company.registeredName}</strong>
                      <span>{company.role} / {company.brn}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </header>

          <div className="erp-shell-grid">
            <aside className="erp-side-nav" aria-label="Demo workspace navigation">
              {navItems.map((item, index) => (
                <button type="button" className={index === 1 ? "is-active" : ""} key={item}>
                  <Icon name={index === 0 ? "grid" : index === 1 ? "users" : index === 3 ? "link" : index === 4 ? "clock" : "shield"} />
                  <span>{item}</span>
                </button>
              ))}
            </aside>

            <main className="erp-main-panel">
              <div className="erp-company-card">
                <div>
                  <span className="erp-mini-label">Company tax profile</span>
                  <h3>{activeCompany.registeredName}</h3>
                  <p>{activeCompany.businessActivityDesc}</p>
                </div>
                <div className="erp-tax-grid">
                  <span><strong>TIN</strong>{activeCompany.tin}</span>
                  <span><strong>BRN</strong>{activeCompany.brn}</span>
                  <span><strong>MSIC</strong>{activeCompany.msicCode}</span>
                  <span><strong>Role</strong>{activeCompany.role}</span>
                </div>
              </div>

              <div className="erp-metric-grid">
                <article>
                  <Icon name="users" />
                  <strong>{tenantCustomers.length}</strong>
                  <span>CRM records</span>
                </article>
                <article>
                  <Icon name="shield" />
                  <strong>Ready</strong>
                  <span>LHDN required fields</span>
                </article>
                <article>
                  <Icon name="link" />
                  <strong>{activeLinks.length}</strong>
                  <span>B2B network links</span>
                </article>
              </div>

              <CRMCustomerListView customers={tenantCustomers} activeCompany={activeCompany} />
            </main>
          </div>
        </div>
      </div>
    </section>
  );
}

function MultiProviderAuthPanel() {
  return (
    <section id="demo-auth" className="erp-demo-section erp-demo-section--auth">
      <div className="content-wrap">
        <div className="erp-auth-grid">
          <SectionHeader eyebrow="Multi-provider authentication" title="One identity, many company workspaces">
            The global User record can be verified by email/password or mapped to multiple SSO providers through UserExternalLogin.
          </SectionHeader>

          <div className="erp-auth-card">
            <div className="erp-auth-tabs" aria-label="Authentication options">
              <button type="button" className="is-active">Login</button>
              <button type="button">Register</button>
            </div>
            <button type="button" className="erp-sso-button"><Icon name="google" /> Continue with Google</button>
            <button type="button" className="erp-sso-button"><Icon name="microsoft" /> Continue with Microsoft</button>
            <div className="erp-divider-text">or use company email</div>
            <label className="ks-control-label" htmlFor="erp-email">Email</label>
            <input id="erp-email" className="ks-field" type="email" placeholder="finance@company.com" />
            <label className="ks-control-label" htmlFor="erp-name">Display name</label>
            <input id="erp-name" className="ks-field" type="text" placeholder="Jane Lee" />
            <button type="button" className="ks-btn ks-btn-brand ks-btn-block">Create verified user</button>
            <p className="ks-note-text">AuthStatus starts as Pending, then moves to Verified after email or SSO confirmation.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function SchemaContextPanel() {
  const items = [
    ["AuditableEntity", "Soft deletion, optimistic concurrency, and created/updated tracking."],
    ["Company / Customer", "Shared LHDN tax profile fields for clean B2B e-Invoice mapping."],
    ["CompanyUser", "Tenant pivot with Admin, Standard, and ReadOnly roles."],
    ["B2BNetworkLink", "Cross-tenant handshake for verified trading relationships."],
  ];

  return (
    <div className="erp-schema-panel">
      {items.map(([title, copy]) => (
        <article key={title}>
          <span />
          <strong>{title}</strong>
          <p>{copy}</p>
        </article>
      ))}
    </div>
  );
}

export default function MultiTenantErpDemoPage() {
  return (
    <main id="page-multi-tenant-erp-demo" className="erp-demo-page">
      <section className="erp-demo-hero">
        <div className="content-wrap erp-demo-hero-grid">
          <div className="erp-demo-hero-copy">
            <div className="ks-eyebrow">Schema-aware ERP demo</div>
            <h1>Multi-tenant ERP and CRM workspace for Malaysia e-Invoicing.</h1>
            <p>
              A responsive frontend demo built around the provided User, Company, CompanyUser, Customer, and B2BNetworkLink schema.
              The visual system follows the dark navy, gold-accented, glass-panel direction used by KS Omni.
            </p>
            <div className="erp-demo-cta-row">
              <a className="ks-btn ks-btn-primary" href="#demo-dashboard">View dashboard shell</a>
              <a className="btn-ghost-base btn-ghost-light" href="#demo-auth">View authentication</a>
            </div>
          </div>
          <SchemaContextPanel />
        </div>
      </section>

      <MultiTenantDashboardShell />
      <MultiProviderAuthPanel />

      <style>{`
        #page-multi-tenant-erp-demo {
          --erp-navy: #1d1b4f;
          --erp-ink: #2f315a;
          --erp-gold: #c9a84c;
          --erp-soft: #f3f1ea;
          --erp-line: rgba(47, 49, 90, 0.12);
          background:
            linear-gradient(180deg, #11122d 0%, #191a42 22rem, #f7f7fb 22rem, #f1efe7 100%);
          color: var(--erp-ink);
          min-height: 100vh;
        }

        .erp-demo-hero {
          position: relative;
          overflow: hidden;
          padding: clamp(5.5rem, 8vw, 8.5rem) 0 clamp(3rem, 6vw, 5rem);
          color: #ffffff;
        }

        .erp-demo-hero::before,
        .erp-demo-hero::after {
          content: "";
          position: absolute;
          border-radius: 999px;
          filter: blur(32px);
          pointer-events: none;
        }

        .erp-demo-hero::before {
          width: 32rem;
          height: 32rem;
          right: -10rem;
          top: -16rem;
          background: rgba(201, 168, 76, 0.18);
        }

        .erp-demo-hero::after {
          width: 22rem;
          height: 22rem;
          left: 8%;
          bottom: -14rem;
          background: rgba(255, 255, 255, 0.08);
        }

        .erp-demo-hero-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: minmax(0, 0.92fr) minmax(360px, 0.72fr);
          gap: clamp(1.5rem, 4vw, 4rem);
          align-items: center;
        }

        .erp-demo-hero-copy h1 {
          max-width: 780px;
          margin: 0 0 1rem;
          color: #ffffff;
          font-size: clamp(2.35rem, 6vw, 5.6rem);
          line-height: 0.95;
          letter-spacing: 0;
        }

        .erp-demo-hero-copy p {
          max-width: 670px;
          margin: 0 0 1.6rem;
          color: rgba(255, 255, 255, 0.72);
          font-size: clamp(1rem, 1.25vw, 1.18rem);
          line-height: 1.75;
        }

        .erp-demo-cta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.8rem;
        }

        .erp-schema-panel {
          display: grid;
          gap: 0.85rem;
          padding: clamp(1rem, 2vw, 1.25rem);
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 28px;
          background: linear-gradient(145deg, rgba(255,255,255,0.13), rgba(255,255,255,0.06));
          box-shadow: 0 26px 80px rgba(0, 0, 0, 0.24);
          backdrop-filter: blur(18px) saturate(1.5);
        }

        .erp-schema-panel article {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          gap: 0.15rem 0.75rem;
          padding: 1rem;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        .erp-schema-panel article > span {
          width: 0.55rem;
          height: 0.55rem;
          margin-top: 0.35rem;
          border-radius: 999px;
          background: var(--erp-gold);
          box-shadow: 0 0 22px rgba(201, 168, 76, 0.65);
        }

        .erp-schema-panel strong {
          color: #ffffff;
          font-size: 0.95rem;
        }

        .erp-schema-panel p {
          grid-column: 2;
          margin: 0;
          color: rgba(255, 255, 255, 0.64);
          font-size: 0.84rem;
          line-height: 1.55;
        }

        .erp-demo-section {
          padding: clamp(3.8rem, 6vw, 6rem) 0;
        }

        .erp-demo-section--dashboard {
          background:
            radial-gradient(circle at 10% 8%, rgba(201, 168, 76, 0.13), transparent 24rem),
            linear-gradient(180deg, #f7f7fb, #f2f0e8);
        }

        .erp-app-shell {
          margin-top: clamp(1.8rem, 3vw, 3rem);
          overflow: hidden;
          border: 1px solid rgba(47, 49, 90, 0.12);
          border-radius: 30px;
          background: #ffffff;
          box-shadow: 0 28px 80px rgba(47, 49, 90, 0.12);
        }

        .erp-topbar {
          position: relative;
          z-index: 4;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          min-height: 76px;
          padding: 1rem clamp(1rem, 2vw, 1.5rem);
          background: var(--erp-navy);
          color: #ffffff;
        }

        .erp-brand-lockup {
          display: flex;
          align-items: center;
          min-width: 0;
          gap: 0.8rem;
        }

        .erp-brand-mark {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 16px;
          background: linear-gradient(135deg, #d9b653, #9f7e23);
          color: #1d1b4f;
          font-weight: 900;
          letter-spacing: -0.06em;
          box-shadow: 0 14px 32px rgba(201, 168, 76, 0.24);
        }

        .erp-brand-lockup strong,
        .erp-brand-lockup span {
          display: block;
        }

        .erp-brand-lockup span {
          color: rgba(255,255,255,0.58);
          font-size: 0.82rem;
        }

        .erp-tenant-switcher {
          position: relative;
          min-width: min(340px, 44vw);
        }

        .erp-tenant-button {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          min-height: 48px;
          padding: 0.55rem 0.9rem;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
          font: inherit;
          text-align: left;
          cursor: pointer;
        }

        .erp-tenant-button small {
          display: block;
          margin-bottom: 0.08rem;
          color: rgba(255, 255, 255, 0.54);
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .erp-tenant-menu {
          position: absolute;
          top: calc(100% + 0.65rem);
          right: 0;
          width: min(360px, 86vw);
          padding: 0.45rem;
          border: 1px solid rgba(47, 49, 90, 0.12);
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.94);
          box-shadow: 0 24px 60px rgba(17, 18, 45, 0.24);
          backdrop-filter: blur(18px);
        }

        .erp-tenant-menu button {
          width: 100%;
          display: block;
          padding: 0.85rem 0.9rem;
          border: 0;
          border-radius: 15px;
          background: transparent;
          color: var(--erp-ink);
          text-align: left;
          cursor: pointer;
        }

        .erp-tenant-menu button.is-active,
        .erp-tenant-menu button:hover {
          background: rgba(47, 49, 90, 0.07);
        }

        .erp-tenant-menu strong,
        .erp-tenant-menu span {
          display: block;
        }

        .erp-tenant-menu span {
          margin-top: 0.2rem;
          color: #777a9a;
          font-size: 0.78rem;
        }

        .erp-shell-grid {
          display: grid;
          grid-template-columns: 210px minmax(0, 1fr);
          background: #f6f6fa;
        }

        .erp-side-nav {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          padding: 1rem;
          border-right: 1px solid rgba(47, 49, 90, 0.08);
          background: #fbfbfd;
        }

        .erp-side-nav button {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          min-height: 44px;
          padding: 0 0.85rem;
          border: 0;
          border-radius: 15px;
          background: transparent;
          color: #6d708f;
          font: inherit;
          font-size: 0.9rem;
          font-weight: 750;
          cursor: pointer;
        }

        .erp-side-nav button.is-active {
          background: var(--erp-navy);
          color: #ffffff;
          box-shadow: 0 14px 34px rgba(47, 49, 90, 0.16);
        }

        .erp-main-panel {
          display: grid;
          gap: 1rem;
          min-width: 0;
          padding: clamp(1rem, 2vw, 1.35rem);
        }

        .erp-company-card {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(300px, 0.8fr);
          gap: 1rem;
          align-items: stretch;
          padding: clamp(1rem, 2vw, 1.3rem);
          border-radius: 24px;
          background:
            linear-gradient(135deg, rgba(47,49,90,0.96), rgba(35,36,84,0.92)),
            radial-gradient(circle at right, rgba(201,168,76,0.26), transparent 22rem);
          color: #ffffff;
        }

        .erp-company-card h3 {
          margin: 0.2rem 0 0.35rem;
          color: #ffffff;
          font-size: clamp(1.2rem, 2vw, 1.75rem);
          line-height: 1.16;
        }

        .erp-company-card p {
          max-width: 680px;
          margin: 0;
          color: rgba(255, 255, 255, 0.66);
          line-height: 1.6;
        }

        .erp-mini-label {
          color: var(--erp-gold);
          font-size: 0.72rem;
          font-weight: 850;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .erp-tax-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.65rem;
        }

        .erp-tax-grid span {
          min-width: 0;
          padding: 0.85rem;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.09);
          color: rgba(255, 255, 255, 0.82);
          font-size: 0.86rem;
          overflow-wrap: anywhere;
        }

        .erp-tax-grid strong {
          display: block;
          margin-bottom: 0.25rem;
          color: rgba(255, 255, 255, 0.46);
          font-size: 0.64rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .erp-metric-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1rem;
        }

        .erp-metric-grid article {
          display: grid;
          gap: 0.25rem;
          padding: 1rem;
          border: 1px solid rgba(47, 49, 90, 0.08);
          border-radius: 20px;
          background: #ffffff;
        }

        .erp-metric-grid svg {
          color: var(--erp-gold);
        }

        .erp-metric-grid strong {
          color: var(--erp-ink);
          font-size: 1.6rem;
          line-height: 1;
        }

        .erp-metric-grid span {
          color: #777a9a;
          font-size: 0.84rem;
          font-weight: 650;
        }

        .erp-crm-panel {
          min-width: 0;
          padding: clamp(1rem, 2vw, 1.25rem);
          border: 1px solid rgba(47, 49, 90, 0.08);
          border-radius: 24px;
          background: #ffffff;
        }

        .erp-crm-toolbar {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .erp-crm-toolbar h3 {
          margin: 0 0 0.25rem;
          color: var(--erp-ink);
          font-size: clamp(1.15rem, 2vw, 1.55rem);
        }

        .erp-crm-toolbar p {
          margin: 0;
          color: #777a9a;
          line-height: 1.55;
        }

        .erp-search-field {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          min-width: min(300px, 100%);
          min-height: 42px;
          padding: 0 0.8rem;
          border: 1px solid rgba(47, 49, 90, 0.12);
          border-radius: 999px;
          color: #8c8faa;
          background: #fbfbfd;
        }

        .erp-search-field input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: var(--erp-ink);
          font: inherit;
          font-size: 0.9rem;
        }

        .erp-breakpoint-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-bottom: 0.8rem;
        }

        .erp-breakpoint-row span {
          padding: 0.32rem 0.6rem;
          border-radius: 999px;
          background: rgba(201, 168, 76, 0.12);
          color: #997728;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .erp-table-wrap {
          overflow-x: auto;
          border: 1px solid rgba(47, 49, 90, 0.08);
          border-radius: 18px;
        }

        .erp-crm-table {
          width: 100%;
          min-width: 760px;
          border-collapse: collapse;
        }

        .erp-crm-table th,
        .erp-crm-table td {
          padding: 0.92rem 1rem;
          border-bottom: 1px solid rgba(47, 49, 90, 0.08);
          text-align: left;
          vertical-align: top;
        }

        .erp-crm-table th {
          background: #f0f0f5;
          color: #5e6286;
          font-size: 0.72rem;
          font-weight: 850;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .erp-crm-table td {
          color: var(--erp-ink);
          font-size: 0.88rem;
        }

        .erp-crm-table td strong,
        .erp-crm-table td span {
          display: block;
        }

        .erp-crm-table td span:not(.erp-status) {
          margin-top: 0.25rem;
          color: #8c8faa;
          font-size: 0.76rem;
        }

        .erp-status {
          display: inline-flex;
          align-items: center;
          min-height: 26px;
          padding: 0 0.62rem;
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 850;
        }

        .erp-status--active { background: rgba(34, 197, 94, 0.12); color: #168545; }
        .erp-status--lead { background: rgba(201, 168, 76, 0.16); color: #927022; }
        .erp-status--inactive { background: rgba(107, 114, 128, 0.12); color: #6b7280; }

        .erp-customer-cards {
          display: none;
          gap: 0.8rem;
        }

        .erp-customer-card {
          display: grid;
          gap: 1rem;
          padding: 1rem;
          border: 1px solid rgba(47, 49, 90, 0.1);
          border-radius: 20px;
          background: #ffffff;
        }

        .erp-customer-card h4 {
          margin: 0.55rem 0 0.2rem;
          color: var(--erp-ink);
          font-size: 1rem;
          line-height: 1.25;
        }

        .erp-customer-card p {
          margin: 0;
          color: #777a9a;
          line-height: 1.45;
        }

        .erp-customer-card dl {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.55rem;
          margin: 0;
        }

        .erp-customer-card dt {
          color: #9699b6;
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .erp-customer-card dd {
          margin: 0.15rem 0 0;
          color: var(--erp-ink);
          font-size: 0.84rem;
          font-weight: 720;
          overflow-wrap: anywhere;
        }

        .erp-demo-section--auth {
          background: linear-gradient(180deg, #f2f0e8, #ffffff);
        }

        .erp-auth-grid {
          display: grid;
          grid-template-columns: minmax(0, 0.95fr) minmax(340px, 0.55fr);
          gap: clamp(1.5rem, 5vw, 4rem);
          align-items: center;
        }

        .erp-auth-card {
          display: grid;
          gap: 0.8rem;
          padding: clamp(1rem, 2vw, 1.35rem);
          border: 1px solid rgba(47, 49, 90, 0.1);
          border-radius: 28px;
          background: #ffffff;
          box-shadow: 0 24px 70px rgba(47, 49, 90, 0.1);
        }

        .erp-auth-tabs {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.25rem;
          padding: 0.25rem;
          border-radius: 999px;
          background: #f0f0f5;
        }

        .erp-auth-tabs button {
          min-height: 38px;
          border: 0;
          border-radius: 999px;
          background: transparent;
          color: #777a9a;
          font: inherit;
          font-weight: 800;
        }

        .erp-auth-tabs button.is-active {
          background: var(--erp-navy);
          color: #ffffff;
        }

        .erp-sso-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.55rem;
          min-height: 46px;
          border: 1px solid rgba(47, 49, 90, 0.12);
          border-radius: 16px;
          background: #ffffff;
          color: var(--erp-ink);
          font: inherit;
          font-weight: 800;
          cursor: pointer;
        }

        .erp-divider-text {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 0.75rem;
          align-items: center;
          color: #9ca0bc;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .erp-divider-text::before,
        .erp-divider-text::after {
          content: "";
          height: 1px;
          background: rgba(47, 49, 90, 0.1);
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        @media (max-width: 1080px) {
          .erp-demo-hero-grid,
          .erp-auth-grid {
            grid-template-columns: 1fr;
          }

          .erp-shell-grid {
            grid-template-columns: 84px minmax(0, 1fr);
          }

          .erp-side-nav span {
            display: none;
          }

          .erp-side-nav button {
            justify-content: center;
            padding: 0;
          }

          .erp-company-card {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 760px) {
          .erp-demo-hero {
            padding-top: 4.6rem;
          }

          .erp-demo-hero-copy h1 {
            font-size: clamp(2.25rem, 14vw, 3.75rem);
          }

          .erp-app-shell {
            border-radius: 24px;
          }

          .erp-topbar,
          .erp-crm-toolbar {
            align-items: stretch;
            flex-direction: column;
          }

          .erp-tenant-switcher {
            width: 100%;
            min-width: 0;
          }

          .erp-shell-grid {
            grid-template-columns: 1fr;
          }

          .erp-side-nav {
            flex-direction: row;
            overflow-x: auto;
            border-right: 0;
            border-bottom: 1px solid rgba(47, 49, 90, 0.08);
          }

          .erp-side-nav button {
            min-width: 46px;
          }

          .erp-tax-grid,
          .erp-metric-grid,
          .erp-customer-card dl {
            grid-template-columns: 1fr;
          }

          .erp-table-wrap {
            display: none;
          }

          .erp-customer-cards {
            display: grid;
          }

          .erp-breakpoint-row {
            margin-bottom: 1rem;
          }
        }
      `}</style>
    </main>
  );
}
