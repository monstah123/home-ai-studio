import { useState, useRef, useCallback } from "react";

const OPENAI_KEY = import.meta.env.VITE_OPENAI_KEY;

const STYLES = [
  { id: "modern-heritage", label: "Modern Heritage", emoji: "\u{1F3DB}\uFE0F", color: "#C4A882", bg: "#2A1F14" },
  { id: "warm-minimalism", label: "Warm Minimalism", emoji: "\u{1F56F}\uFE0F", color: "#E8D5B7", bg: "#3A2E24" },
  { id: "organic-luxe", label: "Organic Luxe", emoji: "\u{1F33F}", color: "#A8C5A0", bg: "#1E2B1A" },
  { id: "collected-eclecticism", label: "Collected Eclecticism", emoji: "\u{1F3A8}", color: "#D4A8D4", bg: "#2A1A2E" },
  { id: "biophilic", label: "Biophilic Design", emoji: "\u{1F343}", color: "#8FC6A0", bg: "#152018" },
  { id: "dark-wood-revival", label: "Dark Wood Revival", emoji: "\u{1FAB5}", color: "#B8926A", bg: "#1A1208" },
  { id: "sculptural", label: "Sculptural & Curved", emoji: "\u{1FAE7}", color: "#C8D8E8", bg: "#141E2A" },
  { id: "art-deco", label: "Art Deco Reimagined", emoji: "\u{1F48E}", color: "#F0D080", bg: "#1A1408" },
  { id: "color-capping", label: "Color Capping", emoji: "\u{1F308}", color: "#9090C8", bg: "#0E0E1A" },
  { id: "tactile", label: "Tactile Textures", emoji: "\u{1F9F5}", color: "#D4C4B4", bg: "#221E18" },
  { id: "japandi", label: "Japandi Zen", emoji: "\u26E9\uFE0F", color: "#C8BEB0", bg: "#1C1A16" },
  { id: "earthy-romanticism", label: "Earthy Romanticism", emoji: "\u{1F339}", color: "#D4A0A0", bg: "#2A1418" },
];

const ROOMS = [
  { id: "living-room", label: "Living Room", icon: "\u{1F6CB}\uFE0F" },
  { id: "kitchen", label: "Kitchen", icon: "\u{1F373}" },
  { id: "bathroom", label: "Bathroom", icon: "\u{1F6C1}" },
  { id: "bedroom", label: "Bedroom", icon: "\u{1F6CF}\uFE0F" },
  { id: "dining-room", label: "Dining Room", icon: "\u{1F37D}\uFE0F" },
  { id: "home-office", label: "Home Office", icon: "\u{1F4BC}" },
  { id: "outdoor", label: "Outdoor / Patio", icon: "\u{1F333}" },
  { id: "entryway", label: "Entryway", icon: "\u{1F6AA}" },
];

const STYLE_PROMPTS = {
  "modern-heritage": "Modern Heritage blends contemporary clean lines with traditional craftsmanship — handmade ceramics, artisan metals, and quiet luxury details that honor enduring quality.",
  "warm-minimalism": "Warm Minimalism emphasizes restraint with warmth — sun-faded palettes, natural linen, plaster walls, purposeful objects, and inviting deep-seated furniture designed for lingering.",
  "organic-luxe": "Organic Luxe marries raw natural forms with high-end finishes — live-edge walnut tables, veined marble accent walls, travertine surfaces, and sculptural stone furniture.",
  "collected-eclecticism": "Collected Eclecticism celebrates personal storytelling through curated objects from different eras — mixing vintage finds, artisan pieces, meaningful heirlooms, and global textiles with intentional cohesion.",
  "biophilic": "Biophilic Design integrates nature holistically — circadian-aligned lighting, living walls, natural wood, mindful material choices, and landscape art that deepens the connection to the outdoors.",
  "dark-wood-revival": "Dark Wood Revival embraces rich walnut, espresso oak, and burl wood to add dramatic depth — dark-stained cabinetry, wood-paneled walls, and artisanal brass hardware replacing matte black.",
  "sculptural": "Sculptural & Curved Forms feature tailored rounded sofas, arched niches, organic furniture silhouettes, and refined plaster walls — comfort with cleaner, more intentional lines.",
  "art-deco": "Art Deco Reimagined brings geometric glamour updated for 2026 — chevron inlays, lacquered surfaces, dusty jewel-tone velvets, patinaed brass, and streamlined elegance.",
  "color-capping": "Color Capping uses tonal gradients within one color family — darkest on the ceiling, medium on walls, lightest at floor level — creating immersive, sophisticated depth without monotony.",
  "tactile": "Tactile Textures create layered sensory richness — limewash walls, plush velvet, natural woven fibers, textured glass, reclaimed wood, and fabric wall tapestries as art.",
  "japandi": "Japandi Zen fuses Japanese wabi-sabi and Scandinavian hygge — functional simplicity, muted warm tones, handcrafted solid wood, and aged organic materials.",
  "earthy-romanticism": "Earthy Romanticism features chalky rose, sunbaked terracotta, dusty sapphire, and muted cranberry — hand-painted furniture, whimsical embellishments, soft warmth, and nature-inspired romance.",
};

