import { useState, useEffect, useRef, useCallback } from "react";

const CATEGORIES = [
  { id: "all", label: "All", icon: "✦" },
  { id: "breakfast", label: "Breakfast", icon: "☀" },
  { id: "bowls", label: "Bowls", icon: "◐" },
  { id: "mains", label: "Mains", icon: "◆" },
  { id: "snacks", label: "Snacks", icon: "○" },
  { id: "sweets", label: "Sweets", icon: "❋" },
];

const RECIPES = [
  {
    id: 1, title: "Avocado & Poached Eggs", cat: "breakfast", cal: 280, carbs: 3, fat: 22, protein: 14, time: "15m",
    img: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=85",
    ingredients: ["2 ripe avocados", "4 free-range eggs", "Flaky sea salt", "Fresh chives", "Red pepper flakes", "Extra virgin olive oil"],
    steps: ["Halve avocados, remove pit, scoop slightly to widen.", "Poach eggs in simmering water with a splash of vinegar.", "Place eggs into avocado halves.", "Finish with olive oil, flaky salt, chives, and chili flakes."]
  },
  {
    id: 2, title: "Butter Chicken with Cauliflower Rice", cat: "mains", cal: 420, carbs: 6, fat: 28, protein: 35, time: "35m",
    img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&q=85",
    ingredients: ["500g chicken thighs", "1 cup heavy cream", "2 tbsp ghee", "Crushed tomatoes", "Garam masala, cumin, turmeric", "Garlic, ginger, cilantro"],
    steps: ["Season chicken with spices, sear in ghee until golden.", "Add garlic and ginger, cook one minute.", "Pour in crushed tomatoes, simmer 15 minutes.", "Stir in cream, cook 5 more minutes. Serve over cauliflower rice."]
  },
  {
    id: 3, title: "Salmon Poke Bowl", cat: "bowls", cal: 380, carbs: 5, fat: 24, protein: 32, time: "20m",
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=85",
    ingredients: ["300g sushi-grade salmon", "1 avocado, sliced", "Cucumber ribbons", "Sesame seeds", "Coconut aminos", "Cauliflower rice base"],
    steps: ["Cube salmon, toss with coconut aminos and sesame oil.", "Prepare cauliflower rice base in bowls.", "Top with salmon, avocado, cucumber ribbons.", "Garnish with sesame seeds and microgreens."]
  },
  {
    id: 4, title: "Everything Bagel Fat Bombs", cat: "snacks", cal: 140, carbs: 1, fat: 13, protein: 4, time: "10m",
    img: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=800&q=85",
    ingredients: ["8 oz cream cheese", "2 tbsp salted butter", "Everything bagel seasoning", "Fresh chives"],
    steps: ["Soften cream cheese and butter to room temperature.", "Mix together until completely smooth.", "Roll into 12 even balls.", "Roll each in everything bagel seasoning. Chill 30 minutes."]
  },
  {
    id: 5, title: "Lemon Panna Cotta", cat: "sweets", cal: 180, carbs: 4, fat: 16, protein: 3, time: "25m",
    img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=85",
    ingredients: ["2 cups heavy cream", "¼ cup monk fruit sweetener", "Zest of 2 Meyer lemons", "1 tsp vanilla bean paste", "2 tsp gelatin", "Fresh berries"],
    steps: ["Bloom gelatin in cold water for 5 minutes.", "Heat cream with sweetener and lemon zest until simmering.", "Remove from heat, dissolve gelatin, add vanilla.", "Pour into ramekins. Chill 4 hours. Top with berries."]
  },
  {
    id: 6, title: "Herb-Crusted Salmon & Asparagus", cat: "mains", cal: 390, carbs: 4, fat: 22, protein: 38, time: "25m",
    img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=85",
    ingredients: ["2 wild salmon fillets", "1 bunch asparagus, trimmed", "Fresh dill & parsley", "Lemon", "Garlic, olive oil", "Dijon mustard"],
    steps: ["Brush salmon with Dijon, press on herb mixture.", "Arrange with asparagus on parchment-lined sheet.", "Drizzle everything with olive oil and lemon.", "Roast at 400°F for 15–18 minutes."]
  },
  {
    id: 7, title: "Chia Coconut Pudding", cat: "breakfast", cal: 220, carbs: 5, fat: 14, protein: 8, time: "5m",
    img: "https://images.unsplash.com/photo-1511690743698-d9d18f7e20f1?w=800&q=85",
    ingredients: ["3 tbsp chia seeds", "1 cup full-fat coconut milk", "½ tsp vanilla bean paste", "Blueberries & raspberries", "Toasted coconut flakes", "Almond butter drizzle"],
    steps: ["Whisk chia seeds with coconut milk and vanilla.", "Stir well, then again after 5 minutes to prevent clumps.", "Refrigerate overnight or at least 4 hours.", "Top with berries, coconut flakes, and almond butter."]
  },
  {
    id: 8, title: "Coconut Crusted Shrimp", cat: "mains", cal: 360, carbs: 4, fat: 20, protein: 30, time: "20m",
    img: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=800&q=85",
    ingredients: ["1 lb wild shrimp, peeled", "1 cup unsweetened coconut flakes", "2 eggs, beaten", "½ cup almond flour", "Coconut oil", "Lime wedges"],
    steps: ["Set up dredge: almond flour → egg → coconut flakes.", "Coat each shrimp through the three stations.", "Pan-fry in coconut oil 2–3 min per side until golden.", "Serve immediately with lime wedges."]
  },
  {
    id: 9, title: "Green Goddess Bowl", cat: "bowls", cal: 310, carbs: 6, fat: 22, protein: 18, time: "15m",
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=85",
    ingredients: ["Mixed greens & arugula", "½ avocado, sliced", "Cucumber, hemp hearts", "Soft-boiled egg", "Tahini-lemon dressing", "Pumpkin seeds"],
    steps: ["Arrange greens in a wide bowl.", "Top with avocado, cucumber, halved soft-boiled egg.", "Whisk tahini with lemon juice and water for dressing.", "Drizzle dressing, scatter hemp hearts and pumpkin seeds."]
  },
  {
    id: 10, title: "Almond Flour Pancakes", cat: "breakfast", cal: 260, carbs: 4, fat: 18, protein: 12, time: "15m",
    img: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=85",
    ingredients: ["1 cup fine almond flour", "2 large eggs", "2 tbsp cream cheese", "1 tsp baking powder", "Ceylon cinnamon", "Grass-fed butter"],
    steps: ["Whisk almond flour, baking powder, and cinnamon.", "Beat in eggs and softened cream cheese until smooth.", "Cook in butter over medium heat, 2–3 min per side.", "Stack and top with butter and sugar-free maple syrup."]
  },
  {
    id: 11, title: "Dark Chocolate Mousse", cat: "sweets", cal: 200, carbs: 5, fat: 18, protein: 4, time: "15m",
    img: "https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=800&q=85",
    ingredients: ["200g dark chocolate (85%+)", "1 cup cold heavy cream", "2 tbsp erythritol", "1 tsp vanilla extract", "Flaky sea salt"],
    steps: ["Melt chocolate gently in a double boiler, cool slightly.", "Whip cream with sweetener and vanilla to soft peaks.", "Fold melted chocolate into whipped cream in two additions.", "Spoon into glasses. Chill 2 hours. Finish with sea salt."]
  },
  {
    id: 12, title: "Steak with Herb Butter", cat: "mains", cal: 480, carbs: 1, fat: 34, protein: 40, time: "20m",
    img: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=85",
    ingredients: ["2 ribeye steaks, room temp", "3 tbsp compound herb butter", "Fresh rosemary & thyme", "4 garlic cloves", "Flaky salt & cracked pepper", "Avocado oil"],
    steps: ["Season steaks generously, let rest 30 minutes.", "Sear in smoking-hot cast iron with avocado oil, 4 min/side.", "Add butter, garlic, and herbs — baste continuously.", "Rest 5 minutes. Slice against the grain."]
  },
  {
    id: 13, title: "Cucumber Avocado Bites", cat: "snacks", cal: 120, carbs: 2, fat: 10, protein: 2, time: "10m",
    img: "https://images.unsplash.com/photo-1604497181015-76590d828448?w=800&q=85",
    ingredients: ["2 English cucumbers", "1 ripe avocado", "Fresh lemon juice", "Everything seasoning", "Maldon sea salt"],
    steps: ["Slice cucumbers into thick rounds.", "Mash avocado with lemon and salt.", "Spoon onto each round.", "Top with everything seasoning. Serve immediately."]
  },
  {
    id: 14, title: "Mediterranean Bowl", cat: "bowls", cal: 350, carbs: 6, fat: 24, protein: 22, time: "20m",
    img: "https://images.unsplash.com/photo-1529059997568-3d847b1154f0?w=800&q=85",
    ingredients: ["Grilled halloumi", "Cherry tomatoes, olives", "Cucumber, red onion", "Fresh mint & parsley", "Lemon-tahini dressing", "Za'atar seasoning"],
    steps: ["Grill halloumi until golden on both sides.", "Arrange vegetables in a wide bowl.", "Top with halloumi slices.", "Drizzle with lemon-tahini, finish with za'atar."]
  },
  {
    id: 15, title: "Jalapeño Bacon Poppers", cat: "snacks", cal: 160, carbs: 2, fat: 12, protein: 8, time: "25m",
    img: "https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?w=800&q=85",
    ingredients: ["12 jalapeños", "8 oz cream cheese", "1 cup sharp cheddar", "6 slices thick-cut bacon", "Garlic powder", "Fresh chives"],
    steps: ["Halve jalapeños, remove seeds and membranes.", "Mix cream cheese, cheddar, garlic powder, chives.", "Fill each half generously with cheese mixture.", "Wrap with bacon, bake at 400°F for 20 minutes."]
  },
  {
    id: 16, title: "Berry Cheesecake Bites", cat: "sweets", cal: 150, carbs: 3, fat: 13, protein: 4, time: "20m",
    img: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=85",
    ingredients: ["8 oz cream cheese", "¼ cup powdered erythritol", "1 tsp vanilla bean paste", "Almond flour crust", "Fresh raspberries", "Lemon zest"],
    steps: ["Press almond flour crust into mini muffin tin.", "Beat cream cheese with sweetener, vanilla, and lemon zest.", "Pipe filling into each crust.", "Top with fresh raspberry. Freeze 1 hour before serving."]
  },
];

