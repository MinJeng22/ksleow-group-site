import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "ksl_multi_tenant_erp_demo_v2";

const seedUsers = [
  { id: "u-elise", email: "elise@ksleow.com.my", displayName: "Elise Tan", authStatus: "Verified", passwordHash: null },
  { id: "u-ch", email: "chleow@ksleow.com.my", displayName: "Leow Chuen Hock", authStatus: "Verified", passwordHash: null },
  { id: "u-audit", email: "audit@ksleow.com.my", displayName: "Audit Reviewer", authStatus: "Pending", passwordHash: null },
];

const seedCompanies = [
  {
    id: "co-ksl",
    category: "Business",
    isLocal: true,
    tin: "C25845678010",
    brn: "202401005119",
    msicCode: "62010",
    sstRegNo: "",
    businessActivityDesc: "Software implementation, IT services, and business process support",
    tourismTaxRegNo: "",
    prevGSTRegNo: "",
    registeredName: "KSL BUSINESS SOLUTIONS SDN. BHD.",
    tradeName: "KSL Business Solutions",
    phone: "017-905 2323",
    email: "support@ksleow.com.my",
    address: "No.8, 2nd Floor, Taman Zabidin, Kampung Catin",
    postCode: "28400",
    city: "Mentakab",
    state: "Pahang",
    country: "MALAYSIA",
    isActive: true,
    isDeleted: false,
    createdBy: "u-elise",
    createdAt: "2026-06-01T08:00:00.000Z",
    updatedBy: "u-elise",
    updatedAt: "2026-06-20T10:00:00.000Z",
    rowVersion: 3,
  },
  {
    id: "co-greenden",
    category: "Business",
    isLocal: true,
    tin: "C99871045080",
    brn: "201701024560",
    msicCode: "31001",
    sstRegNo: "",
    businessActivityDesc: "Furniture trading and distribution",
    tourismTaxRegNo: "",
    prevGSTRegNo: "",
    registeredName: "GREENDEN PRODUCT SDN BHD",
    tradeName: "Greenden Product",
    phone: "09-275 0338",
    email: "sales@greenden.test",
    address: "Temerloh Industrial Area",
    postCode: "28000",
    city: "Temerloh",
    state: "Pahang",
    country: "MALAYSIA",
    isActive: true,
    isDeleted: false,
    createdBy: "u-elise",
    createdAt: "2026-06-04T08:00:00.000Z",
    updatedBy: "u-elise",
    updatedAt: "2026-06-18T10:00:00.000Z",
    rowVersion: 2,
  },
  {
    id: "co-supaprintz",
    category: "Business",
    isLocal: true,
    tin: "C33190021470",
    brn: "202301018822",
    msicCode: "18110",
    sstRegNo: "",
    businessActivityDesc: "Printing, advertising, and design services",
    tourismTaxRegNo: "",
    prevGSTRegNo: "",
    registeredName: "SUPAPRINTZ MY ENTERPRISE",
    tradeName: "Supaprintz.my",
    phone: "011-5585 9576",
    email: "supaprintz.my@gmail.com",
    address: "No. 8, Ground Floor, Jalan Dagang Utama",
    postCode: "28000",
    city: "Temerloh",
    state: "Pahang",
    country: "MALAYSIA",
    isActive: true,
    isDeleted: false,
    createdBy: "u-elise",
    createdAt: "2026-06-08T08:00:00.000Z",
    updatedBy: "u-elise",
    updatedAt: "2026-06-22T10:00:00.000Z",
    rowVersion: 1,
  },
];

const seedCompanyUsers = [
  { id: "cu-1", companyId: "co-ksl", userId: "u-elise", role: "Admin", isActive: true, joinedAt: "2026-06-01T08:00:00.000Z" },
  { id: "cu-2", companyId: "co-greenden", userId: "u-elise", role: "Standard", isActive: true, joinedAt: "2026-06-04T08:00:00.000Z" },
  { id: "cu-3", companyId: "co-supaprintz", userId: "u-elise", role: "ReadOnly", isActive: true, joinedAt: "2026-06-08T08:00:00.000Z" },
  { id: "cu-4", companyId: "co-ksl", userId: "u-ch", role: "Admin", isActive: true, joinedAt: "2026-06-01T08:00:00.000Z" },
  { id: "cu-5", companyId: "co-greenden", userId: "u-audit", role: "ReadOnly", isActive: true, joinedAt: "2026-06-08T08:00:00.000Z" },
];

const seedCustomers = [
  customerSeed({
    id: "cus-aurora",
    companyId: "co-ksl",
    registeredName: "AURORA RETAIL SDN BHD",
    tradeName: "Aurora Retail",
    brn: "201901004781",
    tin: "C201901004781",
    msicCode: "47190",
    phone: "03-7721 8820",
    email: "finance@aurora.test",
    address: "Jalan Ampang",
    postCode: "50450",
    city: "Kuala Lumpur",
    state: "W.P. Kuala Lumpur",
    businessActivityDesc: "Retail operations",
    status: "Active",
    ownerId: "u-elise",
  }),
  customerSeed({
    id: "cus-pahang-foods",
    companyId: "co-ksl",
    registeredName: "PAHANG FOODS TRADING",
    tradeName: "Pahang Foods",
    brn: "KT0491801-X",
    tin: "IG7718290350",
    msicCode: "46309",
    phone: "09-295 1188",
    email: "ops@pahangfoods.test",
    address: "Jalan Temerloh",
    postCode: "28000",
    city: "Temerloh",
    state: "Pahang",
    businessActivityDesc: "Food supply trading",
    status: "Lead",
    ownerId: "u-ch",
  }),
  customerSeed({
    id: "cus-citrine",
    companyId: "co-ksl",
    registeredName: "CITRINE MEDICAL SUPPLY SDN BHD",
    tradeName: "Citrine Medical",
    brn: "202101019553",
    tin: "C202101019553",
    msicCode: "46497",
    phone: "04-502 3301",
    email: "admin@citrine.test",
    address: "Medan Perubatan",
    postCode: "10350",
    city: "George Town",
    state: "Pulau Pinang",
    businessActivityDesc: "Medical supplies",
    status: "Inactive",
    ownerId: "u-elise",
  }),
  customerSeed({
    id: "cus-skyline",
    companyId: "co-greenden",
    registeredName: "SKYLINE PROJECT SDN BHD",
    tradeName: "Skyline Project",
    brn: "201801033019",
    tin: "C201801033019",
    msicCode: "41001",
    phone: "03-8899 2200",
    email: "procurement@skyline.test",
    address: "Seksyen 13",
    postCode: "40100",
    city: "Shah Alam",
    state: "Selangor",
    businessActivityDesc: "Construction project management",
    status: "Active",
    ownerId: "u-audit",
  }),
  customerSeed({
    id: "cus-kopi",
    companyId: "co-supaprintz",
    registeredName: "KOPI BUKIT ANGIN",
    tradeName: "Kopi Bukit Angin",
    brn: "CA0301883-A",
    tin: "IG9901241100",
    msicCode: "56101",
    phone: "011-3312 0900",
    email: "hello@kopibukit.test",
    address: "Dynaton Bukit Angin",
    postCode: "28000",
    city: "Temerloh",
    state: "Pahang",
    businessActivityDesc: "Cafe and beverage service",
    status: "Lead",
    ownerId: "u-elise",
  }),
];

