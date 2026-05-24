// ─── Drop-in replacement for the CRM tab in AgentDashboard.jsx ───────────────
// Replace: {tab === "crm" && ( ... )} with this component render
// Add this component above AgentDashboard export

function CRMTab({ inquiries, onStatusUpdate }) {
  const [expandedId, setExpandedId] = useState(null);
  const [noteTarget, setNoteTarget] = useState(null);
  const [noteText, setNoteText]     = useState("");
  const [savingId,  setSavingId]    = useState(null);
  const [filterStatus, setFilter]   = useState("all");

  const PIPELINE = [
    { key: "new",             label: "New",             color: "#2563eb", bg: "#dbeafe" },
    { key: "contacted",       label: "Contacted",       color: "#7c3aed", bg: "#ede9fe" },
    { key: "visit_scheduled", label: "Visit Scheduled", color: "#0891b2", bg: "#cffafe" },
    { key: "negotiating",     label: "Negotiating",     color: "#d97706", bg: "#fef3c7" },
    { key: "closed",          label: "Closed",          color: "#16a34a", bg: "#dcfce7" },
    { key: "lost",            label: "Lost",            color: "#dc2626", bg: "#fee2e2" },
  ];
  const P_MAP = Object.fromEntries(PIPELINE.map(s => [s.key, s]));

  const filtered = filterStatus === "all"
    ? inquiries
    : inquiries.filter(i => i.status === filterStatus);

  const counts = { all: inquiries.length };
  PIPELINE.forEach(s => { counts[s.key] = inquiries.filter(i => i.status === s.key).length; });

  const changeStatus = async (id, status) => {
    setSavingId(id + status);
    await onStatusUpdate(id, status);
    setSavingId(null);
  };

  const saveNote = async (inq) => {
    setSavingId(inq._id + "note");
    await onStatusUpdate(inq._id, inq.status, noteText);
    setSavingId(null);
    setNoteTarget(null);
    setNoteText("");
  };

  return (
    <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Pipeline summary bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 8 }}>
        {PIPELINE.map(s => (
          <div
            key={s.key}
            onClick={() => setFilter(f => f === s.key ? "all" : s.key)}
            style={{
              background: filterStatus === s.key ? s.bg : "#fff",
              border: `1.5px solid ${filterStatus === s.key ? s.color + "60" : "#e2e8f0"}`,
              borderTop: `3px solid ${s.color}`,
              borderRadius: 10,
              padding: "12px 14px",
              cursor: "pointer",
              transition: "all .15s",
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color, letterSpacing: "-1px" }}>
              {counts[s.key] || 0}
            </div>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: "#0f172a", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter pills */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <button
          onClick={() => setFilter("all")}
          style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, border: "1px solid", cursor: "pointer", fontFamily: "inherit", transition: "all .12s", background: filterStatus === "all" ? "#0f172a" : "none", color: filterStatus === "all" ? "#fff" : "#64748b", borderColor: filterStatus === "all" ? "#0f172a" : "#e2e8f0" }}
        >
          All <span style={{ fontSize: 10.5, background: filterStatus === "all" ? "rgba(255,255,255,.2)" : "#f3f4f6", padding: "1px 6px", borderRadius: 10, color: filterStatus === "all" ? "inherit" : "#94a3b8", marginLeft: 4 }}>{counts.all}</span>
        </button>
        {PIPELINE.map(s => (
          <button key={s.key} onClick={() => setFilter(f => f === s.key ? "all" : s.key)}
            style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all .12s", border: `1px solid ${filterStatus === s.key ? s.color + "50" : "transparent"}`, background: filterStatus === s.key ? s.bg : "transparent", color: filterStatus === s.key ? s.color : "#64748b" }}>
            {s.label}
            <span style={{ fontSize: 10.5, background: "rgba(0,0,0,.08)", padding: "1px 6px", borderRadius: 10, marginLeft: 4 }}>{counts[s.key] || 0}</span>
          </button>
        ))}
      </div>

      {/* Inquiry cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.length === 0 ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "52px", color: "#94a3b8", fontSize: 13.5, fontWeight: 500, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10 }}>
            No inquiries in this stage
          </div>
        ) : filtered.map(inq => {
          const scfg = P_MAP[inq.status] || P_MAP.new;
          const isExp = expandedId === inq._id;
          return (
            <div key={inq._id} style={{ background: "#fff", border: "1px solid #e2e8f0", borderLeft: `3px solid ${scfg.color}`, borderRadius: 10, overflow: "hidden", transition: "box-shadow .15s" }}>
              {/* Card header */}
              <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 12, alignItems: "flex-start", padding: "14px 16px", cursor: "pointer" }}
                onClick={() => setExpandedId(id => id === inq._id ? null : inq._id)}>
                {/* Avatar */}
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#e0e7ff", color: "#4338ca", fontWeight: 800, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {inq.buyerName?.[0]?.toUpperCase()}
                </div>
                {/* Info */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{inq.buyerName}</span>
                    <span style={{ background: scfg.bg, color: scfg.color, fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 20 }}>{scfg.label}</span>
                    {inq.status === "closed" && <span style={{ background: "#dcfce7", color: "#166534", fontSize: 10.5, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>🏆 Sale Closed</span>}
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 3, display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {inq.buyerEmail && <span style={{ display: "flex", alignItems: "center", gap: 3 }}>✉ {inq.buyerEmail}</span>}
                    {inq.buyerPhone && <span style={{ display: "flex", alignItems: "center", gap: 3 }}>📞 {inq.buyerPhone}</span>}
                  </div>
                  {inq.propertyId && (
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 6, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 7, padding: "4px 10px", fontSize: 12, fontWeight: 600, color: "#334155" }}>
                      🏠 {inq.propertyId.title} {inq.propertyId.price && <span style={{ color: "#64748b", fontWeight: 400 }}>· ₹{Number(inq.propertyId.price).toLocaleString("en-IN")}</span>}
                    </div>
                  )}
                  {inq.sellerId && (
                    <div style={{ fontSize: 11.5, color: "#94a3b8", marginTop: 4 }}>
                      Seller: <span style={{ fontWeight: 600, color: "#64748b" }}>{inq.sellerId.name}</span>
                    </div>
                  )}
                </div>
                {/* Right: date + chevron */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                  <span style={{ fontSize: 11.5, color: "#94a3b8" }}>
                    {new Date(inq.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                  </span>
                  <span style={{ fontSize: 11, color: "#94a3b8", transform: isExp ? "rotate(180deg)" : "none", transition: "transform .2s" }}>▼</span>
                </div>
              </div>

              {/* Message preview (collapsed) */}
              {!isExp && (
                <div style={{ padding: "0 16px 12px 68px", fontSize: 13, color: "#475569", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {inq.message}
                </div>
              )}

              {/* Expanded body */}
              {isExp && (
                <div style={{ padding: "0 16px 16px 16px", borderTop: "1px solid #f1f5f9" }}>
                  {/* Full message */}
                  <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "12px 14px", fontSize: 13.5, color: "#334155", lineHeight: 1.65, marginTop: 12, whiteSpace: "pre-wrap" }}>
                    {inq.message}
                  </div>

                  {/* Agent note */}
                  {inq.agentNote && noteTarget?._id !== inq._id && (
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginTop: 10, background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: 8, padding: "8px 12px" }}>
                      <span style={{ fontSize: 13 }}>📝</span>
                      <span style={{ fontSize: 12.5, color: "#78350f", lineHeight: 1.5 }}>{inq.agentNote}</span>
                    </div>
                  )}

                  {/* Note editor */}
                  {noteTarget?._id === inq._id && (
                    <div style={{ marginTop: 10 }}>
                      <textarea
                        autoFocus
                        value={noteText}
                        onChange={e => setNoteText(e.target.value)}
                        placeholder="Add a note about this inquiry…"
                        rows={3}
                        style={{ width: "100%", border: "1.5px solid #3b82f6", borderRadius: 8, padding: "10px 12px", fontSize: 13, fontFamily: "inherit", outline: "none", resize: "vertical" }}
                      />
                      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                        <button disabled={savingId === inq._id + "note"} onClick={() => saveNote(inq)}
                          style={{ padding: "7px 16px", background: "#0f172a", color: "#fff", border: "none", borderRadius: 8, fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                          {savingId === inq._id + "note" ? "Saving…" : "Save Note"}
                        </button>
                        <button onClick={() => { setNoteTarget(null); setNoteText(""); }}
                          style={{ padding: "7px 12px", background: "none", color: "#64748b", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Actions row */}
                  <div style={{ marginTop: 14, borderTop: "1px solid #f1f5f9", paddingTop: 12 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "#94a3b8", marginBottom: 8 }}>Move to stage</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {PIPELINE.filter(s => s.key !== inq.status).map(s => (
                        <button key={s.key} disabled={!!savingId} onClick={() => changeStatus(inq._id, s.key)}
                          style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", background: s.bg, color: s.color, border: `1px solid ${s.color}30`, borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", opacity: savingId === inq._id + s.key ? 0.6 : 1 }}>
                          {savingId === inq._id + s.key ? "…" : s.label}
                        </button>
                      ))}
                    </div>

                    {/* Contact + Note buttons */}
                    <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                      {inq.buyerEmail && (
                        <a href={`mailto:${inq.buyerEmail}?subject=Re: ${inq.propertyId?.title || "Property Inquiry"}`}
                          style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "7px 14px", border: "1px solid #bfdbfe", borderRadius: 8, fontSize: 12.5, fontWeight: 600, background: "#eff6ff", color: "#1d4ed8", textDecoration: "none" }}>
                          ✉ Reply
                        </a>
                      )}
                      {inq.buyerPhone && (
                        <a href={`tel:${inq.buyerPhone}`}
                          style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "7px 14px", border: "1px solid #bbf7d0", borderRadius: 8, fontSize: 12.5, fontWeight: 600, background: "#f0fdf4", color: "#15803d", textDecoration: "none" }}>
                          📞 Call
                        </a>
                      )}
                      <button
                        onClick={() => { setNoteTarget(inq); setNoteText(inq.agentNote || ""); }}
                        style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "7px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12.5, fontWeight: 600, background: "#fff", color: "#334155", cursor: "pointer", fontFamily: "inherit" }}>
                        📝 {inq.agentNote ? "Edit Note" : "Add Note"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}