const DALLE_KEYWORDS = {
  "modern-heritage": "modern heritage interior design, warm oak wood, handmade ceramics, artisan brass hardware, quiet luxury craftsmanship, enduring quality materials",
  "warm-minimalism": "warm minimalist interior, sun-faded neutral palette, natural linen textiles, plaster walls, deep comfortable seating, soft diffused warm light, purposeful minimal decor",
  "organic-luxe": "organic luxury interior, live-edge walnut furniture, veined marble accent wall, travertine stone surfaces, sculptural stone pieces, earthy linen drapes, high-end natural finishes",
  "collected-eclecticism": "eclectic collected interior design, mixed vintage and modern furniture, personal art collection, global textiles, layered patterns at different scales, meaningful curated objects, warm lived-in atmosphere",
  "biophilic": "biophilic interior design, lush living plant walls, circadian lighting, natural wood elements, landscape art, abundant tropical greenery, floor-to-ceiling windows, organic shapes",
  "dark-wood-revival": "dark wood interior design, rich walnut paneled walls, espresso oak cabinetry, burl wood accents, patinaed brass fixtures, deep warm wood tones, dramatic depth and character",
  "sculptural": "sculptural curved interior design, tailored rounded sofa, arched doorways, organic furniture silhouettes, refined warm plaster walls, curved forms with clean intentional lines",
  "art-deco": "art deco reimagined interior design, patinaed brass fixtures, chevron marble flooring, dusty jewel tone velvet upholstery, lacquered surfaces, streamlined geometric glamour",
  "color-capping": "color capped interior, tonal gradient walls from dark ceiling to lighter lower walls, immersive single color family, sophisticated depth, dramatic atmospheric lighting, deep muted tones",
  "tactile": "tactile texture interior design, plush velvet sofa, limewash walls, woven natural fiber accents, textured art glass, fabric wall tapestry, reclaimed wood, layered natural textures",
  "japandi": "japandi interior design, wabi-sabi aesthetics, muted warm neutral tones, handcrafted solid wood furniture, aged organic materials, zen minimalism, natural fiber rugs",
  "earthy-romanticism": "earthy romantic interior design, chalky rose and terracotta palette, hand-painted furniture details, whimsical embellishments, dusty jewel tones, soft warm textiles, nature-inspired romantic atmosphere",
};

