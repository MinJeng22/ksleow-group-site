import re

with open('src/pages/KSOmni.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add HistoryIcon and CloseIcon
icons_to_add = '''
const HistoryIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </svg>
);
const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const DeleteIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);
'''
content = content.replace('/* -- Page-specific icons (Send / Close come from chatbotShared) -- */', '/* -- Page-specific icons (Send / Close come from chatbotShared) -- */' + icons_to_add)

# 2. Replace getChatStorageKey with new helper functions
helpers = '''
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
function getSessionsListKey(machineId) {
  return ks_omni_sessions_;
}
function getSessionMessagesKey(machineId, sessionId) {
  return ks_omni_chat__;
}
'''
content = re.sub(r'function getChatStorageKey\(machineId\)\s*\{.*?\}', helpers, content, flags=re.DOTALL)

# 3. State replacements
state_old = '''  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(getChatStorageKey(machineId));
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });'''
state_new = '''  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessions, setSessions] = useState(() => {
    try {
      const saved = localStorage.getItem(getSessionsListKey(machineId));
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });
  const [activeSessionId, setActiveSessionId] = useState(() => {
    try {
      const saved = localStorage.getItem(getSessionsListKey(machineId));
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) return parsed[0].id;
      }
    } catch (e) {}
    return generateId();
  });
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(getSessionMessagesKey(machineId, activeSessionId));
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // When active session changes, load messages
  useEffect(() => {
    try {
      const saved = localStorage.getItem(getSessionMessagesKey(machineId, activeSessionId));
      setMessages(saved ? JSON.parse(saved) : []);
    } catch (e) {
      setMessages([]);
    }
  }, [activeSessionId, machineId]);
'''
content = content.replace(state_old, state_new)

# 4. Save messages useEffect
save_old = r'// Save messages to local storage and clean up old days.*?\]\);'
save_new = '''  // Save messages and update session list preview
  useEffect(() => {
    if (messages.length === 0) return;
    const msgKey = getSessionMessagesKey(machineId, activeSessionId);
    localStorage.setItem(msgKey, JSON.stringify(messages));

    setSessions(prev => {
      const existingIdx = prev.findIndex(s => s.id === activeSessionId);
      const userMsg = messages.find(m => m.role === "user");
      const preview = userMsg ? userMsg.text.substring(0, 50) : "New Conversation";
      
      const newSessionInfo = {
        id: activeSessionId,
        date: new Date().toISOString(),
        preview: preview
      };

      let next;
      if (existingIdx >= 0) {
        next = [...prev];
        next[existingIdx] = { ...next[existingIdx], preview, date: existingIdx === 0 ? next[existingIdx].date : new Date().toISOString() };
      } else {
        next = [newSessionInfo, ...prev];
      }
      localStorage.setItem(getSessionsListKey(machineId), JSON.stringify(next));
      return next;
    });
  }, [messages, activeSessionId, machineId]);'''
content = re.sub(save_old, save_new, content, flags=re.DOTALL)

# 5. clearChat -> startNewChat and deleteSession
clear_old = r'  function clearChat\(\) \{.*?setPasteError\(""\);\s*\}'
clear_new = '''  function startNewChat() {
    abortRef.current?.abort();
    setActiveSessionId(generateId());
    setInput("");
    setAttachedImage(null);
    setPasteError("");
    if (isMobile) setSidebarOpen(false);
  }

  function deleteSession(id) {
    localStorage.removeItem(getSessionMessagesKey(machineId, id));
    setSessions(prev => {
      const next = prev.filter(s => s.id !== id);
      localStorage.setItem(getSessionsListKey(machineId), JSON.stringify(next));
      if (id === activeSessionId) {
        if (next.length > 0) setActiveSessionId(next[0].id);
        else startNewChat();
      }
      return next;
    });
  }'''
content = re.sub(clear_old, clear_new, content, flags=re.DOTALL)

# 6. Replace onClick={clearChat} with onClick={startNewChat}
content = content.replace('onClick={clearChat}', 'onClick={startNewChat}')

# 7. Add layout wrapper and sidebar UI
layout_old = '''    <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "radial-gradient(ellipse at 50% 0%, rgba(47, 49, 90, 0.5) 0%, transparent 60%), radial-gradient(circle at 85% 15%, rgba(201, 168, 76, 0.08) 0%, transparent 45%), linear-gradient(to bottom, #111328, #0c0e1a)" }}>
    <div ref={contentRef} style={{ position: "absolute", top: 0, left: 0, right: 0, height: "100dvh", display: "flex", flexDirection: "column" }}>'''

layout_new = '''    <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "radial-gradient(ellipse at 50% 0%, rgba(47, 49, 90, 0.5) 0%, transparent 60%), radial-gradient(circle at 85% 15%, rgba(201, 168, 76, 0.08) 0%, transparent 45%), linear-gradient(to bottom, #111328, #0c0e1a)", display: "flex" }}>
      
      {/* -- Sidebar (Desktop Fixed, Mobile Overlay) -- */}
      <div style={{
        width: isMobile ? 280 : (sidebarOpen ? 260 : 0),
        position: isMobile ? "fixed" : "relative",
        top: 0, bottom: 0, left: 0, zIndex: 2000,
        background: isMobile ? "rgba(12, 14, 26, 0.95)" : "rgba(12, 14, 26, 0.3)",
        backdropFilter: "blur(20px)",
        borderRight: (isMobile || sidebarOpen) ? "1px solid rgba(255,255,255,0.05)" : "none",
        transform: isMobile ? (sidebarOpen ? "translateX(0)" : "translateX(-100%)") : "none",
        transition: "width 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
        overflow: "hidden",
      }}>
        <div style={{ width: isMobile ? 280 : 260, padding: "max(1rem, env(safe-area-inset-top)) 1rem 1rem", height: "100%", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <span style={{ color: "rgba(255,255,255,0.9)", fontWeight: 700, fontSize: "1rem", letterSpacing: "0.02em" }}>Chat History</span>
            {isMobile && (
              <button onClick={() => setSidebarOpen(false)} style={{ background: "transparent", border: "none", color: "#6b6f91", padding: "0.5rem", cursor: "pointer" }}>
                <CloseIcon />
              </button>
            )}
          </div>
          <button onClick={startNewChat} className="lg-glass lg-glass-btn lg-glass-pill" style={{ width: "100%", justifyContent: "center", marginBottom: "1.5rem", color: "#ffffff", gap: "0.4rem" }}>
            <NewChatIcon />
            <span>New Chat</span>
          </button>
          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.5rem", paddingRight: "0.25rem" }}>
            {sessions.map(s => (
              <div key={s.id} onClick={() => { setActiveSessionId(s.id); if(isMobile) setSidebarOpen(false); }}
                   style={{ padding: "0.85rem 1rem", borderRadius: "12px", background: activeSessionId === s.id ? "rgba(255,255,255,0.08)" : "transparent", cursor: "pointer", transition: "background 0.2s", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid rgba(255,255,255,0.03)" }}>
                 <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, color: "rgba(255,255,255,0.8)", fontSize: "0.85rem" }}>
                   {s.preview || "New Conversation"}
                 </div>
                 <button onClick={(e) => { e.stopPropagation(); deleteSession(s.id); }} style={{ background: "transparent", border: "none", color: "#6b6f91", padding: "0.25rem", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                   <DeleteIcon size={14} />
                 </button>
              </div>
            ))}
            {sessions.length === 0 && (
              <div style={{ color: "#6b6f91", fontSize: "0.85rem", textAlign: "center", marginTop: "2rem" }}>No history found</div>
            )}
          </div>
        </div>
      </div>

      {/* -- Mobile Overlay -- */}
      {isMobile && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1999 }} />
      )}

      {/* -- Main Chat Area -- */}
      <div style={{ flex: 1, position: "relative" }}>
        <div ref={contentRef} style={{ position: "absolute", top: 0, left: 0, right: 0, height: "100dvh", display: "flex", flexDirection: "column" }}>'''
content = content.replace(layout_old, layout_new)

# 8. Add closing div at the very end (before outer div closes)
# Search for closing tag of main wrapper
end_old = '''    </div>
  );
}'''
end_new = '''      </div>
    </div>
  );
}'''
content = content.replace(end_old, end_new)

# 9. Update Top Left nav with History Button
nav_left_old = '''        <div className="omni-top-group">
          {!isMobile && (
            <button className="lg-glass lg-glass-btn lg-glass-pill" style={{ color: "#ffffff", gap: "0.4rem" }} onClick={goHome} aria-label="Back" title="Back">
              <BackIcon />
              <span>Back</span>
            </button>
          )}
        </div>'''
nav_left_new = '''        <div className="omni-top-group">
          <button className="lg-glass lg-glass-btn lg-glass-pill" style={{ color: "#ffffff", gap: "0.4rem" }} onClick={() => setSidebarOpen(prev => !prev)} aria-label="History" title="History">
            <HistoryIcon />
            {!isMobile && <span>History</span>}
          </button>
          {!isMobile && (
            <button className="lg-glass lg-glass-btn lg-glass-pill" style={{ color: "#ffffff", gap: "0.4rem" }} onClick={goHome} aria-label="Back" title="Back">
              <BackIcon />
              <span>Back</span>
            </button>
          )}
        </div>'''
content = content.replace(nav_left_old, nav_left_new)

# 10. Remove the New Chat button from top-right since it is now in the sidebar
nav_right_old = '''          <button 
            className="lg-glass lg-glass-btn lg-glass-pill" 
            style={{ color: "#ffffff", gap: "0.4rem" }}
            onClick={startNewChat} 
            aria-label="New Chat"
            title="New Chat"
          >
            <NewChatIcon />
            <span>New Chat</span>
          </button>'''
content = content.replace(nav_right_old, "")

with open('src/pages/KSOmni.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