const seedNetworkLinks = [
  { id: "net-1", initiatorCompanyId: "co-ksl", targetCompanyId: "co-greenden", linkedCustomerId: "cus-skyline", status: "Pending", isActive: true, isDeleted: false, createdAt: "2026-06-10T08:00:00.000Z", updatedAt: null, rowVersion: 1 },
  { id: "net-2", initiatorCompanyId: "co-ksl", targetCompanyId: "co-supaprintz", linkedCustomerId: "cus-kopi", status: "Accepted", isActive: true, isDeleted: false, createdAt: "2026-06-12T08:00:00.000Z", updatedAt: "2026-06-14T08:00:00.000Z", rowVersion: 2 },
];

const initialState = {
  users: seedUsers,
  companies: seedCompanies,
  companyUsers: seedCompanyUsers,
  customers: seedCustomers,
  networkLinks: seedNetworkLinks,
  auditLog: [
    auditSeed("System seed created", "Workspace demo initialized", "u-elise"),
    auditSeed("Customer updated", "Aurora Retail LHDN profile verified", "u-elise"),
  ],
  session: null,
};

const modules = [
  { id: "dashboard", label: "Dashboard", icon: "grid" },
  { id: "customers", label: "Customers", icon: "users" },
  { id: "einvoice", label: "e-Invoice", icon: "shield" },
  { id: "network", label: "B2B Network", icon: "link" },
  { id: "audit", label: "Audit Log", icon: "clock" },
];

const requiredCustomerFields = [
  "registeredName",
  "tin",
  "brn",
  "msicCode",
  "businessActivityDesc",
  "phone",
  "email",
  "address",
  "postCode",
  "city",
  "state",
  "country",
];

function customerSeed(overrides) {
  return {
    category: "Business",
    isLocal: true,
    sstRegNo: "",
    tourismTaxRegNo: "",
    prevGSTRegNo: "",
    country: "MALAYSIA",
    isActive: true,
    isDeleted: false,
    deletedAt: null,
    createdBy: "u-elise",
    createdAt: "2026-06-09T08:00:00.000Z",
    updatedBy: "u-elise",
    updatedAt: "2026-06-25T10:00:00.000Z",
    rowVersion: 1,
    ...overrides,
  };
}

