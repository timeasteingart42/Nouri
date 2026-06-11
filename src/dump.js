import { useState, useEffect, useRef, useCallback } from "react";

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Outfit:wght@300;400;500&family=Caveat:wght@400;500;600&display=swap');
`;

const easeOutExpo = "cubic-bezier(0.16, 1, 0.3, 1)";

// The dump — chosen five, each with a little story + a handwritten note.
const PHOTOS = [
  {
    id: 1,
    src: "/photos/02-sunset.jpeg",
    alt: "Golden hour on the field with a friend",
    note: "we made it ♡",
    tag: "the field, golden hour",
    tilt: -2.5,
    ratio: "125%",
  },
  {
    id: 2,
    src: "/photos/01-night.jpeg",
    alt: "Night portrait in white, matcha in hand",
    note: "celebrating, finally",
    tag: "after dark",
    tilt: 2,
    ratio: "128%",
  },
  {
    id: 3,
    src: "/photos/04-sunflowers.jpeg",
    alt: "Sunflowers and palm trees, diploma in hand",
    note: "sunflowers + a degree",
    tag: "palm-lined walk",
    tilt: 1.5,
    ratio: "120%",
  },
  {
    id: 4,
    src: "/photos/03-beach.jpeg",
    alt: "Three friends barefoot on the beach in stoles",
    note: "the girls, barefoot",
    tag: "laguna, low tide",
    tilt: -1.5,
    ratio: "118%",
  },
  {
    id: 5,
    src: "/photos/05-portrait.jpeg",
    alt: "Cap and gown portrait by the columns",
    note: "cap, gown, done",
    tag: "the colonnade",
    tilt: 2.5,
    ratio: "122%",
  },
];

export default function Dump() {
  const [phase, setPhase] = useState(0);
  const [visible, setVisible] = useState({});
  const [lightbox, setLightbox] = useState(null);
  const observer = useRef(null);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 120);
    const t2 = setTimeout(() => setPhase(2), 700);
    const t3 = setTimeout(() => setPhase(3), 1300);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  const cardRef = useCallback((node) => {
    if (!node) return;
    if (!observer.current) {
      observer.current = new IntersectionObserver(
        (entries) => entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible((p) => ({ ...p, [e.target.dataset.id]: true }));
            observer.current?.unobserve(e.target);
          }
        }),
        { threshold: 0.15, rootMargin: "60px" }
      );
    }
    observer.current.observe(node);
  }, []);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => (i + 1) % PHOTOS.length);
      if (e.key === "ArrowLeft") setLightbox((i) => (i - 1 + PHOTOS.length) % PHOTOS.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  const grain = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

  return (
    <>
      <style>{FONTS}{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F3EFE7; }
        ::-webkit-scrollbar { width: 0; }
        @keyframes floatUp { from { opacity: 0; transform: translateY(28px) rotate(var(--tilt)); } to { opacity: 1; transform: translateY(0) rotate(var(--tilt)); } }
        @keyframes lbIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
        @keyframes fade { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      <div style={{
        minHeight: "100vh", background: "#F3EFE7", fontFamily: "'Outfit', sans-serif",
        color: "#26221C", position: "relative", maxWidth: 520, margin: "0 auto",
        padding: "0 0 100px",
        boxShadow: "0 0 80px rgba(120,100,70,0.06)",
      }}>
        {/* Film grain */}
        <div style={{
          position: "fixed", inset: 0, opacity: 0.04, pointerEvents: "none", zIndex: 9999,
          backgroundImage: grain,
        }} />

        {/* COVER */}
        <header style={{ padding: "64px 32px 40px", textAlign: "center", position: "relative" }}>
          <div style={{
            fontSize: 12, fontFamily: "'Outfit', sans-serif", fontWeight: 400,
            letterSpacing: "0.34em", textTransform: "uppercase", color: "#A99A80",
            opacity: phase >= 1 ? 1 : 0, transform: phase >= 1 ? "translateY(0)" : "translateY(12px)",
            transition: `all 0.8s ${easeOutExpo}`,
          }}>
            Chapman University · Class of 2025
          </div>

          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
            fontSize: "clamp(46px, 13vw, 76px)", lineHeight: 1.0, letterSpacing: "-0.02em",
            marginTop: 18, color: "#26221C",
            opacity: phase >= 1 ? 1 : 0, transform: phase >= 1 ? "translateY(0)" : "translateY(20px)",
            transition: `all 0.9s ${easeOutExpo} 0.08s`,
          }}>
            graduation<span style={{ color: "#9A3B47" }}>.</span>
          </h1>

          <div style={{
            fontFamily: "'Caveat', cursive", fontSize: 26, color: "#9A3B47", marginTop: 6,
            opacity: phase >= 2 ? 1 : 0, transform: phase >= 2 ? "rotate(-3deg)" : "rotate(-3deg) translateY(8px)",
            transition: `all 0.7s ${easeOutExpo}`,
          }}>
            a little photo dump ♡
          </div>

          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 14,
            marginTop: 26,
            opacity: phase >= 3 ? 1 : 0, transition: `all 0.7s ${easeOutExpo}`,
          }}>
            <span style={{ width: 40, height: 1, background: "#C9BCA3" }} />
            <span style={{
              fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "#A99A80",
            }}>May 2025 · five frames</span>
            <span style={{ width: 40, height: 1, background: "#C9BCA3" }} />
          </div>
        </header>

        {/* THE DUMP — alternating offset polaroids */}
        <div style={{ padding: "8px 22px 0" }}>
          {PHOTOS.map((p, i) => {
            const left = i % 2 === 0;
            return (
              <div
                key={p.id}
                ref={cardRef}
                data-id={p.id}
                onClick={() => setLightbox(i)}
                style={{
                  "--tilt": `${p.tilt}deg`,
                  width: "84%",
                  marginLeft: left ? 0 : "16%",
                  marginBottom: i === PHOTOS.length - 1 ? 0 : 38,
                  cursor: "pointer",
                  background: "#FCFAF5",
                  padding: "12px 12px 0",
                  borderRadius: 4,
                  boxShadow: "0 18px 50px rgba(80,64,40,0.14), 0 2px 6px rgba(80,64,40,0.08)",
                  transform: `rotate(${p.tilt}deg)`,
                  transition: `box-shadow 0.5s ${easeOutExpo}, transform 0.5s ${easeOutExpo}`,
                  opacity: visible[p.id] ? 1 : 0,
                  animation: visible[p.id] ? `floatUp 0.9s ${easeOutExpo} both` : "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = `rotate(0deg) translateY(-6px) scale(1.015)`;
                  e.currentTarget.style.boxShadow = "0 28px 70px rgba(80,64,40,0.22), 0 3px 8px rgba(80,64,40,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = `rotate(${p.tilt}deg)`;
                  e.currentTarget.style.boxShadow = "0 18px 50px rgba(80,64,40,0.14), 0 2px 6px rgba(80,64,40,0.08)";
                }}
              >
                <div style={{ position: "relative", paddingTop: p.ratio, overflow: "hidden", borderRadius: 2, background: "#E7E0D3" }}>
                  <img src={p.src} alt={p.alt} loading="lazy" style={{
                    position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
                    filter: "saturate(1.02) contrast(1.02)",
                  }} />
                  <div style={{
                    position: "absolute", inset: 0, pointerEvents: "none",
                    backgroundImage: grain, opacity: 0.05, mixBlendMode: "multiply",
                  }} />
                  <span style={{
                    position: "absolute", bottom: 9, right: 11,
                    fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: "0.12em",
                    color: "rgba(255,240,200,0.92)", textShadow: "0 1px 3px rgba(0,0,0,0.5)",
                  }}>05 · 2025</span>
                </div>
                <div style={{
                  padding: "14px 6px 18px", display: "flex", alignItems: "baseline",
                  justifyContent: "space-between", gap: 10,
                }}>
                  <span style={{
                    fontFamily: "'Caveat', cursive", fontSize: 25, color: "#3A332A", lineHeight: 1,
                  }}>{p.note}</span>
                  <span style={{
                    fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase",
                    color: "#B0A185", whiteSpace: "nowrap", flexShrink: 0,
                  }}>{p.tag}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CLOSER */}
        <div style={{
          textAlign: "center", padding: "56px 32px 8px",
        }}>
          <div style={{ width: 1, height: 40, background: "#C9BCA3", margin: "0 auto 22px" }} />
          <p style={{
            fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 300,
            fontSize: 22, color: "#5A5044", lineHeight: 1.5,
          }}>
            and just like that,<br />four years went by.
          </p>
          <div style={{
            fontFamily: "'Caveat', cursive", fontSize: 24, color: "#9A3B47", marginTop: 16,
            transform: "rotate(-2deg)",
          }}>
            onto the next chapter →
          </div>
        </div>
      </div>

      {/* LIGHTBOX */}
      {lightbox !== null && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 10000,
            background: "rgba(28,24,18,0.92)", backdropFilter: "blur(6px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexDirection: "column", padding: 24,
            animation: `fade 0.35s ${easeOutExpo} both`,
          }}
        >
          <img
            key={lightbox}
            src={PHOTOS[lightbox].src}
            alt={PHOTOS[lightbox].alt}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "100%", maxHeight: "78vh", objectFit: "contain",
              borderRadius: 6, boxShadow: "0 30px 90px rgba(0,0,0,0.6)",
              animation: `lbIn 0.4s ${easeOutExpo} both`,
            }}
          />
          <div style={{
            fontFamily: "'Caveat', cursive", fontSize: 26, color: "#F3EBD8", marginTop: 22,
            textAlign: "center",
          }}>
            {PHOTOS[lightbox].note}
          </div>
          <div style={{
            fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase",
            color: "rgba(243,235,216,0.55)", marginTop: 8,
          }}>
            {lightbox + 1} / {PHOTOS.length} · tap anywhere to close
          </div>

          {/* Prev / Next */}
          {["prev", "next"].map((dir) => (
            <button
              key={dir}
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((idx) => dir === "next"
                  ? (idx + 1) % PHOTOS.length
                  : (idx - 1 + PHOTOS.length) % PHOTOS.length);
              }}
              style={{
                position: "fixed", top: "50%", transform: "translateY(-50%)",
                [dir === "prev" ? "left" : "right"]: 16,
                width: 46, height: 46, borderRadius: "50%", border: "1px solid rgba(243,235,216,0.3)",
                background: "rgba(243,235,216,0.08)", color: "#F3EBD8", fontSize: 18,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                backdropFilter: "blur(8px)",
              }}
            >
              {dir === "prev" ? "‹" : "›"}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
