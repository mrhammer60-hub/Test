import { useState, useContext, createContext, useEffect, useRef } from "react";

// ─── CONTEXT ─────────────────────────────────────────────────────────────────
const AppCtx = createContext(null);
const useApp = () => useContext(AppCtx);

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK_COACHES = [
  { id: 1, name: "Ahmed Al-Rashid", email: "ahmed@coach.com", brand: "Alpha Fitness", trainees: 38, limit: 50, plan: "Growth", status: "active", revenue: "$100", joined: "Jan 2026", subdomain: "alpha-fitness" },
  { id: 2, name: "Sara Mohamed", email: "sara@coach.com", brand: "Sara Transforms", trainees: 14, limit: 20, plan: "Starter", status: "active", revenue: "$60", joined: "Feb 2026", subdomain: "sara-transforms" },
  { id: 3, name: "Khalid Hassan", email: "khalid@coach.com", brand: "Iron Will", trainees: 120, limit: 150, plan: "Pro", status: "active", revenue: "$200", joined: "Dec 2025", subdomain: "iron-will" },
  { id: 4, name: "Nour Abdullah", email: "nour@coach.com", brand: "Nour Fitness", trainees: 8, limit: 20, plan: "Starter", status: "pending", revenue: "$60", joined: "Mar 2026", subdomain: "nour-fitness" },
];

const MOCK_TRAINEES = [
  { id: 1, name: "Omar Faris", coach: "Ahmed Al-Rashid", goal: "Muscle Gain", weight: "82kg", status: "active", lastActive: "Today", plan: "Push/Pull/Legs", meals: 5 },
  { id: 2, name: "Layla Nasser", coach: "Ahmed Al-Rashid", goal: "Fat Loss", weight: "65kg", status: "active", lastActive: "Yesterday", plan: "Full Body 4x", meals: 4 },
  { id: 3, name: "Hassan Ali", coach: "Sara Mohamed", goal: "Maintenance", weight: "75kg", status: "active", lastActive: "2 days ago", plan: "Upper/Lower", meals: 5 },
  { id: 4, name: "Fatima Karim", coach: "Khalid Hassan", goal: "Muscle Gain", weight: "58kg", status: "inactive", lastActive: "1 week ago", plan: "PPL Split", meals: 6 },
];

const MOCK_EXERCISES = [
  { id: 1, name: "Bench Press", nameAr: "بنش برس", muscle: "Chest", level: "Advanced", equipment: "Barbell", sets: 4, reps: "8-10", rest: 90 },
  { id: 2, name: "Squat", nameAr: "سكوات", muscle: "Legs", level: "Beginner", equipment: "Barbell", sets: 4, reps: "6-8", rest: 120 },
  { id: 3, name: "Deadlift", nameAr: "ديدليفت", muscle: "Back", level: "Professional", equipment: "Barbell", sets: 3, reps: "5", rest: 180 },
  { id: 4, name: "Pull-ups", nameAr: "عقلة", muscle: "Back", level: "Intermediate", equipment: "Bodyweight", sets: 4, reps: "8-12", rest: 90 },
  { id: 5, name: "OHP", nameAr: "ضغط فوق الرأس", muscle: "Shoulders", level: "Advanced", equipment: "Barbell", sets: 4, reps: "8-10", rest: 90 },
  { id: 6, name: "Barbell Curl", nameAr: "كيرل بالبار", muscle: "Biceps", level: "Beginner", equipment: "Barbell", sets: 3, reps: "10-12", rest: 60 },
  { id: 7, name: "Skull Crusher", nameAr: "سكل كراشر", muscle: "Triceps", level: "Advanced", equipment: "Barbell", sets: 3, reps: "10-12", rest: 60 },
  { id: 8, name: "Plank", nameAr: "بلانك", muscle: "Core", level: "Beginner", equipment: "Bodyweight", sets: 3, reps: "60s", rest: 45 },
];

const MOCK_MESSAGES = [
  { id: 1, from: "Omar Faris", to: "Coach", text: "Coach, can I swap tomorrow's chest day to Wednesday?", time: "10:32 AM", read: true },
  { id: 2, from: "Coach", to: "Omar Faris", text: "Sure Omar! Just make sure you rest on Thursday then.", time: "10:45 AM", read: true },
  { id: 3, from: "Omar Faris", to: "Coach", text: "Perfect! Also finished today's session 💪", time: "11:15 AM", read: false },
];

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  black: "#080808", carbon: "#111111", steel: "#1a1a1a", graphite: "#242424",
  border: "#2a2a2a", muted: "#444", dim: "#888", text: "#c8c8c8", white: "#f0f0f0",
  accent: "#e8ff00", accent2: "#ff6b35", accent3: "#00d4ff",
  green: "#00e676", red: "#ff3b3b", purple: "#9b59b6",
};

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────
const Badge = ({ color = C.accent, children, style = {} }) => (
  <span style={{
    fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 4,
    background: color + "18", color, border: `1px solid ${color}40`,
    letterSpacing: 0.5, textTransform: "uppercase", ...style
  }}>{children}</span>
);

const Btn = ({ children, variant = "primary", onClick, style = {}, disabled = false }) => {
  const styles = {
    primary: { background: C.accent, color: C.black, border: "none" },
    secondary: { background: "transparent", color: C.text, border: `1px solid ${C.border}` },
    danger: { background: "transparent", color: C.red, border: `1px solid ${C.red}40` },
    ghost: { background: C.graphite, color: C.white, border: "none" },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: "9px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600,
      cursor: disabled ? "not-allowed" : "pointer", letterSpacing: 0.3,
      transition: "all 0.2s", opacity: disabled ? 0.5 : 1, fontFamily: "'DM Sans', sans-serif",
      ...styles[variant], ...style
    }}
      onMouseEnter={e => { if (!disabled) e.target.style.opacity = "0.85"; }}
      onMouseLeave={e => { if (!disabled) e.target.style.opacity = "1"; }}
    >{children}</button>
  );
};

const Card = ({ children, style = {} }) => (
  <div style={{ background: C.carbon, border: `1px solid ${C.border}`, borderRadius: 12, ...style }}>
    {children}
  </div>
);

const Input = ({ label, type = "text", value, onChange, placeholder, style = {} }) => (
  <div style={{ marginBottom: 16 }}>
    {label && <label style={{ display: "block", fontSize: 12, color: C.dim, marginBottom: 6, fontWeight: 500 }}>{label}</label>}
    <input
      type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={{
        width: "100%", padding: "10px 14px", background: C.steel, border: `1px solid ${C.border}`,
        borderRadius: 8, color: C.white, fontSize: 14, outline: "none", boxSizing: "border-box",
        fontFamily: "'DM Sans', sans-serif", ...style
      }}
      onFocus={e => e.target.style.borderColor = C.accent3}
      onBlur={e => e.target.style.borderColor = C.border}
    />
  </div>
);

const Select = ({ label, value, onChange, options, style = {} }) => (
  <div style={{ marginBottom: 16 }}>
    {label && <label style={{ display: "block", fontSize: 12, color: C.dim, marginBottom: 6, fontWeight: 500 }}>{label}</label>}
    <select value={value} onChange={onChange} style={{
      width: "100%", padding: "10px 14px", background: C.steel, border: `1px solid ${C.border}`,
      borderRadius: 8, color: C.white, fontSize: 14, outline: "none", boxSizing: "border-box",
      fontFamily: "'DM Sans', sans-serif", cursor: "pointer", ...style
    }}>
      {options.map(o => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
    </select>
  </div>
);

const Modal = ({ open, onClose, title, children, width = 520 }) => {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: C.carbon, border: `1px solid ${C.border}`, borderRadius: 16,
        width: "100%", maxWidth: width, maxHeight: "90vh", overflowY: "auto"
      }}>
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: C.white }}>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.dim, cursor: "pointer", fontSize: 20 }}>×</button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
};

const Stat = ({ label, value, color = C.accent, sub }) => (
  <Card style={{ padding: "20px 24px" }}>
    <div style={{ fontSize: 11, color: C.dim, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
    <div style={{ fontSize: 32, fontWeight: 700, color, fontFamily: "monospace" }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: C.dim, marginTop: 4 }}>{sub}</div>}
  </Card>
);