function auditSeed(action, detail, userId) {
  return {
    id: `audit-${action.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
    action,
    detail,
    userId,
    at: "2026-06-30T09:00:00.000Z",
  };
}

function cloneInitialState() {
  return JSON.parse(JSON.stringify(initialState));
}

function uid(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function nowIso() {
  return new Date().toISOString();
}

function formatDateTime(value) {
  if (!value) return "-";
  try {
    return new Intl.DateTimeFormat("en-MY", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kuala_Lumpur",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function getUserName(users, userId) {
  return users.find((user) => user.id === userId)?.displayName || "System";
}

function getCompanyName(companies, companyId) {
  const company = companies.find((item) => item.id === companyId);
  return company?.tradeName || company?.registeredName || "Unknown company";
}

function statusClass(status) {
  return `erp-status erp-status--${String(status || "").toLowerCase()}`;
}

function validateCustomer(customer, allCustomers, currentId) {
  const errors = {};
  requiredCustomerFields.forEach((field) => {
    if (!String(customer[field] || "").trim()) {
      errors[field] = "Required";
    }
  });

  if (customer.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
    errors.email = "Invalid email";
  }

  if (customer.tin && !/^[A-Z0-9-]{6,18}$/i.test(customer.tin)) {
    errors.tin = "TIN format looks invalid";
  }

  if (customer.brn && allCustomers.some((item) => item.id !== currentId && !item.isDeleted && item.brn === customer.brn)) {
    errors.brn = "BRN already exists";
  }

  if (customer.tin && allCustomers.some((item) => item.id !== currentId && !item.isDeleted && item.tin === customer.tin)) {
    errors.tin = "TIN already exists";
  }

  return errors;
}

function getReadinessScore(customer) {
  const filled = requiredCustomerFields.filter((field) => String(customer[field] || "").trim()).length;
  return Math.round((filled / requiredCustomerFields.length) * 100);
}

function Icon({ name, size = 18 }) {
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
    plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
    edit: <><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" /></>,
    trash: <><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="m19 6-1 14H6L5 6" /><path d="M10 11v5" /><path d="M14 11v5" /></>,
    restore: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></>,
  };

  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {paths[name] || paths.grid}
    </svg>
  );
}

function usePersistentErpState() {
  const [erp, setErp] = useState(() => cloneInitialState());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setErp({ ...cloneInitialState(), ...JSON.parse(saved) });
      }
    } catch {
      setErp(cloneInitialState());
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(erp));
  }, [erp, hydrated]);

  return [erp, setErp, hydrated];
}

function pushAudit(state, userId, action, detail) {
  return {
    ...state,
    auditLog: [
      {
        id: uid("audit"),
        action,
        detail,
        userId,
        at: nowIso(),
      },
      ...(state.auditLog || []),
    ].slice(0, 80),
  };
}

function AuthScreen({ erp, setErp }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("elise@ksleow.com.my");
  const [displayName, setDisplayName] = useState("Elise Tan");
  const [error, setError] = useState("");

  const signIn = (provider) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Please enter a valid email.");
      return;
    }

    setErp((state) => {
      let next = { ...state };
      let user = next.users.find((item) => item.email.toLowerCase() === normalizedEmail);

      if (!user) {
        user = {
          id: uid("u"),
          email: normalizedEmail,
          displayName: displayName.trim() || normalizedEmail.split("@")[0],
          authStatus: provider === "Email" ? "Pending" : "Verified",
          passwordHash: provider === "Email" ? "demo-password-hash" : null,
        };
        next = {
          ...next,
          users: [...next.users, user],
          companyUsers: [
            ...next.companyUsers,
            { id: uid("cu"), companyId: "co-ksl", userId: user.id, role: "Admin", isActive: true, joinedAt: nowIso() },
          ],
        };
      }

      next = { ...next, session: { userId: user.id, provider, signedInAt: nowIso() } };
      return pushAudit(next, user.id, `${provider} sign-in`, `${user.displayName} opened the ERP workspace`);
    });
  };

  return (
    <main id="page-multi-tenant-erp-demo" className="erp-system-page erp-auth-screen">
      <section className="erp-auth-shell">
        <div className="erp-auth-copy">
          <div className="ks-eyebrow">KSL ERP System</div>
          <h1>Sign in to your multi-tenant ERP workspace.</h1>
          <p>
            Use the seeded account below, Google, Microsoft, or create a new email user.
            The demo persists users, customers, audit logs, and tenant state in this browser.
          </p>
          <div className="erp-auth-proof">
            <span><Icon name="shield" /> LHDN profile checks</span>
            <span><Icon name="users" /> CRM records</span>
            <span><Icon name="link" /> B2B network links</span>
          </div>
        </div>

        <div className="erp-login-panel">
          <div className="erp-auth-tabs" aria-label="Authentication mode">
            <button type="button" className={mode === "login" ? "is-active" : ""} onClick={() => setMode("login")}>Login</button>
            <button type="button" className={mode === "register" ? "is-active" : ""} onClick={() => setMode("register")}>Register</button>
          </div>

          <button type="button" className="erp-sso-button" onClick={() => signIn("Google")}>
            <Icon name="google" /> Continue with Google
          </button>
          <button type="button" className="erp-sso-button" onClick={() => signIn("Microsoft")}>
            <Icon name="microsoft" /> Continue with Microsoft
          </button>

          <div className="erp-divider-text">or use email</div>

          <label className="ks-control-label" htmlFor="erp-auth-email">Email</label>
          <input
            id="erp-auth-email"
            className="ks-field"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder="name@company.com"
          />

          {mode === "register" && (
            <>
              <label className="ks-control-label" htmlFor="erp-auth-name">Display name</label>
              <input
                id="erp-auth-name"
                className="ks-field"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                type="text"
                placeholder="Jane Lee"
              />
            </>
          )}

          {error && <p className="erp-form-error">{error}</p>}
          <button type="button" className="ks-btn ks-btn-brand ks-btn-block" onClick={() => signIn("Email")}>
            <Icon name="mail" /> {mode === "login" ? "Sign in with email" : "Create email user"}
          </button>

          <p className="ks-note-text">
            Demo account: elise@ksleow.com.my. No password is required because this is a frontend-only ERP prototype.
          </p>
        </div>
      </section>
      <ErpStyles />
    </main>
  );
}

export function CRMCustomerListView({
  rows,
  users,
  canWrite,
  onEdit,
  onDelete,
  onRestore,
  showDeleted,
  setShowDeleted,
}) {
  const [query, setQuery] = useState("");
  const filteredRows = useMemo(() => {
    const text = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (!showDeleted && row.isDeleted) return false;
      if (!text) return true;
      return [row.registeredName, row.tradeName, row.brn, row.tin, row.phone, row.status, row.city, row.email]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(text));
    });
  }, [query, rows, showDeleted]);

  return (
    <section className="erp-card erp-crm-panel" aria-labelledby="crm-title">
      <div className="erp-card-toolbar">
        <div>
          <span className="erp-mini-label">CRM</span>
          <h2 id="crm-title">Customers</h2>
          <p>Tenant-isolated customer master data for CRM and e-Invoice workflows.</p>
        </div>
        <div className="erp-toolbar-actions">
          <label className="erp-search-field">
            <Icon name="search" />
            <span className="sr-only">Search customers</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, BRN, TIN..." />
          </label>
          <label className="erp-switch">
            <input type="checkbox" checked={showDeleted} onChange={(event) => setShowDeleted(event.target.checked)} />
            <span>Show deleted</span>
          </label>
        </div>
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((customer) => (
              <tr key={customer.id} className={customer.isDeleted ? "is-deleted" : ""}>
                <td>
                  <strong>{customer.registeredName}</strong>
                  <span>{customer.tradeName || "-"} / Owner: {getUserName(users, customer.ownerId)} / Row v{customer.rowVersion}</span>
                </td>
                <td>{customer.brn}</td>
                <td>{customer.tin}</td>
                <td>{customer.phone}</td>
                <td><span className={statusClass(customer.status)}>{customer.isDeleted ? "Deleted" : customer.status}</span></td>
                <td>
                  <div className="erp-row-actions">
                    <button type="button" onClick={() => onEdit(customer)} disabled={!canWrite || customer.isDeleted}>
                      <Icon name="edit" size={15} /> Edit
                    </button>
                    {customer.isDeleted ? (
                      <button type="button" onClick={() => onRestore(customer)} disabled={!canWrite}>
                        <Icon name="restore" size={15} /> Restore
                      </button>
                    ) : (
                      <button type="button" onClick={() => onDelete(customer)} disabled={!canWrite}>
                        <Icon name="trash" size={15} /> Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="erp-customer-cards">
        {filteredRows.map((customer) => (
          <article className={`erp-customer-card${customer.isDeleted ? " is-deleted" : ""}`} key={`card-${customer.id}`}>
            <div className="erp-customer-card-head">
              <span className={statusClass(customer.status)}>{customer.isDeleted ? "Deleted" : customer.status}</span>
              <strong>v{customer.rowVersion}</strong>
            </div>
            <h3>{customer.registeredName}</h3>
            <p>{customer.tradeName || "-"} / {customer.city}, {customer.state}</p>
            <dl>
              <div><dt>BRN</dt><dd>{customer.brn}</dd></div>
              <div><dt>TIN</dt><dd>{customer.tin}</dd></div>
              <div><dt>Phone</dt><dd>{customer.phone}</dd></div>
              <div><dt>Owner</dt><dd>{getUserName(users, customer.ownerId)}</dd></div>
            </dl>
            <div className="erp-row-actions">
              <button type="button" onClick={() => onEdit(customer)} disabled={!canWrite || customer.isDeleted}>
                <Icon name="edit" size={15} /> Edit
              </button>
              {customer.isDeleted ? (
                <button type="button" onClick={() => onRestore(customer)} disabled={!canWrite}>
                  <Icon name="restore" size={15} /> Restore
                </button>
              ) : (
                <button type="button" onClick={() => onDelete(customer)} disabled={!canWrite}>
                  <Icon name="trash" size={15} /> Delete
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function CustomerFormModal({ customer, users, activeCompany, allCustomers, onClose, onSave }) {
  const isEdit = Boolean(customer?.id);
  const [form, setForm] = useState(() => ({
    category: "Business",
    isLocal: true,
    tin: "",
    brn: "",
    msicCode: "",
    sstRegNo: "",
    businessActivityDesc: "",
    tourismTaxRegNo: "",
    prevGSTRegNo: "",
    registeredName: "",
    tradeName: "",
    phone: "",
    email: "",
    address: "",
    postCode: "",
    city: "",
    state: "",
    country: "MALAYSIA",
    status: "Lead",
    ownerId: users[0]?.id || "",
    ...customer,
  }));
  const [errors, setErrors] = useState({});

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const submit = (event) => {
    event.preventDefault();
    const nextErrors = validateCustomer(form, allCustomers, customer?.id);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onSave(form);
  };

  const field = (name, label, type = "text") => (
    <label className="erp-form-field">
      <span>{label}</span>
      <input
        value={form[name] || ""}
        type={type}
        onChange={(event) => setField(name, event.target.value)}
        aria-invalid={Boolean(errors[name])}
      />
      {errors[name] && <em>{errors[name]}</em>}
    </label>
  );

  return (
    <div className="erp-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="customer-form-title">
      <form className="erp-customer-modal" onSubmit={submit}>
        <div className="erp-modal-head">
          <div>
            <span className="erp-mini-label">{activeCompany.tradeName || activeCompany.registeredName}</span>
            <h2 id="customer-form-title">{isEdit ? "Edit customer" : "New customer"}</h2>
          </div>
          <button type="button" className="erp-icon-button" onClick={onClose} aria-label="Close">x</button>
        </div>

        <div className="erp-form-grid">
          {field("registeredName", "Registered Name")}
          {field("tradeName", "Trade Name")}
          {field("brn", "BRN")}
          {field("tin", "TIN")}
          {field("msicCode", "MSIC Code")}
          {field("businessActivityDesc", "Business Activity")}
          {field("phone", "Phone")}
          {field("email", "Email", "email")}
          {field("address", "Address")}
          {field("postCode", "Post Code")}
          {field("city", "City")}
          {field("state", "State")}
          <label className="erp-form-field">
            <span>Country</span>
            <input value={form.country || "MALAYSIA"} onChange={(event) => setField("country", event.target.value)} />
            {errors.country && <em>{errors.country}</em>}
          </label>
          <label className="erp-form-field">
            <span>Status</span>
            <select value={form.status} onChange={(event) => setField("status", event.target.value)}>
              <option>Lead</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </label>
          <label className="erp-form-field">
            <span>Owner</span>
            <select value={form.ownerId} onChange={(event) => setField("ownerId", event.target.value)}>
              {users.map((user) => <option value={user.id} key={user.id}>{user.displayName}</option>)}
            </select>
          </label>
        </div>

        <div className="erp-readiness-strip">
          <strong>{getReadinessScore(form)}%</strong>
          <span>LHDN customer profile readiness</span>
        </div>

        <div className="erp-modal-actions">
          <button type="button" className="ks-btn ks-btn-muted" onClick={onClose}>Cancel</button>
          <button type="submit" className="ks-btn ks-btn-brand">{isEdit ? "Save changes" : "Create customer"}</button>
        </div>
      </form>
    </div>
  );
}

function DashboardPanel({ activeCompany, customers, networkLinks }) {
  const liveCustomers = customers.filter((item) => !item.isDeleted);
  const activeCustomers = liveCustomers.filter((item) => item.status === "Active");
  const readiness = liveCustomers.length
    ? Math.round(liveCustomers.reduce((sum, item) => sum + getReadinessScore(item), 0) / liveCustomers.length)
    : 0;

  return (
    <div className="erp-dashboard-grid">
      <section className="erp-card erp-company-summary">
        <span className="erp-mini-label">Active tenant</span>
        <h2>{activeCompany.registeredName}</h2>
        <p>{activeCompany.businessActivityDesc}</p>
        <div className="erp-tax-grid">
          <span><strong>TIN</strong>{activeCompany.tin}</span>
          <span><strong>BRN</strong>{activeCompany.brn}</span>
          <span><strong>MSIC</strong>{activeCompany.msicCode}</span>
          <span><strong>City</strong>{activeCompany.city}</span>
        </div>
      </section>

      <section className="erp-metric-grid">
        <article><Icon name="users" /><strong>{liveCustomers.length}</strong><span>Customers</span></article>
        <article><Icon name="shield" /><strong>{readiness}%</strong><span>LHDN readiness</span></article>
        <article><Icon name="link" /><strong>{networkLinks.length}</strong><span>B2B links</span></article>
        <article><Icon name="clock" /><strong>{activeCustomers.length}</strong><span>Active accounts</span></article>
      </section>
    </div>
  );
}

function EInvoicePanel({ customers }) {
  const liveCustomers = customers.filter((item) => !item.isDeleted);
  return (
    <section className="erp-card">
      <div className="erp-card-toolbar">
        <div>
          <span className="erp-mini-label">LHDN e-Invoice</span>
          <h2>Customer profile readiness</h2>
          <p>Every customer record mirrors the Company tax profile for clean B2B mapping.</p>
        </div>
      </div>
      <div className="erp-readiness-list">
        {liveCustomers.map((customer) => {
          const score = getReadinessScore(customer);
          const missing = requiredCustomerFields.filter((field) => !String(customer[field] || "").trim());
          return (
            <article key={customer.id}>
              <div>
                <strong>{customer.registeredName}</strong>
                <span>{customer.tin} / {customer.brn}</span>
              </div>
              <div className="erp-readiness-meter" style={{ "--score": `${score}%` }}>
                <span />
              </div>
              <em>{score}% ready{missing.length ? ` / Missing ${missing.join(", ")}` : " / Complete"}</em>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function NetworkPanel({ erp, activeCompany, currentUser, setErp }) {
  const links = erp.networkLinks.filter((link) => (
    link.initiatorCompanyId === activeCompany.id || link.targetCompanyId === activeCompany.id
  ));

  const updateLink = (link, status) => {
    setErp((state) => {
      const next = {
        ...state,
        networkLinks: state.networkLinks.map((item) => item.id === link.id
          ? { ...item, status, updatedAt: nowIso(), rowVersion: (item.rowVersion || 1) + 1 }
          : item
        ),
      };
      return pushAudit(next, currentUser.id, "B2B link updated", `${link.id} changed to ${status}`);
    });
  };

  return (
    <section className="erp-card">
      <div className="erp-card-toolbar">
        <div>
          <span className="erp-mini-label">Cross-tenant handshake</span>
          <h2>B2B network links</h2>
          <p>Accept or reject company-to-company links without exposing data across tenants.</p>
        </div>
      </div>
      <div className="erp-network-list">
        {links.map((link) => (
          <article key={link.id}>
            <div>
              <strong>{getCompanyName(erp.companies, link.initiatorCompanyId)} -> {getCompanyName(erp.companies, link.targetCompanyId)}</strong>
              <span>Linked customer: {erp.customers.find((item) => item.id === link.linkedCustomerId)?.registeredName || "Not found"}</span>
            </div>
            <span className={statusClass(link.status)}>{link.status}</span>
            <div className="erp-row-actions">
              <button type="button" onClick={() => updateLink(link, "Accepted")}><Icon name="shield" size={15} /> Accept</button>
              <button type="button" onClick={() => updateLink(link, "Rejected")}><Icon name="trash" size={15} /> Reject</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function AuditPanel({ erp }) {
  return (
    <section className="erp-card">
      <div className="erp-card-toolbar">
        <div>
          <span className="erp-mini-label">AuditableEntity</span>
          <h2>Audit log</h2>
          <p>Actions are tracked with user, timestamp, and row version updates.</p>
        </div>
      </div>
      <div className="erp-audit-list">
        {erp.auditLog.map((item) => (
          <article key={item.id}>
            <span>{formatDateTime(item.at)}</span>
            <strong>{item.action}</strong>
            <p>{item.detail}</p>
            <em>{getUserName(erp.users, item.userId)}</em>
          </article>
        ))}
      </div>
    </section>
  );
}

export function MultiTenantDashboardShell({ erp, setErp, hydrated }) {
  const currentUser = erp.users.find((user) => user.id === erp.session?.userId) || erp.users[0];
  const memberships = erp.companyUsers.filter((item) => item.userId === currentUser.id && item.isActive);
  const [activeCompanyId, setActiveCompanyId] = useState(memberships[0]?.companyId || erp.companies[0]?.id);
  const [activeModule, setActiveModule] = useState("dashboard");
  const [tenantOpen, setTenantOpen] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isCustomerModalOpen, setCustomerModalOpen] = useState(false);

  const activeCompany = erp.companies.find((company) => company.id === activeCompanyId) || erp.companies[0];
  const activeMembership = erp.companyUsers.find((item) => item.companyId === activeCompany.id && item.userId === currentUser.id);
  const canWrite = activeMembership?.role === "Admin" || activeMembership?.role === "Standard";
  const tenantCustomers = erp.customers.filter((customer) => customer.companyId === activeCompany.id);
  const tenantNetworkLinks = erp.networkLinks.filter((link) => (
    link.initiatorCompanyId === activeCompany.id || link.targetCompanyId === activeCompany.id
  ));

  const openNewCustomer = () => {
    setEditingCustomer(null);
    setCustomerModalOpen(true);
  };

  const saveCustomer = (form) => {
    setErp((state) => {
      const isEdit = Boolean(form.id);
      const base = {
        ...form,
        companyId: activeCompany.id,
        isLocal: Boolean(form.isLocal),
        isActive: form.isActive ?? true,
        isDeleted: false,
        deletedAt: null,
        updatedBy: currentUser.id,
        updatedAt: nowIso(),
        rowVersion: (form.rowVersion || 0) + 1,
      };
      const next = isEdit
        ? { ...state, customers: state.customers.map((item) => item.id === form.id ? base : item) }
        : {
          ...state,
          customers: [
            ...state.customers,
            {
              ...base,
              id: uid("cus"),
              createdBy: currentUser.id,
              createdAt: nowIso(),
              rowVersion: 1,
            },
          ],
        };
      return pushAudit(next, currentUser.id, isEdit ? "Customer updated" : "Customer created", base.registeredName);
    });
    setCustomerModalOpen(false);
    setEditingCustomer(null);
  };

  const softDeleteCustomer = (customer) => {
    setErp((state) => {
      const next = {
        ...state,
        customers: state.customers.map((item) => item.id === customer.id
          ? { ...item, isDeleted: true, deletedAt: nowIso(), updatedBy: currentUser.id, updatedAt: nowIso(), rowVersion: (item.rowVersion || 1) + 1 }
          : item
        ),
      };
      return pushAudit(next, currentUser.id, "Customer soft deleted", customer.registeredName);
    });
  };

  const restoreCustomer = (customer) => {
    setErp((state) => {
      const next = {
        ...state,
        customers: state.customers.map((item) => item.id === customer.id
          ? { ...item, isDeleted: false, deletedAt: null, updatedBy: currentUser.id, updatedAt: nowIso(), rowVersion: (item.rowVersion || 1) + 1 }
          : item
        ),
      };
      return pushAudit(next, currentUser.id, "Customer restored", customer.registeredName);
    });
  };

  const logout = () => {
    setErp((state) => pushAudit({ ...state, session: null }, currentUser.id, "User signed out", currentUser.email));
  };

  const resetDemo = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    setErp(cloneInitialState());
  };

  return (
    <main id="page-multi-tenant-erp-demo" className="erp-system-page">
      <div className="erp-system-shell" aria-busy={!hydrated}>
        <header className="erp-system-topbar">
          <div className="erp-brand-lockup">
            <span className="erp-brand-mark">KS</span>
            <div>
              <strong>KSL ERP</strong>
              <span>Multi-tenant CRM and e-Invoice workspace</span>
            </div>
          </div>

          <div className="erp-tenant-switcher">
            <button type="button" className="erp-tenant-button" onClick={() => setTenantOpen((open) => !open)} aria-expanded={tenantOpen}>
              <span>
                <small>Active workspace</small>
                {activeCompany.tradeName || activeCompany.registeredName}
              </span>
              <Icon name="chevron" />
            </button>
            {tenantOpen && (
              <div className="erp-tenant-menu">
                {memberships.map((membership) => {
                  const company = erp.companies.find((item) => item.id === membership.companyId);
                  if (!company) return null;
                  return (
                    <button
                      type="button"
                      key={membership.id}
                      className={company.id === activeCompany.id ? "is-active" : ""}
                      onClick={() => {
                        setActiveCompanyId(company.id);
                        setTenantOpen(false);
                      }}
                    >
                      <strong>{company.tradeName || company.registeredName}</strong>
                      <span>{membership.role} / {company.brn}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="erp-user-chip">
            <span>{currentUser.displayName.slice(0, 1)}</span>
            <div>
              <strong>{currentUser.displayName}</strong>
              <small>{activeMembership?.role || "No role"}</small>
            </div>
            <button type="button" onClick={logout} aria-label="Sign out"><Icon name="logout" size={16} /></button>
          </div>
        </header>

        <div className="erp-system-body">
          <aside className="erp-side-nav" aria-label="ERP modules">
            {modules.map((module) => (
              <button
                type="button"
                key={module.id}
                className={activeModule === module.id ? "is-active" : ""}
                onClick={() => setActiveModule(module.id)}
              >
                <Icon name={module.icon} />
                <span>{module.label}</span>
              </button>
            ))}
          </aside>

          <section className="erp-workspace">
            <div className="erp-workspace-head">
              <div>
                <span className="erp-mini-label">Live frontend ERP prototype</span>
                <h1>{modules.find((module) => module.id === activeModule)?.label}</h1>
                <p>{canWrite ? "You can add, edit, soft-delete, restore, and validate customer records." : "This workspace is read-only for your role."}</p>
              </div>
              <div className="erp-workspace-actions">
                <button type="button" className="ks-btn ks-btn-primary" onClick={openNewCustomer} disabled={!canWrite}>
                  <Icon name="plus" /> New customer
                </button>
                <button type="button" className="ks-btn ks-btn-muted" onClick={resetDemo}>Reset demo data</button>
              </div>
            </div>

            {activeModule === "dashboard" && (
              <DashboardPanel activeCompany={activeCompany} customers={tenantCustomers} networkLinks={tenantNetworkLinks} />
            )}
            {activeModule === "customers" && (
              <CRMCustomerListView
                rows={tenantCustomers}
                users={erp.users}
                canWrite={canWrite}
                onEdit={(customer) => {
                  setEditingCustomer(customer);
                  setCustomerModalOpen(true);
                }}
                onDelete={softDeleteCustomer}
                onRestore={restoreCustomer}
                showDeleted={showDeleted}
                setShowDeleted={setShowDeleted}
              />
            )}
            {activeModule === "einvoice" && <EInvoicePanel customers={tenantCustomers} />}
            {activeModule === "network" && <NetworkPanel erp={erp} activeCompany={activeCompany} currentUser={currentUser} setErp={setErp} />}
            {activeModule === "audit" && <AuditPanel erp={erp} />}
          </section>
        </div>
      </div>

      {isCustomerModalOpen && (
        <CustomerFormModal
          customer={editingCustomer}
          users={erp.users}
          activeCompany={activeCompany}
          allCustomers={erp.customers}
          onClose={() => {
            setCustomerModalOpen(false);
            setEditingCustomer(null);
          }}
          onSave={saveCustomer}
        />
      )}
      <ErpStyles />
    </main>
  );
}

export default function MultiTenantErpDemoPage() {
  const [erp, setErp, hydrated] = usePersistentErpState();
  if (!erp.session) return <AuthScreen erp={erp} setErp={setErp} />;
  return <MultiTenantDashboardShell erp={erp} setErp={setErp} hydrated={hydrated} />;
}

function ErpStyles() {
  return (
    <style>{`
      #page-multi-tenant-erp-demo {
        --erp-navy: #1d1b4f;
        --erp-ink: #2f315a;
        --erp-gold: #c9a84c;
        --erp-bg: #f4f3ef;
        --erp-panel: #ffffff;
        --erp-line: rgba(47,49,90,0.12);
        min-height: 100vh;
        background:
          radial-gradient(circle at 12% 4%, rgba(201,168,76,0.14), transparent 24rem),
          linear-gradient(180deg, #10122c 0, #191a42 20rem, #f5f4ef 20rem, #f7f7fb 100%);
        color: var(--erp-ink);
      }

      .erp-system-shell,
      .erp-auth-shell {
        width: min(1680px, calc(100% - clamp(1rem, 4vw, 4rem)));
        margin: 0 auto;
      }

      .erp-system-shell {
        min-height: calc(100vh - 3rem);
        padding: clamp(1rem, 2vw, 1.5rem) 0;
      }

      .erp-system-topbar {
        position: sticky;
        top: 1rem;
        z-index: 20;
        display: grid;
        grid-template-columns: minmax(220px, 0.85fr) minmax(280px, 0.8fr) auto;
        gap: 1rem;
        align-items: center;
        padding: 0.85rem;
        border: 1px solid rgba(255,255,255,0.18);
        border-radius: 28px;
        background: rgba(29, 27, 79, 0.88);
        color: #ffffff;
        box-shadow: 0 24px 70px rgba(17,18,45,0.22);
        backdrop-filter: blur(20px) saturate(1.5);
      }

      .erp-brand-lockup,
      .erp-user-chip {
        display: flex;
        align-items: center;
        min-width: 0;
        gap: 0.8rem;
      }

      .erp-brand-mark,
      .erp-user-chip > span {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
        width: 44px;
        height: 44px;
        border-radius: 16px;
        background: linear-gradient(135deg, #dcb954, #a17b22);
        color: #1d1b4f;
        font-weight: 900;
        letter-spacing: -0.04em;
        box-shadow: 0 14px 32px rgba(201,168,76,0.26);
      }

      .erp-brand-lockup strong,
      .erp-brand-lockup span,
      .erp-user-chip strong,
      .erp-user-chip small {
        display: block;
      }

      .erp-brand-lockup span,
      .erp-user-chip small {
        color: rgba(255,255,255,0.6);
        font-size: 0.8rem;
      }

      .erp-tenant-switcher {
        position: relative;
        min-width: 0;
      }

      .erp-tenant-button {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        min-height: 52px;
        padding: 0.55rem 0.9rem;
        border: 1px solid rgba(255,255,255,0.16);
        border-radius: 18px;
        background: rgba(255,255,255,0.08);
        color: #ffffff;
        font: inherit;
        text-align: left;
        cursor: pointer;
      }

      .erp-tenant-button small {
        display: block;
        margin-bottom: 0.08rem;
        color: rgba(255,255,255,0.54);
        font-size: 0.66rem;
        font-weight: 850;
        letter-spacing: 0.1em;
        text-transform: uppercase;
      }

      .erp-tenant-menu {
        position: absolute;
        top: calc(100% + 0.65rem);
        right: 0;
        width: min(380px, 88vw);
        padding: 0.45rem;
        border: 1px solid rgba(47,49,90,0.12);
        border-radius: 20px;
        background: rgba(255,255,255,0.94);
        box-shadow: 0 24px 60px rgba(17,18,45,0.24);
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
        background: rgba(47,49,90,0.07);
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

      .erp-user-chip {
        justify-self: end;
      }

      .erp-user-chip button,
      .erp-icon-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 38px;
        height: 38px;
        border: 1px solid rgba(255,255,255,0.14);
        border-radius: 999px;
        background: rgba(255,255,255,0.08);
        color: inherit;
        cursor: pointer;
      }

      .erp-system-body {
        display: grid;
        grid-template-columns: 220px minmax(0, 1fr);
        gap: 1rem;
        margin-top: 1rem;
        align-items: start;
      }

      .erp-side-nav {
        position: sticky;
        top: 7.2rem;
        display: grid;
        gap: 0.45rem;
        padding: 0.7rem;
        border: 1px solid rgba(47,49,90,0.1);
        border-radius: 24px;
        background: rgba(255,255,255,0.82);
        box-shadow: 0 20px 60px rgba(47,49,90,0.08);
        backdrop-filter: blur(16px);
      }

      .erp-side-nav button {
        display: flex;
        align-items: center;
        gap: 0.65rem;
        min-height: 46px;
        padding: 0 0.85rem;
        border: 0;
        border-radius: 16px;
        background: transparent;
        color: #676b8d;
        font: inherit;
        font-weight: 800;
        cursor: pointer;
      }

      .erp-side-nav button.is-active {
        background: var(--erp-navy);
        color: #ffffff;
        box-shadow: 0 14px 34px rgba(47,49,90,0.16);
      }

      .erp-workspace {
        min-width: 0;
        display: grid;
        gap: 1rem;
      }

      .erp-workspace-head {
        display: flex;
        align-items: end;
        justify-content: space-between;
        gap: 1rem;
        padding: clamp(1rem, 2vw, 1.35rem);
        border: 1px solid rgba(47,49,90,0.1);
        border-radius: 28px;
        background: rgba(255,255,255,0.88);
      }

      .erp-workspace-head h1,
      .erp-card h2 {
        margin: 0.15rem 0 0.35rem;
        color: var(--erp-ink);
        line-height: 1.1;
      }

      .erp-workspace-head p,
      .erp-card p {
        margin: 0;
        color: #74789a;
        line-height: 1.6;
      }

      .erp-workspace-actions,
      .erp-toolbar-actions,
      .erp-row-actions,
      .erp-modal-actions {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 0.6rem;
      }

      .erp-card {
        min-width: 0;
        padding: clamp(1rem, 2vw, 1.35rem);
        border: 1px solid rgba(47,49,90,0.1);
        border-radius: 26px;
        background: #ffffff;
        box-shadow: 0 20px 60px rgba(47,49,90,0.07);
      }

      .erp-dashboard-grid {
        display: grid;
        grid-template-columns: minmax(0, 1.05fr) minmax(320px, 0.95fr);
        gap: 1rem;
      }

      .erp-company-summary {
        background:
          radial-gradient(circle at 100% 0%, rgba(201,168,76,0.22), transparent 18rem),
          linear-gradient(135deg, rgba(47,49,90,0.98), rgba(29,27,79,0.92));
        color: #ffffff;
      }

      .erp-company-summary h2,
      .erp-company-summary p {
        color: #ffffff;
      }

      .erp-company-summary p {
        color: rgba(255,255,255,0.68);
      }

      .erp-mini-label {
        color: var(--erp-gold);
        font-size: 0.72rem;
        font-weight: 850;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }

      .erp-tax-grid,
      .erp-metric-grid {
        display: grid;
        gap: 0.8rem;
      }

      .erp-tax-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        margin-top: 1.1rem;
      }

      .erp-tax-grid span,
      .erp-metric-grid article {
        min-width: 0;
        padding: 0.9rem;
        border-radius: 18px;
      }

      .erp-tax-grid span {
        background: rgba(255,255,255,0.09);
        color: rgba(255,255,255,0.86);
        overflow-wrap: anywhere;
      }

      .erp-tax-grid strong {
        display: block;
        margin-bottom: 0.25rem;
        color: rgba(255,255,255,0.48);
        font-size: 0.64rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
      }

      .erp-metric-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .erp-metric-grid article {
        display: grid;
        gap: 0.25rem;
        border: 1px solid rgba(47,49,90,0.08);
        background: #ffffff;
      }

      .erp-metric-grid svg {
        color: var(--erp-gold);
      }

      .erp-metric-grid strong {
        color: var(--erp-ink);
        font-size: clamp(1.6rem, 3vw, 2.2rem);
        line-height: 1;
      }

      .erp-metric-grid span {
        color: #777a9a;
        font-size: 0.84rem;
        font-weight: 700;
      }

      .erp-card-toolbar {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .erp-search-field {
        display: flex;
        align-items: center;
        gap: 0.55rem;
        min-width: min(330px, 100%);
        min-height: 42px;
        padding: 0 0.8rem;
        border: 1px solid rgba(47,49,90,0.12);
        border-radius: 999px;
        background: #fbfbfd;
        color: #8c8faa;
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

      .erp-switch {
        display: flex;
        align-items: center;
        min-height: 42px;
        gap: 0.45rem;
        color: #6e7194;
        font-size: 0.86rem;
        font-weight: 750;
      }

      .erp-table-wrap {
        overflow-x: auto;
        border: 1px solid rgba(47,49,90,0.08);
        border-radius: 18px;
      }

      .erp-crm-table {
        width: 100%;
        min-width: 900px;
        border-collapse: collapse;
      }

      .erp-crm-table th,
      .erp-crm-table td {
        padding: 0.9rem 1rem;
        border-bottom: 1px solid rgba(47,49,90,0.08);
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
      .erp-crm-table td span:not(.erp-status) {
        display: block;
      }

      .erp-crm-table td span:not(.erp-status) {
        margin-top: 0.25rem;
        color: #8c8faa;
        font-size: 0.76rem;
      }

      .erp-crm-table tr.is-deleted,
      .erp-customer-card.is-deleted {
        opacity: 0.58;
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

      .erp-status--active,
      .erp-status--accepted { background: rgba(34,197,94,0.12); color: #168545; }
      .erp-status--lead,
      .erp-status--pending { background: rgba(201,168,76,0.16); color: #927022; }
      .erp-status--inactive,
      .erp-status--rejected { background: rgba(107,114,128,0.12); color: #6b7280; }

      .erp-row-actions button {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        min-height: 32px;
        padding: 0 0.65rem;
        border: 1px solid rgba(47,49,90,0.12);
        border-radius: 999px;
        background: #ffffff;
        color: var(--erp-ink);
        font: inherit;
        font-size: 0.78rem;
        font-weight: 800;
        cursor: pointer;
      }

      button:disabled {
        cursor: not-allowed !important;
        opacity: 0.48;
      }

      .erp-customer-cards {
        display: none;
        gap: 0.8rem;
      }

      .erp-customer-card {
        display: grid;
        gap: 1rem;
        padding: 1rem;
        border: 1px solid rgba(47,49,90,0.1);
        border-radius: 20px;
        background: #ffffff;
      }

      .erp-customer-card-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .erp-customer-card h3 {
        margin: 0;
        color: var(--erp-ink);
        font-size: 1rem;
        line-height: 1.25;
      }

      .erp-customer-card p {
        margin: -0.7rem 0 0;
        color: #777a9a;
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

      .erp-readiness-list,
      .erp-network-list,
      .erp-audit-list {
        display: grid;
        gap: 0.8rem;
      }

      .erp-readiness-list article,
      .erp-network-list article,
      .erp-audit-list article {
        display: grid;
        gap: 0.5rem;
        padding: 1rem;
        border: 1px solid rgba(47,49,90,0.08);
        border-radius: 18px;
        background: #fbfbfd;
      }

      .erp-network-list article {
        grid-template-columns: minmax(0, 1fr) auto auto;
        align-items: center;
      }

      .erp-readiness-list strong,
      .erp-network-list strong,
      .erp-audit-list strong {
        color: var(--erp-ink);
      }

      .erp-readiness-list span,
      .erp-network-list span,
      .erp-audit-list span,
      .erp-audit-list em {
        color: #8387a5;
        font-size: 0.82rem;
      }

      .erp-readiness-meter {
        height: 10px;
        overflow: hidden;
        border-radius: 999px;
        background: rgba(47,49,90,0.08);
      }

      .erp-readiness-meter span {
        display: block;
        width: var(--score);
        height: 100%;
        background: linear-gradient(90deg, var(--erp-gold), #22c55e);
      }

      .erp-readiness-strip {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        padding: 0.85rem 1rem;
        border-radius: 18px;
        background: rgba(201,168,76,0.12);
        color: #886b24;
      }

      .erp-readiness-strip strong {
        color: var(--erp-ink);
        font-size: 1.45rem;
      }

      .erp-auth-screen {
        display: grid;
        place-items: center;
        padding: clamp(1rem, 4vw, 3rem) 0;
      }

      .erp-auth-shell {
        display: grid;
        grid-template-columns: minmax(0, 0.95fr) minmax(340px, 0.55fr);
        gap: clamp(1.5rem, 5vw, 4rem);
        align-items: center;
      }

      .erp-auth-copy {
        color: #ffffff;
      }

      .erp-auth-copy h1 {
        max-width: 760px;
        margin: 0 0 1rem;
        color: #ffffff;
        font-size: clamp(2.6rem, 7vw, 5.8rem);
        line-height: 0.94;
      }

      .erp-auth-copy p {
        max-width: 660px;
        color: rgba(255,255,255,0.7);
        line-height: 1.75;
      }

      .erp-auth-proof {
        display: flex;
        flex-wrap: wrap;
        gap: 0.65rem;
        margin-top: 1.4rem;
      }

      .erp-auth-proof span {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        min-height: 38px;
        padding: 0 0.8rem;
        border: 1px solid rgba(255,255,255,0.16);
        border-radius: 999px;
        background: rgba(255,255,255,0.08);
      }

      .erp-login-panel,
      .erp-customer-modal {
        display: grid;
        gap: 0.8rem;
        padding: clamp(1rem, 2vw, 1.35rem);
        border: 1px solid rgba(255,255,255,0.18);
        border-radius: 28px;
        background: rgba(255,255,255,0.94);
        box-shadow: 0 24px 70px rgba(17,18,45,0.22);
        backdrop-filter: blur(18px);
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
        cursor: pointer;
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
        border: 1px solid rgba(47,49,90,0.12);
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
        background: rgba(47,49,90,0.1);
      }

      .erp-form-error,
      .erp-form-field em {
        color: #b42318;
        font-size: 0.78rem;
        font-style: normal;
      }

      .erp-modal-backdrop {
        position: fixed;
        inset: 0;
        z-index: 1300;
        display: grid;
        place-items: center;
        padding: 1rem;
        background: rgba(6,7,18,0.62);
        backdrop-filter: blur(8px);
      }

      .erp-customer-modal {
        width: min(1040px, 100%);
        max-height: min(86vh, 900px);
        overflow: auto;
      }

      .erp-modal-head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 1rem;
      }

      .erp-modal-head h2 {
        margin: 0.2rem 0 0;
        color: var(--erp-ink);
      }

      .erp-modal-head .erp-icon-button {
        color: var(--erp-ink);
        border-color: rgba(47,49,90,0.12);
        background: #ffffff;
      }

      .erp-form-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 0.85rem;
      }

      .erp-form-field {
        display: grid;
        gap: 0.35rem;
      }

      .erp-form-field span {
        color: #6c7193;
        font-size: 0.72rem;
        font-weight: 850;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .erp-form-field input,
      .erp-form-field select {
        width: 100%;
        min-height: 42px;
        border: 1px solid rgba(47,49,90,0.16);
        border-radius: 12px;
        background: #ffffff;
        color: var(--erp-ink);
        font: inherit;
        padding: 0 0.75rem;
        outline: none;
      }

      .erp-form-field input[aria-invalid="true"] {
        border-color: rgba(180,35,24,0.58);
      }

      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0,0,0,0);
        white-space: nowrap;
        border: 0;
      }

      @media (max-width: 1180px) {
        .erp-system-topbar {
          grid-template-columns: 1fr;
          position: relative;
          top: auto;
        }

        .erp-user-chip {
          justify-self: stretch;
        }

        .erp-system-body,
        .erp-auth-shell,
        .erp-dashboard-grid {
          grid-template-columns: 1fr;
        }

        .erp-side-nav {
          position: relative;
          top: auto;
          display: flex;
          overflow-x: auto;
        }

        .erp-side-nav button {
          flex: 0 0 auto;
        }

        .erp-form-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 760px) {
        #page-multi-tenant-erp-demo {
          background: linear-gradient(180deg, #10122c 0, #191a42 18rem, #f5f4ef 18rem, #f7f7fb 100%);
        }

        .erp-system-shell,
        .erp-auth-shell {
          width: min(100% - 1rem, 1680px);
        }

        .erp-system-topbar,
        .erp-workspace-head,
        .erp-card-toolbar,
        .erp-workspace-actions,
        .erp-toolbar-actions {
          align-items: stretch;
          flex-direction: column;
        }

        .erp-workspace-head,
        .erp-card,
        .erp-system-topbar {
          border-radius: 22px;
        }

        .erp-side-nav span {
          display: none;
        }

        .erp-side-nav button {
          justify-content: center;
          min-width: 48px;
          padding: 0;
        }

        .erp-table-wrap {
          display: none;
        }

        .erp-customer-cards {
          display: grid;
        }

        .erp-tax-grid,
        .erp-metric-grid,
        .erp-customer-card dl,
        .erp-form-grid,
        .erp-network-list article {
          grid-template-columns: 1fr;
        }

        .erp-auth-copy h1 {
          font-size: clamp(2.35rem, 14vw, 3.8rem);
        }

        .erp-customer-modal {
          max-height: 92vh;
        }
      }
    `}</style>
  );
}