async function generateDalleImage(styleId, roomLabel, extraPrompt = "") {
  const keywords = DALLE_KEYWORDS[styleId] || "modern interior design";
  const prompt = `Professional interior design photograph of a beautifully styled ${roomLabel}. ${keywords}. ${extraPrompt} Photorealistic, Architectural Digest quality editorial photo, beautiful natural and warm artificial lighting, ultra-detailed, no people, no text overlays, wide angle shot showing full room.`;
  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENAI_KEY}` },
    body: JSON.stringify({ model: "dall-e-3", prompt, n: 1, size: "1792x1024", quality: "standard" }),
  });
  if (!response.ok) { const err = await response.json().catch(() => ({})); throw new Error(err.error?.message || "Image generation failed"); }
  const data = await response.json();
  return data.data[0].url;
}

async function analyzeRoomWithVision(base64Image, mimeType) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENAI_KEY}` },
    body: JSON.stringify({
      model: "gpt-4o", max_tokens: 400,
      messages: [{
        role: "user",
        content: [
          { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64Image}`, detail: "low" } },
          { type: "text", text: "Describe this room for an interior design AI. In 3-4 sentences cover: room type, approximate size/layout, current wall color, flooring material, main furniture pieces, lighting, and current style. Be specific and concise. Only describe what you see, no advice." }
        ]
      }]
    }),
  });
  if (!response.ok) { const err = await response.json().catch(() => ({})); throw new Error(err.error?.message || "Vision analysis failed"); }
  const d = await response.json();
  return d.choices?.[0]?.message?.content || "";
}

async function generateMakeoverImage(styleId, roomDescription, styleLabel) {
  const keywords = DALLE_KEYWORDS[styleId] || "modern interior design";
  const prompt = `Professional interior design photograph showing a stunning ${styleLabel} style makeover. The room being redesigned: ${roomDescription}. Apply this complete transformation: ${keywords}. Keep the same room layout and dimensions but completely redesign all surfaces, furniture, materials and colors. Photorealistic, Architectural Digest quality, beautiful lighting, ultra-detailed, no people, no text overlays, wide angle shot.`;
  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENAI_KEY}` },
    body: JSON.stringify({ model: "dall-e-3", prompt, n: 1, size: "1792x1024", quality: "hd" }),
  });
  if (!response.ok) { const err = await response.json().catch(() => ({})); throw new Error(err.error?.message || "Makeover generation failed"); }
  const d = await response.json();
  return d.data[0].url;
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => { resolve(reader.result.split(",")[1]); };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Before/After Comparison Slider
function CompareSlider({ beforeSrc, afterSrc, accent }) {
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef(null);

  const updatePos = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.max(2, Math.min(98, ((clientX - rect.left) / rect.width) * 100));
    setPos(pct);
  }, []);

  const onMouseMove = useCallback((e) => { if (dragging) updatePos(e.clientX); }, [dragging, updatePos]);
  const onMouseUp = useCallback(() => setDragging(false), []);

  return (
    <div
      ref={containerRef}
      onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
      onTouchMove={(e) => updatePos(e.touches[0].clientX)} onTouchEnd={onMouseUp}
      style={{ position: "relative", borderRadius: "16px", overflow: "hidden", cursor: dragging ? "grabbing" : "grab", userSelect: "none", touchAction: "none" }}
    >
      <img src={afterSrc} alt="After" style={{ width: "100%", display: "block" }} />
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <img src={beforeSrc} alt="Before" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${pos}%`, width: "2px", background: "#fff", transform: "translateX(-50%)", pointerEvents: "none" }}>
        <div
          onMouseDown={(e) => { e.preventDefault(); setDragging(true); }}
          onTouchStart={(e) => { e.preventDefault(); setDragging(true); }}
          style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "44px", height: "44px", borderRadius: "50%", background: `radial-gradient(circle at 35% 35%, ${accent}cc, #111)`, border: `2px solid ${accent}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "grab", boxShadow: `0 0 20px ${accent}66`, pointerEvents: "auto", color: "#fff", fontSize: "16px", letterSpacing: "-2px" }}
        >&#9666;&#9656;</div>
      </div>
      <div style={{ position: "absolute", top: "12px", left: "14px", background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)", borderRadius: "20px", padding: "4px 12px", fontSize: "9px", color: "#ccc", letterSpacing: "0.18em", fontFamily: "'DM Sans',sans-serif", textTransform: "uppercase", fontWeight: 700, pointerEvents: "none" }}>Before</div>
      <div style={{ position: "absolute", top: "12px", right: "14px", background: `${accent}33`, backdropFilter: "blur(8px)", border: `1px solid ${accent}55`, borderRadius: "20px", padding: "4px 12px", fontSize: "9px", color: accent, letterSpacing: "0.18em", fontFamily: "'DM Sans',sans-serif", textTransform: "uppercase", fontWeight: 700, pointerEvents: "none" }}>After</div>
    </div>
  );
}

// Upload Drop Zone
function UploadZone({ onFile, accent, uploadedPreview }) {
  const [draggingOver, setDraggingOver] = useState(false);
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault(); setDraggingOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) onFile(file);
  };

  return (
    <div
      onClick={() => !uploadedPreview && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDraggingOver(true); }}
      onDragLeave={() => setDraggingOver(false)}
      onDrop={handleDrop}
      style={{ borderRadius: "20px", overflow: "hidden", border: `2px dashed ${draggingOver ? accent : uploadedPreview ? accent + "44" : "rgba(255,255,255,0.08)"}`, background: draggingOver ? `${accent}08` : "rgba(255,255,255,0.015)", transition: "all 0.3s", cursor: uploadedPreview ? "default" : "pointer", minHeight: uploadedPreview ? "auto" : "220px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}
    >
      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files[0]; if (f) onFile(f); }} />
      {uploadedPreview ? (
        <div style={{ position: "relative", width: "100%" }}>
          <img src={uploadedPreview} alt="Uploaded room" style={{ width: "100%", display: "block", borderRadius: "18px" }} />
          <div style={{ position: "absolute", bottom: "12px", right: "12px" }}>
            <button onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }} style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", border: `1px solid ${accent}44`, borderRadius: "20px", padding: "6px 14px", color: accent, fontSize: "10px", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.1em", fontWeight: 700 }}>Change Photo</button>
          </div>
          <div style={{ position: "absolute", top: "12px", left: "12px", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", borderRadius: "20px", padding: "4px 12px", fontSize: "9px", color: "#aaa", letterSpacing: "0.15em", fontFamily: "'DM Sans',sans-serif", textTransform: "uppercase", fontWeight: 700 }}>Your Room</div>
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontSize: "42px", marginBottom: "14px" }}>&#128248;</div>
          <div style={{ color: "#999", fontSize: "14px", fontFamily: "'Playfair Display',serif", fontWeight: 600, marginBottom: "6px" }}>Drop your room photo here</div>
          <div style={{ color: "#444", fontSize: "11px", fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.05em" }}>or click to browse &middot; JPG, PNG, HEIC</div>
          <div style={{ marginTop: "18px", display: "inline-flex", alignItems: "center", gap: "6px", background: `${accent}14`, border: `1px solid ${accent}30`, borderRadius: "20px", padding: "6px 16px" }}>
            <span style={{ fontSize: "10px", color: accent, letterSpacing: "0.1em", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, textTransform: "uppercase" }}>AI Makeover powered by GPT-4o + DALL&middot;E 3</span>
          </div>
        </div>
      )}
    </div>
  );
}

