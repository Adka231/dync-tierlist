/* ─── MCTIERS · App Logic ────────────────────────────────────────── */

let currentFilter = 'overall';
let selectedPlayerId = 1;

const POINT_VALUES = {
    'HT1': 65, 'LT1': 50,
    'HT2': 40, 'LT2': 35,
    'HT3': 20, 'LT3': 15,
    'HT4': 10, 'LT4': 5,
    'HT5': 3,  'LT5': 1
};

const abbreviations = {
    sword: "SW", crystal: "CR", mace: "ME", smp: "SM",
    diapot: "DP", nethpot: "NP", axe: "AX", uhc: "UHC"
};

const fullNames = {
    sword: "Sword", crystal: "Crystal", mace: "Mace", smp: "SMP",
    diapot: "Diapot", nethpot: "Nethpot", axe: "Axe", uhc: "UHC"
};

// Icon filenames — must sit in the same folder as index.html
const modeIcons = {
    sword:   "Sword.png",
    crystal: "Crystal.png",
    mace:    "Mace.png",
    smp:     "SMP.png",
    diapot:  "Diapot.png",
    nethpot: "NethOp.png",
    axe:     "Axe.png",
    uhc:     "UHC.png"
};

/* ─── PLAYER DATA ─────────────────────────────────────────────────── */
const players = [
    {
        id: 1, name: "X1an_", title: "Combat Grandmaster", region: "Asia",
        pfp: "https://i.postimg.cc/zfhd3dML/custom-ava-(6).png",
        tiers: { sword: "LT1", crystal: "LT3", mace: "HT4", smp: "LT2", diapot: "LT2", nethpot: "HT4", axe: "LT3", uhc: "LT3" }
    },
    {
        id: 2, name: "ugood", title: "Average Pros", region: "Asia",
        pfp: "https://i.postimg.cc/02qqHcHW/custom-ava-(10).png",
        tiers: { sword: "HT3", smp: "LT3", mace: "LT3" }
    },
    {
        id: 3, name: "aozora", title: "Sword Carried", region: "Asia",
        pfp: "https://i.postimg.cc/mrnwppVs/custom-ava-(8).png",
        tiers: { sword: "LT4" }
    },
    {
        id: 4, name: "Nelllwkwkwk", title: "Top 1 Wannabe", region: "Asia",
        pfp: "https://i.postimg.cc/bJzzMLv1/custom-ava-(9).png",
        tiers: { sword: "HT5", uhc: "LT5" }
    },
    {
        id: 5, name: "owllyarv", title: "Mace Specialist", region: "Asia",
        pfp: "https://i.postimg.cc/fT79Sq90/custom-ava-(7).png",
        tiers: { crystal: "HT5", mace: "LT4", sword: "HT5" }
    },
    {
        id: 6, name: "none", title: "Survival Pro", region: "North America",
        pfp: "", tiers: { smp: "LT5" }
    },
    {
        id: 7, name: "none", title: "Rising Star", region: "South East Asia",
        pfp: "", tiers: { sword: "LT5" }
    }
];

/* ─── HELPERS ─────────────────────────────────────────────────────── */
function calculatePoints(tierList) {
    return Object.values(tierList).reduce((acc, t) => acc + (POINT_VALUES[t] || 0), 0);
}