const HEIGHTS = [300, 350, 260, 320, 280, 360, 270, 310, 340, 290, 330, 250, 300, 280, 340, 320];

export default function Nouri() {
  const [cat, setCat] = useState("all");
  const [saved, setSaved] = useState(new Set());
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState("discover");
  const [imgReady, setImgReady] = useState({});
  const [heartAnim, setHeartAnim] = useState(null);
  const searchRef = useRef(null);

  useEffect(() => { setTimeout(() => setLoaded(true), 80); }, []);

  const filtered = RECIPES.filter(r => {
    if (view === "saved" && !saved.has(r.id)) return false;
    if (cat !== "all" && r.cat !== cat) return false;
    if (search && !r.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const toggleSave = (id, e) => {
    if (e) e.stopPropagation();
    setHeartAnim(id);
    setTimeout(() => setHeartAnim(null), 500);
    setSaved(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const macroColor = (val, max) => {
    const pct = Math.min(val / max, 1);
    return `hsl(${140 - pct * 80}, 45%, 55%)`;
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FAF9F6" }}>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,300;1,9..144,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #FAF9F6; overflow-x: hidden; }
        ::selection { background: #E8DFD0; }
        ::-webkit-scrollbar { width: 0; }

        .n-shell { max-width: 1360px; margin: 0 auto; padding: 0 36px; }
        @media (max-width: 768px) { .n-shell { padding: 0 16px; } }

        /* ━━ NAV ━━ */
        .n-nav {
          position: sticky; top: 0; z-index: 50;
          background: rgba(250,249,246,0.82);
          backdrop-filter: blur(20px) saturate(1.4);
          -webkit-backdrop-filter: blur(20px) saturate(1.4);
          border-bottom: 1px solid rgba(0,0,0,0.04);
          padding: 0 36px;
        }
        .n-nav-inner {
          max-width: 1360px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
          height: 64px;
        }
        .n-brand {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 24px; font-weight: 500;
          color: #1a1a18; letter-spacing: -0.5px;
          cursor: default;
        }
        .n-brand span { color: #A8926A; }
        .n-nav-actions { display: flex; align-items: center; gap: 6px; }
        .n-nav-btn {
          padding: 8px 18px; border-radius: 100px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px; font-weight: 500;
          border: none; cursor: pointer;
          transition: all 0.25s;
          background: transparent; color: #888;
          position: relative;
        }
        .n-nav-btn:hover { color: #555; }
        .n-nav-btn.active { background: #1a1a18; color: #FAF9F6; }
        .n-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #C4956A; position: absolute;
          top: 6px; right: 10px;
          animation: dotPulse 2s ease infinite;
        }
        @keyframes dotPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }

        /* ━━ HERO ━━ */
        .n-hero { padding: 48px 0 8px; }
        .n-title {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 42px; font-weight: 400;
          color: #1a1a18; letter-spacing: -1px;
          line-height: 1.15; margin-bottom: 6px;
        }
        .n-title em { font-style: italic; color: #A8926A; font-weight: 300; }
        .n-subtitle {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px; color: #aaa; font-weight: 300;
          margin-bottom: 32px; letter-spacing: 0.2px;
        }
        @media (max-width: 768px) {
          .n-title { font-size: 30px; }
          .n-hero { padding: 32px 0 4px; }
        }

        /* ━━ SEARCH ━━ */
        .n-search-wrap {
          position: relative; max-width: 420px; margin-bottom: 28px;
        }
        .n-search-icon {
          position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
          font-size: 15px; color: #ccc; pointer-events: none;
        }
        .n-search {
          width: 100%; padding: 14px 18px 14px 42px;
          border: 1.5px solid #ECEAE4;
          border-radius: 16px; font-size: 14px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 400; background: #fff;
          color: #1a1a18; outline: none;
          transition: all 0.3s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }
        .n-search:focus {
          border-color: #C4B798;
          box-shadow: 0 0 0 4px rgba(196,183,152,0.12), 0 2px 8px rgba(0,0,0,0.04);
        }
        .n-search::placeholder { color: #d0ccc4; font-weight: 300; }

        /* ━━ CATEGORIES ━━ */
        .n-cats {
          display: flex; gap: 8px; flex-wrap: wrap;
          margin-bottom: 36px;
          padding-bottom: 4px;
        }
        .n-cat-btn {
          padding: 10px 22px; border-radius: 100px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px; font-weight: 400;
          border: 1.5px solid #ECEAE4;
          background: #fff; color: #999;
          cursor: pointer; transition: all 0.3s;
          display: flex; align-items: center; gap: 6px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.02);
        }
        .n-cat-btn:hover {
          border-color: #d4cfc4; color: #666;
          transform: translateY(-1px);
          box-shadow: 0 3px 8px rgba(0,0,0,0.04);
        }
        .n-cat-btn.active {
          background: #1a1a18; border-color: #1a1a18;
          color: #FAF9F6; font-weight: 500;
          box-shadow: 0 2px 10px rgba(26,26,24,0.15);
        }
        .n-cat-icon { font-size: 11px; opacity: 0.7; }

        /* ━━ GRID ━━ */
        .n-grid {
          columns: 4; column-gap: 20px;
          padding-bottom: 100px;
        }
        @media (max-width: 1100px) { .n-grid { columns: 3; } }
        @media (max-width: 768px) { .n-grid { columns: 2; column-gap: 12px; } }
        @media (max-width: 440px) { .n-grid { columns: 2; column-gap: 10px; } }

        /* ━━ CARD ━━ */
        .n-card {
          break-inside: avoid; margin-bottom: 20px;
          border-radius: 20px; overflow: hidden;
          background: #fff; cursor: pointer;
          position: relative;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02);
          transition: all 0.4s cubic-bezier(0.25,0.46,0.45,0.94);
          opacity: 0; transform: translateY(28px) scale(0.96);
        }
        .n-card.show { opacity: 1; transform: translateY(0) scale(1); }
        .n-card:hover {
          transform: translateY(-8px) scale(1.01) !important;
          box-shadow: 0 20px 50px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04);
        }
        .n-card:hover .n-card-img { transform: scale(1.06); }
        .n-card:hover .n-heart { opacity: 1; transform: scale(1); }
        .n-card:hover .n-card-gradient { opacity: 1; }
        .n-card.pop { animation: cardPop 0.5s cubic-bezier(0.34,1.56,0.64,1); }
        @keyframes cardPop {
          0% { transform: scale(1); }
          25% { transform: scale(0.95); }
          50% { transform: scale(1.03); }
          100% { transform: scale(1); }
        }

        .n-card-img-wrap {
          width: 100%; overflow: hidden;
          position: relative; background: #F0EDE6;
        }
        .n-card-img {
          width: 100%; height: 100%; object-fit: cover;
          display: block; transition: transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.5s;
        }
        .n-card-gradient {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.05) 40%, transparent 60%);
          opacity: 0; transition: opacity 0.4s; pointer-events: none;
        }
        .n-heart {
          position: absolute; top: 12px; right: 12px;
          width: 38px; height: 38px; border-radius: 50%;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(12px);
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 17px; z-index: 3;
          opacity: 0; transform: scale(0.7);
          transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
          color: #999;
        }
        .n-heart.is-saved {
          opacity: 1; transform: scale(1);
          background: #1a1a18; color: #FAF9F6;
        }
        .n-heart:hover { transform: scale(1.1) !important; }
        .n-card-time {
          position: absolute; bottom: 12px; left: 12px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 11px; font-weight: 500;
          color: #fff; padding: 5px 12px;
          background: rgba(0,0,0,0.45);
          backdrop-filter: blur(8px);
          border-radius: 100px;
          opacity: 0; transition: opacity 0.3s;
          letter-spacing: 0.5px;
        }
        .n-card:hover .n-card-time { opacity: 1; }

        .n-card-body { padding: 16px 18px 18px; }
        .n-card-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px; font-weight: 600;
          color: #1a1a18; line-height: 1.35;
          margin-bottom: 10px; letter-spacing: -0.2px;
        }
        .n-card-macros {
          display: flex; align-items: center; gap: 6px;
          flex-wrap: wrap;
        }
        .n-macro-pill {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 11px; font-weight: 500;
          padding: 4px 10px; border-radius: 8px;
          background: #F5F3EE; color: #8a8578;
          letter-spacing: 0.2px;
        }
        .n-macro-pill.carbs {
          background: #E8F5E4; color: #5a8a50;
        }

        /* ━━ MODAL ━━ */
        .n-overlay {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(26,26,24,0.25);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          display: flex; align-items: flex-end; justify-content: center;
          padding: 0;
          animation: fadeIn 0.2s ease;
        }
        @media (min-width: 640px) {
          .n-overlay { align-items: center; padding: 24px; }
        }
        .n-modal {
          background: #fff; width: 100%;
          max-width: 520px; max-height: 92vh;
          overflow-y: auto; overflow-x: hidden;
          border-radius: 28px 28px 0 0;
          animation: modalSlide 0.4s cubic-bezier(0.34,1.56,0.64,1);
          box-shadow: 0 -4px 40px rgba(0,0,0,0.08);
        }
        @media (min-width: 640px) {
          .n-modal { border-radius: 28px; animation-name: modalPop; }
        }
        .n-modal::-webkit-scrollbar { width: 0; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalSlide { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes modalPop { from { opacity: 0; transform: scale(0.92) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }

        .n-modal-img-wrap {
          width: 100%; height: 280px;
          overflow: hidden; position: relative;
        }
        .n-modal-img { width: 100%; height: 100%; object-fit: cover; }
        .n-modal-close {
          position: absolute; top: 16px; right: 16px;
          width: 40px; height: 40px; border-radius: 50%;
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(12px);
          border: none; cursor: pointer;
          font-size: 18px; color: #555;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .n-modal-close:hover { transform: scale(1.1); background: #fff; }
        .n-modal-badge {
          position: absolute; bottom: 16px; left: 20px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 11px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 2px;
          color: #fff; padding: 6px 14px;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(8px);
          border-radius: 10px;
        }

        .n-modal-body { padding: 28px 28px 36px; }
        .n-modal-title {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 28px; font-weight: 400;
          color: #1a1a18; line-height: 1.2;
          margin-bottom: 24px; letter-spacing: -0.5px;
        }

        .n-macro-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 10px; margin-bottom: 32px;
        }
        .n-macro-box {
          text-align: center; padding: 16px 8px;
          background: #FAF9F6; border-radius: 16px;
          position: relative; overflow: hidden;
        }
        .n-macro-box::after {
          content: ''; position: absolute;
          bottom: 0; left: 10%; right: 10%; height: 3px;
          border-radius: 2px;
        }
        .n-macro-val {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 20px; font-weight: 700;
          color: #1a1a18;
        }
        .n-macro-lbl {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 10px; color: #b0ab9f;
          text-transform: uppercase; letter-spacing: 1.2px;
          margin-top: 3px;
        }

        .n-section-label {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 18px; font-weight: 400;
          color: #1a1a18; margin-bottom: 14px;
        }
        .n-ingredient-list { margin-bottom: 28px; }
        .n-ingredient {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px; color: #666; font-weight: 400;
          padding: 10px 0;
          border-bottom: 1px solid #F5F3EE;
          display: flex; align-items: center; gap: 12px;
        }
        .n-ingredient:last-child { border: none; }
        .n-ing-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #C4B798; flex-shrink: 0;
        }

        .n-step-list { margin-top: 0; }
        .n-step {
          display: flex; gap: 16px;
          padding: 10px 0;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px; color: #555;
          font-weight: 400; line-height: 1.65;
        }
        .n-step-num {
          width: 28px; height: 28px; border-radius: 10px;
          background: #FAF9F6;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700; color: #aaa;
          flex-shrink: 0; margin-top: 1px;
        }

        .n-modal-save-btn {
          width: 100%; padding: 17px; border: none;
          border-radius: 16px; font-size: 15px;
          font-weight: 600; font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer; transition: all 0.3s;
          margin-top: 28px; letter-spacing: 0.3px;
        }
        .n-modal-save-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(26,26,24,0.12); }

        /* ━━ EMPTY ━━ */
        .n-empty {
          text-align: center; padding: 100px 20px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .n-empty-icon { font-size: 44px; margin-bottom: 16px; opacity: 0.5; display: block; }
        .n-empty-title { font-size: 16px; color: #999; font-weight: 500; margin-bottom: 6px; }
        .n-empty-sub { font-size: 13px; color: #ccc; font-weight: 300; }

        /* ━━ FOOTER ━━ */
        .n-footer {
          text-align: center; padding: 0 20px 40px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 12px; color: #ddd; font-weight: 300;
          letter-spacing: 1px;
        }

        @media (max-width: 768px) {
          .n-nav { padding: 0 16px; }
          .n-card-body { padding: 12px 14px 14px; }
          .n-card-title { font-size: 13px; }
          .n-modal-body { padding: 24px 20px 32px; }
          .n-modal-title { font-size: 24px; }
        }
      `}</style>

      {/* ━━ STICKY NAV ━━ */}
      <nav className="n-nav">
        <div className="n-nav-inner">
          <div className="n-brand">nouri<span>.</span></div>
          <div className="n-nav-actions">
            <button className={`n-nav-btn ${view === "discover" ? "active" : ""}`} onClick={() => setView("discover")}>
              Discover
            </button>
            <button className={`n-nav-btn ${view === "saved" ? "active" : ""}`} onClick={() => setView("saved")}>
              Saved
              {saved.size > 0 && <span className="n-dot" />}
            </button>
          </div>
        </div>
      </nav>

      <div className="n-shell">
        {/* ━━ HERO ━━ */}
        <div className="n-hero">
          <h1 className="n-title">
            {view === "saved" ? <>Your <em>collection</em></> : <>Keto <em>recipes</em></>}
          </h1>
          <p className="n-subtitle">
            {view === "saved"
              ? `${saved.size} recipe${saved.size !== 1 ? "s" : ""} saved`
              : "Clean eating, beautiful food, zero compromise"
            }
          </p>
        </div>

        {/* ━━ SEARCH ━━ */}
        <div className="n-search-wrap">
          <span className="n-search-icon">⌕</span>
          <input
            ref={searchRef}
            className="n-search"
            placeholder="Search recipes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* ━━ CATEGORIES ━━ */}
        <div className="n-cats">
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              className={`n-cat-btn ${cat === c.id ? "active" : ""}`}
              onClick={() => setCat(c.id)}
            >
              <span className="n-cat-icon">{c.icon}</span>
              {c.label}
            </button>
          ))}
        </div>

        {/* ━━ GRID ━━ */}
        <div className="n-grid">
          {filtered.length === 0 ? (
            <div className="n-empty">
              <span className="n-empty-icon">{view === "saved" ? "♡" : "✦"}</span>
              <div className="n-empty-title">{view === "saved" ? "No saved recipes yet" : "No recipes found"}</div>
              <div className="n-empty-sub">{view === "saved" ? "Tap the heart to start your collection" : "Try a different search or category"}</div>
            </div>
          ) : (
            filtered.map((r, i) => (
              <div
                key={r.id}
                className={`n-card ${loaded ? "show" : ""} ${heartAnim === r.id ? "pop" : ""}`}
                style={{ transitionDelay: `${i * 45}ms` }}
                onClick={() => setSelected(r)}
              >
                <div className="n-card-img-wrap" style={{ height: HEIGHTS[r.id - 1] || 300 }}>
                  <img
                    className="n-card-img"
                    src={r.img}
                    alt={r.title}
                    loading="lazy"
                    style={{ opacity: imgReady[r.id] ? 1 : 0 }}
                    onLoad={() => setImgReady(p => ({ ...p, [r.id]: true }))}
                  />
                  <div className="n-card-gradient" />
                  <button
                    className={`n-heart ${saved.has(r.id) ? "is-saved" : ""}`}
                    onClick={e => toggleSave(r.id, e)}
                    aria-label="Save recipe"
                  >
                    {saved.has(r.id) ? "♥" : "♡"}
                  </button>
                  <div className="n-card-time">{r.time}</div>
                </div>
                <div className="n-card-body">
                  <div className="n-card-title">{r.title}</div>
                  <div className="n-card-macros">
                    <span className="n-macro-pill carbs">{r.carbs}g carbs</span>
                    <span className="n-macro-pill">{r.cal} cal</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {filtered.length > 0 && <div className="n-footer">NOURI · EAT WELL · FEEL GOOD</div>}
      </div>

      {/* ━━ DETAIL MODAL ━━ */}
      {selected && (
        <div className="n-overlay" onClick={() => setSelected(null)}>
          <div className="n-modal" onClick={e => e.stopPropagation()}>
            <div className="n-modal-img-wrap">
              <img className="n-modal-img" src={selected.img} alt={selected.title} />
              <button className="n-modal-close" onClick={() => setSelected(null)}>✕</button>
              <div className="n-modal-badge">{selected.cat}</div>
            </div>

            <div className="n-modal-body">
              <h2 className="n-modal-title">{selected.title}</h2>

              <div className="n-macro-grid">
                {[
                  { val: selected.cal, label: "Cal", color: "#E8E4D8" },
                  { val: `${selected.carbs}g`, label: "Carbs", color: "#E0EED8" },
                  { val: `${selected.fat}g`, label: "Fat", color: "#F0E8D8" },
                  { val: `${selected.protein}g`, label: "Protein", color: "#D8E4EE" },
                ].map((m, i) => (
                  <div key={i} className="n-macro-box" style={{ "--bar-color": m.color }}>
                    <div className="n-macro-val">{m.val}</div>
                    <div className="n-macro-lbl">{m.label}</div>
                  </div>
                ))}
              </div>

              <div className="n-section-label">Ingredients</div>
              <div className="n-ingredient-list">
                {selected.ingredients.map((ing, i) => (
                  <div key={i} className="n-ingredient">
                    <span className="n-ing-dot" />
                    {ing}
                  </div>
                ))}
              </div>

              <div className="n-section-label">Method</div>
              <div className="n-step-list">
                {selected.steps.map((s, i) => (
                  <div key={i} className="n-step">
                    <span className="n-step-num">{i + 1}</span>
                    <span>{s}</span>
                  </div>
                ))}
              </div>

              <button
                className="n-modal-save-btn"
                style={{
                  background: saved.has(selected.id) ? "#FAF9F6" : "#1a1a18",
                  color: saved.has(selected.id) ? "#1a1a18" : "#FAF9F6",
                  border: saved.has(selected.id) ? "1.5px solid #ECEAE4" : "none",
                }}
                onClick={e => toggleSave(selected.id, e)}
              >
                {saved.has(selected.id) ? "♥  Saved to collection" : "Save recipe"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
