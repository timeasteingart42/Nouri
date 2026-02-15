import { useState, useEffect, useRef, useCallback } from "react";

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Outfit:wght@300;400;500&display=swap');
`;

const CATEGORIES = [
  { id: "all", label: "All", icon: "◎" },
  { id: "morning", label: "Morning", icon: "○" },
  { id: "bowls", label: "Bowls", icon: "◑" },
  { id: "plates", label: "Plates", icon: "◐" },
  { id: "bites", label: "Bites", icon: "◒" },
  { id: "warm", label: "Warm + Cozy", icon: "◓" },
  { id: "sweets", label: "Sweets", icon: "◔" },
  { id: "drinks", label: "Drinks", icon: "◕" },
];

const RECIPES = [
  { id: 1, title: "Herb-Crusted Salmon", subtitle: "with lemon dill sauce", cat: "plates", time: "25 min", cal: 380, carbs: 3, protein: 42, fat: 22, img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80", ingredients: ["Wild salmon fillet", "Fresh dill", "Lemon zest", "Dijon mustard", "Almond flour crust", "Capers"], steps: ["Pat salmon dry, season generously", "Press almond-herb crust onto flesh side", "Sear skin-side down 4 min", "Flip, finish in 400°F oven 8 min", "Rest 3 min, serve with lemon dill sauce"] },
  { id: 2, title: "Golden Turmeric Latte", subtitle: "anti-inflammatory ritual", cat: "drinks", time: "5 min", cal: 120, carbs: 4, protein: 3, fat: 10, img: "https://images.unsplash.com/photo-1578020190125-f4f7c18bc9cb?w=800&q=80", ingredients: ["Oat milk", "Fresh turmeric", "Ceylon cinnamon", "Black pepper", "Coconut oil", "Raw honey"], steps: ["Warm milk gently — never boil", "Whisk in turmeric and spices", "Add coconut oil for richness", "Strain into your favourite mug", "Dust with cinnamon"] },
  { id: 3, title: "Avocado Citrus Bowl", subtitle: "bright & nourishing", cat: "bowls", time: "15 min", cal: 420, carbs: 18, protein: 12, fat: 34, img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80", ingredients: ["Ripe avocado", "Blood orange segments", "Toasted pepitas", "Microgreens", "Extra virgin olive oil", "Flaky sea salt"], steps: ["Halve and fan the avocado", "Segment blood oranges over the bowl", "Scatter pepitas and microgreens", "Drizzle your best olive oil", "Finish with flaky salt"] },
  { id: 4, title: "Warm Seed Porridge", subtitle: "cozy morning bowl", cat: "morning", time: "10 min", cal: 310, carbs: 8, protein: 14, fat: 26, img: "https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=800&q=80", ingredients: ["Hemp hearts", "Chia seeds", "Flaxmeal", "Coconut cream", "Vanilla bean", "Toasted coconut flakes"], steps: ["Combine seeds with warm coconut cream", "Stir gently over low heat 5 min", "Scrape in vanilla bean seeds", "Pour into warmed bowl", "Crown with toasted coconut"] },
  { id: 5, title: "Sesame Orange Chicken", subtitle: "weeknight favourite", cat: "plates", time: "30 min", cal: 450, carbs: 6, protein: 38, fat: 28, img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80", ingredients: ["Chicken thighs", "Fresh orange juice", "Tamari", "Sesame oil", "Ginger", "Toasted sesame seeds"], steps: ["Sear chicken thighs skin-down until golden", "Remove, build sauce in the same pan", "Reduce orange-tamari glaze by half", "Return chicken, coat in sauce", "Garnish with sesame and scallion"] },
  { id: 6, title: "Chocolate Protein Shake", subtitle: "post-workout indulgence", cat: "drinks", time: "3 min", cal: 280, carbs: 6, protein: 30, fat: 16, img: "https://images.unsplash.com/photo-1553787499-6f9133860278?w=800&q=80", ingredients: ["Cacao powder", "Collagen peptides", "Almond butter", "Frozen cauliflower", "Almond milk", "Vanilla"], steps: ["Blend all ingredients until velvety", "Add ice for thickness if desired", "Pour into chilled glass", "Top with cacao nibs"] },
  { id: 7, title: "Mediterranean Frittata", subtitle: "elegant brunch centrepiece", cat: "morning", time: "20 min", cal: 340, carbs: 5, protein: 24, fat: 26, img: "https://images.unsplash.com/photo-1510693206972-df098062cb71?w=800&q=80", ingredients: ["Pastured eggs", "Sun-dried tomatoes", "Kalamata olives", "Goat cheese", "Fresh basil", "Extra virgin olive oil"], steps: ["Whisk eggs with a splash of cream", "Sauté aromatics in olive oil", "Pour eggs, arrange toppings artfully", "Broil until just set and golden", "Slide onto board, scatter basil"] },
  { id: 8, title: "Tuna Niçoise Bowl", subtitle: "French riviera in a bowl", cat: "bowls", time: "20 min", cal: 390, carbs: 10, protein: 36, fat: 24, img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80", ingredients: ["Seared ahi tuna", "Haricots verts", "Soft-boiled egg", "Niçoise olives", "Cherry tomatoes", "Anchovy vinaigrette"], steps: ["Blanch haricots verts until crisp-tender", "Sear tuna 90 seconds per side", "Arrange components in wide bowl", "Halve the soft-boiled egg", "Drizzle anchovy vinaigrette"] },
  { id: 9, title: "Spicy Buffalo Bites", subtitle: "game day, elevated", cat: "bites", time: "25 min", cal: 260, carbs: 4, protein: 28, fat: 14, img: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&q=80", ingredients: ["Chicken breast", "Frank's hot sauce", "Grass-fed butter", "Celery", "Blue cheese crumbles", "Ranch seasoning"], steps: ["Cut chicken into bite-sized pieces", "Toss with ranch seasoning, air fry 12 min", "Melt butter into hot sauce", "Coat bites in buffalo sauce", "Serve with celery and blue cheese"] },
  { id: 10, title: "Smoked Salmon Pinwheels", subtitle: "effortless appetiser", cat: "bites", time: "10 min", cal: 180, carbs: 2, protein: 16, fat: 12, img: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80", ingredients: ["Wild smoked salmon", "Cream cheese", "Fresh dill", "Capers", "Lemon zest", "Everything bagel seasoning"], steps: ["Spread cream cheese on salmon slices", "Layer dill, capers, lemon zest", "Roll tightly, chill 15 min", "Slice into pinwheels", "Dust with everything seasoning"] },
  { id: 11, title: "Bone Broth Ramen", subtitle: "deeply restorative", cat: "warm", time: "20 min", cal: 350, carbs: 8, protein: 30, fat: 22, img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80", ingredients: ["Bone broth", "Shirataki noodles", "Soft-boiled egg", "Nori sheets", "Scallions", "Chili oil"], steps: ["Heat bone broth with ginger and garlic", "Prepare shirataki noodles per package", "Ladle broth over noodles", "Top with halved egg and nori", "Finish with scallion and chili oil"] },
  { id: 12, title: "Dark Chocolate Mousse", subtitle: "three-ingredient magic", cat: "sweets", time: "15 min", cal: 220, carbs: 8, protein: 4, fat: 20, img: "https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=800&q=80", ingredients: ["85% dark chocolate", "Coconut cream", "Vanilla extract", "Flaky sea salt", "Cacao nibs"], steps: ["Melt chocolate slowly over bain-marie", "Whip cold coconut cream to soft peaks", "Fold chocolate into cream gently", "Chill 2 hours minimum", "Serve with salt and cacao nibs"] },
  { id: 13, title: "Green Goddess Bowl", subtitle: "the reset button", cat: "bowls", time: "15 min", cal: 380, carbs: 14, protein: 18, fat: 28, img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80", ingredients: ["Massaged kale", "Avocado", "Cucumber", "Edamame", "Hemp hearts", "Green goddess dressing"], steps: ["Massage kale with lemon and salt", "Arrange all components in sections", "Scatter hemp hearts generously", "Drizzle green goddess dressing", "Eat slowly, feel incredible"] },
  { id: 14, title: "Coconut Chia Pudding", subtitle: "make tonight, enjoy tomorrow", cat: "sweets", time: "5 min", cal: 260, carbs: 10, protein: 8, fat: 20, img: "https://images.unsplash.com/photo-1546548970-71785318a17b?w=800&q=80", ingredients: ["Chia seeds", "Full-fat coconut milk", "Vanilla bean paste", "Mango", "Toasted coconut", "Lime zest"], steps: ["Whisk chia into coconut milk", "Add vanilla, stir well", "Refrigerate overnight", "Top with mango and coconut", "Finish with lime zest"] },
  { id: 15, title: "Chicken Noodle Soup", subtitle: "the healer", cat: "warm", time: "35 min", cal: 320, carbs: 6, protein: 34, fat: 18, img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80", ingredients: ["Whole chicken thighs", "Hearts of palm noodles", "Celery", "Carrots", "Fresh thyme", "Bay leaves"], steps: ["Sear chicken thighs until golden", "Build broth with aromatics", "Simmer 20 min until falling apart", "Shred chicken, add noodles", "Ladle generously, breathe in the steam"] },
  { id: 16, title: "Matcha Coconut Latte", subtitle: "calm energy", cat: "drinks", time: "5 min", cal: 140, carbs: 3, protein: 2, fat: 12, img: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=800&q=80", ingredients: ["Ceremonial matcha", "Coconut cream", "Oat milk", "Vanilla", "Raw honey"], steps: ["Sift matcha into warm bowl", "Whisk with small amount of hot water", "Froth coconut cream and oat milk", "Pour matcha over frothed milk", "Sweeten gently if desired"] },
];

const MOODS = [
  { id: "tired", label: "I'm exhausted", emoji: "🌙", desc: "Easy, under 15 min" },
  { id: "hosting", label: "I'm hosting", emoji: "✦", desc: "Show-stopping dishes" },
  { id: "comfort", label: "I need comfort", emoji: "♨", desc: "Warm, soul-filling" },
  { id: "quick", label: "I have 15 min", emoji: "↗", desc: "Fast & delicious" },
  { id: "light", label: "Keep it light", emoji: "○", desc: "Fresh & bright" },
];

const easeOutExpo = "cubic-bezier(0.16, 1, 0.3, 1)";

export default function Nouri() {
  const [view, setView] = useState("splash");
  const [cat, setCat] = useState("all");
  const [selected, setSelected] = useState(null);
  const [saved, setSaved] = useState(new Set());
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("home");
  const [mounted, setMounted] = useState(false);
  const [cardVisible, setCardVisible] = useState({});
  const [modalPhase, setModalPhase] = useState("closed");
  const [splashPhase, setSplashPhase] = useState(0);
  const observer = useRef(null);

  useEffect(() => {
    if (view === "splash") {
      setTimeout(() => setSplashPhase(1), 100);
      setTimeout(() => setSplashPhase(2), 800);
      setTimeout(() => setSplashPhase(3), 1600);
      setTimeout(() => { setView("main"); setTimeout(() => setMounted(true), 50); }, 3200);
    }
  }, [view]);

  const cardRef = useCallback((node) => {
    if (!node) return;
    if (!observer.current) {
      observer.current = new IntersectionObserver(
        (entries) => entries.forEach((e) => {
          if (e.isIntersecting) {
            setCardVisible((p) => ({ ...p, [e.target.dataset.id]: true }));
            observer.current?.unobserve(e.target);
          }
        }),
        { threshold: 0.1, rootMargin: "40px" }
      );
    }
    observer.current.observe(node);
  }, []);

  const openRecipe = (r) => {
    setSelected(r);
    setModalPhase("entering");
    requestAnimationFrame(() => setTimeout(() => setModalPhase("open"), 20));
  };

  const closeRecipe = () => {
    setModalPhase("leaving");
    setTimeout(() => { setModalPhase("closed"); setSelected(null); }, 500);
  };

  const toggleSave = (id, e) => {
    e?.stopPropagation();
    setSaved((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const filtered = RECIPES.filter((r) => {
    const matchCat = cat === "all" || r.cat === cat;
    const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.ingredients.some((i) => i.toLowerCase().includes(search.toLowerCase()));
    const matchSaved = tab === "saved" ? saved.has(r.id) : true;
    return matchCat && matchSearch && matchSaved;
  });

  if (view === "splash") {
    return (
      <>
        <style>{FONTS}</style>
        <div style={{
          height: "100vh", width: "100vw", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", background: "#FAF9F6",
          fontFamily: "'Cormorant Garamond', serif", overflow: "hidden", position: "relative",
        }}>
          {/* Subtle grain overlay */}
          <div style={{
            position: "absolute", inset: 0, opacity: 0.03,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }} />
          <div style={{
            fontSize: "clamp(52px, 10vw, 88px)", fontWeight: 300, letterSpacing: "-0.03em",
            color: "#1a1a18", opacity: splashPhase >= 1 ? 1 : 0,
            transform: splashPhase >= 1 ? "translateY(0)" : "translateY(30px)",
            transition: `all 0.9s ${easeOutExpo}`,
          }}>
            nouri<span style={{ color: "#C4A882" }}>.</span>
          </div>
          <div style={{
            fontSize: "clamp(13px, 2vw, 16px)", fontFamily: "'Outfit', sans-serif", fontWeight: 300,
            letterSpacing: "0.25em", textTransform: "uppercase", color: "#9B9489", marginTop: 16,
            opacity: splashPhase >= 2 ? 1 : 0, transform: splashPhase >= 2 ? "translateY(0)" : "translateY(16px)",
            transition: `all 0.8s ${easeOutExpo} 0.1s`,
          }}>
            Clean ingredients · whole foods · effortlessly good
          </div>
          <div style={{
            width: 48, height: 1, background: "#C4A882", marginTop: 32,
            opacity: splashPhase >= 3 ? 1 : 0, transform: splashPhase >= 3 ? "scaleX(1)" : "scaleX(0)",
            transition: `all 0.6s ${easeOutExpo}`,
          }} />
        </div>
      </>
    );
  }

  return (
    <>
      <style>{FONTS}{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #FAF9F6; }
        ::-webkit-scrollbar { width: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes modalIn { from { opacity:0; transform: translateY(100%); } to { opacity:1; transform: translateY(0); } }
        @keyframes modalOut { from { opacity:1; transform: translateY(0); } to { opacity:0; transform: translateY(100%); } }
        @keyframes backdropIn { from { opacity:0; } to { opacity:1; } }
        @keyframes backdropOut { from { opacity:1; } to { opacity:0; } }
        @keyframes gentlePulse { 0%,100% { opacity: 0.4; } 50% { opacity: 0.7; } }
        input::placeholder { color: #C4BFB6; }
      `}</style>

      <div style={{
        minHeight: "100vh", background: "#FAF9F6", fontFamily: "'Outfit', sans-serif",
        color: "#1a1a18", position: "relative", maxWidth: 480, margin: "0 auto",
        borderLeft: "1px solid #F0EDE8", borderRight: "1px solid #F0EDE8",
      }}>
        {/* Grain texture */}
        <div style={{
          position: "fixed", inset: 0, opacity: 0.025, pointerEvents: "none", zIndex: 9999,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }} />

        {/* HEADER */}
        <header style={{
          position: "sticky", top: 0, zIndex: 100, padding: "20px 24px 16px",
          background: "rgba(250,249,246,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0,0,0,0.04)",
          opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(-10px)",
          transition: `all 0.6s ${easeOutExpo}`,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 300,
              letterSpacing: "-0.03em", cursor: "pointer",
            }} onClick={() => { setTab("home"); setCat("all"); setSearch(""); }}>
              nouri<span style={{ color: "#C4A882" }}>.</span>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {["home", "mood", "saved"].map((t) => (
                <button key={t} onClick={() => { setTab(t); setCat("all"); }} style={{
                  background: tab === t ? "#1a1a18" : "transparent",
                  color: tab === t ? "#FAF9F6" : "#9B9489",
                  border: tab === t ? "none" : "1px solid #E8E4DD",
                  borderRadius: 100, padding: "8px 18px", fontSize: 13, fontWeight: 400,
                  fontFamily: "'Outfit', sans-serif", cursor: "pointer", letterSpacing: "0.02em",
                  transition: `all 0.4s ${easeOutExpo}`,
                }}>
                  {t === "home" ? "Discover" : t === "mood" ? "By Mood" : "Saved"}
                </button>
              ))}
            </div>
          </div>

          {tab === "home" && (
            <div style={{
              marginTop: 16, position: "relative",
              opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(8px)",
              transition: `all 0.6s ${easeOutExpo} 0.1s`,
            }}>
              <input
                value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search recipes or ingredients..."
                style={{
                  width: "100%", padding: "14px 20px", paddingLeft: 44, background: "#F4F1EC",
                  border: "none", borderRadius: 14, fontSize: 14, fontFamily: "'Outfit', sans-serif",
                  color: "#1a1a18", outline: "none", transition: "all 0.3s ease",
                }}
                onFocus={(e) => e.target.style.background = "#EFEBE4"}
                onBlur={(e) => e.target.style.background = "#F4F1EC"}
              />
              <span style={{
                position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
                fontSize: 16, color: "#9B9489",
              }}>⌕</span>
            </div>
          )}
        </header>

        {/* CATEGORIES */}
        {tab === "home" && (
          <div style={{
            display: "flex", gap: 8, padding: "16px 24px", overflowX: "auto",
            opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(12px)",
            transition: `all 0.6s ${easeOutExpo} 0.15s`,
          }}>
            {CATEGORIES.map((c) => (
              <button key={c.id} onClick={() => setCat(c.id)} style={{
                whiteSpace: "nowrap", padding: "10px 20px", borderRadius: 100,
                border: cat === c.id ? "1.5px solid #1a1a18" : "1px solid #E8E4DD",
                background: cat === c.id ? "#1a1a18" : "transparent",
                color: cat === c.id ? "#FAF9F6" : "#6B665E",
                fontSize: 13, fontFamily: "'Outfit', sans-serif", fontWeight: 400,
                cursor: "pointer", transition: `all 0.35s ${easeOutExpo}`,
                letterSpacing: "0.01em", flexShrink: 0,
              }}>
                <span style={{ marginRight: 6, opacity: 0.6 }}>{c.icon}</span>{c.label}
              </button>
            ))}
          </div>
        )}

        {/* MOOD VIEW */}
        {tab === "mood" && (
          <div style={{ padding: "40px 24px" }}>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300,
              lineHeight: 1.15, marginBottom: 8, letterSpacing: "-0.02em",
              animation: `fadeUp 0.7s ${easeOutExpo} both`,
            }}>
              How are you<br />feeling tonight?
            </h2>
            <p style={{
              color: "#9B9489", fontSize: 14, marginBottom: 36, fontWeight: 300,
              animation: `fadeUp 0.7s ${easeOutExpo} 0.1s both`,
            }}>
              We'll match you with exactly what you need.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {MOODS.map((m, i) => (
                <button key={m.id} onClick={() => { setTab("home"); setCat("all"); setSearch(m.id === "tired" || m.id === "quick" ? "5 min" : m.id === "comfort" || m.id === "hosting" ? "" : ""); }} style={{
                  display: "flex", alignItems: "center", gap: 20, padding: "22px 24px",
                  background: "#FFFFFF", border: "1px solid #F0EDE8", borderRadius: 18,
                  cursor: "pointer", transition: `all 0.4s ${easeOutExpo}`,
                  fontFamily: "'Outfit', sans-serif", textAlign: "left",
                  animation: `fadeUp 0.6s ${easeOutExpo} ${0.15 + i * 0.08}s both`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateX(8px)";
                  e.currentTarget.style.borderColor = "#C4A882";
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(196,168,130,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateX(0)";
                  e.currentTarget.style.borderColor = "#F0EDE8";
                  e.currentTarget.style.boxShadow = "none";
                }}>
                  <span style={{
                    fontSize: 24, width: 48, height: 48, display: "flex", alignItems: "center",
                    justifyContent: "center", background: "#FAF9F6", borderRadius: 14,
                    flexShrink: 0,
                  }}>{m.emoji}</span>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 400, color: "#1a1a18" }}>{m.label}</div>
                    <div style={{ fontSize: 13, color: "#9B9489", fontWeight: 300, marginTop: 2 }}>{m.desc}</div>
                  </div>
                  <span style={{ marginLeft: "auto", color: "#C4A882", fontSize: 18 }}>→</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SAVED EMPTY STATE */}
        {tab === "saved" && filtered.length === 0 && (
          <div style={{
            padding: "80px 24px", textAlign: "center",
            animation: `fadeUp 0.7s ${easeOutExpo} both`,
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: "50%", background: "#F4F1EC",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 24px", fontSize: 32,
            }}>♡</div>
            <h3 style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300,
              marginBottom: 8,
            }}>Your collection is empty</h3>
            <p style={{ color: "#9B9489", fontSize: 14, fontWeight: 300 }}>
              Save recipes you love and find them here.
            </p>
          </div>
        )}

        {/* EDITORIAL HERO — only on home with "all" */}
        {tab === "home" && cat === "all" && !search && (
          <div style={{
            margin: "8px 24px 24px", borderRadius: 22, overflow: "hidden",
            position: "relative", height: 220, cursor: "pointer",
            opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(16px)",
            transition: `all 0.8s ${easeOutExpo} 0.2s`,
          }} onClick={() => openRecipe(RECIPES[0])}>
            <img src={RECIPES[0].img} alt="" style={{
              width: "100%", height: "100%", objectFit: "cover",
              transition: `transform 0.8s ${easeOutExpo}`,
            }}
            onMouseEnter={(e) => e.target.style.transform = "scale(1.04)"}
            onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
            />
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(0deg, rgba(26,26,24,0.7) 0%, rgba(26,26,24,0) 60%)",
            }} />
            <div style={{ position: "absolute", bottom: 24, left: 24, right: 24 }}>
              <div style={{
                fontSize: 11, fontFamily: "'Outfit', sans-serif", letterSpacing: "0.2em",
                textTransform: "uppercase", color: "#C4A882", fontWeight: 400, marginBottom: 8,
              }}>
                Editor's Pick
              </div>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300,
                color: "#FAF9F6", lineHeight: 1.15,
              }}>
                {RECIPES[0].title}
              </div>
              <div style={{ color: "rgba(250,249,246,0.6)", fontSize: 13, marginTop: 4, fontWeight: 300 }}>
                {RECIPES[0].subtitle}
              </div>
            </div>
          </div>
        )}

        {/* SECTION TITLE */}
        {tab === "home" && (
          <div style={{
            padding: "0 24px 16px", display: "flex", justifyContent: "space-between", alignItems: "baseline",
            opacity: mounted ? 1 : 0, transition: `all 0.6s ${easeOutExpo} 0.25s`,
          }}>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 300,
              letterSpacing: "-0.01em",
            }}>
              {cat === "all" ? "All Recipes" : CATEGORIES.find((c) => c.id === cat)?.label}
            </h2>
            <span style={{ fontSize: 13, color: "#9B9489", fontWeight: 300 }}>
              {filtered.length} {filtered.length === 1 ? "recipe" : "recipes"}
            </span>
          </div>
        )}

        {tab === "saved" && filtered.length > 0 && (
          <div style={{ padding: "32px 24px 16px" }}>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 300,
              animation: `fadeUp 0.6s ${easeOutExpo} both`,
            }}>Your Collection</h2>
          </div>
        )}

        {/* RECIPE GRID */}
        {(tab === "home" || (tab === "saved" && filtered.length > 0)) && (
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16,
            padding: "0 24px 120px",
          }}>
            {filtered.map((r, i) => (
              <div key={r.id} ref={cardRef} data-id={r.id} onClick={() => openRecipe(r)} style={{
                cursor: "pointer", borderRadius: 18, overflow: "hidden",
                background: "#FFFFFF", border: "1px solid #F0EDE8",
                opacity: cardVisible[r.id] ? 1 : 0,
                transform: cardVisible[r.id] ? "translateY(0)" : "translateY(20px)",
                transition: `all 0.6s ${easeOutExpo} ${(i % 4) * 0.06}s`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 16px 48px rgba(26,26,24,0.08)";
                e.currentTarget.style.borderColor = "#E0DBD3";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "#F0EDE8";
              }}>
                <div style={{ position: "relative", paddingTop: "110%", overflow: "hidden" }}>
                  <img src={r.img} alt={r.title} loading="lazy" style={{
                    position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
                    transition: `transform 0.7s ${easeOutExpo}`,
                  }}
                  onMouseEnter={(e) => e.target.style.transform = "scale(1.06)"}
                  onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                  />
                  {/* Save button */}
                  <button onClick={(e) => toggleSave(r.id, e)} style={{
                    position: "absolute", top: 10, right: 10, width: 36, height: 36,
                    borderRadius: "50%", border: "none", cursor: "pointer",
                    background: saved.has(r.id) ? "#1a1a18" : "rgba(250,249,246,0.85)",
                    backdropFilter: "blur(8px)", color: saved.has(r.id) ? "#C4A882" : "#9B9489",
                    fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
                    transition: `all 0.3s ${easeOutExpo}`,
                  }}>
                    {saved.has(r.id) ? "♥" : "♡"}
                  </button>
                  {/* Time badge */}
                  <div style={{
                    position: "absolute", bottom: 10, left: 10,
                    background: "rgba(250,249,246,0.9)", backdropFilter: "blur(8px)",
                    borderRadius: 100, padding: "5px 12px", fontSize: 11, fontWeight: 400,
                    color: "#6B665E", letterSpacing: "0.02em",
                  }}>
                    {r.time}
                  </div>
                </div>
                <div style={{ padding: "14px 16px 16px" }}>
                  <div style={{
                    fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 400,
                    lineHeight: 1.25, marginBottom: 4, letterSpacing: "-0.01em",
                  }}>
                    {r.title}
                  </div>
                  <div style={{ fontSize: 12, color: "#9B9489", fontWeight: 300, marginBottom: 10 }}>
                    {r.subtitle}
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <span style={{
                      padding: "4px 10px", borderRadius: 100, fontSize: 11, fontWeight: 400,
                      background: "#F4F1EC", color: "#6B665E",
                    }}>{r.carbs}g carbs</span>
                    <span style={{
                      padding: "4px 10px", borderRadius: 100, fontSize: 11, fontWeight: 400,
                      background: "#F4F1EC", color: "#6B665E",
                    }}>{r.protein}g protein</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* RECIPE DETAIL MODAL */}
        {selected && modalPhase !== "closed" && (
          <>
            <div onClick={closeRecipe} style={{
              position: "fixed", inset: 0, background: "rgba(26,26,24,0.4)",
              backdropFilter: "blur(4px)", zIndex: 200,
              animation: `${modalPhase === "leaving" ? "backdropOut" : "backdropIn"} 0.4s ${easeOutExpo} forwards`,
            }} />
            <div style={{
              position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
              width: "100%", maxWidth: 480, maxHeight: "92vh", zIndex: 201,
              background: "#FAF9F6", borderRadius: "24px 24px 0 0", overflowY: "auto",
              animation: `${modalPhase === "leaving" ? "modalOut" : "modalIn"} 0.5s ${easeOutExpo} forwards`,
            }}>
              {/* Handle */}
              <div style={{
                width: 40, height: 4, background: "#E0DBD3", borderRadius: 100,
                margin: "12px auto 0",
              }} />
              
              {/* Hero image */}
              <div style={{ position: "relative", height: 280, margin: "12px 16px 0", borderRadius: 20, overflow: "hidden" }}>
                <img src={selected.img} alt={selected.title} style={{
                  width: "100%", height: "100%", objectFit: "cover",
                }} />
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(0deg, rgba(26,26,24,0.5) 0%, transparent 50%)",
                }} />
                <div style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
                  <div style={{
                    fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 300,
                    color: "#FAF9F6", lineHeight: 1.15, letterSpacing: "-0.02em",
                  }}>{selected.title}</div>
                  <div style={{ color: "rgba(250,249,246,0.65)", fontSize: 14, marginTop: 4, fontWeight: 300 }}>
                    {selected.subtitle}
                  </div>
                </div>
              </div>

              {/* Macros bar */}
              <div style={{
                display: "flex", justifyContent: "space-around", padding: "24px 24px 20px",
                borderBottom: "1px solid #F0EDE8",
              }}>
                {[
                  { label: "Calories", val: selected.cal },
                  { label: "Carbs", val: `${selected.carbs}g` },
                  { label: "Protein", val: `${selected.protein}g` },
                  { label: "Fat", val: `${selected.fat}g` },
                ].map((m) => (
                  <div key={m.label} style={{ textAlign: "center" }}>
                    <div style={{
                      fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 400,
                      color: "#1a1a18",
                    }}>{m.val}</div>
                    <div style={{ fontSize: 11, color: "#9B9489", fontWeight: 300, marginTop: 2, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Ingredients */}
              <div style={{ padding: "24px 24px 0" }}>
                <h3 style={{
                  fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 400,
                  marginBottom: 16, letterSpacing: "-0.01em",
                }}>Ingredients</h3>
                {selected.ingredients.map((ing, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 14, padding: "12px 0",
                    borderBottom: i < selected.ingredients.length - 1 ? "1px solid #F4F1EC" : "none",
                  }}>
                    <div style={{
                      width: 6, height: 6, borderRadius: "50%", background: "#C4A882", flexShrink: 0,
                    }} />
                    <span style={{ fontSize: 14, fontWeight: 300, color: "#3D3A35" }}>{ing}</span>
                  </div>
                ))}
              </div>

              {/* Steps */}
              <div style={{ padding: "28px 24px 0" }}>
                <h3 style={{
                  fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 400,
                  marginBottom: 16, letterSpacing: "-0.01em",
                }}>Method</h3>
                {selected.steps.map((step, i) => (
                  <div key={i} style={{
                    display: "flex", gap: 16, marginBottom: 20,
                  }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%", border: "1.5px solid #E0DBD3",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 400, color: "#9B9489", flexShrink: 0,
                    }}>{i + 1}</div>
                    <p style={{ fontSize: 14, fontWeight: 300, color: "#3D3A35", lineHeight: 1.6, paddingTop: 4 }}>
                      {step}
                    </p>
                  </div>
                ))}
              </div>

              {/* Save button */}
              <div style={{ padding: "16px 24px 40px" }}>
                <button onClick={(e) => toggleSave(selected.id, e)} style={{
                  width: "100%", padding: "16px 0", borderRadius: 14, fontSize: 14,
                  fontFamily: "'Outfit', sans-serif", fontWeight: 400, cursor: "pointer",
                  letterSpacing: "0.02em",
                  background: saved.has(selected.id) ? "transparent" : "#1a1a18",
                  color: saved.has(selected.id) ? "#1a1a18" : "#FAF9F6",
                  border: saved.has(selected.id) ? "1.5px solid #E0DBD3" : "none",
                  transition: `all 0.35s ${easeOutExpo}`,
                }}>
                  {saved.has(selected.id) ? "♥  Saved to collection" : "Save recipe"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