function handleImgError(img) {
    img.onerror = null;
    img.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(img.dataset.name)}&backgroundType=solid&backgroundColor=0b0e17`;
}

/* ─── TIER CAPSULE HTML ────────────────────────────────────────────── */
function getTierIconHtml(mode, tier, isProfile = false, delayIndex = 0) {
    const level = tier.replace(/\D/g, '');
    const icon  = modeIcons[mode] || '';
    const delay = `style="animation-delay:${delayIndex * 40}ms"`;
    const iconTag = icon
        ? `<img src="${icon}" class="mode-icon" alt="${fullNames[mode]}" onerror="this.style.display='none'">`
        : '';

    return `
    <div class="tier-capsule t${level}-theme animate-tier-bar" ${delay}>
        ${iconTag}
        <span style="font-size:0.62rem;font-weight:700;opacity:0.4;letter-spacing:0.1em">${abbreviations[mode]}</span>
        <span style="font-size:0.7rem;font-weight:900;margin-top:2px;letter-spacing:-0.01em">${tier}</span>
        ${isProfile ? `<span style="font-size:0.55rem;opacity:0.3;font-weight:700;margin-top:4px;text-transform:uppercase;letter-spacing:0.08em;text-align:center;width:100%">${fullNames[mode]}</span>` : ''}
    </div>`;
}

/* ─── LEDGER ──────────────────────────────────────────────────────── */
function buildLedger() {
    const el = document.getElementById('ledgerContainer');
    el.innerHTML = Object.entries(POINT_VALUES).map(([tier, pts]) => {
        const level = tier.replace(/\D/g, '');
        return `
        <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);padding:10px 14px;border-radius:14px;display:flex;align-items:center;justify-content:space-between;">
            <span class="t${level}-theme" style="padding:4px 10px;border-radius:8px;font-size:0.7rem;font-weight:900;background:rgba(0,0,0,0.4);border:1px solid">${tier}</span>
            <span style="font-size:0.75rem;font-weight:800;color:#f1f5f9">${pts} <span style="font-size:0.6rem;opacity:0.35;font-weight:500">PTS</span></span>
        </div>`;
    }).join('');
}

/* ─── RENDER LIST ─────────────────────────────────────────────────── */
function renderList() {
    const container = document.getElementById('playerContainer');
    container.innerHTML = '';
    players.forEach(p => p.computedPts = calculatePoints(p.tiers));
    players.sort((a, b) => b.computedPts - a.computedPts);

    let renderedCount = 0;

    players.forEach((p, index) => {
        const rank = index + 1;
        let cardClass = '';
        if (rank === 1) cardClass = 'card-top-1';
        else if (rank === 2) cardClass = 'card-top-2';
        else if (rank === 3) cardClass = 'card-top-3';

        const rankClass = rank <= 3 ? `rank-${rank}` : 'rank-other';

        let tiersHtml = (currentFilter === 'overall')
            ? Object.entries(p.tiers).map(([m, t], i) => getTierIconHtml(m, t, false, i)).join('')
            : (p.tiers[currentFilter] ? getTierIconHtml(currentFilter, p.tiers[currentFilter], false, 0) : '');

        if (!tiersHtml) return;

        const card = document.createElement('div');
        card.className = `mctiers-card ${cardClass} p-5`;
        card.style.animationDelay = `${renderedCount * 60}ms`;
        card.onclick = () => handlePlayerClick(p.id, rank);

        card.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;gap:16px">
            <div style="display:flex;align-items:center;gap:14px;min-width:0">
                <div class="rank-box ${rankClass}"><span>${rank}</span></div>
                <div style="position:relative;flex-shrink:0;width:52px;height:52px">
                    <img src="${p.pfp || ''}" data-name="${p.name}" onerror="handleImgError(this)"
                         style="width:100%;height:100%;border-radius:16px;object-fit:cover;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08)">
                    <div class="status-dot"></div>
                </div>
                <div style="min-width:0">
                    <h3 style="font-weight:800;font-size:0.95rem;color:#fff;letter-spacing:-0.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:160px">${p.name}</h3>
                    <p style="font-size:0.72rem;color:rgba(148,163,184,0.7);margin-top:2px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:160px">${p.title}</p>
                </div>
            </div>
            <div style="text-align:right;flex-shrink:0">
                <div class="pts-pill">${p.computedPts} <span style="font-size:0.6rem;font-weight:600;opacity:0.45">PTS</span></div>
                <p style="font-size:0.6rem;color:rgba(100,116,139,0.7);font-weight:700;margin-top:8px;text-transform:uppercase;letter-spacing:0.1em">${p.region}</p>
            </div>
        </div>
        <div style="margin-top:14px;padding-top:14px;border-top:1px solid rgba(255,255,255,0.04);display:flex;gap:6px;overflow-x:auto;scrollbar-width:none">${tiersHtml}</div>
        `;

        container.appendChild(card);
        renderedCount++;
    });

    updateDesktopProfile(selectedPlayerId, 1);
}