const NavItem = ({ icon, label, active, onClick, badge }) => (
  <div onClick={onClick} style={{
    display: "flex", alignItems: "center", gap: 10, padding: "10px 16px",
    borderRadius: 8, cursor: "pointer", color: active ? C.white : C.dim,
    background: active ? C.graphite : "transparent",
    border: active ? `1px solid ${C.border}` : "1px solid transparent",
    marginBottom: 2, transition: "all 0.15s", fontSize: 13, fontWeight: active ? 600 : 400
  }}
    onMouseEnter={e => { if (!active) e.currentTarget.style.background = C.steel; }}
    onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
  >
    <span style={{ fontSize: 16 }}>{icon}</span>
    <span style={{ flex: 1 }}>{label}</span>
    {badge && <span style={{ background: C.accent, color: C.black, borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>{badge}</span>}
  </div>
);

// ─── SIDEBAR LAYOUT ───────────────────────────────────────────────────────────
const SidebarLayout = ({ logo, nav, children, headerRight }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div style={{ display: "flex", height: "100vh", background: C.black, overflow: "hidden" }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? 240 : 64, background: C.carbon, borderRight: `1px solid ${C.border}`,
        display: "flex", flexDirection: "column", transition: "width 0.25s", overflow: "hidden", flexShrink: 0
      }}>
        <div style={{ padding: "16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10, height: 58 }}>
          {logo}
          {sidebarOpen && <button onClick={() => setSidebarOpen(false)} style={{ marginLeft: "auto", background: "none", border: "none", color: C.dim, cursor: "pointer", fontSize: 16 }}>‹</button>}
          {!sidebarOpen && <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", color: C.dim, cursor: "pointer", fontSize: 16 }}>›</button>}
        </div>
        <div style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
          {nav.map((item, i) => sidebarOpen
            ? <NavItem key={i} {...item} />
            : <div key={i} onClick={item.onClick} title={item.label} style={{
              padding: "10px", borderRadius: 8, cursor: "pointer", display: "flex", justifyContent: "center",
              marginBottom: 2, background: item.active ? C.graphite : "transparent", fontSize: 18
            }}>{item.icon}</div>
          )}
        </div>
      </div>
      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ height: 58, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", padding: "0 24px", gap: 16, flexShrink: 0 }}>
          <div style={{ flex: 1 }} />
          {headerRight}
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          {children}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// LOGIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function LoginPage() {
  const { login } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("login"); // login | register
  const [regData, setRegData] = useState({ name: "", email: "", password: "", confirm: "", role: "coach" });

  const accounts = {
    "admin@ironcoach.com": { role: "admin", name: "Super Admin", avatar: "👑" },
    "ahmed@coach.com": { role: "coach", name: "Ahmed Al-Rashid", brand: "Alpha Fitness", avatar: "🏋️", planType: "Growth", traineeLimit: 50 },
    "omar@trainee.com": { role: "trainee", name: "Omar Faris", coach: "Ahmed Al-Rashid", avatar: "👤" },
  };

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      const acc = accounts[email];
      if (acc && password === "password123") {
        login(acc.role, acc);
      } else {
        setError("Invalid credentials. Try: admin@ironcoach.com / ahmed@coach.com / omar@trainee.com with password123");
      }
      setLoading(false);
    }, 800);
  };

  const quickLogin = (e) => {
    setLoading(true);
    setTimeout(() => { login(accounts[e].role, accounts[e]); setLoading(false); }, 500);
  };

  return (
    <div style={{
      minHeight: "100vh", background: C.black, display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden", fontFamily: "'DM Sans', sans-serif"
    }}>
      {/* Background grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(rgba(232,255,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(232,255,0,0.03) 1px, transparent 1px)`,
        backgroundSize: "60px 60px"
      }} />
      <div style={{ position: "absolute", width: 600, height: 600, background: "radial-gradient(circle, rgba(232,255,0,0.06) 0%, transparent 70%)", top: -200, right: -200 }} />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 440, padding: "0 20px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 42, fontWeight: 900, letterSpacing: 4, color: C.white, marginBottom: 8 }}>
            IRON<span style={{ color: C.accent }}>COACH</span>
          </div>
          <p style={{ color: C.dim, fontSize: 14 }}>Professional Training Platform</p>
        </div>

        <Card style={{ padding: 32 }}>
          {/* Tabs */}
          <div style={{ display: "flex", marginBottom: 24, background: C.steel, borderRadius: 8, padding: 4 }}>
            {["login", "register"].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex: 1, padding: "8px", borderRadius: 6, border: "none", cursor: "pointer",
                background: tab === t ? C.graphite : "transparent", color: tab === t ? C.white : C.dim,
                fontSize: 13, fontWeight: 600, fontFamily: "inherit", transition: "all 0.2s"
              }}>{t === "login" ? "Sign In" : "Create Account"}</button>
            ))}
          </div>

          {tab === "login" ? (
            <>
              <Input label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" />
              <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
              {error && <div style={{ color: C.red, fontSize: 12, marginBottom: 12, padding: "8px 12px", background: `${C.red}10`, borderRadius: 6 }}>{error}</div>}
              <Btn onClick={handleLogin} disabled={loading} style={{ width: "100%", padding: "12px", fontSize: 14 }}>
                {loading ? "Signing in..." : "Sign In"}
              </Btn>
              <div style={{ textAlign: "center", marginTop: 16, color: C.dim, fontSize: 12 }}>Forgot password? <span style={{ color: C.accent3, cursor: "pointer" }}>Reset here</span></div>

              {/* Quick access */}
              <div style={{ marginTop: 24, paddingTop: 24, borderTop: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 11, color: C.dim, textAlign: "center", marginBottom: 12, letterSpacing: 1 }}>QUICK ACCESS (DEMO)</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {[
                    { e: "admin@ironcoach.com", label: "👑 Admin" },
                    { e: "ahmed@coach.com", label: "🏋️ Coach" },
                    { e: "omar@trainee.com", label: "👤 Trainee" },
                  ].map(q => (
                    <Btn key={q.e} variant="ghost" onClick={() => quickLogin(q.e)} style={{ flex: 1, fontSize: 11, padding: "8px 4px" }}>
                      {q.label}
                    </Btn>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <Input label="Full Name" value={regData.name} onChange={e => setRegData({ ...regData, name: e.target.value })} placeholder="Your full name" />
              <Input label="Email" type="email" value={regData.email} onChange={e => setRegData({ ...regData, email: e.target.value })} placeholder="your@email.com" />
              <Select label="I am a..." value={regData.role} onChange={e => setRegData({ ...regData, role: e.target.value })}
                options={[{ value: "coach", label: "🏋️ Coach - I train others" }, { value: "trainee", label: "👤 Trainee - I want to train" }]} />
              <Input label="Password" type="password" value={regData.password} onChange={e => setRegData({ ...regData, password: e.target.value })} placeholder="Min 8 characters" />
              <Input label="Confirm Password" type="password" value={regData.confirm} onChange={e => setRegData({ ...regData, confirm: e.target.value })} placeholder="Repeat password" />
              <Btn onClick={() => setTab("login")} style={{ width: "100%", padding: "12px", fontSize: 14 }}>
                Create Account
              </Btn>
            </>
          )}
        </Card>

        <p style={{ textAlign: "center", color: C.muted, fontSize: 12, marginTop: 20 }}>
          © 2026 IronCoach · Arabic + English · Mobile-first
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
function AdminDashboard() {
  const { logout } = useApp();
  const [page, setPage] = useState("dashboard");
  const [coaches, setCoaches] = useState(MOCK_COACHES);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [newExercise, setNewExercise] = useState({ name: "", muscle: "Chest", level: "Beginner", equipment: "" });
  const [exercises, setExercises] = useState(MOCK_EXERCISES);
  const [announcement, setAnnouncement] = useState({ title: "", body: "", target: "all" });
  const [supportMsg, setSupportMsg] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, from: "Ahmed Al-Rashid", text: "Can you help me set up my brand colors?", time: "10:30 AM", read: true },
    { id: 2, from: "Sara Mohamed", text: "I can't upload exercise videos larger than 30MB.", time: "11:00 AM", read: false },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { id: 1, from: "Ahmed Al-Rashid", text: "Hi Admin, I need help with my subdomain.", time: "10:30" },
  ]);

  const showToast = (msg, color = C.green) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  };

  const approveCoach = (id) => {
    setCoaches(coaches.map(c => c.id === id ? { ...c, status: "active" } : c));
    showToast("Coach approved successfully!");
  };
  const suspendCoach = (id) => {
    setCoaches(coaches.map(c => c.id === id ? { ...c, status: "suspended" } : c));
    showToast("Coach suspended.", C.accent2);
  };

  const navItems = [
    { icon: "📊", label: "Dashboard", active: page === "dashboard", onClick: () => setPage("dashboard") },
    { icon: "🏋️", label: "Coaches", active: page === "coaches", onClick: () => setPage("coaches") },
    { icon: "👥", label: "All Trainees", active: page === "trainees", onClick: () => setPage("trainees") },
    { icon: "💳", label: "Revenue", active: page === "revenue", onClick: () => setPage("revenue") },
    { icon: "💪", label: "Exercise Library", active: page === "exercises", onClick: () => setPage("exercises") },
    { icon: "💬", label: "Support Inbox", active: page === "support", onClick: () => setPage("support"), badge: 2 },
    { icon: "📢", label: "Announcements", active: page === "announcements", onClick: () => setPage("announcements") },
    { icon: "⚙️", label: "Settings", active: page === "settings", onClick: () => setPage("settings") },
    { icon: "📋", label: "Audit Logs", active: page === "audit", onClick: () => setPage("audit") },
  ];

  const logo = (
    <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: 3, color: C.white }}>
      IRON<span style={{ color: C.accent }}>COACH</span>
    </div>
  );

  const headerRight = (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Badge color={C.accent}>Super Admin</Badge>
      <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>👑</div>
      <Btn variant="secondary" onClick={logout} style={{ fontSize: 12, padding: "6px 14px" }}>Logout</Btn>
    </div>
  );

  return (
    <SidebarLayout logo={logo} nav={navItems} headerRight={headerRight}>
      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, background: toast.color, color: C.black, padding: "12px 20px", borderRadius: 8, fontWeight: 600, fontSize: 13, zIndex: 9999 }}>
          {toast.msg}
        </div>
      )}

      {/* ── DASHBOARD ── */}
      {page === "dashboard" && (
        <div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: C.accent, letterSpacing: 2, marginBottom: 4 }}>// PLATFORM OVERVIEW</div>
            <h1 style={{ fontSize: 28, color: C.white, fontWeight: 700 }}>Platform Dashboard</h1>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
            <Stat label="Active Coaches" value="47" sub="+3 this month" />
            <Stat label="Total Trainees" value="1,284" color={C.accent3} sub="Across all coaches" />
            <Stat label="MRR" value="$6,240" color={C.green} sub="+12% vs last month" />
            <Stat label="Churn Rate" value="2.1%" color={C.accent2} sub="Healthy range" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 24 }}>
            <Card style={{ padding: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.white, marginBottom: 16 }}>Recent Coach Signups</div>
              {coaches.slice(0, 4).map(c => (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.graphite, display: "flex", alignItems: "center", justifyContent: "center" }}>🏋️</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: C.white, fontWeight: 500 }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: C.dim }}>{c.brand} · {c.plan}</div>
                  </div>
                  <Badge color={c.status === "active" ? C.green : c.status === "pending" ? C.accent2 : C.red}>{c.status}</Badge>
                </div>
              ))}
            </Card>
            <Card style={{ padding: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.white, marginBottom: 16 }}>Plan Distribution</div>
              {[{ plan: "Starter ($60)", count: 18, pct: 38, color: C.text }, { plan: "Growth ($100)", count: 22, pct: 47, color: C.accent3 }, { plan: "Pro ($200)", count: 7, pct: 15, color: C.accent }].map(p => (
                <div key={p.plan} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: C.text }}>{p.plan}</span>
                    <span style={{ fontSize: 12, color: p.color, fontWeight: 600 }}>{p.count}</span>
                  </div>
                  <div style={{ height: 6, background: C.graphite, borderRadius: 3 }}>
                    <div style={{ height: "100%", width: `${p.pct}%`, background: p.color, borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </Card>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {[
              { label: "Pending Approvals", value: 1, color: C.accent2, icon: "⏳", action: () => setPage("coaches") },
              { label: "Support Tickets", value: 2, color: C.accent3, icon: "💬", action: () => setPage("support") },
              { label: "Exercises in Library", value: exercises.length, color: C.accent, icon: "💪", action: () => setPage("exercises") },
            ].map(item => (
              <Card key={item.label} style={{ padding: 20, cursor: "pointer" }} onClick={item.action}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: item.color }}>{item.value}</div>
                <div style={{ fontSize: 12, color: C.dim }}>{item.label}</div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ── COACHES ── */}
      {page === "coaches" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 11, color: C.accent, letterSpacing: 2, marginBottom: 4 }}>// COACH MANAGEMENT</div>
              <h1 style={{ fontSize: 24, color: C.white, fontWeight: 700 }}>Coaches ({coaches.length})</h1>
            </div>
          </div>
          <Card>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  {["Coach", "Brand", "Plan", "Trainees", "Revenue", "Status", "Actions"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, color: C.dim, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {coaches.map(c => (
                  <tr key={c.id} style={{ borderBottom: `1px solid ${C.border}` }}
                    onMouseEnter={e => e.currentTarget.style.background = C.steel}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontSize: 13, color: C.white, fontWeight: 500 }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: C.dim }}>{c.email}</div>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: C.text }}>{c.brand}</td>
                    <td style={{ padding: "14px 16px" }}><Badge color={c.plan === "Pro" ? C.accent : c.plan === "Growth" ? C.accent3 : C.text}>{c.plan}</Badge></td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: C.text }}>{c.trainees}/{c.limit}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: C.green, fontWeight: 600 }}>{c.revenue}/mo</td>
                    <td style={{ padding: "14px 16px" }}>
                      <Badge color={c.status === "active" ? C.green : c.status === "pending" ? C.accent2 : C.red}>{c.status}</Badge>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        {c.status === "pending" && <Btn variant="primary" onClick={() => approveCoach(c.id)} style={{ fontSize: 11, padding: "5px 10px" }}>Approve</Btn>}
                        {c.status === "active" && <Btn variant="danger" onClick={() => suspendCoach(c.id)} style={{ fontSize: 11, padding: "5px 10px" }}>Suspend</Btn>}
                        <Btn variant="secondary" onClick={() => setModal({ type: "view-coach", coach: c })} style={{ fontSize: 11, padding: "5px 10px" }}>View</Btn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {/* ── TRAINEES ── */}
      {page === "trainees" && (
        <div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: C.accent, letterSpacing: 2, marginBottom: 4 }}>// ALL TRAINEES</div>
            <h1 style={{ fontSize: 24, color: C.white, fontWeight: 700 }}>Trainees Across Platform</h1>
          </div>
          <Card>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  {["Trainee", "Coach", "Goal", "Weight", "Status", "Last Active"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, color: C.dim, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_TRAINEES.map(t => (
                  <tr key={t.id} style={{ borderBottom: `1px solid ${C.border}` }}
                    onMouseEnter={e => e.currentTarget.style.background = C.steel}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "14px 16px", fontSize: 13, color: C.white, fontWeight: 500 }}>{t.name}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: C.dim }}>{t.coach}</td>
                    <td style={{ padding: "14px 16px" }}><Badge color={C.accent3}>{t.goal}</Badge></td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: C.text }}>{t.weight}</td>
                    <td style={{ padding: "14px 16px" }}><Badge color={t.status === "active" ? C.green : C.muted}>{t.status}</Badge></td>
                    <td style={{ padding: "14px 16px", fontSize: 12, color: C.dim }}>{t.lastActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {/* ── REVENUE ── */}
      {page === "revenue" && (
        <div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: C.accent, letterSpacing: 2, marginBottom: 4 }}>// BILLING & REVENUE</div>
            <h1 style={{ fontSize: 24, color: C.white, fontWeight: 700 }}>Revenue Dashboard</h1>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
            <Stat label="MRR" value="$6,240" color={C.green} />
            <Stat label="ARR" value="$74,880" color={C.accent} />
            <Stat label="Active Subscriptions" value="47" color={C.accent3} />
            <Stat label="Avg Revenue/Coach" value="$132" color={C.accent2} />
          </div>
          <Card style={{ padding: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.white, marginBottom: 16 }}>Recent Transactions</div>
            {coaches.map(c => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${C.border}` }}>
                <div>
                  <div style={{ fontSize: 13, color: C.white }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: C.dim }}>{c.plan} Plan · {c.joined}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 14, color: C.green, fontWeight: 600 }}>{c.revenue}/mo</div>
                  <Badge color={C.green}>paid</Badge>
                </div>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* ── EXERCISES ── */}
      {page === "exercises" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 11, color: C.accent, letterSpacing: 2, marginBottom: 4 }}>// EXERCISE LIBRARY</div>
              <h1 style={{ fontSize: 24, color: C.white, fontWeight: 700 }}>Global Exercises ({exercises.length})</h1>
            </div>
            <Btn onClick={() => setModal({ type: "add-exercise" })}>+ Add Exercise</Btn>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }}>
            {exercises.map(ex => (
              <Card key={ex.id} style={{ padding: 16, display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: `${C.accent}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>💪</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: C.white, fontWeight: 600 }}>{ex.name}</div>
                  <div style={{ fontSize: 11, color: C.dim }}>{ex.nameAr}</div>
                  <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                    <Badge color={C.accent3}>{ex.muscle}</Badge>
                    <Badge color={ex.level === "Beginner" ? C.green : ex.level === "Advanced" ? C.accent : C.accent2}>{ex.level}</Badge>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 12, color: C.dim }}>{ex.sets}×{ex.reps}</div>
                  <div style={{ fontSize: 11, color: C.dim }}>{ex.rest}s rest</div>
                  <Btn variant="secondary" onClick={() => setModal({ type: "edit-exercise", ex })} style={{ fontSize: 10, padding: "4px 8px", marginTop: 6 }}>Edit</Btn>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ── SUPPORT ── */}
      {page === "support" && (
        <div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: C.accent, letterSpacing: 2, marginBottom: 4 }}>// SUPPORT INBOX</div>
            <h1 style={{ fontSize: 24, color: C.white, fontWeight: 700 }}>Support Tickets</h1>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 16, height: "calc(100vh - 220px)" }}>
            <Card style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "14px 16px", borderBottom: `1px solid ${C.border}`, fontSize: 13, fontWeight: 600, color: C.white }}>Conversations</div>
              <div style={{ flex: 1, overflowY: "auto" }}>
                {messages.map(m => (
                  <div key={m.id} style={{
                    padding: "14px 16px", borderBottom: `1px solid ${C.border}`, cursor: "pointer",
                    background: !m.read ? `${C.accent3}08` : "transparent",
                    display: "flex", gap: 10
                  }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.graphite, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>🏋️</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 13, color: C.white, fontWeight: 500 }}>{m.from}</span>
                        <span style={{ fontSize: 10, color: C.dim }}>{m.time}</span>
                      </div>
                      <div style={{ fontSize: 12, color: C.dim, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{m.text}</div>
                    </div>
                    {!m.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.accent3, flexShrink: 0, marginTop: 4 }} />}
                  </div>
                ))}
              </div>
            </Card>
            <Card style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <div style={{ padding: "14px 16px", borderBottom: `1px solid ${C.border}`, fontSize: 13, fontWeight: 600, color: C.white }}>
                Chat with Sara Mohamed
              </div>
              <div style={{ flex: 1, padding: 16, overflowY: "auto" }}>
                {chatMessages.map(m => (
                  <div key={m.id} style={{ marginBottom: 12, display: "flex", flexDirection: "column", alignItems: m.from === "Admin" ? "flex-end" : "flex-start" }}>
                    <div style={{ fontSize: 10, color: C.dim, marginBottom: 4 }}>{m.from} · {m.time}</div>
                    <div style={{
                      padding: "10px 14px", borderRadius: 10, maxWidth: "70%", fontSize: 13,
                      background: m.from === "Admin" ? C.accent : C.graphite,
                      color: m.from === "Admin" ? C.black : C.text
                    }}>{m.text}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: 16, borderTop: `1px solid ${C.border}`, display: "flex", gap: 8 }}>
                <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter" && chatInput.trim()) {
                      setChatMessages([...chatMessages, { id: Date.now(), from: "Admin", text: chatInput, time: "now" }]);
                      setChatInput("");
                    }
                  }}
                  placeholder="Type a message..." style={{
                    flex: 1, padding: "10px 14px", background: C.steel, border: `1px solid ${C.border}`,
                    borderRadius: 8, color: C.white, fontSize: 13, outline: "none", fontFamily: "inherit"
                  }} />
                <Btn onClick={() => {
                  if (chatInput.trim()) {
                    setChatMessages([...chatMessages, { id: Date.now(), from: "Admin", text: chatInput, time: "now" }]);
                    setChatInput("");
                  }
                }}>Send</Btn>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ── ANNOUNCEMENTS ── */}
      {page === "announcements" && (
        <div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: C.accent, letterSpacing: 2, marginBottom: 4 }}>// ANNOUNCEMENTS</div>
            <h1 style={{ fontSize: 24, color: C.white, fontWeight: 700 }}>Send Announcements</h1>
          </div>
          <div style={{ maxWidth: 600 }}>
            <Card style={{ padding: 24 }}>
              <Input label="Announcement Title" value={announcement.title} onChange={e => setAnnouncement({ ...announcement, title: e.target.value })} placeholder="e.g. New feature release!" />
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 12, color: C.dim, marginBottom: 6 }}>Message Body</label>
                <textarea value={announcement.body} onChange={e => setAnnouncement({ ...announcement, body: e.target.value })}
                  rows={4} placeholder="Write your announcement..."
                  style={{ width: "100%", padding: "10px 14px", background: C.steel, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white, fontSize: 14, outline: "none", boxSizing: "border-box", resize: "vertical", fontFamily: "inherit" }} />
              </div>
              <Select label="Send To" value={announcement.target} onChange={e => setAnnouncement({ ...announcement, target: e.target.value })}
                options={[{ value: "all", label: "Everyone (Coaches + Trainees)" }, { value: "coaches", label: "Coaches Only" }, { value: "trainees", label: "Trainees Only" }]} />
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <Btn onClick={() => {
                  if (announcement.title && announcement.body) {
                    showToast(`Announcement sent to ${announcement.target}! 📢`);
                    setAnnouncement({ title: "", body: "", target: "all" });
                  }
                }}>📢 Send Announcement</Btn>
                <Btn variant="secondary">Preview</Btn>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ── SETTINGS ── */}
      {page === "settings" && (
        <div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: C.accent, letterSpacing: 2, marginBottom: 4 }}>// PLATFORM SETTINGS</div>
            <h1 style={{ fontSize: 24, color: C.white, fontWeight: 700 }}>Settings</h1>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { title: "Starter Plan Price", value: "$60/month", icon: "💳" },
              { title: "Growth Plan Price", value: "$100/month", icon: "💳" },
              { title: "Pro Plan Price", value: "$200/month", icon: "💳" },
              { title: "Auto-Approve Coaches", value: "Enabled", icon: "✅" },
              { title: "Platform Language", value: "English + Arabic", icon: "🌍" },
              { title: "Maintenance Mode", value: "Off", icon: "🔧" },
            ].map(s => (
              <Card key={s.title} style={{ padding: 16, display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontSize: 24 }}>{s.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: C.dim }}>{s.title}</div>
                  <div style={{ fontSize: 14, color: C.white, fontWeight: 500 }}>{s.value}</div>
                </div>
                <Btn variant="secondary" style={{ fontSize: 11, padding: "5px 10px" }} onClick={() => showToast("Setting updated!")}>Edit</Btn>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ── AUDIT LOGS ── */}
      {page === "audit" && (
        <div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: C.accent, letterSpacing: 2, marginBottom: 4 }}>// AUDIT LOGS</div>
            <h1 style={{ fontSize: 24, color: C.white, fontWeight: 700 }}>Activity Logs</h1>
          </div>
          <Card>
            {[
              { action: "coach.approved", user: "Admin", resource: "Ahmed Al-Rashid", time: "Today 10:30 AM", ip: "192.168.1.1" },
              { action: "exercise.created", user: "Admin", resource: "Bench Press", time: "Today 9:15 AM", ip: "192.168.1.1" },
              { action: "coach.suspended", user: "Admin", resource: "Nour Fitness", time: "Yesterday 3:45 PM", ip: "192.168.1.1" },
              { action: "plan.changed", user: "Sara Mohamed", resource: "Starter → Growth", time: "Yesterday 11:00 AM", ip: "10.0.0.5" },
              { action: "trainee.removed", user: "Khalid Hassan", resource: "Hassan Ali", time: "Mar 10 2:00 PM", ip: "10.0.0.8" },
            ].map((log, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ fontFamily: "monospace", fontSize: 11, color: C.accent, background: `${C.accent}10`, padding: "3px 8px", borderRadius: 4 }}>{log.action}</div>
                <div style={{ fontSize: 12, color: C.text, flex: 1 }}>{log.user} → <span style={{ color: C.dim }}>{log.resource}</span></div>
                <div style={{ fontSize: 11, color: C.dim }}>{log.ip}</div>
                <div style={{ fontSize: 11, color: C.dim, whiteSpace: "nowrap" }}>{log.time}</div>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* ── MODALS ── */}
      <Modal open={modal?.type === "view-coach"} onClose={() => setModal(null)} title="Coach Details">
        {modal?.coach && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              {[
                ["Name", modal.coach.name], ["Brand", modal.coach.brand],
                ["Plan", modal.coach.plan], ["Trainees", `${modal.coach.trainees}/${modal.coach.limit}`],
                ["Revenue", modal.coach.revenue + "/mo"], ["Subdomain", modal.coach.subdomain + ".ironcoach.com"],
              ].map(([k, v]) => (
                <div key={k} style={{ background: C.steel, padding: "10px 14px", borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: C.dim }}>{k}</div>
                  <div style={{ fontSize: 13, color: C.white, fontWeight: 500 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn onClick={() => { approveCoach(modal.coach.id); setModal(null); }}>Approve Coach</Btn>
              <Btn variant="danger" onClick={() => { suspendCoach(modal.coach.id); setModal(null); }}>Suspend</Btn>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={modal?.type === "add-exercise"} onClose={() => setModal(null)} title="Add Exercise">
        <Input label="Exercise Name (EN)" value={newExercise.name} onChange={e => setNewExercise({ ...newExercise, name: e.target.value })} placeholder="e.g. Bench Press" />
        <Select label="Muscle Group" value={newExercise.muscle} onChange={e => setNewExercise({ ...newExercise, muscle: e.target.value })}
          options={["Chest", "Back", "Legs", "Shoulders", "Biceps", "Triceps", "Core", "Glutes"]} />
        <Select label="Level" value={newExercise.level} onChange={e => setNewExercise({ ...newExercise, level: e.target.value })}
          options={["Beginner", "Intermediate", "Advanced", "Professional"]} />
        <Input label="Equipment" value={newExercise.equipment} onChange={e => setNewExercise({ ...newExercise, equipment: e.target.value })} placeholder="e.g. Barbell" />
        <Btn onClick={() => {
          if (newExercise.name) {
            setExercises([...exercises, { id: Date.now(), ...newExercise, nameAr: "", sets: 4, reps: "8-12", rest: 90 }]);
            setModal(null);
            setNewExercise({ name: "", muscle: "Chest", level: "Beginner", equipment: "" });
            showToast("Exercise added to library!");
          }
        }} style={{ width: "100%" }}>Add Exercise</Btn>
      </Modal>
    </SidebarLayout>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// COACH DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
function CoachDashboard() {
  const { logout, user } = useApp();
  const [page, setPage] = useState("dashboard");
  const [trainees, setTrainees] = useState(MOCK_TRAINEES.filter(t => t.coach === "Ahmed Al-Rashid"));
  const [selectedTrainee, setSelectedTrainee] = useState(null);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState(MOCK_MESSAGES);
  const [exercises] = useState(MOCK_EXERCISES);
  const [planDays, setPlanDays] = useState([
    { id: 1, name: "Day 1 - Chest & Triceps", exercises: [MOCK_EXERCISES[0], MOCK_EXERCISES[6]] },
    { id: 2, name: "Day 2 - Back & Biceps", exercises: [MOCK_EXERCISES[3], MOCK_EXERCISES[5]] },
    { id: 3, name: "Day 3 - Legs", exercises: [MOCK_EXERCISES[1]] },
  ]);
  const [mealPlan, setMealPlan] = useState({
    calories: 2800, protein: 200, carbs: 320, fat: 78,
    meals: [
      { time: "7:00 AM", name: "Breakfast", cals: 560, protein: 40, carbs: 60, fat: 15, foods: "Oats, eggs, banana, whey protein" },
      { time: "10:30 AM", name: "Mid-Morning Snack", cals: 350, protein: 30, carbs: 35, fat: 10, foods: "Greek yogurt, nuts, berries" },
      { time: "1:00 PM", name: "Lunch", cals: 700, protein: 55, carbs: 80, fat: 20, foods: "Chicken breast, brown rice, salad" },
      { time: "4:30 PM", name: "Pre-Workout", cals: 420, protein: 35, carbs: 55, fat: 8, foods: "Banana, rice cake, whey shake" },
      { time: "8:00 PM", name: "Dinner", cals: 770, protein: 60, carbs: 90, fat: 25, foods: "Salmon, sweet potato, broccoli" },
    ]
  });

  const showToast = (msg, color = C.green) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  };

  const navItems = [
    { icon: "🏠", label: "Overview", active: page === "dashboard", onClick: () => setPage("dashboard") },
    { icon: "👥", label: "Trainees", active: page === "trainees", onClick: () => setPage("trainees"), badge: trainees.length },
    { icon: "📋", label: "Workout Plans", active: page === "plans", onClick: () => setPage("plans") },
    { icon: "🥗", label: "Nutrition", active: page === "nutrition", onClick: () => setPage("nutrition") },
    { icon: "💪", label: "Exercise Library", active: page === "exercises", onClick: () => setPage("exercises") },
    { icon: "📈", label: "Analytics", active: page === "analytics", onClick: () => setPage("analytics") },
    { icon: "💬", label: "Messages", active: page === "messages", onClick: () => setPage("messages"), badge: 1 },
    { icon: "🎨", label: "Branding", active: page === "branding", onClick: () => setPage("branding") },
    { icon: "💳", label: "Subscription", active: page === "billing", onClick: () => setPage("billing") },
    { icon: "🆘", label: "Support", active: page === "support-chat", onClick: () => setPage("support-chat") },
  ];

  const logo = (
    <div>
      <div style={{ fontSize: 14, fontWeight: 900, letterSpacing: 2, color: C.white }}>ALPHA<span style={{ color: C.accent }}>FIT</span></div>
      <div style={{ fontSize: 9, color: C.dim, letterSpacing: 1 }}>by IronCoach</div>
    </div>
  );

  const headerRight = (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ fontSize: 12, color: C.dim }}>Growth Plan · 38/50 trainees</div>
      <Badge color={C.green}>Active</Badge>
      <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🏋️</div>
      <Btn variant="secondary" onClick={logout} style={{ fontSize: 12, padding: "6px 14px" }}>Logout</Btn>
    </div>
  );

  return (
    <SidebarLayout logo={logo} nav={navItems} headerRight={headerRight}>
      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, background: toast.color, color: C.black, padding: "12px 20px", borderRadius: 8, fontWeight: 600, fontSize: 13, zIndex: 9999 }}>
          {toast.msg}
        </div>
      )}

      {/* ── OVERVIEW ── */}
      {page === "dashboard" && (
        <div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: C.accent, letterSpacing: 2, marginBottom: 4 }}>// GOOD MORNING</div>
            <h1 style={{ fontSize: 28, color: C.white, fontWeight: 700 }}>Welcome back, {user?.name?.split(" ")[0]} 👋</h1>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
            <Stat label="Active Trainees" value="38" sub="12 more slots available" />
            <Stat label="Workouts Logged" value="142" color={C.accent3} sub="This month" />
            <Stat label="Avg Adherence" value="84%" color={C.green} sub="Industry avg: 65%" />
            <Stat label="Unread Messages" value="3" color={C.accent2} sub="2 need response" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
            <Card style={{ padding: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.white, marginBottom: 16 }}>Your Trainees</div>
              {trainees.map(t => (
                <div key={t.id} onClick={() => { setSelectedTrainee(t); setPage("trainee-detail"); }}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: `1px solid ${C.border}`, cursor: "pointer" }}
                  onMouseEnter={e => e.currentTarget.style.background = C.steel}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: C.graphite, display: "flex", alignItems: "center", justifyContent: "center" }}>👤</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: C.white, fontWeight: 500 }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: C.dim }}>{t.goal} · {t.plan}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: C.dim }}>{t.lastActive}</div>
                    <Badge color={t.status === "active" ? C.green : C.muted}>{t.status}</Badge>
                  </div>
                </div>
              ))}
            </Card>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Card style={{ padding: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.white, marginBottom: 12 }}>Today's Activity</div>
                {[{ name: "Omar Faris", action: "Completed chest workout 💪", time: "11:30 AM" },
                { name: "Layla Nasser", action: "Logged check-in weight", time: "9:00 AM" }].map((a, i) => (
                  <div key={i} style={{ fontSize: 12, color: C.dim, padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
                    <span style={{ color: C.text }}>{a.name}</span>: {a.action}
                    <div style={{ fontSize: 10, color: C.muted }}>{a.time}</div>
                  </div>
                ))}
              </Card>
              <Card style={{ padding: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.white, marginBottom: 12 }}>Quick Actions</div>
                {[
                  { label: "Invite Trainee", icon: "➕", action: () => setModal({ type: "invite" }) },
                  { label: "Create Plan", icon: "📋", action: () => setPage("plans") },
                  { label: "View Messages", icon: "💬", action: () => setPage("messages") },
                ].map(a => (
                  <div key={a.label} onClick={a.action} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px", borderRadius: 8, cursor: "pointer", marginBottom: 4 }}
                    onMouseEnter={e => e.currentTarget.style.background = C.graphite}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <span style={{ fontSize: 16 }}>{a.icon}</span>
                    <span style={{ fontSize: 13, color: C.text }}>{a.label}</span>
                  </div>
                ))}
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* ── TRAINEES PAGE ── */}
      {page === "trainees" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 11, color: C.accent, letterSpacing: 2, marginBottom: 4 }}>// TRAINEE ROSTER</div>
              <h1 style={{ fontSize: 24, color: C.white, fontWeight: 700 }}>My Trainees ({trainees.length}/50)</h1>
            </div>
            <Btn onClick={() => setModal({ type: "invite" })}>+ Invite Trainee</Btn>
          </div>
          <div style={{ marginBottom: 16, background: `${C.accent3}18`, border: `1px solid ${C.accent3}40`, borderRadius: 8, padding: "12px 16px", display: "flex", alignItems: "center", gap: 8 }}>
            <span>💡</span>
            <span style={{ fontSize: 12, color: C.accent3 }}>You have 12 available seats. <span style={{ textDecoration: "underline", cursor: "pointer" }} onClick={() => setPage("billing")}>Upgrade to Pro</span> to add up to 150 trainees.</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }}>
            {trainees.map(t => (
              <Card key={t.id} style={{ padding: 20, cursor: "pointer" }}
                onClick={() => { setSelectedTrainee(t); setPage("trainee-detail"); }}
                onMouseEnter={e => e.currentTarget.style.borderColor = C.accent3}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 46, height: 46, borderRadius: "50%", background: C.graphite, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>👤</div>
                  <div>
                    <div style={{ fontSize: 15, color: C.white, fontWeight: 600 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: C.dim }}>Goal: {t.goal}</div>
                  </div>
                  <div style={{ marginLeft: "auto" }}><Badge color={t.status === "active" ? C.green : C.muted}>{t.status}</Badge></div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                  {[["Weight", t.weight], ["Plan", t.plan.split(" ")[0]], ["Last Active", t.lastActive]].map(([k, v]) => (
                    <div key={k} style={{ background: C.steel, padding: "8px", borderRadius: 6, textAlign: "center" }}>
                      <div style={{ fontSize: 10, color: C.dim }}>{k}</div>
                      <div style={{ fontSize: 12, color: C.text, fontWeight: 500 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ── TRAINEE DETAIL ── */}
      {page === "trainee-detail" && selectedTrainee && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <Btn variant="secondary" onClick={() => setPage("trainees")} style={{ fontSize: 12, padding: "6px 12px" }}>← Back</Btn>
            <div>
              <div style={{ fontSize: 11, color: C.accent, letterSpacing: 2 }}>// TRAINEE PROFILE</div>
              <h1 style={{ fontSize: 24, color: C.white, fontWeight: 700 }}>{selectedTrainee.name}</h1>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16, marginBottom: 16 }}>
            <Card style={{ padding: 24, textAlign: "center" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: C.graphite, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 16px" }}>👤</div>
              <div style={{ fontSize: 18, color: C.white, fontWeight: 600 }}>{selectedTrainee.name}</div>
              <Badge color={C.green} style={{ marginTop: 8, display: "inline-block" }}>{selectedTrainee.status}</Badge>
              <div style={{ marginTop: 16, display: "flex", gap: 8, justifyContent: "center" }}>
                <Btn onClick={() => setPage("messages")} style={{ fontSize: 12, padding: "7px 14px" }}>💬 Message</Btn>
                <Btn variant="secondary" style={{ fontSize: 12, padding: "7px 14px" }}>Edit</Btn>
              </div>
            </Card>
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 12 }}>
                {[["Goal", selectedTrainee.goal, C.accent], ["Weight", selectedTrainee.weight, C.accent3], ["Active Plan", selectedTrainee.plan, C.green]].map(([k, v, c]) => (
                  <Card key={k} style={{ padding: 14 }}>
                    <div style={{ fontSize: 11, color: C.dim }}>{k}</div>
                    <div style={{ fontSize: 15, color: c, fontWeight: 600, marginTop: 4 }}>{v}</div>
                  </Card>
                ))}
              </div>
              <Card style={{ padding: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.white, marginBottom: 10 }}>Progress Chart (Last 8 Weeks)</div>
                <div style={{ height: 80, display: "flex", alignItems: "flex-end", gap: 4 }}>
                  {[82, 81.5, 81, 80.8, 80.5, 80, 79.5, 79].map((w, i) => (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                      <div style={{ width: "100%", height: `${((w - 78) / 5) * 70}px`, background: `linear-gradient(to top, ${C.accent3}, ${C.accent3}60)`, borderRadius: "2px 2px 0 0", minHeight: 4 }} />
                      <span style={{ fontSize: 8, color: C.dim }}>W{i + 1}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
            <Btn onClick={() => setPage("plans")} style={{ padding: "14px" }}>📋 Edit Workout Plan</Btn>
            <Btn variant="secondary" onClick={() => setPage("nutrition")} style={{ padding: "14px" }}>🥗 Edit Nutrition Plan</Btn>
            <Btn variant="ghost" style={{ padding: "14px" }}>📏 Log Assessment</Btn>
          </div>
        </div>
      )}

      {/* ── WORKOUT PLANS ── */}
      {page === "plans" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 11, color: C.accent, letterSpacing: 2, marginBottom: 4 }}>// WORKOUT BUILDER</div>
              <h1 style={{ fontSize: 24, color: C.white, fontWeight: 700 }}>Workout Plans</h1>
            </div>
            <Btn onClick={() => setModal({ type: "new-plan" })}>+ New Plan</Btn>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Card style={{ padding: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.white, marginBottom: 4 }}>Push/Pull/Legs Split</div>
              <div style={{ fontSize: 12, color: C.dim, marginBottom: 16 }}>6 weeks · 3 days/week · Assigned to Omar Faris</div>
              {planDays.map(day => (
                <div key={day.id} style={{ marginBottom: 12, background: C.steel, borderRadius: 8, overflow: "hidden" }}>
                  <div style={{ padding: "10px 14px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, color: C.white, fontWeight: 500 }}>{day.name}</span>
                    <Btn variant="secondary" onClick={() => setModal({ type: "add-exercise-to-day", dayId: day.id })} style={{ fontSize: 10, padding: "3px 8px" }}>+ Exercise</Btn>
                  </div>
                  {day.exercises.map(ex => (
                    <div key={ex.id} style={{ padding: "8px 14px", display: "flex", justifyContent: "space-between", fontSize: 12, color: C.text }}>
                      <span>{ex.name}</span>
                      <span style={{ color: C.dim }}>{ex.sets}×{ex.reps}</span>
                    </div>
                  ))}
                </div>
              ))}
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <Btn style={{ fontSize: 12 }} onClick={() => showToast("Plan assigned to Omar Faris! 🎉")}>Assign to Trainee</Btn>
                <Btn variant="secondary" style={{ fontSize: 12 }}>Save Draft</Btn>
              </div>
            </Card>
            <Card style={{ padding: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.white, marginBottom: 16 }}>Exercise Library</div>
              {exercises.map(ex => (
                <div key={ex.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                  <div>
                    <div style={{ fontSize: 13, color: C.white }}>{ex.name}</div>
                    <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                      <Badge color={C.accent3} style={{ fontSize: 9 }}>{ex.muscle}</Badge>
                      <Badge color={ex.level === "Beginner" ? C.green : C.accent} style={{ fontSize: 9 }}>{ex.level}</Badge>
                    </div>
                  </div>
                  <Btn variant="ghost" style={{ fontSize: 10, padding: "4px 8px" }}
                    onClick={() => {
                      setPlanDays(planDays.map((d, i) => i === 0 ? { ...d, exercises: [...d.exercises, ex] } : d));
                      showToast(`${ex.name} added to Day 1!`);
                    }}>Add to Day 1</Btn>
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}

      {/* ── NUTRITION ── */}
      {page === "nutrition" && (
        <div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: C.accent, letterSpacing: 2, marginBottom: 4 }}>// MEAL PLAN CREATOR</div>
            <h1 style={{ fontSize: 24, color: C.white, fontWeight: 700 }}>Nutrition Plans</h1>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
            {[["Calories", mealPlan.calories + " kcal", C.accent], ["Protein", mealPlan.protein + "g", C.accent3], ["Carbs", mealPlan.carbs + "g", C.green], ["Fat", mealPlan.fat + "g", C.accent2]].map(([k, v, c]) => (
              <Card key={k} style={{ padding: 16, textAlign: "center" }}>
                <div style={{ fontSize: 11, color: C.dim }}>{k}</div>
                <div style={{ fontSize: 24, color: c, fontWeight: 700 }}>{v}</div>
              </Card>
            ))}
          </div>
          <Card style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: C.white }}>Omar Faris — Muscle Gain Plan</span>
              <Btn onClick={() => showToast("Meal plan saved and assigned! 🥗")} style={{ fontSize: 12 }}>Save & Assign</Btn>
            </div>
            {mealPlan.meals.map((meal, i) => (
              <div key={i} style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ width: 70, fontSize: 12, color: C.dim, flexShrink: 0, paddingTop: 2 }}>{meal.time}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: C.white, fontWeight: 600 }}>{meal.name}</div>
                  <div style={{ fontSize: 12, color: C.dim, marginTop: 2 }}>{meal.foods}</div>
                </div>
                <div style={{ display: "flex", gap: 12, fontSize: 12, flexShrink: 0 }}>
                  {[["🔥", meal.cals + " kcal", C.accent], ["💪", meal.protein + "g", C.accent3], ["🌾", meal.carbs + "g", C.green]].map(([icon, val, c]) => (
                    <div key={icon} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 14 }}>{icon}</div>
                      <div style={{ color: c, fontWeight: 600 }}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* ── EXERCISES ── */}
      {page === "exercises" && (
        <div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: C.accent, letterSpacing: 2, marginBottom: 4 }}>// EXERCISE LIBRARY</div>
            <h1 style={{ fontSize: 24, color: C.white, fontWeight: 700 }}>Exercise Library</h1>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
            {exercises.map(ex => (
              <Card key={ex.id} style={{ padding: 18, cursor: "pointer" }} onClick={() => setModal({ type: "exercise-detail", ex })}>
                <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: `${C.accent}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>💪</div>
                  <div>
                    <div style={{ fontSize: 14, color: C.white, fontWeight: 600 }}>{ex.name}</div>
                    <div style={{ fontSize: 11, color: C.dim }}>{ex.nameAr}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <Badge color={C.accent3}>{ex.muscle}</Badge>
                  <Badge color={ex.level === "Beginner" ? C.green : ex.level === "Advanced" ? C.accent : C.accent2}>{ex.level}</Badge>
                  <Badge color={C.muted}>{ex.equipment}</Badge>
                </div>
                <div style={{ marginTop: 10, fontSize: 12, color: C.dim }}>{ex.sets} sets × {ex.reps} reps · {ex.rest}s rest</div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ── ANALYTICS ── */}
      {page === "analytics" && (
        <div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: C.accent, letterSpacing: 2, marginBottom: 4 }}>// PROGRESS ANALYTICS</div>
            <h1 style={{ fontSize: 24, color: C.white, fontWeight: 700 }}>Performance Analytics</h1>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 16 }}>
            <Stat label="Sessions This Month" value="142" />
            <Stat label="Avg Session Rating" value="4.2★" color={C.accent} />
            <Stat label="Check-ins Completed" value="89%" color={C.green} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Card style={{ padding: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.white, marginBottom: 16 }}>Trainee Adherence (This Week)</div>
              {trainees.map(t => (
                <div key={t.id} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: C.text }}>{t.name}</span>
                    <span style={{ fontSize: 12, color: C.accent, fontWeight: 600 }}>{Math.floor(Math.random() * 20 + 75)}%</span>
                  </div>
                  <div style={{ height: 6, background: C.graphite, borderRadius: 3 }}>
                    <div style={{ height: "100%", width: `${Math.floor(Math.random() * 20 + 75)}%`, background: C.accent, borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </Card>
            <Card style={{ padding: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.white, marginBottom: 16 }}>Goal Distribution</div>
              {[["Muscle Gain", 60, C.accent], ["Fat Loss", 25, C.accent2], ["Maintenance", 15, C.accent3]].map(([goal, pct, color]) => (
                <div key={goal} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: C.text }}>{goal}</span>
                    <span style={{ fontSize: 12, color, fontWeight: 600 }}>{pct}%</span>
                  </div>
                  <div style={{ height: 6, background: C.graphite, borderRadius: 3 }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}

      {/* ── MESSAGES ── */}
      {page === "messages" && (
        <div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: C.accent, letterSpacing: 2, marginBottom: 4 }}>// MESSAGES</div>
            <h1 style={{ fontSize: 24, color: C.white, fontWeight: 700 }}>Trainee Messages</h1>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 16, height: "calc(100vh - 200px)" }}>
            <Card style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
              {trainees.map(t => (
                <div key={t.id} style={{
                  padding: "14px 16px", borderBottom: `1px solid ${C.border}`, cursor: "pointer",
                  display: "flex", gap: 10, background: t.name === "Omar Faris" ? `${C.accent3}08` : "transparent"
                }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.graphite, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>👤</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: C.white, fontWeight: 500 }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: C.dim, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>Last message...</div>
                  </div>
                </div>
              ))}
            </Card>
            <Card style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <div style={{ padding: "14px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.graphite, display: "flex", alignItems: "center", justifyContent: "center" }}>👤</div>
                <div>
                  <div style={{ fontSize: 14, color: C.white, fontWeight: 600 }}>Omar Faris</div>
                  <div style={{ fontSize: 11, color: C.green }}>● Online</div>
                </div>
              </div>
              <div style={{ flex: 1, padding: 16, overflowY: "auto" }}>
                {chatMessages.map(m => (
                  <div key={m.id} style={{ marginBottom: 14, display: "flex", flexDirection: "column", alignItems: m.from === "Coach" ? "flex-end" : "flex-start" }}>
                    <div style={{ fontSize: 10, color: C.dim, marginBottom: 4 }}>{m.from} · {m.time}</div>
                    <div style={{
                      padding: "10px 14px", borderRadius: 12, maxWidth: "65%", fontSize: 13,
                      background: m.from === "Coach" ? C.accent : C.graphite,
                      color: m.from === "Coach" ? C.black : C.text,
                      borderBottomRightRadius: m.from === "Coach" ? 4 : 12,
                      borderBottomLeftRadius: m.from !== "Coach" ? 4 : 12,
                    }}>{m.text}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: "12px 16px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 8 }}>
                <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter" && chatInput.trim()) {
                      setChatMessages([...chatMessages, { id: Date.now(), from: "Coach", to: "Omar Faris", text: chatInput, time: "now", read: false }]);
                      setChatInput("");
                    }
                  }}
                  placeholder="Type a message..." style={{
                    flex: 1, padding: "10px 14px", background: C.steel, border: `1px solid ${C.border}`,
                    borderRadius: 8, color: C.white, fontSize: 13, outline: "none", fontFamily: "inherit"
                  }} />
                <Btn onClick={() => {
                  if (chatInput.trim()) {
                    setChatMessages([...chatMessages, { id: Date.now(), from: "Coach", to: "Omar Faris", text: chatInput, time: "now", read: false }]);
                    setChatInput("");
                  }
                }}>Send</Btn>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ── BRANDING ── */}
      {page === "branding" && (
        <div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: C.accent, letterSpacing: 2, marginBottom: 4 }}>// BRAND SETTINGS</div>
            <h1 style={{ fontSize: 24, color: C.white, fontWeight: 700 }}>Brand Customization</h1>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Card style={{ padding: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.white, marginBottom: 16 }}>Brand Identity</div>
              <Input label="Brand Name" value="Alpha Fitness" onChange={() => {}} />
              <Input label="Subdomain" value="alpha-fitness" onChange={() => {}} />
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 12, color: C.dim, marginBottom: 6 }}>Bio</label>
                <textarea defaultValue="Professional bodybuilding coach with 10+ years experience. Specializing in muscle building and contest prep." rows={3}
                  style={{ width: "100%", padding: "10px 14px", background: C.steel, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white, fontSize: 13, outline: "none", boxSizing: "border-box", resize: "vertical", fontFamily: "inherit" }} />
              </div>
              <Btn onClick={() => showToast("Brand settings saved!")} style={{ width: "100%" }}>Save Changes</Btn>
            </Card>
            <Card style={{ padding: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.white, marginBottom: 16 }}>Preview</div>
              <div style={{ background: C.steel, borderRadius: 10, padding: 20, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: C.white, letterSpacing: 2 }}>ALPHA<span style={{ color: C.accent }}>FIT</span></div>
                <div style={{ fontSize: 11, color: C.dim, marginBottom: 12 }}>alpha-fitness.ironcoach.com</div>
                <div style={{ fontSize: 12, color: C.dim }}>Professional bodybuilding coach with 10+ years experience.</div>
              </div>
              <div style={{ marginTop: 16 }}>
                <label style={{ display: "block", fontSize: 12, color: C.dim, marginBottom: 8 }}>Language Preference</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <Btn variant="primary" style={{ flex: 1, fontSize: 12 }}>🇺🇸 English</Btn>
                  <Btn variant="secondary" style={{ flex: 1, fontSize: 12 }}>🇸🇦 العربية</Btn>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ── BILLING ── */}
      {page === "billing" && (
        <div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: C.accent, letterSpacing: 2, marginBottom: 4 }}>// SUBSCRIPTION</div>
            <h1 style={{ fontSize: 24, color: C.white, fontWeight: 700 }}>Subscription & Billing</h1>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
            {[
              { plan: "Starter", price: "$60", trainees: "20 trainees", current: false },
              { plan: "Growth", price: "$100", trainees: "50 trainees", current: true },
              { plan: "Pro", price: "$200", trainees: "150 trainees", current: false },
            ].map(p => (
              <Card key={p.plan} style={{ padding: 24, border: p.current ? `1px solid ${C.accent}` : `1px solid ${C.border}`, position: "relative" }}>
                {p.current && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: C.accent, color: C.black, fontSize: 10, fontWeight: 700, padding: "3px 12px", borderRadius: 100, letterSpacing: 1 }}>CURRENT PLAN</div>}
                <div style={{ fontSize: 28, fontWeight: 700, color: C.white }}>{p.plan}</div>
                <div style={{ fontSize: 36, color: p.current ? C.accent : C.white, fontWeight: 900, margin: "8px 0" }}>{p.price}<span style={{ fontSize: 14, color: C.dim }}>/mo</span></div>
                <div style={{ fontSize: 13, color: C.dim, marginBottom: 20 }}>{p.trainees}</div>
                <Btn variant={p.current ? "secondary" : "primary"} style={{ width: "100%" }}
                  onClick={() => { if (!p.current) showToast(`Redirecting to Stripe checkout for ${p.plan}...`); }}>
                  {p.current ? "Current Plan" : "Upgrade"}
                </Btn>
              </Card>
            ))}
          </div>
          <Card style={{ padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.white, marginBottom: 12 }}>Billing History</div>
            {["March 2026", "February 2026", "January 2026"].map(m => (
              <div key={m} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 13, color: C.text }}>{m} — Growth Plan</span>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: C.green, fontWeight: 600 }}>$100.00</span>
                  <Badge color={C.green}>Paid</Badge>
                  <Btn variant="secondary" style={{ fontSize: 10, padding: "4px 8px" }} onClick={() => showToast("Invoice downloaded!")}>Invoice</Btn>
                </div>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* ── SUPPORT CHAT ── */}
      {page === "support-chat" && (
        <div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: C.accent, letterSpacing: 2, marginBottom: 4 }}>// ADMIN SUPPORT</div>
            <h1 style={{ fontSize: 24, color: C.white, fontWeight: 700 }}>Support Chat</h1>
          </div>
          <Card style={{ height: "calc(100vh - 220px)", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${C.accent}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>👑</div>
              <div>
                <div style={{ fontSize: 14, color: C.white, fontWeight: 600 }}>IronCoach Support</div>
                <div style={{ fontSize: 11, color: C.green }}>● Typically replies in under 2 hours</div>
              </div>
            </div>
            <div style={{ flex: 1, padding: 20, overflowY: "auto" }}>
              <div style={{ marginBottom: 14, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <div style={{ fontSize: 10, color: C.dim, marginBottom: 4 }}>Support · Yesterday</div>
                <div style={{ padding: "10px 14px", borderRadius: 12, background: C.graphite, color: C.text, fontSize: 13, maxWidth: "65%" }}>
                  Hey Ahmed! How can we help you today?
                </div>
              </div>
              <div style={{ marginBottom: 14, display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                <div style={{ fontSize: 10, color: C.dim, marginBottom: 4 }}>You · Yesterday</div>
                <div style={{ padding: "10px 14px", borderRadius: 12, background: C.accent, color: C.black, fontSize: 13, maxWidth: "65%" }}>
                  Hi! I'm having trouble uploading exercise videos larger than 50MB.
                </div>
              </div>
              <div style={{ marginBottom: 14, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <div style={{ fontSize: 10, color: C.dim, marginBottom: 4 }}>Support · Yesterday</div>
                <div style={{ padding: "10px 14px", borderRadius: 12, background: C.graphite, color: C.text, fontSize: 13, maxWidth: "65%" }}>
                  The maximum video size is 50MB. We recommend compressing to H.264 MP4 for best results. Would you like a guide?
                </div>
              </div>
            </div>
            <div style={{ padding: "12px 20px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 8 }}>
              <input placeholder="Type your message..." style={{
                flex: 1, padding: "10px 14px", background: C.steel, border: `1px solid ${C.border}`,
                borderRadius: 8, color: C.white, fontSize: 13, outline: "none", fontFamily: "inherit"
              }} onKeyDown={e => { if (e.key === "Enter") showToast("Message sent to support!"); }} />
              <Btn onClick={() => showToast("Message sent!")}>Send</Btn>
            </div>
          </Card>
        </div>
      )}

      {/* ── MODALS ── */}
      <Modal open={modal?.type === "invite"} onClose={() => setModal(null)} title="Invite Trainee">
        <Input label="Trainee Email" type="email" placeholder="trainee@email.com" value="" onChange={() => {}} />
        <Input label="Trainee Name (optional)" placeholder="Full name" value="" onChange={() => {}} />
        <div style={{ fontSize: 12, color: C.dim, marginBottom: 16, padding: "10px 12px", background: `${C.accent3}10`, borderRadius: 6 }}>
          💡 An invitation link will be sent to their email with your branded registration page.
        </div>
        <Btn onClick={() => { setModal(null); showToast("Invitation sent! 📧"); }} style={{ width: "100%" }}>Send Invitation</Btn>
      </Modal>

      <Modal open={modal?.type === "exercise-detail"} onClose={() => setModal(null)} title={modal?.ex?.name || ""}>
        {modal?.ex && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              {[["Muscle Group", modal.ex.muscle], ["Level", modal.ex.level], ["Equipment", modal.ex.equipment], ["Default Sets", modal.ex.sets], ["Default Reps", modal.ex.reps], ["Rest Time", modal.ex.rest + "s"]].map(([k, v]) => (
                <div key={k} style={{ background: C.steel, padding: "10px 14px", borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: C.dim }}>{k}</div>
                  <div style={{ fontSize: 13, color: C.white, fontWeight: 500 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ background: C.steel, borderRadius: 8, padding: 14, fontSize: 12, color: C.dim }}>
              🎥 Video tutorial would appear here in production
            </div>
          </div>
        )}
      </Modal>

      <Modal open={modal?.type === "new-plan"} onClose={() => setModal(null)} title="Create New Workout Plan">
        <Input label="Plan Name" placeholder="e.g. Hypertrophy 8-Week" value="" onChange={() => {}} />
        <Select label="Assign To" value="" onChange={() => {}} options={trainees.map(t => ({ value: t.id, label: t.name }))} />
        <Select label="Duration" value="8" onChange={() => {}} options={["4", "6", "8", "12", "16"].map(v => ({ value: v, label: `${v} Weeks` }))} />
        <Select label="Days Per Week" value="3" onChange={() => {}} options={["3", "4", "5", "6"].map(v => ({ value: v, label: `${v} days/week` }))} />
        <Btn onClick={() => { setModal(null); showToast("Plan created! Now add exercises."); }} style={{ width: "100%" }}>Create Plan</Btn>
      </Modal>
    </SidebarLayout>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TRAINEE DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
function TraineeDashboard() {
  const { logout, user } = useApp();
  const [page, setPage] = useState("home");
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState(MOCK_MESSAGES.slice(0, 2));
  const [completedSets, setCompletedSets] = useState({});
  const [weight, setWeight] = useState("82.0");
  const [checkWeight, setCheckWeight] = useState("");
  const [measurements, setMeasurements] = useState({ chest: "102", waist: "82", arm: "40", thigh: "60", hips: "97" });

  const todayWorkout = {
    name: "Day 1 — Chest & Triceps",
    exercises: [
      { ...MOCK_EXERCISES[0], sets: 4, reps: "8-10", rest: 90 },
      { ...MOCK_EXERCISES[6], sets: 3, reps: "10-12", rest: 60 },
    ]
  };

  const showToast = (msg, color = C.green) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleSet = (exId, setNum) => {
    const key = `${exId}-${setNum}`;
    setCompletedSets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const navItems = [
    { icon: "🏠", label: "Home", active: page === "home", onClick: () => setPage("home") },
    { icon: "💪", label: "Today's Workout", active: page === "workout", onClick: () => setPage("workout") },
    { icon: "📅", label: "Schedule", active: page === "schedule", onClick: () => setPage("schedule") },
    { icon: "🥗", label: "My Meal Plan", active: page === "meals", onClick: () => setPage("meals") },
    { icon: "🔥", label: "Calories & Macros", active: page === "calories", onClick: () => setPage("calories") },
    { icon: "📈", label: "My Progress", active: page === "progress", onClick: () => setPage("progress") },
    { icon: "📏", label: "Measurements", active: page === "measurements", onClick: () => setPage("measurements") },
    { icon: "📷", label: "Progress Photos", active: page === "photos", onClick: () => setPage("photos") },
    { icon: "💬", label: "Coach Chat", active: page === "chat", onClick: () => setPage("chat"), badge: 1 },
    { icon: "👤", label: "Profile", active: page === "profile", onClick: () => setPage("profile") },
  ];

  const logo = (
    <div style={{ fontSize: 14, fontWeight: 900, letterSpacing: 2, color: C.white }}>
      ALPHA<span style={{ color: C.accent }}>FIT</span>
    </div>
  );

  const headerRight = (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ fontSize: 12, color: C.dim }}>Day 42 of 56</div>
      <div style={{ width: 80, height: 6, background: C.graphite, borderRadius: 3 }}>
        <div style={{ width: "75%", height: "100%", background: C.accent, borderRadius: 3 }} />
      </div>
      <Badge color={C.green}>On Track</Badge>
      <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.graphite, display: "flex", alignItems: "center", justifyContent: "center" }}>👤</div>
      <Btn variant="secondary" onClick={logout} style={{ fontSize: 12, padding: "6px 14px" }}>Logout</Btn>
    </div>
  );

  return (
    <SidebarLayout logo={logo} nav={navItems} headerRight={headerRight}>
      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, background: toast.color, color: C.black, padding: "12px 20px", borderRadius: 8, fontWeight: 600, fontSize: 13, zIndex: 9999 }}>
          {toast.msg}
        </div>
      )}

      {/* ── HOME ── */}
      {page === "home" && (
        <div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: C.accent, letterSpacing: 2, marginBottom: 4 }}>// GOOD MORNING</div>
            <h1 style={{ fontSize: 28, color: C.white, fontWeight: 700 }}>Hey Omar 👋 Let's crush it today!</h1>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
            <Stat label="Day Streak 🔥" value="12" sub="Keep it up!" />
            <Stat label="Today's Calories" value="1,840" color={C.accent3} sub="Target: 2,800" />
            <Stat label="Protein Today" value="132g" color={C.green} sub="Target: 200g" />
            <Stat label="This Week" value="3/3" color={C.accent} sub="Sessions done" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <Card style={{ padding: 24, cursor: "pointer", border: `1px solid ${C.accent}` }} onClick={() => setPage("workout")}>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: `${C.accent}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>💪</div>
                <div>
                  <div style={{ fontSize: 11, color: C.accent, letterSpacing: 1, marginBottom: 2 }}>TODAY'S WORKOUT</div>
                  <div style={{ fontSize: 16, color: C.white, fontWeight: 700 }}>{todayWorkout.name}</div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: C.dim, marginBottom: 16 }}>{todayWorkout.exercises.length} exercises · ~45 minutes</div>
              <Btn style={{ width: "100%", padding: "12px" }}>▶ Start Workout</Btn>
            </Card>
            <Card style={{ padding: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.white, marginBottom: 14 }}>Macro Ring — Today</div>
              <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
                {[["🔥", "Calories", 66, C.accent], ["💪", "Protein", 66, C.accent3], ["🌾", "Carbs", 52, C.green], ["🥑", "Fat", 58, C.accent2]].map(([icon, label, pct, color]) => (
                  <div key={label} style={{ textAlign: "center" }}>
                    <div style={{ width: 56, height: 56, borderRadius: "50%", background: `conic-gradient(${color} ${pct * 3.6}deg, ${C.graphite} 0)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 6px", position: "relative" }}>
                      <div style={{ width: 42, height: 42, borderRadius: "50%", background: C.carbon, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{icon}</div>
                    </div>
                    <div style={{ fontSize: 10, color: C.dim }}>{label}</div>
                    <div style={{ fontSize: 11, color, fontWeight: 600 }}>{pct}%</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
            <Card style={{ padding: 16, cursor: "pointer" }} onClick={() => setPage("meals")}>
              <div style={{ fontSize: 20, marginBottom: 8 }}>🥗</div>
              <div style={{ fontSize: 13, color: C.white, fontWeight: 600 }}>Next Meal</div>
              <div style={{ fontSize: 12, color: C.dim }}>Lunch — 700 kcal</div>
              <div style={{ fontSize: 11, color: C.accent3, marginTop: 4 }}>In 1h 30m</div>
            </Card>
            <Card style={{ padding: 16, cursor: "pointer" }} onClick={() => setPage("progress")}>
              <div style={{ fontSize: 20, marginBottom: 8 }}>📈</div>
              <div style={{ fontSize: 13, color: C.white, fontWeight: 600 }}>Weight Trend</div>
              <div style={{ fontSize: 12, color: C.green }}>↓ −3kg since start</div>
              <div style={{ fontSize: 11, color: C.dim, marginTop: 4 }}>Last: 82kg</div>
            </Card>
            <Card style={{ padding: 16, cursor: "pointer" }} onClick={() => setPage("chat")}>
              <div style={{ fontSize: 20, marginBottom: 8 }}>💬</div>
              <div style={{ fontSize: 13, color: C.white, fontWeight: 600 }}>Coach Message</div>
              <div style={{ fontSize: 12, color: C.dim, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>Sure Omar! Just make sure...</div>
              <Badge color={C.accent2} style={{ marginTop: 6, fontSize: 9 }}>1 unread</Badge>
            </Card>
          </div>
        </div>
      )}

      {/* ── WORKOUT ── */}
      {page === "workout" && (
        <div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: C.accent, letterSpacing: 2, marginBottom: 4 }}>// TODAY'S SESSION</div>
            <h1 style={{ fontSize: 24, color: C.white, fontWeight: 700 }}>{todayWorkout.name}</h1>
          </div>
          {todayWorkout.exercises.map((ex, exIdx) => (
            <Card key={ex.id} style={{ marginBottom: 12, overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${C.accent}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>💪</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, color: C.white, fontWeight: 600 }}>{ex.name}</div>
                  <div style={{ fontSize: 12, color: C.dim }}>{ex.muscle} · {ex.equipment}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 13, color: C.accent, fontWeight: 600 }}>{ex.sets} × {ex.reps}</div>
                  <div style={{ fontSize: 11, color: C.dim }}>{ex.rest}s rest</div>
                </div>
                <Btn variant="secondary" style={{ fontSize: 11, padding: "5px 10px" }} onClick={() => setModal({ type: "exercise-view", ex })}>📹 Watch</Btn>
              </div>
              <div style={{ padding: "12px 20px" }}>
                <div style={{ fontSize: 11, color: C.dim, marginBottom: 10, letterSpacing: 1 }}>LOG SETS</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {Array.from({ length: ex.sets }, (_, i) => {
                    const key = `${ex.id}-${i}`;
                    const done = completedSets[key];
                    return (
                      <button key={i} onClick={() => toggleSet(ex.id, i)} style={{
                        padding: "8px 16px", borderRadius: 8, border: `1px solid ${done ? C.green : C.border}`,
                        background: done ? `${C.green}18` : C.steel, color: done ? C.green : C.dim,
                        fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s"
                      }}>Set {i + 1} {done ? "✓" : ""}</button>
                    );
                  })}
                </div>
              </div>
            </Card>
          ))}
          <div style={{ marginTop: 20 }}>
            <Btn style={{ width: "100%", padding: "14px", fontSize: 15 }} onClick={() => {
              showToast("Session logged! Coach notified. 🎉");
              setPage("home");
            }}>✅ Complete Workout</Btn>
          </div>
        </div>
      )}

      {/* ── SCHEDULE ── */}
      {page === "schedule" && (
        <div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: C.accent, letterSpacing: 2, marginBottom: 4 }}>// WORKOUT SCHEDULE</div>
            <h1 style={{ fontSize: 24, color: C.white, fontWeight: 700 }}>This Week</h1>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 8, marginBottom: 24 }}>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
              const isToday = i === 0;
              const isWorkout = [0, 2, 4].includes(i);
              return (
                <Card key={day} style={{ padding: 12, textAlign: "center", border: isToday ? `1px solid ${C.accent}` : `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 11, color: isToday ? C.accent : C.dim, marginBottom: 6 }}>{day}</div>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{isWorkout ? "💪" : "😴"}</div>
                  <div style={{ fontSize: 10, color: isWorkout ? C.text : C.muted }}>{isWorkout ? (i === 0 ? "Chest" : i === 2 ? "Back" : "Legs") : "Rest"}</div>
                </Card>
              );
            })}
          </div>
          <Card style={{ padding: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.white, marginBottom: 16 }}>Full Program — Week 6 of 8</div>
            {["Chest & Triceps", "Rest Day", "Back & Biceps", "Rest Day", "Legs & Shoulders"].map((day, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: day === "Rest Day" ? C.graphite : `${C.accent}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
                  {day === "Rest Day" ? "😴" : "💪"}
                </div>
                <div>
                  <div style={{ fontSize: 13, color: day === "Rest Day" ? C.dim : C.white }}>{["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"][i]}</div>
                  <div style={{ fontSize: 12, color: C.dim }}>{day}</div>
                </div>
                {i === 0 && <Badge color={C.green} style={{ marginLeft: "auto" }}>Today</Badge>}
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* ── MEALS ── */}
      {page === "meals" && (
        <div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: C.accent, letterSpacing: 2, marginBottom: 4 }}>// NUTRITION PLAN</div>
            <h1 style={{ fontSize: 24, color: C.white, fontWeight: 700 }}>My Meal Plan</h1>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
            {[["🔥 Target", "2800 kcal", C.accent], ["💪 Protein", "200g", C.accent3], ["🌾 Carbs", "320g", C.green], ["🥑 Fat", "78g", C.accent2]].map(([k, v, c]) => (
              <Card key={k} style={{ padding: 14, textAlign: "center" }}>
                <div style={{ fontSize: 11, color: C.dim }}>{k}</div>
                <div style={{ fontSize: 20, color: c, fontWeight: 700 }}>{v}</div>
              </Card>
            ))}
          </div>
          {[
            { time: "7:00 AM", name: "Breakfast", cals: 560, p: 40, c: 60, f: 15, foods: "Oatmeal (100g) + 3 Eggs + Banana + Whey Protein" },
            { time: "10:30 AM", name: "Mid-Morning Snack", cals: 350, p: 30, c: 35, f: 10, foods: "Greek Yogurt (200g) + Mixed Nuts + Berries" },
            { time: "1:00 PM", name: "Lunch", cals: 700, p: 55, c: 80, f: 20, foods: "Chicken Breast (200g) + Brown Rice (150g) + Salad" },
            { time: "4:30 PM", name: "Pre-Workout", cals: 420, p: 35, c: 55, f: 8, foods: "Banana + Rice Cake (2) + Whey Protein Shake" },
            { time: "8:00 PM", name: "Dinner", cals: 770, p: 60, c: 90, f: 25, foods: "Salmon Fillet (180g) + Sweet Potato (200g) + Broccoli" },
          ].map((meal, i) => (
            <Card key={i} style={{ marginBottom: 10, padding: "16px 20px", display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{ flexShrink: 0 }}>
                <div style={{ fontSize: 11, color: C.dim, marginBottom: 2 }}>{meal.time}</div>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.accent, marginLeft: 16 }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, color: C.white, fontWeight: 600, marginBottom: 4 }}>{meal.name}</div>
                <div style={{ fontSize: 12, color: C.dim }}>{meal.foods}</div>
              </div>
              <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
                {[["🔥", meal.cals + " kcal", C.accent], ["💪", meal.p + "g", C.accent3], ["🌾", meal.c + "g", C.green]].map(([icon, val, c]) => (
                  <div key={icon} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 14 }}>{icon}</div>
                    <div style={{ fontSize: 11, color: c, fontWeight: 600 }}>{val}</div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── CALORIES ── */}
      {page === "calories" && (
        <div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: C.accent, letterSpacing: 2, marginBottom: 4 }}>// DAILY TRACKER</div>
            <h1 style={{ fontSize: 24, color: C.white, fontWeight: 700 }}>Calories & Macros Today</h1>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
            {[
              { label: "Calories", current: 1840, target: 2800, color: C.accent, unit: "kcal" },
              { label: "Protein", current: 132, target: 200, color: C.accent3, unit: "g" },
              { label: "Carbohydrates", current: 167, target: 320, color: C.green, unit: "g" },
              { label: "Fat", current: 45, target: 78, color: C.accent2, unit: "g" },
            ].map(macro => {
              const pct = Math.round((macro.current / macro.target) * 100);
              return (
                <Card key={macro.label} style={{ padding: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ fontSize: 14, color: C.white, fontWeight: 600 }}>{macro.label}</span>
                    <span style={{ fontSize: 13, color: macro.color, fontWeight: 700 }}>{pct}%</span>
                  </div>
                  <div style={{ height: 8, background: C.graphite, borderRadius: 4, marginBottom: 8 }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: macro.color, borderRadius: 4, transition: "width 0.5s" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                    <span style={{ color: C.white }}>{macro.current}{macro.unit} consumed</span>
                    <span style={{ color: C.dim }}>{macro.target - macro.current}{macro.unit} remaining</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* ── PROGRESS ── */}
      {page === "progress" && (
        <div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: C.accent, letterSpacing: 2, marginBottom: 4 }}>// PROGRESS TRACKING</div>
            <h1 style={{ fontSize: 24, color: C.white, fontWeight: 700 }}>My Progress</h1>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
            <Stat label="Starting Weight" value="85kg" color={C.dim} />
            <Stat label="Current Weight" value="82kg" color={C.accent3} />
            <Stat label="Total Lost" value="−3kg" color={C.green} />
          </div>
          <Card style={{ padding: 24, marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.white, marginBottom: 16 }}>Weight History</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 100 }}>
              {[85, 84.5, 84, 83.5, 83, 82.5, 82, 82].map((w, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ fontSize: 9, color: C.dim }}>{w}</div>
                  <div style={{ width: "100%", height: `${((w - 80) / 6) * 80}px`, background: `linear-gradient(to top, ${C.accent3}, ${C.accent3}50)`, borderRadius: "2px 2px 0 0" }} />
                  <div style={{ fontSize: 8, color: C.muted }}>W{i + 1}</div>
                </div>
              ))}
            </div>
          </Card>
          <Card style={{ padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.white, marginBottom: 14 }}>Log Today's Weight</div>
            <div style={{ display: "flex", gap: 10 }}>
              <input value={checkWeight} onChange={e => setCheckWeight(e.target.value)} placeholder="e.g. 82.0" type="number"
                style={{ flex: 1, padding: "10px 14px", background: C.steel, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white, fontSize: 14, outline: "none", fontFamily: "inherit" }} />
              <Btn onClick={() => { showToast(`Weight ${checkWeight}kg logged! 📊`); setCheckWeight(""); }}>Log Weight</Btn>
            </div>
          </Card>
        </div>
      )}

      {/* ── MEASUREMENTS ── */}
      {page === "measurements" && (
        <div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: C.accent, letterSpacing: 2, marginBottom: 4 }}>// BODY MEASUREMENTS</div>
            <h1 style={{ fontSize: 24, color: C.white, fontWeight: 700 }}>Body Measurements</h1>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Card style={{ padding: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.white, marginBottom: 16 }}>Update Measurements</div>
              {Object.entries(measurements).map(([key, val]) => (
                <Input key={key} label={key.charAt(0).toUpperCase() + key.slice(1) + " (cm)"}
                  value={val} onChange={e => setMeasurements({ ...measurements, [key]: e.target.value })} />
              ))}
              <Btn onClick={() => showToast("Measurements saved! 📏")} style={{ width: "100%" }}>Save Measurements</Btn>
            </Card>
            <Card style={{ padding: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.white, marginBottom: 16 }}>Current Stats</div>
              {[
                ["Weight", "82 kg", "↓ −3kg"], ["Body Fat", "18%", "↓ −2%"],
                ["Chest", measurements.chest + " cm", "↑ +2cm"], ["Waist", measurements.waist + " cm", "↓ −4cm"],
                ["Arm", measurements.arm + " cm", "↑ +1.5cm"], ["Thigh", measurements.thigh + " cm", "↑ +1cm"],
              ].map(([k, v, delta]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 13, color: C.dim }}>{k}</span>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={{ fontSize: 14, color: C.white, fontWeight: 600 }}>{v}</span>
                    <span style={{ fontSize: 11, color: delta.includes("↑") ? C.green : delta.includes("↓") ? C.accent3 : C.dim }}>{delta}</span>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}

      {/* ── PHOTOS ── */}
      {page === "photos" && (
        <div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: C.accent, letterSpacing: 2, marginBottom: 4 }}>// PROGRESS PHOTOS</div>
            <h1 style={{ fontSize: 24, color: C.white, fontWeight: 700 }}>Progress Photos</h1>
          </div>
          <div style={{ marginBottom: 20 }}>
            <Btn onClick={() => showToast("Upload a photo via the mobile app!")} style={{ marginRight: 10 }}>📷 Upload New Photo</Btn>
            <Btn variant="secondary">Compare Before/After</Btn>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
            {["Week 1 — Front", "Week 4 — Front", "Week 6 — Front", "Week 1 — Side", "Week 4 — Side", "Week 6 — Side"].map((label, i) => (
              <Card key={i} style={{ padding: 0, overflow: "hidden", cursor: "pointer" }}>
                <div style={{ height: 180, background: `linear-gradient(135deg, ${C.graphite}, ${C.steel})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>
                  {i % 2 === 0 ? "🏋️" : "💪"}
                </div>
                <div style={{ padding: "10px 14px" }}>
                  <div style={{ fontSize: 12, color: C.text }}>{label}</div>
                  <div style={{ fontSize: 10, color: C.dim, marginTop: 2 }}>Weight: {[85, 83.5, 82][i % 3]}kg</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ── CHAT ── */}
      {page === "chat" && (
        <div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: C.accent, letterSpacing: 2, marginBottom: 4 }}>// COACH CHAT</div>
            <h1 style={{ fontSize: 24, color: C.white, fontWeight: 700 }}>Chat with Coach</h1>
          </div>
          <Card style={{ height: "calc(100vh - 220px)", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: `${C.accent}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🏋️</div>
              <div>
                <div style={{ fontSize: 14, color: C.white, fontWeight: 600 }}>Ahmed Al-Rashid</div>
                <div style={{ fontSize: 11, color: C.green }}>● Online · Alpha Fitness</div>
              </div>
            </div>
            <div style={{ flex: 1, padding: 20, overflowY: "auto" }}>
              {chatMessages.map(m => (
                <div key={m.id} style={{ marginBottom: 14, display: "flex", flexDirection: "column", alignItems: m.from === "Omar Faris" ? "flex-end" : "flex-start" }}>
                  <div style={{ fontSize: 10, color: C.dim, marginBottom: 4 }}>{m.from} · {m.time}</div>
                  <div style={{
                    padding: "10px 14px", borderRadius: 12, maxWidth: "65%", fontSize: 13,
                    background: m.from === "Omar Faris" ? C.accent : C.graphite,
                    color: m.from === "Omar Faris" ? C.black : C.text,
                    borderBottomRightRadius: m.from === "Omar Faris" ? 4 : 12,
                    borderBottomLeftRadius: m.from !== "Omar Faris" ? 4 : 12,
                  }}>{m.text}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: "12px 20px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 8 }}>
              <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && chatInput.trim()) {
                    setChatMessages([...chatMessages, { id: Date.now(), from: "Omar Faris", to: "Coach", text: chatInput, time: "now", read: false }]);
                    setChatInput("");
                  }
                }}
                placeholder="Message your coach..." style={{
                  flex: 1, padding: "10px 14px", background: C.steel, border: `1px solid ${C.border}`,
                  borderRadius: 8, color: C.white, fontSize: 13, outline: "none", fontFamily: "inherit"
                }} />
              <Btn onClick={() => {
                if (chatInput.trim()) {
                  setChatMessages([...chatMessages, { id: Date.now(), from: "Omar Faris", to: "Coach", text: chatInput, time: "now", read: false }]);
                  setChatInput("");
                }
              }}>Send</Btn>
            </div>
          </Card>
        </div>
      )}

      {/* ── PROFILE ── */}
      {page === "profile" && (
        <div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: C.accent, letterSpacing: 2, marginBottom: 4 }}>// MY PROFILE</div>
            <h1 style={{ fontSize: 24, color: C.white, fontWeight: 700 }}>Profile & Settings</h1>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Card style={{ padding: 24 }}>
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: C.graphite, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 12px" }}>👤</div>
                <div style={{ fontSize: 18, color: C.white, fontWeight: 600 }}>{user?.name}</div>
                <Badge color={C.green} style={{ marginTop: 6, display: "inline-block" }}>Active Trainee</Badge>
              </div>
              <Input label="Full Name" value={user?.name || "Omar Faris"} onChange={() => {}} />
              <Input label="Email" type="email" value="omar@trainee.com" onChange={() => {}} />
              <Input label="Phone" value="+966 50 123 4567" onChange={() => {}} />
              <Btn onClick={() => showToast("Profile updated!")} style={{ width: "100%" }}>Save Changes</Btn>
            </Card>
            <div>
              <Card style={{ padding: 20, marginBottom: 12 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.white, marginBottom: 14 }}>Preferences</div>
                {[
                  { label: "Push Notifications", desc: "Workout reminders and messages", enabled: true },
                  { label: "Weekly Check-in Reminder", desc: "Every Monday at 9:00 AM", enabled: true },
                  { label: "Email Updates", desc: "Weekly progress summary", enabled: false },
                ].map(pref => (
                  <div key={pref.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                    <div>
                      <div style={{ fontSize: 13, color: C.white }}>{pref.label}</div>
                      <div style={{ fontSize: 11, color: C.dim }}>{pref.desc}</div>
                    </div>
                    <div style={{ width: 40, height: 22, borderRadius: 11, background: pref.enabled ? C.green : C.graphite, cursor: "pointer", position: "relative" }}
                      onClick={() => showToast("Preference updated!")}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.white, position: "absolute", top: 2, left: pref.enabled ? 20 : 2, transition: "left 0.2s" }} />
                    </div>
                  </div>
                ))}
              </Card>
              <Card style={{ padding: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.white, marginBottom: 14 }}>Language</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Btn style={{ flex: 1, fontSize: 13 }}>🇺🇸 English</Btn>
                  <Btn variant="secondary" style={{ flex: 1, fontSize: 13 }}>🇸🇦 العربية</Btn>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* ── MODALS ── */}
      <Modal open={modal?.type === "exercise-view"} onClose={() => setModal(null)} title={modal?.ex?.name || ""}>
        {modal?.ex && (
          <div>
            <div style={{ height: 180, background: `linear-gradient(135deg, ${C.graphite}, ${C.steel})`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 60, marginBottom: 16 }}>
              💪
            </div>
            <div style={{ fontSize: 12, color: C.dim, marginBottom: 4 }}>🎥 Video tutorial available in mobile app</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginTop: 14 }}>
              {[["Muscle", modal.ex.muscle], ["Sets", modal.ex.sets], ["Reps", modal.ex.reps], ["Rest", modal.ex.rest + "s"], ["Equipment", modal.ex.equipment], ["Level", modal.ex.level]].map(([k, v]) => (
                <div key={k} style={{ background: C.steel, padding: "10px", borderRadius: 8, textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: C.dim }}>{k}</div>
                  <div style={{ fontSize: 12, color: C.white, fontWeight: 600 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, padding: 12, background: C.steel, borderRadius: 8, fontSize: 12, color: C.dim }}>
              <strong style={{ color: C.accent3 }}>Instructions:</strong> Keep your back flat on the bench, grip the bar slightly wider than shoulder-width. Lower slowly (3 seconds), pause, then press explosively.
            </div>
          </div>
        )}
      </Modal>
    </SidebarLayout>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════════════════════
export default function IronCoach() {
  const [user, setUser] = useState(null);

  const login = (role, userData) => setUser({ role, ...userData });
  const logout = () => setUser(null);

  return (
    <AppCtx.Provider value={{ user, login, logout }}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #080808; font-family: 'DM Sans', sans-serif; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: #080808; }
        ::-webkit-scrollbar-thumb { background: #242424; border-radius: 3px; }
        input::placeholder { color: #444; }
        select option { background: #1a1a1a; }
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;900&display=swap');
      `}</style>
      {!user && <LoginPage />}
      {user?.role === "admin" && <AdminDashboard />}
      {user?.role === "coach" && <CoachDashboard />}
      {user?.role === "trainee" && <TraineeDashboard />}
    </AppCtx.Provider>
  );
}
