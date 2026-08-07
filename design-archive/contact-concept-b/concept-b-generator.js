const fs = require("fs");
const OUT = process.env.OUT;
const FONT = fs.readFileSync("C:/Projects/thesoundcorp-web/app/fonts/Satoshi-Variable.woff2").toString("base64");
const NOISE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

const IC = {
  phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L7.6 9.8a16 16 0 0 0 6 6l1.4-1.1a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2Z"/></svg>`,
  whatsapp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.4" cy="6.6" r="1.05" fill="currentColor" stroke="none"/></svg>`,
  pin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
};

// Periodic waveform: y(x) has period 1440 (all harmonics integer multiples of the
// fundamental), so the path drawn across 2 periods (0..2880) tiles seamlessly and
// can scroll left by exactly one period for an endless, jump-free flow.
function periodicWave(yb, A){
  let p = [];
  for (let x = 0; x <= 2880; x += 5){
    const t = 2 * Math.PI * x / 1440;
    const f = 0.5*Math.sin(t) + 0.28*Math.sin(2*t+1.1) + 0.34*Math.sin(3*t+0.4) + 0.16*Math.sin(5*t+2.2);
    p.push(x.toFixed(0) + " " + (yb + A*f).toFixed(1));
  }
  return "M " + p.join(" L ");
}
const WV = periodicWave(432, 118);
const WV2 = periodicWave(596, 58);

const HERO = `
  <div class="content">
    <div class="left">
      <p class="eyebrow">Get in touch</p>
      <h1 class="title">For Those<br><span class="g">Who Listen.</span></h1>
      <p class="lead">Great sound begins with knowing what matters.<br>We&rsquo;d be pleased to hear from you.</p>
      <div class="channels">
        <a class="chan" href="tel:+989123215847">${IC.phone}<span>+98 912 321 5847</span></a>
        <a class="chan" href="https://wa.me/989123215847" target="_blank" rel="noopener">${IC.whatsapp}<span>WhatsApp</span></a>
        <a class="chan" href="https://instagram.com/the.sound.corp" target="_blank" rel="noopener">${IC.instagram}<span>@the.sound.corp</span></a>
        <div class="chan">${IC.pin}<span>Manzariyeh, Tehran</span></div>
      </div>
    </div>
    <form class="card" onsubmit="return false">
      <div class="fld"><label>Name</label><input placeholder="Your name"></div>
      <div class="fld"><label>Email</label><input placeholder="you@email.com"></div>
      <div class="fld"><label>Message</label><textarea placeholder="How can we help you?"></textarea></div>
      <button type="button">Send message <span>&rarr;</span></button>
    </form>
  </div>`;

// stylised dark map (abstract streets + gold pin) for the FIND US section
let streets = "";
const segs = [[0,120,600,90],[0,250,600,270],[0,360,600,330],[150,0,120,420],[330,0,360,420],[480,0,450,420],[0,60,600,180],[60,420,340,0]];
for (const [x1,y1,x2,y2] of segs) streets += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#ffffff" stroke-opacity="0.05" stroke-width="1"/>`;
streets += `<line x1="0" y1="212" x2="600" y2="236" stroke="#d4af37" stroke-opacity="0.32" stroke-width="2"/>`;

const FIND = `
  <section class="find">
    <div class="find-wrap">
      <div class="find-copy">
        <p class="eyebrow">Find us</p>
        <h2 class="find-title">Manzariyeh,<br><span class="g">Tehran.</span></h2>
        <p class="find-sub">Visit our private listening lounge &mdash; by appointment. Reference systems, curated and calibrated for those who truly listen.</p>
        <a class="find-btn" href="#">Open in Maps <span>&rarr;</span></a>
      </div>
      <div class="find-map">
        <svg class="mapsvg" viewBox="0 0 600 420" preserveAspectRatio="xMidYMid slice">${streets}</svg>
        <div class="mapfade"></div>
        <div class="pin">${IC.pin}<span class="ping"></span></div>
      </div>
    </div>
  </section>`;

