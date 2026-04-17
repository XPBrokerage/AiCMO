import { useState, useEffect, useCallback } from "react";

// ─── SAMPLE DATA (seeded from Alta Brand's niche: medical scrubs) ─────────
const BRAND = {
  name: "Alta Brand",
  url: "shopaltabrand.com",
  niche: "Medical Scrubs & Healthcare Apparel",
  products: [
    "Women's Scrub Tops", "Women's Scrub Pants", "Women's Scrub Jackets",
    "Men's Scrub Tops", "Men's Scrub Pants", "Gift Cards"
  ],
  colors: ["Black", "Burgundy", "Ceil Blue", "Grey", "Navy", "Royal Blue"],
};

const KEYWORD_DATA = [
  { keyword: "best scrubs for nurses", volume: 14800, difficulty: 28, traffic: 890, position: null, intent: "commercial", cluster: "buying-guides", opportunity: 94 },
  { keyword: "most comfortable scrubs", volume: 12100, difficulty: 22, traffic: 0, position: null, intent: "commercial", cluster: "buying-guides", opportunity: 91 },
  { keyword: "scrubs that don't wrinkle", volume: 5400, difficulty: 12, traffic: 0, position: null, intent: "informational", cluster: "fabric-care", opportunity: 89 },
  { keyword: "how to style scrubs", volume: 3600, difficulty: 8, traffic: 0, position: null, intent: "informational", cluster: "style-guides", opportunity: 87 },
  { keyword: "scrub colors meaning hospital", volume: 8200, difficulty: 15, traffic: 0, position: null, intent: "informational", cluster: "education", opportunity: 86 },
  { keyword: "best scrub pants for thick thighs", volume: 6800, difficulty: 18, traffic: 0, position: null, intent: "commercial", cluster: "fit-guides", opportunity: 85 },
  { keyword: "jogger scrub pants women", volume: 9900, difficulty: 32, traffic: 120, position: 24, intent: "transactional", cluster: "product", opportunity: 78 },
  { keyword: "ceil blue scrubs", volume: 4100, difficulty: 20, traffic: 45, position: 18, intent: "transactional", cluster: "product", opportunity: 76 },
  { keyword: "scrubs with pockets for nurses", volume: 7300, difficulty: 25, traffic: 0, position: null, intent: "commercial", cluster: "feature-guides", opportunity: 82 },
  { keyword: "how to shrink scrubs", volume: 4800, difficulty: 6, traffic: 0, position: null, intent: "informational", cluster: "fabric-care", opportunity: 88 },
  { keyword: "scrub top vs scrub jacket", volume: 2900, difficulty: 5, traffic: 0, position: null, intent: "informational", cluster: "education", opportunity: 90 },
  { keyword: "what scrubs do Grey's Anatomy wear", volume: 11500, difficulty: 19, traffic: 0, position: null, intent: "informational", cluster: "pop-culture", opportunity: 83 },
  { keyword: "antimicrobial scrubs worth it", volume: 3200, difficulty: 10, traffic: 0, position: null, intent: "informational", cluster: "fabric-care", opportunity: 88 },
  { keyword: "nursing school scrub requirements", volume: 5100, difficulty: 14, traffic: 0, position: null, intent: "informational", cluster: "education", opportunity: 84 },
  { keyword: "alta brand scrubs review", volume: 320, difficulty: 3, traffic: 280, position: 2, intent: "navigational", cluster: "brand", opportunity: 60 },
];