/* ─── PROFILE MARKUP ──────────────────────────────────────────────── */
function buildProfileMarkup(p, rank, rankPillStyle, avatarBorderStyle) {
    const tiersHtml = Object.entries(p.tiers).map(([m, t], i) => getTierIconHtml(m, t, true, i)).join('');
    return `
    <div style="padding:24px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.04);background:rgba(255,255,255,0.01);">
        <div style="position:relative;display:inline-block;width:88px;height:88px;margin-top:8px;margin-bottom:16px">
            <img src="${p.pfp || ''}" data-name="${p.name}" onerror="handleImgError(this)"
                 class="modal-avatar-frame"
                 style="border-radius:22px;${avatarBorderStyle};box-shadow:0 12px 32px rgba(0,0,0,0.6)">
            <div class="absolute -bottom-2 left-1/2 -translate-x-1/2" style="position:absolute;bottom:-10px;left:50%;transform:translateX(-50%);${rankPillStyle};border:1px solid;font-size:0.6rem;padding:3px 12px;border-radius:999px;white-space:nowrap;font-weight:800;letter-spacing:0.12em;text-transform:uppercase">RANK #${rank}</div>
        </div>
        <h2 style="font-size:1.5rem;font-weight:900;color:#fff;letter-spacing:-0.03em;margin-bottom:4px;margin-top:10px">${p.name}</h2>
        <p style="font-size:0.65rem;color:rgba(100,116,139,0.8);font-weight:700;text-transform:uppercase;letter-spacing:0.14em;margin-bottom:16px">📍 ${p.region} Network</p>
        <div style="display:inline-flex;align-items:center;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);padding:8px 20px;border-radius:14px">
            <span style="font-size:0.72rem;font-weight:800;color:#f1f5f9;letter-spacing:0.02em">🏆 ${p.title}</span>
        </div>
    </div>
    <div style="padding:24px;display:flex;flex-direction:column;gap:20px">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div style="background:rgba(0,0,0,0.35);border:1px solid rgba(255,255,255,0.04);border-radius:18px;padding:16px;text-align:left">
                <span style="font-size:0.58rem;color:rgba(100,116,139,0.7);font-weight:800;text-transform:uppercase;letter-spacing:0.14em;display:block;margin-bottom:2px">Position</span>
                <span style="font-size:1.2rem;font-weight:900;color:#fff;letter-spacing:-0.02em">#${rank} Place</span>
            </div>
            <div style="background:rgba(0,0,0,0.35);border:1px solid rgba(255,255,255,0.04);border-radius:18px;padding:16px;text-align:left">
                <span style="font-size:0.58rem;color:rgba(100,116,139,0.7);font-weight:800;text-transform:uppercase;letter-spacing:0.14em;display:block;margin-bottom:2px">Net Worth</span>
                <span style="font-size:1.2rem;font-weight:900;color:#f1f5f9;letter-spacing:-0.02em">${p.computedPts} <span style="font-size:0.7rem;font-weight:600;opacity:0.4">PTS</span></span>
            </div>
        </div>
        <div>
            <p style="font-size:0.6rem;font-weight:800;color:rgba(148,163,184,0.6);margin-bottom:14px;text-transform:uppercase;letter-spacing:0.14em;display:flex;align-items:center;gap:6px">
                <span style="width:6px;height:6px;border-radius:50%;background:#3b82f6;display:inline-block"></span>
                Competitive Tier Matrix
            </p>
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding-bottom:4px">${tiersHtml}</div>
        </div>
    </div>`;
}