const HTML = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>
@font-face{font-family:'Satoshi';src:url(data:font/woff2;base64,${FONT}) format('woff2');font-weight:300 900;font-display:block}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}body{font-family:'Satoshi',-apple-system,'Segoe UI',sans-serif;background:#07080a;color:#eceef2;-webkit-font-smoothing:antialiased}
.page{position:relative;min-height:100vh;width:100%;overflow:hidden;background:radial-gradient(135% 120% at 50% 45%,#0d0e12,#06070a 60%)}
.bg{position:absolute;inset:0;z-index:0;pointer-events:none}
.bg::after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent 0 3px,rgba(255,255,255,.013) 3px 4px);opacity:.6}
.wave-b{position:absolute;inset:0;width:100%;height:100%}
.flow{animation:waveFlow 22s linear infinite}
@keyframes waveFlow{from{transform:translateX(0)}to{transform:translateX(-1440px)}}
.grain{position:absolute;inset:0;z-index:1;background-image:url("${NOISE}");opacity:.04;mix-blend-mode:overlay}
.vig{position:absolute;inset:0;z-index:2;background:radial-gradient(120% 95% at 50% 42%,transparent 52%,rgba(0,0,0,.62) 100%)}
.content{position:relative;z-index:3;min-height:100vh;max-width:1200px;margin:0 auto;padding:70px 56px;display:grid;grid-template-columns:1.05fr .9fr;gap:60px;align-items:center}
.eyebrow{font-size:12px;letter-spacing:.3em;text-transform:uppercase;color:#e4c878;font-weight:500;margin-bottom:24px;opacity:.92}
.title{font-size:55px;line-height:1.05;font-weight:500;letter-spacing:-.025em;color:#f4f5f7}
.g{background:linear-gradient(96deg,#efdcac,#d4af37 52%,#b8912e);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.lead{margin-top:24px;max-width:37ch;color:#9a9ba3;font-size:15px;line-height:1.65;font-weight:300}
.channels{margin-top:36px;display:flex;flex-direction:column;gap:15px}
.chan{display:flex;align-items:center;gap:13px;color:#cbccd3;font-size:14.5px;text-decoration:none}
.chan svg{width:18px;height:18px;color:#e4c878;flex:none;opacity:.9}
.card{background:rgba(15,17,22,.52);border:1px solid rgba(255,255,255,.09);border-radius:22px;padding:32px;backdrop-filter:blur(16px) saturate(1.2);-webkit-backdrop-filter:blur(16px) saturate(1.2);box-shadow:inset 0 1px 0 rgba(255,255,255,.06),0 40px 80px -40px rgba(0,0,0,.9)}
.fld{margin-bottom:18px}
.fld label{display:block;font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:#8a8b93}
.fld input,.fld textarea{width:100%;margin-top:9px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:13px 15px;color:#eceef2;font-family:inherit;font-size:14px;outline:none}
.fld textarea{min-height:90px;resize:none}
.card button{margin-top:6px;width:100%;padding:15px;border:none;border-radius:999px;background:linear-gradient(100deg,#d4af37,#ecd6a0);color:#231a05;font-family:inherit;font-weight:700;font-size:14px;letter-spacing:.02em;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 14px 34px -12px rgba(212,175,55,.5)}
/* FIND US / MAP */
.find{position:relative;z-index:1;background:#080a0d;border-top:1px solid rgba(255,255,255,.06);padding:100px 56px}
.find-wrap{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:.92fr 1.08fr;gap:60px;align-items:center}
.find-title{font-size:44px;line-height:1.06;font-weight:500;letter-spacing:-.02em;color:#f4f5f7;margin-top:6px}
.find-sub{margin-top:20px;max-width:34ch;color:#9a9ba3;font-size:14.5px;line-height:1.6;font-weight:300}
.find-btn{display:inline-flex;align-items:center;gap:8px;margin-top:28px;padding:12px 24px;border-radius:999px;border:1px solid rgba(212,175,55,.4);color:#e4c878;text-decoration:none;font-size:13.5px;font-weight:500;letter-spacing:.02em}
.find-map{position:relative;height:400px;border-radius:22px;overflow:hidden;border:1px solid rgba(255,255,255,.08);background:radial-gradient(120% 120% at 50% 40%,#0e1116,#080a0d)}
.mapsvg{position:absolute;inset:0;width:100%;height:100%}
.mapfade{position:absolute;inset:0;background:radial-gradient(60% 60% at 50% 48%,transparent,rgba(8,10,13,.55))}
.pin{position:absolute;left:50%;top:47%;transform:translate(-50%,-100%)}
.pin svg{width:32px;height:32px;color:#e4c878;filter:drop-shadow(0 6px 14px rgba(212,175,55,.4))}
.ping{position:absolute;left:50%;bottom:-4px;width:10px;height:10px;transform:translateX(-50%);border-radius:50%;background:rgba(212,175,55,.6);box-shadow:0 0 0 0 rgba(212,175,55,.35);animation:ping 3.4s ease-out infinite}
@keyframes ping{0%{box-shadow:0 0 0 0 rgba(212,175,55,.35)}70%,100%{box-shadow:0 0 0 26px rgba(212,175,55,0)}}
@media(max-width:760px){
 .content{grid-template-columns:1fr;gap:28px;padding:92px 22px 56px;align-content:start;align-items:start}
 .title{font-size:33px}.lead{margin-top:18px;max-width:none;font-size:14px}.channels{margin-top:24px;gap:14px}.card{padding:24px;border-radius:18px}
 /* mobile: waveform lifted into the headline / copy — deliberate overlap, matching the desktop feel */
 .wave-b{transform:translateY(-20%) scale(1.08)}
 .find{padding:64px 22px}.find-wrap{grid-template-columns:1fr;gap:30px}.find-title{font-size:30px}.find-map{height:300px}
}
@media(prefers-reduced-motion:reduce){.flow{animation:none}.ping{animation:none}}
</style></head><body>
<div class="page">
  <div class="bg"><svg class="wave-b" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice"><defs>
    <linearGradient id="wg" x1="0" x2="1"><stop offset="0" stop-color="#b8912e" stop-opacity=".2"/><stop offset=".3" stop-color="#d4af37" stop-opacity=".9"/><stop offset=".5" stop-color="#f4e3b4"/><stop offset=".7" stop-color="#d4af37" stop-opacity=".9"/><stop offset="1" stop-color="#b8912e" stop-opacity=".2"/></linearGradient>
    <filter id="wgl" x="-10%" y="-40%" width="120%" height="180%"><feGaussianBlur stdDeviation="7"/></filter></defs>
    <g class="flow">
      <path d="${WV}" fill="none" stroke="#d4af37" stroke-opacity=".42" stroke-width="8" filter="url(#wgl)"/>
      <path d="${WV}" fill="none" stroke="url(#wg)" stroke-width="2.3"/>
      <path d="${WV2}" fill="none" stroke="url(#wg)" stroke-width="1.4" stroke-opacity=".13"/>
    </g></svg></div>
  <div class="grain"></div><div class="vig"></div>
  ${HERO}
</div>
${FIND}
</body></html>`;

fs.writeFileSync(`${OUT}/contact-B.html`, HTML);
console.log("wrote contact-B.html", HTML.length, "bytes");