const CONTENT_CALENDAR = [
  { week: 1, stage: "inspire", title: "The Complete Guide to Scrub Colors: What Each Color Means in Healthcare", keyword: "scrub colors meaning hospital", volume: 8200, products: ["Women's Scrub Tops", "Men's Scrub Tops"], status: "brief-ready" },
  { week: 1, stage: "educate", title: "Best Scrubs for Nurses in 2026: Comfort, Durability & Style Ranked", keyword: "best scrubs for nurses", volume: 14800, products: ["Women's Scrub Tops", "Women's Scrub Pants"], status: "brief-ready" },
  { week: 2, stage: "educate", title: "How to Find Scrubs That Actually Fit Thick Thighs (Without Sizing Up)", keyword: "best scrub pants for thick thighs", volume: 6800, products: ["Women's Scrub Pants"], status: "queued" },
  { week: 2, stage: "inspire", title: "What Scrubs Do They Wear on Grey's Anatomy? (And Where to Get Them)", keyword: "what scrubs do Grey's Anatomy wear", volume: 11500, products: ["Women's Scrub Tops", "Men's Scrub Tops"], status: "queued" },
  { week: 3, stage: "educate", title: "Wrinkle-Free Scrubs: Do They Exist? A Fabric Technology Breakdown", keyword: "scrubs that don't wrinkle", volume: 5400, products: ["Women's Scrub Tops", "Women's Scrub Jackets"], status: "queued" },
  { week: 3, stage: "convert", title: "Jogger Scrub Pants: Why Nurses Are Making the Switch in 2026", keyword: "jogger scrub pants women", volume: 9900, products: ["Women's Scrub Pants"], status: "queued" },
  { week: 4, stage: "educate", title: "How to Shrink Scrubs Back to Size (Without Ruining Them)", keyword: "how to shrink scrubs", volume: 4800, products: [], status: "queued" },
  { week: 4, stage: "inspire", title: "5 Ways to Style Your Scrubs So You Actually Feel Good at Work", keyword: "how to style scrubs", volume: 3600, products: ["Women's Scrub Tops", "Women's Scrub Jackets"], status: "queued" },
];

const COMPETITOR_DATA = [
  { name: "FIGS", domain: "wearfigs.com", keywords: 48200, traffic: 312000, dr: 72 },
  { name: "Jaanuu", domain: "jaanuu.com", keywords: 12800, traffic: 89000, dr: 58 },
  { name: "Cherokee", domain: "cherokeemedical.com", keywords: 8400, traffic: 42000, dr: 51 },
  { name: "Mandala", domain: "mandalascrubs.com", keywords: 3200, traffic: 18000, dr: 38 },
  { name: "Alta Brand", domain: "shopaltabrand.com", keywords: 85, traffic: 445, dr: 12 },
];

const FAQ_DATA = [
  { question: "What are the most comfortable scrubs for 12-hour shifts?", source: "People Also Ask", volume: 3400 },
  { question: "Do antimicrobial scrubs actually work?", source: "People Also Ask", volume: 2100 },
  { question: "What's the difference between jogger and straight-leg scrub pants?", source: "Related Searches", volume: 1800 },
  { question: "Can you bleach colored scrubs?", source: "People Also Ask", volume: 2600 },
  { question: "Why are FIGS scrubs so expensive?", source: "People Also Ask", volume: 8900 },
  { question: "What scrub color is most slimming?", source: "Related Searches", volume: 1500 },
];

// ─── COMPONENT ────────────────────────────────────────────────────────────
const TABS = [
  { id: "overview", label: "Dashboard", icon: "◉" },
  { id: "keywords", label: "Keyword Intel", icon: "◎" },
  { id: "calendar", label: "Content Calendar", icon: "▦" },
  { id: "voice", label: "Brand Voice", icon: "✎" },
  { id: "faq", label: "FAQ Engine", icon: "?" },
  { id: "competitors", label: "Competitors", icon: "⚔" },
];

