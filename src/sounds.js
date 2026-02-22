// ─────────────────────────────────────────────────
// Monstah!!! — Shark Swoosh Sound Effects 🦈
// Sharp, fast, water-cutting swooshes
// ─────────────────────────────────────────────────

let audioCtx = null;

function getContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") {
        audioCtx.resume();
    }
    return audioCtx;
}

// Helper: Create a burst of filtered noise (the core "swoosh" texture)
function createNoiseBurst(ctx, startTime, duration, filterFreqStart, filterFreqEnd, volume = 0.15, filterQ = 1.5) {
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.setValueAtTime(filterQ, startTime);
    filter.frequency.setValueAtTime(filterFreqStart, startTime);
    filter.frequency.exponentialRampToValueAtTime(filterFreqEnd, startTime + duration);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + duration * 0.08);
    gain.gain.setValueAtTime(volume * 0.9, startTime + duration * 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    noise.connect(filter).connect(gain).connect(ctx.destination);
    noise.start(startTime);
    noise.stop(startTime + duration);
}

// ── Sharp Swoosh Forward — Style Orb Selection ──
export function playStyleSelect() {
    const ctx = getContext();
    const now = ctx.currentTime;

    // Main swoosh — low to high sweep (like a shark darting forward)
    createNoiseBurst(ctx, now, 0.18, 300, 4000, 0.14, 1.2);

    // Sub-bass thump for weight
    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = "sine";
    sub.frequency.setValueAtTime(80, now);
    sub.frequency.exponentialRampToValueAtTime(40, now + 0.1);
    subGain.gain.setValueAtTime(0.12, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    sub.connect(subGain).connect(ctx.destination);
    sub.start(now);
    sub.stop(now + 0.1);

    // Sharp high tail
    createNoiseBurst(ctx, now + 0.04, 0.1, 2000, 6000, 0.06, 2);
}

// ── Reverse Swoosh — Style Deselect ──
export function playStyleDeselect() {
    const ctx = getContext();
    const now = ctx.currentTime;

    // High to low sweep (shark retreating)
    createNoiseBurst(ctx, now, 0.15, 3500, 200, 0.1, 1.5);
}

// ── Quick Snap Swoosh — Room Selection ──
export function playRoomSelect() {
    const ctx = getContext();
    const now = ctx.currentTime;

    // Short, punchy swoosh — like a tail snap
    createNoiseBurst(ctx, now, 0.1, 500, 5000, 0.12, 2);

    // Tight sub-click
    const click = ctx.createOscillator();
    const clickGain = ctx.createGain();
    click.type = "sine";
    click.frequency.setValueAtTime(150, now);
    click.frequency.exponentialRampToValueAtTime(60, now + 0.04);
    clickGain.gain.setValueAtTime(0.15, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    click.connect(clickGain).connect(ctx.destination);
    click.start(now);
    click.stop(now + 0.06);
}

// ── Full Shark Swoosh — Tab Switch ──
export function playTabSwitch() {
    const ctx = getContext();
    const now = ctx.currentTime;

    // Sweeping water swoosh — the signature sound
    createNoiseBurst(ctx, now, 0.25, 200, 3500, 0.13, 0.8);

    // Secondary high-freq trail (water spray)
    createNoiseBurst(ctx, now + 0.06, 0.18, 1500, 5500, 0.05, 3);

    // Deep water displacement
    const depth = ctx.createOscillator();
    const depthGain = ctx.createGain();
    depth.type = "sine";
    depth.frequency.setValueAtTime(60, now);
    depth.frequency.exponentialRampToValueAtTime(30, now + 0.15);
    depthGain.gain.setValueAtTime(0.08, now);
    depthGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    depth.connect(depthGain).connect(ctx.destination);
    depth.start(now);
    depth.stop(now + 0.2);
}

// ── Power Charge Swoosh — Generate Button ──
export function playGenerate() {
    const ctx = getContext();
    const now = ctx.currentTime;

    // Building energy swoosh — ascending
    createNoiseBurst(ctx, now, 0.12, 200, 2000, 0.08, 1);
    createNoiseBurst(ctx, now + 0.08, 0.12, 400, 3500, 0.1, 1.2);
    createNoiseBurst(ctx, now + 0.16, 0.15, 800, 5500, 0.13, 1.5);

    // Deep power rumble
    const rumble = ctx.createOscillator();
    const rumbleGain = ctx.createGain();
    rumble.type = "sine";
    rumble.frequency.setValueAtTime(50, now);
    rumble.frequency.exponentialRampToValueAtTime(100, now + 0.25);
    rumbleGain.gain.setValueAtTime(0.1, now);
    rumbleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    rumble.connect(rumbleGain).connect(ctx.destination);
    rumble.start(now);
    rumble.stop(now + 0.3);
}

// ── Impact Swoosh — Success / Results Loaded ──
export function playSuccess() {
    const ctx = getContext();
    const now = ctx.currentTime;

    // Fast approach swoosh
    createNoiseBurst(ctx, now, 0.12, 300, 4500, 0.12, 1.5);

    // Satisfying impact thump
    const impact = ctx.createOscillator();
    const impactGain = ctx.createGain();
    impact.type = "sine";
    impact.frequency.setValueAtTime(120, now + 0.08);
    impact.frequency.exponentialRampToValueAtTime(45, now + 0.2);
    impactGain.gain.setValueAtTime(0, now + 0.08);
    impactGain.gain.linearRampToValueAtTime(0.15, now + 0.09);
    impactGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    impact.connect(impactGain).connect(ctx.destination);
    impact.start(now + 0.08);
    impact.stop(now + 0.25);

    // Sparkle trail after impact
    createNoiseBurst(ctx, now + 0.1, 0.2, 3000, 7000, 0.04, 4);
}

// ── Dark Swoosh — Error ──
export function playError() {
    const ctx = getContext();
    const now = ctx.currentTime;

    // Heavy downward swoosh
    createNoiseBurst(ctx, now, 0.2, 2000, 150, 0.12, 1);

    // Double thud
    [0, 0.12].forEach((delay) => {
        const thud = ctx.createOscillator();
        const thudGain = ctx.createGain();
        thud.type = "sine";
        thud.frequency.setValueAtTime(90, now + delay);
        thud.frequency.exponentialRampToValueAtTime(35, now + delay + 0.08);
        thudGain.gain.setValueAtTime(0.12, now + delay);
        thudGain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.1);
        thud.connect(thudGain).connect(ctx.destination);
        thud.start(now + delay);
        thud.stop(now + delay + 0.1);
    });
}

// ── Quick Snap — Upload Complete ──
export function playUpload() {
    const ctx = getContext();
    const now = ctx.currentTime;

    // Quick upward snap swoosh
    createNoiseBurst(ctx, now, 0.1, 400, 6000, 0.1, 2);

    // Tight pop
    const pop = ctx.createOscillator();
    const popGain = ctx.createGain();
    pop.type = "sine";
    pop.frequency.setValueAtTime(200, now + 0.03);
    pop.frequency.exponentialRampToValueAtTime(80, now + 0.08);
    popGain.gain.setValueAtTime(0.1, now + 0.03);
    popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    pop.connect(popGain).connect(ctx.destination);
    pop.start(now + 0.03);
    pop.stop(now + 0.09);
}