function StyleOrb({ style, isSelected, onClick, index, total }) {
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
  const cx = 50 + (160 / 4.2) * Math.cos(angle);
  const cy = 50 + (160 / 4.2) * Math.sin(angle);
  return (
    <button onClick={() => onClick(style)} style={{ position: "absolute", left: `${cx}%`, top: `${cy}%`, transform: "translate(-50%, -50%)", width: isSelected ? "88px" : "70px", height: isSelected ? "88px" : "70px", borderRadius: "50%", background: isSelected ? `radial-gradient(circle at 35% 35%, ${style.color}55, ${style.bg})` : `radial-gradient(circle at 35% 35%, ${style.color}20, ${style.bg}88)`, border: `2px solid ${isSelected ? style.color : style.color + "40"}`, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)", boxShadow: isSelected ? `0 0 28px ${style.color}66, 0 0 56px ${style.color}22, inset 0 1px 0 ${style.color}44` : `0 4px 18px rgba(0,0,0,0.4)`, zIndex: isSelected ? 10 : 1, backdropFilter: "blur(8px)" }}>
      <span style={{ fontSize: isSelected ? "24px" : "18px", lineHeight: 1, transition: "all 0.3s" }}>{style.emoji}</span>
      <span style={{ fontSize: "6.5px", color: isSelected ? style.color : "#777", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", marginTop: "4px", textAlign: "center", lineHeight: 1.2, maxWidth: "58px", transition: "all 0.3s" }}>{style.label}</span>
    </button>
  );
}

function Dots({ color }) {
  return (
    <div style={{ display: "flex", gap: "8px", justifyContent: "center", padding: "16px 0" }}>
      {[0, 1, 2].map(i => <div key={i} style={{ width: "7px", height: "7px", borderRadius: "50%", background: color || "#C4A882", animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />)}
    </div>
  );
}

function IdeaCard({ idea, index, accentColor, styleId, roomLabel }) {
  const [open, setOpen] = useState(false);
  const [img, setImg] = useState(null);
  const [imgLoading, setImgLoading] = useState(false);
  const [imgErr, setImgErr] = useState(null);

  const handleImg = async (e) => {
    e.stopPropagation(); setImgLoading(true); setImgErr(null);
    try { setImg(await generateDalleImage(styleId, roomLabel, `Featuring: ${idea.title}.`)); }
    catch (err) { setImgErr(err.message); }
    finally { setImgLoading(false); }
  };

  return (
    <div style={{ background: "rgba(255,255,255,0.025)", borderRadius: "18px", overflow: "hidden", border: `1px solid rgba(255,255,255,0.07)`, borderLeft: `3px solid ${accentColor}55`, transition: "all 0.3s ease", animation: "slideUp 0.5s ease forwards", opacity: 0, animationDelay: `${index * 0.07}s` }}>
      <div onClick={() => setOpen(!open)} style={{ padding: "18px 22px", cursor: "pointer", display: "flex", gap: "12px", alignItems: "flex-start" }}
        onMouseEnter={e => e.currentTarget.parentElement.style.background = "rgba(255,255,255,0.05)"}
        onMouseLeave={e => e.currentTarget.parentElement.style.background = "rgba(255,255,255,0.025)"}>
        <span style={{ background: `${accentColor}20`, color: accentColor, borderRadius: "8px", padding: "3px 9px", fontSize: "10px", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif", flexShrink: 0 }}>#{String(index + 1).padStart(2, "0")}</span>
        <div style={{ flex: 1 }}>
          <div style={{ color: "#F0EDE8", fontFamily: "'Playfair Display',serif", fontSize: "15px", fontWeight: 600, lineHeight: 1.4 }}>{idea.title}</div>
          <div style={{ color: "#4A4540", fontFamily: "'DM Sans',sans-serif", fontSize: "12px", marginTop: "3px", lineHeight: 1.5 }}>{idea.description?.substring(0, 85)}...</div>
        </div>
        <span style={{ color: "#333", fontSize: "13px", flexShrink: 0 }}>{open ? "^" : "v"}</span>
      </div>
      {open && (
        <div style={{ padding: "0 22px 22px" }}>
          <p style={{ color: "#8A8480", fontFamily: "'DM Sans',sans-serif", fontSize: "13px", lineHeight: 1.75, marginBottom: "14px" }}>{idea.description}</p>
          {idea.products && (
            <div style={{ display: "flex", gap: "7px", flexWrap: "wrap", marginBottom: "18px" }}>
              {idea.products.map((p, i) => <span key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "20px", padding: "3px 13px", fontSize: "11px", color: "#777", fontFamily: "'DM Sans',sans-serif" }}>{p}</span>)}
            </div>
          )}
          {img ? (
            <div>
              <div style={{ borderRadius: "12px", overflow: "hidden" }}><img src={img} alt={idea.title} style={{ width: "100%", display: "block" }} /></div>
              <button onClick={handleImg} style={{ marginTop: "10px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "7px 14px", color: "#555", fontSize: "11px", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>New Image</button>
            </div>
          ) : imgLoading ? (
            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "12px", padding: "28px", textAlign: "center" }}>
              <div style={{ fontSize: "11px", color: accentColor, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>Rendering with DALL E 3</div>
              <Dots color={accentColor} />
            </div>
          ) : (
            <div>
              <button onClick={handleImg} style={{ width: "100%", background: `linear-gradient(135deg, ${accentColor}12, ${accentColor}06)`, border: `1px dashed ${accentColor}40`, borderRadius: "12px", padding: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", transition: "all 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.background = `linear-gradient(135deg, ${accentColor}22, ${accentColor}12)`; }}
                onMouseLeave={e => { e.currentTarget.style.background = `linear-gradient(135deg, ${accentColor}12, ${accentColor}06)`; }}>
                <div style={{ textAlign: "left" }}>
                  <div style={{ color: accentColor, fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>Visualize This Idea</div>
                  <div style={{ color: "#444", fontSize: "11px", fontFamily: "'DM Sans',sans-serif", marginTop: "2px" }}>AI render powered by DALL E 3</div>
                </div>
              </button>
              {imgErr && <p style={{ color: "#E09090", fontSize: "11px", marginTop: "8px", fontFamily: "'DM Sans',sans-serif" }}>Error: {imgErr}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Makeover Tab
function MakeoverTab({ selectedStyle, accent, styleData }) {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedPreview, setUploadedPreview] = useState(null);
  const [makeoverImg, setMakeoverImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState(null);
  const [roomAnalysis, setRoomAnalysis] = useState("");

  const handleFile = (file) => {
    setUploadedFile(file); setMakeoverImg(null); setError(null); setRoomAnalysis("");
    setUploadedPreview(URL.createObjectURL(file));
  };

  const runMakeover = async () => {
    if (!uploadedFile || !selectedStyle) return;
    setLoading(true); setError(null); setMakeoverImg(null); setRoomAnalysis("");
    try {
      setStatus("Analysing your room with GPT-4o Vision...");
      const base64 = await fileToBase64(uploadedFile);
      const analysis = await analyzeRoomWithVision(base64, uploadedFile.type);
      setRoomAnalysis(analysis);
      setStatus(`Generating ${styleData.label} makeover with DALL E 3 HD...`);
      const url = await generateMakeoverImage(selectedStyle, analysis, styleData.label);
      setMakeoverImg(url); setStatus("");
    } catch (err) { setError(err.message); setStatus(""); }
    finally { setLoading(false); }
  };

  const canGenerate = uploadedFile && selectedStyle && !loading;

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{ background: `${accent}08`, border: `1px solid ${accent}18`, borderRadius: "14px", padding: "14px 18px", marginBottom: "22px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
        <div>
          <div style={{ color: accent, fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif", marginBottom: "4px" }}>How it works</div>
          <div style={{ color: "#5A5550", fontSize: "12px", fontFamily: "'DM Sans',sans-serif", lineHeight: 1.65 }}>
            Upload a photo of any room, choose a style from the orbit above, then hit Generate Makeover. GPT-4o analyses your space and DALL E 3 renders a stunning redesign. Drag the slider to compare before and after.
          </div>
        </div>
      </div>

      <UploadZone onFile={handleFile} accent={accent} uploadedPreview={uploadedPreview} />

      {!selectedStyle && <div style={{ textAlign: "center", marginTop: "14px", color: "#333", fontSize: "11px", fontFamily: "'DM Sans',sans-serif" }}>Select a style from the orbit above first</div>}

      <div style={{ textAlign: "center", margin: "22px 0" }}>
        <button onClick={runMakeover} disabled={!canGenerate} style={{ background: canGenerate ? `linear-gradient(135deg, ${accent}30, ${accent}12)` : "rgba(255,255,255,0.025)", border: `1px solid ${canGenerate ? accent + "55" : "rgba(255,255,255,0.06)"}`, borderRadius: "50px", padding: "16px 50px", color: canGenerate ? accent : "#252220", fontSize: "11.5px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif", cursor: canGenerate ? "pointer" : "not-allowed", transition: "all 0.4s ease", boxShadow: canGenerate ? `0 8px 36px ${accent}20` : "none" }}
          onMouseEnter={e => { if (canGenerate) { e.currentTarget.style.background = `linear-gradient(135deg, ${accent}44, ${accent}22)`; e.currentTarget.style.transform = "translateY(-2px)"; } }}
          onMouseLeave={e => { e.currentTarget.style.background = `linear-gradient(135deg, ${accent}30, ${accent}12)`; e.currentTarget.style.transform = "translateY(0)"; }}>
          {loading ? "Generating Makeover..." : "Generate Makeover"}
        </button>
      </div>

      {loading && (
        <div style={{ textAlign: "center", marginBottom: "20px", animation: "fadeIn 0.3s ease" }}>
          <div style={{ fontSize: "11px", color: accent, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>{status}</div>
          <Dots color={accent} />
        </div>
      )}

      {error && <div style={{ background: "rgba(200,70,70,0.07)", border: "1px solid rgba(200,70,70,0.22)", borderRadius: "12px", padding: "14px 18px", color: "#C08080", fontSize: "12px", textAlign: "center", fontFamily: "'DM Sans',sans-serif", marginBottom: "20px" }}>Error: {error}</div>}

      {roomAnalysis && !loading && (
        <div style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${accent}18`, borderRadius: "14px", padding: "14px 18px", marginBottom: "18px", animation: "slideUp 0.4s ease" }}>
          <div style={{ color: accent, fontSize: "8.5px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif", marginBottom: "6px" }}>GPT-4o Room Analysis</div>
          <div style={{ color: "#6A6560", fontSize: "12px", fontFamily: "'DM Sans',sans-serif", lineHeight: 1.7 }}>{roomAnalysis}</div>
        </div>
      )}

      {makeoverImg && uploadedPreview && (
        <div style={{ animation: "slideUp 0.5s ease" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "19px", fontWeight: 600, color: "#F0EDE8" }}>Before & After</div>
              <div style={{ color: accent, fontSize: "9.5px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif", marginTop: "2px" }}>{styleData?.label} Makeover - Drag to Compare</div>
            </div>
            <button onClick={runMakeover} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "8px", padding: "7px 14px", color: "#444", fontSize: "10.5px", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#999"} onMouseLeave={e => e.currentTarget.style.color = "#444"}>Redo</button>
          </div>
          <CompareSlider beforeSrc={uploadedPreview} afterSrc={makeoverImg} accent={accent} />
          <div style={{ textAlign: "center", marginTop: "14px", color: "#2A2520", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>Drag the handle left and right to compare</div>
          <div style={{ textAlign: "center", marginTop: "14px" }}>
            <a href={makeoverImg} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: `${accent}14`, border: `1px solid ${accent}30`, borderRadius: "20px", padding: "8px 20px", color: accent, fontSize: "10.5px", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, letterSpacing: "0.1em", textDecoration: "none", textTransform: "uppercase" }}>
              Open Full Resolution
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("ideas");
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [heroImg, setHeroImg] = useState(null);
  const [heroLoading, setHeroLoading] = useState(false);
  const [pulse, setPulse] = useState(false);
  const resultsRef = useRef(null);

  const styleData = STYLES.find(s => s.id === selectedStyle);
  const roomData = ROOMS.find(r => r.id === selectedRoom);
  const accent = styleData?.color || "#C4A882";

  const generate = async () => {
    if (!selectedStyle || !selectedRoom) return;
    setLoading(true); setError(null); setIdeas([]); setHeroImg(null);
    setPulse(true); setTimeout(() => setPulse(false), 900);
    setHeroLoading(true);
    generateDalleImage(selectedStyle, roomData.label).then(url => setHeroImg(url)).catch(() => { }).finally(() => setHeroLoading(false));
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENAI_KEY}` },
        body: JSON.stringify({
          model: "gpt-4o", max_tokens: 1500,
          messages: [
            { role: "system", content: "You are an elite interior design AI. Always respond with raw valid JSON only, no markdown, no backticks, no preamble. Just the JSON array." },
            { role: "user", content: `Generate 7 trending decor ideas for a ${roomData.label} in the "${styleData.label}" style. Context: ${STYLE_PROMPTS[selectedStyle]}. Return a JSON array. Each item: "title" (punchy 4-7 words), "description" (2-3 sentences, specific materials, colors, tips), "products" (array of 3-4 item types). Start with [ end with ]` },
          ],
        }),
      });
      if (!res.ok) { const e = await res.json().catch(() => { }); throw new Error(e?.error?.message || `Error ${res.status}`); }
      const d = await res.json();
      const text = d.choices?.[0]?.message?.content || "";
      const match = text.match(/\[[\s\S]*\]/);
      if (!match) throw new Error("Invalid response format");
      const parsed = JSON.parse(match[0]);
      if (!Array.isArray(parsed) || !parsed.length) throw new Error("Empty response");
      setIdeas(parsed);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 200);
    } catch (err) { setError(err.message || "Something went wrong."); }
    finally { setLoading(false); }
  };

  const tabs = [{ id: "ideas", label: "Design Ideas" }, { id: "makeover", label: "Room Makeover" }];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,600;9..40,700&display=swap');
        *{margin:0;padding:0;box-sizing:border-box;}
        body{background:#0B0B0D;color:#F0EDE8;overflow-x:hidden;}
        @keyframes pulse{0%,100%{transform:scale(0.8);opacity:0.3;}50%{transform:scale(1.2);opacity:1;}}
        @keyframes slideUp{from{opacity:0;transform:translateY(22px);}to{opacity:1;transform:translateY(0);}}
        @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
        @keyframes glow{0%,100%{box-shadow:0 0 20px ${accent}44;}50%{box-shadow:0 0 55px ${accent}99,0 0 90px ${accent}33;}}
        ::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-thumb{background:#222;border-radius:2px;}
      `}</style>

      <div style={{ minHeight: "100vh", background: "#0B0B0D" }}>
        <div style={{ textAlign: "center", padding: "48px 20px 0" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: `${accent}10`, border: `1px solid ${accent}28`, borderRadius: "30px", padding: "5px 18px", marginBottom: "20px", transition: "all 0.5s" }}>
            <span style={{ fontSize: "13px" }}>&#127968;</span>
            <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: accent, fontFamily: "'DM Sans',sans-serif" }}>AI Interior Design Studio</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(36px,6vw,64px)", fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1, marginBottom: "8px" }}>
            <span style={{ color: accent, transition: "color 0.5s", fontStyle: "italic" }}>Monstah!!!</span>
          </h1>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(16px,2.5vw,26px)", fontWeight: 400, color: "#4A4540", letterSpacing: "0.01em", marginBottom: "14px", transition: "all 0.4s" }}>
            {activeTab === "makeover" ? "Room Makeover Studio" : roomData ? `${roomData.label} Ideas` : "Living Room Ideas"}
          </h2>
          <p style={{ color: "#383430", fontSize: "13px", maxWidth: "420px", margin: "0 auto", lineHeight: 1.7, fontFamily: "'DM Sans',sans-serif" }}>
            {activeTab === "makeover" ? "Upload your room, choose a style, watch it transform with AI" : "Pick a style orbit, choose your room, generate AI concepts + DALL E 3 renders"}
          </p>
        </div>

        <div style={{ position: "relative", width: "100%", maxWidth: "500px", height: "500px", margin: "0 auto" }}>
          {[58, 28].map((ins, i) => <div key={i} style={{ position: "absolute", inset: `${ins}px`, borderRadius: "50%", border: `1px ${i ? "dashed" : "solid"} rgba(255,255,255,${i ? "0.025" : "0.04"})`, pointerEvents: "none" }} />)}
          <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: "110px", height: "110px", borderRadius: "50%", background: styleData ? `radial-gradient(circle at 35% 35%, ${accent}30, ${styleData.bg})` : "radial-gradient(circle at 35% 35%, #222018, #0E0C0A)", border: `2px solid ${accent}40`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 5, transition: "all 0.6s ease", animation: selectedStyle ? "glow 3s ease-in-out infinite" : "none", boxShadow: pulse ? `0 0 80px ${accent}99` : `0 0 30px ${accent}30` }}>
            {styleData ? (<><span style={{ fontSize: "30px" }}>{styleData.emoji}</span><span style={{ fontSize: "7px", color: accent, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif", textAlign: "center", maxWidth: "82px", lineHeight: 1.3, marginTop: "5px" }}>{styleData.label}</span></>) : (<span style={{ fontSize: "9.5px", color: "#2A2520", textAlign: "center", fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.12em", textTransform: "uppercase", lineHeight: 1.7 }}>SELECT<br />STYLE</span>)}
          </div>
          {STYLES.map((s, i) => <StyleOrb key={s.id} style={s} isSelected={selectedStyle === s.id} onClick={s => setSelectedStyle(selectedStyle === s.id ? null : s.id)} index={i} total={STYLES.length} />)}
        </div>

        <div style={{ maxWidth: "680px", margin: "0 auto", padding: "0 20px" }}>
          {/* TABS */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "28px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "5px" }}>
            {tabs.map(tab => {
              const active = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, padding: "11px 16px", borderRadius: "12px", border: "none", cursor: "pointer", background: active ? `linear-gradient(135deg, ${accent}22, ${accent}0d)` : "transparent", color: active ? accent : "#3A3530", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif", transition: "all 0.3s", boxShadow: active ? `0 2px 12px ${accent}18` : "none" }}>
                  {tab.label}
                </button>
              );
            })}
          </div>

          {activeTab === "ideas" && (
            <div style={{ animation: "fadeIn 0.35s ease" }}>
              <p style={{ fontSize: "9.5px", letterSpacing: "0.24em", textTransform: "uppercase", color: "#2A2520", fontWeight: 700, fontFamily: "'DM Sans',sans-serif", textAlign: "center", marginBottom: "14px" }}>Choose Your Room</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "9px", marginBottom: "28px" }}>
                {ROOMS.map(room => {
                  const sel = selectedRoom === room.id;
                  return (
                    <button key={room.id} onClick={() => setSelectedRoom(sel ? null : room.id)} style={{ background: sel ? `${accent}16` : "rgba(255,255,255,0.025)", border: `1px solid ${sel ? accent + "55" : "rgba(255,255,255,0.06)"}`, borderRadius: "14px", padding: "13px 8px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "7px", transition: "all 0.3s", color: sel ? accent : "#484440", boxShadow: sel ? `0 4px 18px ${accent}20` : "none" }}
                      onMouseEnter={e => { if (!sel) { e.currentTarget.style.color = "#888"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; } }}
                      onMouseLeave={e => { if (!sel) { e.currentTarget.style.color = "#484440"; e.currentTarget.style.background = "rgba(255,255,255,0.025)"; } }}>
                      <span style={{ fontSize: "20px" }}>{room.icon}</span>
                      <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.04em", textAlign: "center", lineHeight: 1.3, fontFamily: "'DM Sans',sans-serif" }}>{room.label}</span>
                    </button>
                  );
                })}
              </div>
              <div style={{ textAlign: "center", marginBottom: "36px" }}>
                <button onClick={generate} disabled={!selectedStyle || !selectedRoom || loading} style={{ background: selectedStyle && selectedRoom ? `linear-gradient(135deg, ${accent}25, ${accent}10)` : "rgba(255,255,255,0.025)", border: `1px solid ${selectedStyle && selectedRoom ? accent + "55" : "rgba(255,255,255,0.06)"}`, borderRadius: "50px", padding: "16px 50px", color: selectedStyle && selectedRoom ? accent : "#252220", fontSize: "11.5px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif", cursor: selectedStyle && selectedRoom && !loading ? "pointer" : "not-allowed", transition: "all 0.4s ease", boxShadow: selectedStyle && selectedRoom ? `0 8px 36px ${accent}20` : "none" }}
                  onMouseEnter={e => { if (selectedStyle && selectedRoom && !loading) { e.currentTarget.style.transform = "translateY(-2px)"; } }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}>
                  {loading ? "Generating..." : "Generate Design Ideas"}
                </button>
                {(!selectedStyle || !selectedRoom) && <p style={{ color: "#222", fontSize: "10.5px", marginTop: "10px", fontFamily: "'DM Sans',sans-serif" }}>Select a style + room to unlock</p>}
              </div>
              {loading && <div style={{ textAlign: "center", marginBottom: "20px" }}><div style={{ fontSize: "10px", color: accent, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>Curating your {roomData?.label}</div><Dots color={accent} /></div>}
              {error && <div style={{ background: "rgba(200,70,70,0.07)", border: "1px solid rgba(200,70,70,0.22)", borderRadius: "12px", padding: "14px 18px", color: "#C08080", fontSize: "12px", textAlign: "center", fontFamily: "'DM Sans',sans-serif", marginBottom: "20px" }}>{error}</div>}
              <div ref={resultsRef}>
                {ideas.length > 0 && (
                  <div style={{ animation: "fadeIn 0.5s ease" }}>
                    <div style={{ borderRadius: "20px", overflow: "hidden", marginBottom: "24px", background: "rgba(255,255,255,0.02)", border: `1px solid ${accent}20`, minHeight: heroLoading ? "260px" : "auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {heroLoading ? (<div style={{ textAlign: "center", padding: "50px 20px" }}><div style={{ fontSize: "10px", color: accent, letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>Rendering with DALL E 3</div><Dots color={accent} /></div>) : heroImg ? (
                        <div style={{ position: "relative", width: "100%" }}>
                          <img src={heroImg} alt="Hero" style={{ width: "100%", display: "block" }} />
                          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.88))", padding: "50px 24px 22px" }}>
                            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "22px", fontWeight: 700, color: "#fff", fontStyle: "italic" }}>{styleData?.label} {roomData?.label}</div>
                            <div style={{ fontSize: "9.5px", color: accent, fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.14em", textTransform: "uppercase", marginTop: "4px" }}>AI Rendered - DALL E 3 - Monstah!!!</div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                      <div>
                        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "19px", fontWeight: 600, color: "#F0EDE8" }}>{ideas.length} Design Concepts</div>
                        <div style={{ color: accent, fontSize: "9.5px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif", marginTop: "2px" }}>{styleData?.label} - {roomData?.label}</div>
                      </div>
                      <button onClick={generate} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "8px", padding: "7px 14px", color: "#444", fontSize: "10.5px", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all 0.2s" }}
                        onMouseEnter={e => e.currentTarget.style.color = "#999"} onMouseLeave={e => e.currentTarget.style.color = "#444"}>Regenerate</button>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                      {ideas.map((idea, i) => <IdeaCard key={i} idea={idea} index={i} accentColor={accent} styleId={selectedStyle} roomLabel={roomData?.label} />)}
                    </div>
                    <div style={{ textAlign: "center", marginTop: "32px", paddingTop: "22px", borderTop: "1px solid rgba(255,255,255,0.04)", color: "#1E1C18", fontSize: "9.5px", letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>Expand any card to visualize with DALL E 3</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "makeover" && <MakeoverTab selectedStyle={selectedStyle} accent={accent} styleData={styleData} />}

          <div style={{ height: "60px" }} />
        </div>
      </div>
    </>
  );
}