/* ─── STYLE CONFIG ────────────────────────────────────────────────── */
function getStyleConfig(rank) {
    let cfg = {
        containerClass: '',
        pillInlineStyle: 'background:rgba(30,30,40,0.9);color:#94a3b8;border-color:rgba(255,255,255,0.1)',
        avatarInlineStyle: 'border:2px solid rgba(255,255,255,0.1)',
        buttonClass: 'bg-slate-900 text-slate-300'
    };
    if (rank === 1) {
        cfg.containerClass = 'top-1';
        cfg.pillInlineStyle = 'background:#ffd700;color:#000;border-color:#fff8d6;font-weight:900';
        cfg.avatarInlineStyle = 'border:2px solid #ffd700;box-shadow:0 0 0 4px rgba(255,215,0,0.15)';
        cfg.buttonClass = 'btn-gold';
    } else if (rank === 2) {
        cfg.containerClass = 'top-2';
        cfg.pillInlineStyle = 'background:#d4d4d8;color:#000;border-color:#fff;font-weight:900';
        cfg.avatarInlineStyle = 'border:2px solid #a1a1aa;box-shadow:0 0 0 4px rgba(161,161,170,0.12)';
        cfg.buttonClass = 'btn-silver';
    } else if (rank === 3) {
        cfg.containerClass = 'top-3';
        cfg.pillInlineStyle = 'background:#cd7f32;color:#fff;border-color:#daa06d;font-weight:900';
        cfg.avatarInlineStyle = 'border:2px solid #cd7f32;box-shadow:0 0 0 4px rgba(205,127,50,0.12)';
        cfg.buttonClass = 'btn-bronze';
    }
    return cfg;
}

/* ─── DESKTOP PROFILE ─────────────────────────────────────────────── */
function updateDesktopProfile(id, rank) {
    const p = players.find(x => x.id === id) || players[0];
    const deskCard = document.getElementById('desktopProfileCard');
    const deskBody = document.getElementById('desktopProfileBody');
    const cfg = getStyleConfig(rank);

    deskCard.classList.remove('desktop-top-1', 'desktop-top-2', 'desktop-top-3');
    if (cfg.containerClass) deskCard.classList.add(`desktop-${cfg.containerClass}`);

    deskBody.style.opacity = '0';
    deskBody.style.transform = 'translateY(8px)';
    setTimeout(() => {
        deskBody.innerHTML = buildProfileMarkup(p, rank, cfg.pillInlineStyle, cfg.avatarInlineStyle);
        deskBody.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1)';
        deskBody.style.opacity = '1';
        deskBody.style.transform = 'translateY(0)';
    }, 100);
}

/* ─── MOBILE MODAL ────────────────────────────────────────────────── */
function openMobileProfile(id, rank) {
    const p = players.find(x => x.id === id);
    const modal = document.getElementById('profileModal');
    const modalContainer = document.getElementById('modalContainer');
    const modalBody = document.getElementById('modalBody');
    const cfg = getStyleConfig(rank);

    modalContainer.classList.remove('modal-top-1', 'modal-top-2', 'modal-top-3');
    if (cfg.containerClass) modalContainer.classList.add(`modal-${cfg.containerClass}`);

    modalBody.innerHTML = buildProfileMarkup(p, rank, cfg.pillInlineStyle, cfg.avatarInlineStyle) + `
    <div style="padding:0 24px 24px">
        <button onclick="closeProfile()" style="width:100%;padding:14px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:18px;font-size:0.72rem;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;color:#f1f5f9;cursor:pointer;transition:all 0.3s ease">Close</button>
    </div>`;

    modal.style.display = 'flex';
    requestAnimationFrame(() => modal.classList.add('modal-visible'));
}

function closeProfile() {
    const modal = document.getElementById('profileModal');
    modal.classList.remove('modal-visible');
    setTimeout(() => { modal.style.display = 'none'; }, 500);
}

/* ─── OTHERS MODAL ────────────────────────────────────────────────── */
function openOthersModal() {
    const modal = document.getElementById('othersModal');
    modal.style.display = 'flex';
    requestAnimationFrame(() => modal.classList.add('modal-visible'));
}

function closeOthersModal() {
    const modal = document.getElementById('othersModal');
    modal.classList.remove('modal-visible');
    setTimeout(() => { modal.style.display = 'none'; }, 500);
}

/* ─── FILTER ──────────────────────────────────────────────────────── */
function filterBy(mode, el) {
    currentFilter = mode;
    document.querySelectorAll('.tab-item').forEach(t => {
        t.classList.remove('active');
    });
    el.classList.add('active');
    renderList();
}

/* ─── CLICK HANDLER ───────────────────────────────────────────────── */
function handlePlayerClick(id, rank) {
    selectedPlayerId = id;
    if (window.innerWidth >= 1024) {
        updateDesktopProfile(id, rank);
    } else {
        openMobileProfile(id, rank);
    }
}

/* ─── BOOT ────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    buildLedger();
    renderList();
});