export default function AICMODashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [scanRunning, setScanRunning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [voiceInput, setVoiceInput] = useState("");
  const [generatedArticle, setGeneratedArticle] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState(new Set());
  const [sortBy, setSortBy] = useState("opportunity");
  const [filterIntent, setFilterIntent] = useState("all");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const runScan = useCallback(() => {
    setScanRunning(true);
    setTimeout(() => {
      setScanRunning(false);
      setScanComplete(true);
    }, 2800);
  }, []);

  const generateBrief = useCallback(async (article) => {
    setGenerating(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `You are an AI CMO for Alta Brand, a medical scrubs company (shopaltabrand.com). They sell premium scrub tops, pants, and jackets for men and women in colors like Black, Burgundy, Ceil Blue, Grey, Navy, and Royal Blue.

Generate a content brief for this article: "${article.title}"
Target keyword: "${article.keyword}" (volume: ${article.volume}/mo)

Return ONLY a JSON object (no markdown, no backticks) with these fields:
- "outline": array of 5-7 section headings (strings)
- "faqs": array of 3 FAQ questions to include
- "product_links": array of 2-3 Alta Brand products to link (from their catalog: Women's Scrub Tops, Women's Scrub Pants, Women's Scrub Jackets, Men's Scrub Tops, Men's Scrub Pants)
- "word_count": recommended word count (number)
- "meta_title": SEO meta title under 60 chars
- "meta_description": SEO meta description under 155 chars
- "image_brief": array of 2-3 image descriptions needed`
          }]
        })
      });
      const data = await res.json();
      const text = data.content?.map(i => i.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setGeneratedArticle({ ...article, brief: parsed });
    } catch (e) {
      setGeneratedArticle({ ...article, brief: { error: "Could not generate brief. Check API connection.", raw: e.message } });
    }
    setGenerating(false);
  }, []);

  const sortedKeywords = [...KEYWORD_DATA]
    .filter(k => filterIntent === "all" || k.intent === filterIntent)
    .sort((a, b) => {
      if (sortBy === "opportunity") return b.opportunity - a.opportunity;
      if (sortBy === "volume") return b.volume - a.volume;
      if (sortBy === "difficulty") return a.difficulty - b.difficulty;
      return 0;
    });

  const totalOpportunityTraffic = KEYWORD_DATA.filter(k => !k.position).reduce((s, k) => s + k.volume * 0.03, 0);

  return (
    <div style={{
      minHeight: "100vh",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      background: "linear-gradient(135deg, #0a0f1a 0%, #111827 50%, #0f172a 100%)",
      color: "#e2e8f0",
      opacity: mounted ? 1 : 0,
      transition: "opacity 0.6s ease",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:wght@700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scanLine { 0% { left: -30%; } 100% { left: 130%; } }
        .card { background: rgba(30,41,59,0.6); border: 1px solid rgba(71,85,105,0.3); border-radius: 12px; backdrop-filter: blur(8px); }
        .card:hover { border-color: rgba(99,116,141,0.5); }
        .tag { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; }
        .btn { cursor: pointer; border: none; border-radius: 8px; font-family: inherit; font-weight: 600; transition: all 0.2s; }
        .btn:hover { transform: translateY(-1px); filter: brightness(1.1); }
        .btn:active { transform: translateY(0); }
        .tab { cursor: pointer; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 500; border: none; background: transparent; color: #94a3b8; transition: all 0.2s; font-family: inherit; white-space: nowrap; }
        .tab:hover { background: rgba(51,65,85,0.4); color: #cbd5e1; }
        .tab.active { background: linear-gradient(135deg, #0ea5e9, #0284c7); color: white; box-shadow: 0 2px 12px rgba(14,165,233,0.3); }
        .intent-info { background: #1e3a5f; color: #60a5fa; }
        .intent-commercial { background: #1e3a2f; color: #4ade80; }
        .intent-transactional { background: #3a2f1e; color: #fbbf24; }
        .intent-navigational { background: #2f1e3a; color: #c084fc; }
        .stage-inspire { background: #78350f33; color: #fbbf24; border-left: 3px solid #f59e0b; }
        .stage-educate { background: #0c4a6e33; color: #38bdf8; border-left: 3px solid #0ea5e9; }
        .stage-convert { background: #14532d33; color: #4ade80; border-left: 3px solid #22c55e; }
        .diff-low { color: #4ade80; }
        .diff-med { color: #fbbf24; }
        .diff-high { color: #f87171; }
      `}</style>

      {/* ─── HEADER ─── */}
      <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(71,85,105,0.3)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, #0ea5e9, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700 }}>⚡</div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 700, color: "#f8fafc" }}>AI CMO</div>
            <div style={{ fontSize: 11, color: "#64748b", letterSpacing: 1 }}>ALTA BRAND • shopaltabrand.com</div>
          </div>
        </div>
        <button className="btn" onClick={runScan} disabled={scanRunning} style={{
          background: scanRunning ? "#334155" : "linear-gradient(135deg, #0ea5e9, #0284c7)",
          color: "white", padding: "10px 24px", fontSize: 13,
          position: "relative", overflow: "hidden",
        }}>
          {scanRunning && <div style={{ position: "absolute", top: 0, left: 0, width: "30%", height: "100%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)", animation: "scanLine 1.2s ease infinite" }} />}
          {scanRunning ? "Scanning Ahrefs..." : scanComplete ? "✓ Re-scan" : "Run Ahrefs Scan"}
        </button>
      </div>

      {/* ─── TABS ─── */}
      <div style={{ padding: "12px 24px", display: "flex", gap: 6, overflowX: "auto", borderBottom: "1px solid rgba(71,85,105,0.2)" }}>
        {TABS.map(t => (
          <button key={t.id} className={`tab ${activeTab === t.id ? "active" : ""}`} onClick={() => setActiveTab(t.id)}>
            <span style={{ marginRight: 6 }}>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {/* ─── CONTENT ─── */}
      <div style={{ padding: "20px 24px", maxWidth: 1200, margin: "0 auto" }}>

        {/* ════ OVERVIEW TAB ════ */}
        {activeTab === "overview" && (
          <div style={{ animation: "slideUp 0.4s ease" }}>
            {/* Stat cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
              {[
                { label: "Keyword Opportunities", value: KEYWORD_DATA.filter(k => !k.position).length, sub: "not yet ranking", accent: "#0ea5e9" },
                { label: "Est. Monthly Traffic Gain", value: `${Math.round(totalOpportunityTraffic).toLocaleString()}`, sub: "from untapped keywords", accent: "#22c55e" },
                { label: "Content Briefs Ready", value: CONTENT_CALENDAR.filter(c => c.status === "brief-ready").length, sub: `of ${CONTENT_CALENDAR.length} planned`, accent: "#f59e0b" },
                { label: "Competitor Gap", value: `${Math.round(((COMPETITOR_DATA[0].keywords - COMPETITOR_DATA[4].keywords) / COMPETITOR_DATA[0].keywords) * 100)}%`, sub: `vs FIGS (${COMPETITOR_DATA[0].keywords.toLocaleString()} keywords)`, accent: "#f87171" },
              ].map((s, i) => (
                <div key={i} className="card" style={{ padding: 20, borderTop: `3px solid ${s.accent}` }}>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 8, fontWeight: 500, letterSpacing: 0.5 }}>{s.label}</div>
                  <div style={{ fontSize: 32, fontWeight: 700, color: "#f8fafc", fontFamily: "'Playfair Display', Georgia, serif" }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Two-column: Top opportunities + Competitors */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="card" style={{ padding: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: "#f8fafc" }}>🎯 Top Keyword Opportunities</div>
                {KEYWORD_DATA.filter(k => !k.position).sort((a,b) => b.opportunity - a.opportunity).slice(0, 5).map((k, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 4 ? "1px solid rgba(71,85,105,0.2)" : "none" }}>
                    <div>
                      <div style={{ fontSize: 13, color: "#e2e8f0" }}>{k.keyword}</div>
                      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                        <span className={`tag intent-${k.intent}`}>{k.intent}</span>
                        <span style={{ fontSize: 11, color: "#64748b" }}>{k.volume.toLocaleString()}/mo</span>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 20, fontWeight: 700, color: "#4ade80" }}>{k.opportunity}</div>
                      <div style={{ fontSize: 10, color: "#64748b" }}>score</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="card" style={{ padding: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: "#f8fafc" }}>⚔ Competitive Landscape</div>
                {COMPETITOR_DATA.map((c, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < COMPETITOR_DATA.length - 1 ? "1px solid rgba(71,85,105,0.2)" : "none" }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700,
                      background: c.name === "Alta Brand" ? "linear-gradient(135deg, #0ea5e9, #06b6d4)" : "rgba(51,65,85,0.5)",
                      color: c.name === "Alta Brand" ? "white" : "#94a3b8"
                    }}>
                      {i + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: c.name === "Alta Brand" ? 700 : 400, color: c.name === "Alta Brand" ? "#38bdf8" : "#e2e8f0" }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>{c.domain}</div>
                    </div>
                    <div style={{ textAlign: "right", fontSize: 12 }}>
                      <div style={{ color: "#e2e8f0" }}>{c.keywords.toLocaleString()} kw</div>
                      <div style={{ color: "#64748b" }}>{c.traffic.toLocaleString()} traffic</div>
                    </div>
                    <div style={{ width: 36, textAlign: "center" }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: c.dr > 60 ? "#f87171" : c.dr > 40 ? "#fbbf24" : "#4ade80" }}>{c.dr}</div>
                      <div style={{ fontSize: 9, color: "#64748b" }}>DR</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════ KEYWORDS TAB ════ */}
        {activeTab === "keywords" && (
          <div style={{ animation: "slideUp 0.4s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Playfair Display', Georgia, serif", color: "#f8fafc" }}>Keyword Opportunities</h2>
                <p style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{sortedKeywords.length} keywords found • Sorted by {sortBy}</p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {["all", "informational", "commercial", "transactional"].map(f => (
                  <button key={f} className="btn" onClick={() => setFilterIntent(f)} style={{
                    background: filterIntent === f ? "rgba(14,165,233,0.2)" : "rgba(51,65,85,0.3)",
                    color: filterIntent === f ? "#38bdf8" : "#94a3b8",
                    padding: "6px 12px", fontSize: 11, border: filterIntent === f ? "1px solid rgba(14,165,233,0.4)" : "1px solid transparent",
                  }}>{f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}</button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {["opportunity", "volume", "difficulty"].map(s => (
                <button key={s} className="btn" onClick={() => setSortBy(s)} style={{
                  background: sortBy === s ? "rgba(14,165,233,0.15)" : "transparent",
                  color: sortBy === s ? "#38bdf8" : "#64748b",
                  padding: "4px 12px", fontSize: 11, border: "1px solid rgba(71,85,105,0.3)",
                }}>Sort: {s}</button>
              ))}
            </div>

            <div className="card" style={{ overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "32px 1fr 90px 90px 80px 80px 70px", padding: "12px 16px", fontSize: 11, color: "#64748b", fontWeight: 600, letterSpacing: 0.5, borderBottom: "1px solid rgba(71,85,105,0.3)", background: "rgba(15,23,42,0.5)" }}>
                <div></div><div>KEYWORD</div><div style={{textAlign:"right"}}>VOLUME</div><div style={{textAlign:"right"}}>DIFFICULTY</div><div style={{textAlign:"right"}}>POSITION</div><div style={{textAlign:"right"}}>INTENT</div><div style={{textAlign:"right"}}>SCORE</div>
              </div>
              {sortedKeywords.map((k, i) => (
                <div key={i} onClick={() => { const n = new Set(selectedKeywords); n.has(i) ? n.delete(i) : n.add(i); setSelectedKeywords(n); }}
                  style={{ display: "grid", gridTemplateColumns: "32px 1fr 90px 90px 80px 80px 70px", padding: "12px 16px", borderBottom: "1px solid rgba(71,85,105,0.15)", cursor: "pointer", background: selectedKeywords.has(i) ? "rgba(14,165,233,0.08)" : "transparent", transition: "background 0.15s" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ width: 16, height: 16, borderRadius: 4, border: selectedKeywords.has(i) ? "none" : "2px solid #475569", background: selectedKeywords.has(i) ? "#0ea5e9" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "white" }}>
                      {selectedKeywords.has(i) && "✓"}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, color: "#e2e8f0" }}>{k.keyword}</div>
                    <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{k.cluster}</div>
                  </div>
                  <div style={{ textAlign: "right", fontSize: 13, fontWeight: 600, color: "#e2e8f0", alignSelf: "center" }}>{k.volume.toLocaleString()}</div>
                  <div style={{ textAlign: "right", alignSelf: "center" }}>
                    <span className={`tag ${k.difficulty <= 15 ? "diff-low" : k.difficulty <= 30 ? "diff-med" : "diff-high"}`} style={{ background: "transparent", padding: 0, fontSize: 13, fontWeight: 600 }}>
                      {k.difficulty}
                    </span>
                  </div>
                  <div style={{ textAlign: "right", fontSize: 13, alignSelf: "center", color: k.position ? "#e2e8f0" : "#475569" }}>{k.position || "—"}</div>
                  <div style={{ textAlign: "right", alignSelf: "center" }}><span className={`tag intent-${k.intent}`}>{k.intent.slice(0, 5)}</span></div>
                  <div style={{ textAlign: "right", fontSize: 16, fontWeight: 700, alignSelf: "center", color: k.opportunity >= 85 ? "#4ade80" : k.opportunity >= 75 ? "#fbbf24" : "#94a3b8" }}>{k.opportunity}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════ CALENDAR TAB ════ */}
        {activeTab === "calendar" && (
          <div style={{ animation: "slideUp 0.4s ease" }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Playfair Display', Georgia, serif", color: "#f8fafc", marginBottom: 4 }}>4-Week Content Calendar</h2>
            <p style={{ fontSize: 12, color: "#64748b", marginBottom: 20 }}>{CONTENT_CALENDAR.length} articles planned • {CONTENT_CALENDAR.filter(c => c.status === "brief-ready").length} briefs ready to generate</p>

            {[1, 2, 3, 4].map(week => (
              <div key={week} style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", letterSpacing: 1, marginBottom: 10 }}>WEEK {week}</div>
                <div style={{ display: "grid", gap: 10 }}>
                  {CONTENT_CALENDAR.filter(c => c.week === week).map((c, i) => (
                    <div key={i} className={`card stage-${c.stage}`} style={{ padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                      <div style={{ flex: 1, minWidth: 250 }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                          <span className="tag" style={{ background: c.stage === "inspire" ? "#78350f" : c.stage === "educate" ? "#0c4a6e" : "#14532d", color: c.stage === "inspire" ? "#fbbf24" : c.stage === "educate" ? "#38bdf8" : "#4ade80", textTransform: "uppercase", fontSize: 10 }}>{c.stage}</span>
                          <span style={{ fontSize: 11, color: "#64748b" }}>{c.volume.toLocaleString()}/mo</span>
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#f8fafc", marginBottom: 4 }}>{c.title}</div>
                        <div style={{ fontSize: 11, color: "#64748b" }}>Target: <span style={{ color: "#94a3b8" }}>{c.keyword}</span></div>
                        {c.products.length > 0 && (
                          <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
                            {c.products.map((p, j) => <span key={j} style={{ fontSize: 10, color: "#94a3b8", background: "rgba(51,65,85,0.4)", padding: "2px 8px", borderRadius: 4 }}>🔗 {p}</span>)}
                          </div>
                        )}
                      </div>
                      <button className="btn" onClick={() => generateBrief(c)} disabled={generating} style={{
                        background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
                        color: "white", padding: "8px 16px", fontSize: 12,
                      }}>{generating ? "..." : "Generate Brief"}</button>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Generated brief display */}
            {generatedArticle && generatedArticle.brief && (
              <div className="card" style={{ padding: 24, marginTop: 12, borderTop: "3px solid #0ea5e9" }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#f8fafc", marginBottom: 4 }}>📋 Generated Brief: {generatedArticle.title}</div>
                {generatedArticle.brief.error ? (
                  <div style={{ color: "#f87171", fontSize: 13, marginTop: 8 }}>{generatedArticle.brief.error}</div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 16 }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", letterSpacing: 0.5, marginBottom: 8 }}>ARTICLE OUTLINE</div>
                      {generatedArticle.brief.outline?.map((s, i) => (
                        <div key={i} style={{ fontSize: 13, color: "#e2e8f0", padding: "6px 0", borderBottom: "1px solid rgba(71,85,105,0.2)" }}>
                          <span style={{ color: "#0ea5e9", fontWeight: 700, marginRight: 8 }}>H2</span>{s}
                        </div>
                      ))}
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", letterSpacing: 0.5, marginTop: 16, marginBottom: 8 }}>FAQs TO INCLUDE</div>
                      {generatedArticle.brief.faqs?.map((f, i) => (
                        <div key={i} style={{ fontSize: 12, color: "#94a3b8", padding: "4px 0" }}>❓ {f}</div>
                      ))}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", letterSpacing: 0.5, marginBottom: 8 }}>SEO META</div>
                      <div style={{ fontSize: 12, color: "#38bdf8", marginBottom: 4 }}>{generatedArticle.brief.meta_title}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 16 }}>{generatedArticle.brief.meta_description}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", letterSpacing: 0.5, marginBottom: 8 }}>PRODUCT LINKS</div>
                      {generatedArticle.brief.product_links?.map((p, i) => (
                        <div key={i} style={{ fontSize: 12, color: "#4ade80", padding: "3px 0" }}>🔗 {p}</div>
                      ))}
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", letterSpacing: 0.5, marginTop: 16, marginBottom: 8 }}>IMAGE BRIEF</div>
                      {generatedArticle.brief.image_brief?.map((img, i) => (
                        <div key={i} style={{ fontSize: 12, color: "#94a3b8", padding: "3px 0" }}>📸 {img}</div>
                      ))}
                      <div style={{ marginTop: 16, fontSize: 13, color: "#fbbf24", fontWeight: 600 }}>
                        Recommended: {generatedArticle.brief.word_count?.toLocaleString()} words
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ════ VOICE TAB ════ */}
        {activeTab === "voice" && (
          <div style={{ animation: "slideUp 0.4s ease" }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Playfair Display', Georgia, serif", color: "#f8fafc", marginBottom: 4 }}>Brand Voice Engine</h2>
            <p style={{ fontSize: 12, color: "#64748b", marginBottom: 20 }}>Paste existing content from Alta Brand to train the AI on your writing style</p>

            <div className="card" style={{ padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", letterSpacing: 0.5, marginBottom: 8 }}>PASTE SAMPLE CONTENT (product descriptions, emails, social posts)</div>
              <textarea
                value={voiceInput}
                onChange={e => setVoiceInput(e.target.value)}
                placeholder={"Paste Alta Brand content here...\n\nExample: \"Sleek, Comfortable — The Perfect Scrub Set. Our scrubs are designed for healthcare professionals who refuse to compromise on style or function. Built with ALTA Tech fabric that moves with you through every shift.\""}
                style={{
                  width: "100%", minHeight: 140, background: "rgba(15,23,42,0.5)", border: "1px solid rgba(71,85,105,0.3)", borderRadius: 8,
                  color: "#e2e8f0", fontFamily: "inherit", fontSize: 13, padding: 14, resize: "vertical", outline: "none",
                }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                <div style={{ fontSize: 11, color: "#64748b" }}>{voiceInput.split(/\s+/).filter(Boolean).length} words analyzed</div>
                <button className="btn" style={{ background: "linear-gradient(135deg, #0ea5e9, #0284c7)", color: "white", padding: "8px 20px", fontSize: 12 }}>Train Voice Model</button>
              </div>
            </div>

            <div className="card" style={{ padding: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#f8fafc", marginBottom: 16 }}>Detected Voice Attributes</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                {[
                  { attr: "Tone", value: "Professional yet approachable", confidence: 85 },
                  { attr: "Sentence Length", value: "Medium (12-18 words avg)", confidence: 90 },
                  { attr: "Vocabulary", value: "Healthcare-savvy, modern", confidence: 78 },
                  { attr: "Call to Action Style", value: "Confident, benefit-focused", confidence: 72 },
                  { attr: "Brand Personality", value: "Premium but accessible", confidence: 80 },
                  { attr: "POV", value: "Second person (you/your)", confidence: 88 },
                ].map((v, i) => (
                  <div key={i} style={{ background: "rgba(15,23,42,0.5)", padding: 14, borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>{v.attr}</div>
                    <div style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 500, marginBottom: 8 }}>{v.value}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1, height: 4, background: "rgba(71,85,105,0.3)", borderRadius: 2 }}>
                        <div style={{ width: `${v.confidence}%`, height: "100%", background: v.confidence > 80 ? "#22c55e" : "#fbbf24", borderRadius: 2 }} />
                      </div>
                      <span style={{ fontSize: 11, color: "#94a3b8" }}>{v.confidence}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════ FAQ TAB ════ */}
        {activeTab === "faq" && (
          <div style={{ animation: "slideUp 0.4s ease" }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Playfair Display', Georgia, serif", color: "#f8fafc", marginBottom: 4 }}>FAQ & Schema Engine</h2>
            <p style={{ fontSize: 12, color: "#64748b", marginBottom: 20 }}>Questions real people are asking about scrubs — ready to become rich snippets</p>

            <div style={{ display: "grid", gap: 12 }}>
              {FAQ_DATA.map((faq, i) => (
                <div key={i} className="card" style={{ padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 250 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#f8fafc", marginBottom: 6 }}>❓ {faq.question}</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <span className="tag" style={{ background: "rgba(14,165,233,0.15)", color: "#38bdf8" }}>{faq.source}</span>
                      <span style={{ fontSize: 11, color: "#64748b" }}>{faq.volume.toLocaleString()}/mo</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn" style={{ background: "rgba(51,65,85,0.4)", color: "#94a3b8", padding: "6px 14px", fontSize: 11, border: "1px solid rgba(71,85,105,0.3)" }}>Generate Answer</button>
                    <button className="btn" style={{ background: "rgba(51,65,85,0.4)", color: "#94a3b8", padding: "6px 14px", fontSize: 11, border: "1px solid rgba(71,85,105,0.3)" }}>Schema Markup</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="card" style={{ padding: 20, marginTop: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#f8fafc", marginBottom: 12 }}>Schema Preview</div>
              <pre style={{ background: "rgba(15,23,42,0.8)", padding: 16, borderRadius: 8, fontSize: 11, color: "#94a3b8", overflow: "auto", lineHeight: 1.6 }}>
{`{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "${FAQ_DATA[0].question}",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "For 12-hour shifts, look for scrubs with 
4-way stretch fabric, moisture-wicking technology, 
and reinforced seams. Alta Brand scrubs use ALTA Tech 
fabric designed specifically for long-shift comfort..."
    }
  }]
}`}
              </pre>
            </div>
          </div>
        )}

        {/* ════ COMPETITORS TAB ════ */}
        {activeTab === "competitors" && (
          <div style={{ animation: "slideUp 0.4s ease" }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Playfair Display', Georgia, serif", color: "#f8fafc", marginBottom: 4 }}>Competitive Analysis</h2>
            <p style={{ fontSize: 12, color: "#64748b", marginBottom: 20 }}>How Alta Brand stacks up against the medical scrubs market</p>

            <div style={{ display: "grid", gap: 12 }}>
              {COMPETITOR_DATA.map((c, i) => {
                const isAlta = c.name === "Alta Brand";
                return (
                  <div key={i} className="card" style={{ padding: 20, border: isAlta ? "1px solid rgba(14,165,233,0.4)" : undefined }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: isAlta ? "#38bdf8" : "#f8fafc" }}>{c.name} {isAlta && "⚡"}</div>
                        <div style={{ fontSize: 12, color: "#64748b" }}>{c.domain}</div>
                      </div>
                      <div style={{ display: "flex", gap: 20 }}>
                        {[
                          { label: "Keywords", value: c.keywords.toLocaleString() },
                          { label: "Monthly Traffic", value: c.traffic.toLocaleString() },
                          { label: "Domain Rating", value: c.dr },
                        ].map((m, j) => (
                          <div key={j} style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 18, fontWeight: 700, color: "#f8fafc" }}>{m.value}</div>
                            <div style={{ fontSize: 10, color: "#64748b" }}>{m.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Visual bar */}
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <div style={{ fontSize: 10, color: "#64748b", width: 50 }}>Traffic</div>
                      <div style={{ flex: 1, height: 8, background: "rgba(51,65,85,0.3)", borderRadius: 4, overflow: "hidden" }}>
                        <div style={{
                          width: `${(c.traffic / COMPETITOR_DATA[0].traffic) * 100}%`,
                          height: "100%",
                          background: isAlta ? "linear-gradient(90deg, #0ea5e9, #06b6d4)" : "rgba(100,116,139,0.5)",
                          borderRadius: 4,
                          transition: "width 1s ease",
                        }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="card" style={{ padding: 20, marginTop: 16, borderTop: "3px solid #22c55e" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#f8fafc", marginBottom: 8 }}>🎯 The Opportunity</div>
              <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7 }}>
                FIGS dominates with 48K keywords, but they've left thousands of long-tail opportunities untouched. 
                Alta Brand's sweet spot: target the <span style={{ color: "#4ade80", fontWeight: 600 }}>informational and educational keywords</span> that 
                FIGS ignores — fabric care, fit guides, scrub color meanings, and style tips. These keywords have 
                <span style={{ color: "#fbbf24", fontWeight: 600 }}> lower competition</span> and build the kind of trust that turns readers into customers. 
                With 2-3 articles per week for 6 months, Alta Brand can realistically capture <span style={{ color: "#38bdf8", fontWeight: 600 }}>5,000-15,000 monthly organic visitors</span>.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
