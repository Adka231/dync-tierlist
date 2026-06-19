/* ── DyncTiers · App Logic ────────────────────────────────────────── */

var currentFilter = 'overall';
var selectedPlayerId = 1;

var POINT_VALUES = {
    'HT1': 65, 'LT1': 50,
    'HT2': 40, 'LT2': 35,
    'HT3': 20, 'LT3': 15,
    'HT4': 10, 'LT4': 5,
    'HT5': 3,  'LT5': 1
};

var abbreviations = {
    sword:'SW', crystal:'CR', mace:'ME', smp:'SM',
    diapot:'DP', nethpot:'NP', axe:'AX', uhc:'UHC'
};

var fullNames = {
    sword:'Sword', crystal:'Crystal', mace:'Mace', smp:'SMP',
    diapot:'Diapot', nethpot:'Nethpot', axe:'Axe', uhc:'UHC'
};

var modeIcons = {
    sword:'Sword.png', crystal:'Crystal.png', mace:'Mace.png',
    smp:'SMP.png', diapot:'Diapot.png', nethpot:'NethOp.png',
    axe:'Axe.png', uhc:'UHC.png'
};

/* region badge class */
function regionClass(region) {
    if (!region) return 'region-AS';
    var r = region.toLowerCase();
    if (r.indexOf('europe') !== -1 || r === 'eu') return 'region-EU';
    if (r.indexOf('north america') !== -1 || r === 'na') return 'region-NA';
    if (r.indexOf('south east') !== -1 || r === 'sea') return 'region-SEA';
    if (r.indexOf('oceania') !== -1 || r === 'oc') return 'region-OC';
    return 'region-AS';
}

function regionLabel(region) {
    if (!region) return 'AS';
    var r = region.toLowerCase();
    if (r.indexOf('europe') !== -1 || r === 'eu') return 'EU';
    if (r.indexOf('north america') !== -1 || r === 'na') return 'NA';
    if (r.indexOf('south east') !== -1 || r === 'sea') return 'SEA';
    if (r.indexOf('oceania') !== -1 || r === 'oc') return 'OC';
    return 'AS';
}

/* ── PLAYER DATA ──────────────────────────────────────────────────── */
var players = [
    {
        id:1, name:'X1an_', title:'Combat Grandmaster', region:'Asia',
        pfp:'https://i.postimg.cc/zfhd3dML/custom-ava-(6).png',
        tiers:{ sword:'LT1', crystal:'LT3', mace:'HT4', smp:'LT2', diapot:'LT2', nethpot:'HT4', axe:'LT3', uhc:'LT3' }
    },
    {
        id:2, name:'ugood', title:'Average Pros', region:'Asia',
        pfp:'https://i.postimg.cc/02qqHcHW/custom-ava-(10).png',
        tiers:{ sword:'HT3', smp:'LT3', mace:'LT3' }
    },
    {
        id:3, name:'aozora', title:'Sword Carried', region:'Asia',
        pfp:'https://i.postimg.cc/mrnwppVs/custom-ava-(8).png',
        tiers:{ sword:'LT4' }
    },
    {
        id:4, name:'Nelllwkwkwk', title:'Top 1 Wannabe', region:'Asia',
        pfp:'https://i.postimg.cc/bJzzMLv1/custom-ava-(9).png',
        tiers:{ sword:'HT5', uhc:'LT5' }
    },
    {
        id:5, name:'owllyarv', title:'Mace Specialist', region:'Asia',
        pfp:'https://i.postimg.cc/fT79Sq90/custom-ava-(7).png',
        tiers:{ crystal:'HT5', mace:'LT4', sword:'HT5' }
    },
    {
        id:6, name:'none', title:'Survival Pro', region:'North America',
        pfp:'', tiers:{ smp:'LT5' }
    },
    {
        id:7, name:'none', title:'Rising Star', region:'South East Asia',
        pfp:'', tiers:{ sword:'LT5' }
    }
];

/* ── HELPERS ──────────────────────────────────────────────────────── */
function calculatePoints(tierList) {
    var total = 0;
    for (var k in tierList) { total += (POINT_VALUES[tierList[k]] || 0); }
    return total;
}

function handleImgError(img) {
    img.onerror = null;
    img.src = 'https://api.dicebear.com/7.x/identicon/svg?seed=' + encodeURIComponent(img.dataset.name) + '&backgroundType=solid&backgroundColor=161b22';
}

/* ── TIER CAPSULE ─────────────────────────────────────────────────── */
function tierCapsuleHtml(mode, tier, delay) {
    delay = delay || 0;
    var level = tier.replace(/\D/g, '');
    var icon = modeIcons[mode] || '';
    var iconHtml = icon
        ? '<img src="' + icon + '" alt="' + (fullNames[mode]||mode) + '" onerror="this.style.display=\'none\'">'
        : '<span style="font-size:1rem">?</span>';

    return '<div class="tier-capsule t' + level + '-theme animate-tier-bar" style="animation-delay:' + delay + 'ms">'
        + '<div class="tier-icon-wrap">' + iconHtml + '</div>'
        + '<div class="tier-label">' + tier + '</div>'
        + '</div>';
}

/* ── LEDGER ───────────────────────────────────────────────────────── */
function buildLedger() {
    var el = document.getElementById('ledgerContainer');
    if (!el) return;
    var html = '';
    for (var tier in POINT_VALUES) {
        var pts = POINT_VALUES[tier];
        var level = tier.replace(/\D/g, '');
        html += '<div style="background:#161b22;border:1px solid #21262d;padding:10px 14px;border-radius:10px;display:flex;align-items:center;justify-content:space-between">'
            + '<span class="t' + level + '-theme tier-label" style="font-size:0.75rem;padding:4px 10px;background:#0d1117;border-radius:6px;border:1px solid #21262d">' + tier + '</span>'
            + '<span style="font-size:0.8rem;font-weight:800;color:#e6edf3">' + pts + '<span style="font-size:0.62rem;color:#484f58;font-weight:500;margin-left:3px">PTS</span></span>'
            + '</div>';
    }
    el.innerHTML = html;
}

/* ── RENDER LIST ──────────────────────────────────────────────────── */
function renderList() {
    var container = document.getElementById('playerContainer');
    if (!container) return;
    container.innerHTML = '';

    for (var i = 0; i < players.length; i++) {
        players[i].computedPts = calculatePoints(players[i].tiers);
    }
    players.sort(function(a,b){ return b.computedPts - a.computedPts; });

    var count = 0;
    for (var idx = 0; idx < players.length; idx++) {
        var p = players[idx];
        var rank = idx + 1;

        /* filter check */
        var tiersHtml = '';
        if (currentFilter === 'overall') {
            var di = 0;
            for (var m in p.tiers) {
                tiersHtml += tierCapsuleHtml(m, p.tiers[m], di * 35);
                di++;
            }
        } else {
            if (!p.tiers[currentFilter]) continue;
            tiersHtml = tierCapsuleHtml(currentFilter, p.tiers[currentFilter], 0);
        }

        var rankTheme = '';
        if (rank === 1) rankTheme = 'card-top-1';
        else if (rank === 2) rankTheme = 'card-top-2';
        else if (rank === 3) rankTheme = 'card-top-3';

        var rClass  = regionClass(p.region);
        var rLabel  = regionLabel(p.region);

        var card = document.createElement('div');
        card.className = 'mctiers-card ' + rankTheme;
        card.style.animationDelay = (count * 55) + 'ms';
        card.onclick = (function(id, r){ return function(){ handlePlayerClick(id, r); }; })(p.id, rank);

        card.innerHTML =
            '<div class="card-banner">'
          +   '<div class="card-rank-block">'
          +     '<div class="rank-num">' + rank + '.</div>'
          +     '<img class="rank-avatar" src="' + (p.pfp||'') + '" data-name="' + p.name + '" onerror="handleImgError(this)" alt="' + p.name + '">'
          +   '</div>'
          +   '<div class="card-info">'
          +     '<div class="card-name">' + p.name + '</div>'
          +     '<div class="card-title-row">'
          +       '<span class="card-title-icon">✦</span>'
          +       '<span class="card-title-text">' + p.title + '</span>'
          +     '</div>'
          +   '</div>'
          +   '<div class="region-badge ' + rClass + '">' + rLabel + '</div>'
          + '</div>'
          + '<div class="card-tiers">'
          +   '<div class="tiers-label">Tiers</div>'
          +   '<div class="tiers-row">' + tiersHtml + '</div>'
          + '</div>';

        container.appendChild(card);
        count++;
    }
}

/* ── PROFILE MODAL MARKUP ──────────────────────────────────────────── */
function buildProfileMarkup(p, rank) {
    var avatarClass = 'modal-avatar';
    if (rank === 1) avatarClass += ' modal-avatar-top1';
    else if (rank === 2) avatarClass += ' modal-avatar-top2';
    else if (rank === 3) avatarClass += ' modal-avatar-top3';

    var posClass = 'pos-other';
    if (rank === 1) posClass = 'pos-top1';
    else if (rank === 2) posClass = 'pos-top2';
    else if (rank === 3) posClass = 'pos-top3';

    var tiersHtml = '';
    var di = 0;
    for (var m in p.tiers) {
        tiersHtml += tierCapsuleHtml(m, p.tiers[m], di * 35);
        di++;
    }

    return '<div style="padding:20px 20px 0;display:flex;justify-content:flex-end">'
        + '<button onclick="closeProfile()" style="width:36px;height:36px;background:#21262d;border:1px solid #30363d;border-radius:50%;color:#8b949e;cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center">✕</button>'
        + '</div>'
        + '<div style="text-align:center;padding:0 20px 20px">'
        +   '<img class="' + avatarClass + '" src="' + (p.pfp||'') + '" data-name="' + p.name + '" onerror="handleImgError(this)" alt="' + p.name + '">'
        +   '<h2 style="font-size:1.5rem;font-weight:900;color:#e6edf3;margin-top:12px;letter-spacing:-0.02em">' + p.name + '</h2>'
        +   '<div style="display:inline-flex;align-items:center;gap:6px;background:#21262d;border:1px solid #30363d;border-radius:20px;padding:6px 16px;margin-top:8px">'
        +     '<span style="color:#f0a500;font-size:0.9rem">✦</span>'
        +     '<span style="font-size:0.8rem;font-weight:700;color:#f0a500">' + p.title + '</span>'
        +   '</div>'
        +   '<div style="font-size:0.85rem;color:#484f58;font-weight:600;margin-top:10px">' + p.region + '</div>'
        + '</div>'
        + '<div style="padding:0 20px 20px">'
        +   '<div class="section-label">Position</div>'
        +   '<div class="pos-banner">'
        +     '<div class="pos-num-block ' + posClass + '">' + rank + '.</div>'
        +     '<div class="pos-detail">'
        +       '🏆 OVERALL'
        +       '<span class="pos-pts">(' + p.computedPts + ' points)</span>'
        +     '</div>'
        +   '</div>'
        + '</div>'
        + '<div style="padding:0 20px 32px">'
        +   '<div class="section-label">Tiers</div>'
        +   '<div style="background:#161b22;border:1px solid #21262d;border-radius:12px;padding:14px">'
        +     '<div style="display:flex;flex-wrap:wrap;gap:10px;overflow-x:auto">' + tiersHtml + '</div>'
        +   '</div>'
        + '</div>';
}

/* ── MODAL OPEN / CLOSE ─────────────────────────────────────────────── */
function handlePlayerClick(id, rank) {
    selectedPlayerId = id;
    openMobileProfile(id, rank);
}

function openMobileProfile(id, rank) {
    var p = null;
    for (var i = 0; i < players.length; i++) {
        if (players[i].id === id) { p = players[i]; break; }
    }
    if (!p) return;
    var modal = document.getElementById('profileModal');
    var body  = document.getElementById('modalBody');
    if (!modal || !body) return;
    body.innerHTML = buildProfileMarkup(p, rank);
    modal.style.display = 'flex';
    requestAnimationFrame(function(){ modal.classList.add('modal-visible'); });
}

function closeProfile() {
    var modal = document.getElementById('profileModal');
    if (!modal) return;
    modal.classList.remove('modal-visible');
    setTimeout(function(){ modal.style.display = 'none'; }, 400);
}

function openOthersModal() {
    var modal = document.getElementById('othersModal');
    if (!modal) return;
    modal.style.display = 'flex';
    requestAnimationFrame(function(){ modal.classList.add('modal-visible'); });
}

function closeOthersModal() {
    var modal = document.getElementById('othersModal');
    if (!modal) return;
    modal.classList.remove('modal-visible');
    setTimeout(function(){ modal.style.display = 'none'; }, 400);
}

/* ── FILTER ─────────────────────────────────────────────────────────── */
function filterBy(mode, el) {
    currentFilter = mode;
    var tabs = document.querySelectorAll('.tab-item');
    for (var i = 0; i < tabs.length; i++) { tabs[i].classList.remove('active'); }
    el.classList.add('active');
    renderList();
}

/* ── BOOT ────────────────────────────────────────────────────────────── */
function init() {
    buildLedger();
    renderList();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

    // Update desktop panel safely
    try { updateDesktopProfile(selectedPlayerId, 1); } catch(e) {}
}

/* ─── PROFILE MARKUP ──────────────────────────────────────────────── */
function buildProfileMarkup(p, rank, rankPillStyle, avatarBorderStyle) {
    var tiersHtml = '';
    Object.keys(p.tiers).forEach(function(m, i) {
        tiersHtml += getTierIconHtml(m, p.tiers[m], true, i);
    });

    return '<div style="padding:24px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.04);background:rgba(255,255,255,0.01)">'
        + '<div style="position:relative;display:inline-block;width:88px;height:88px;margin-top:8px;margin-bottom:16px">'
        + '<img src="' + (p.pfp || '') + '" data-name="' + p.name + '" onerror="handleImgError(this)" class="modal-avatar-frame" style="border-radius:22px;' + avatarBorderStyle + ';box-shadow:0 12px 32px rgba(0,0,0,0.6)">'
        + '<div style="position:absolute;bottom:-10px;left:50%;transform:translateX(-50%);' + rankPillStyle + ';border:1px solid;font-size:0.6rem;padding:3px 12px;border-radius:999px;white-space:nowrap;font-weight:800;letter-spacing:0.12em;text-transform:uppercase">RANK #' + rank + '</div>'
        + '</div>'
        + '<h2 style="font-size:1.4rem;font-weight:900;color:#fff;letter-spacing:-0.03em;margin-bottom:4px;margin-top:10px">' + p.name + '</h2>'
        + '<p style="font-size:0.65rem;color:rgba(100,116,139,0.8);font-weight:700;text-transform:uppercase;letter-spacing:0.14em;margin-bottom:16px">📍 ' + p.region + ' Network</p>'
        + '<div style="display:inline-flex;align-items:center;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);padding:8px 20px;border-radius:14px">'
        + '<span style="font-size:0.72rem;font-weight:800;color:#f1f5f9">🏆 ' + p.title + '</span>'
        + '</div>'
        + '</div>'
        + '<div style="padding:24px;display:flex;flex-direction:column;gap:20px">'
        + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">'
        + '<div style="background:rgba(0,0,0,0.35);border:1px solid rgba(255,255,255,0.04);border-radius:18px;padding:16px;text-align:left">'
        + '<span style="font-size:0.58rem;color:rgba(100,116,139,0.7);font-weight:800;text-transform:uppercase;letter-spacing:0.14em;display:block;margin-bottom:2px">Position</span>'
        + '<span style="font-size:1.2rem;font-weight:900;color:#fff">#' + rank + ' Place</span>'
        + '</div>'
        + '<div style="background:rgba(0,0,0,0.35);border:1px solid rgba(255,255,255,0.04);border-radius:18px;padding:16px;text-align:left">'
        + '<span style="font-size:0.58rem;color:rgba(100,116,139,0.7);font-weight:800;text-transform:uppercase;letter-spacing:0.14em;display:block;margin-bottom:2px">Net Worth</span>'
        + '<span style="font-size:1.2rem;font-weight:900;color:#f1f5f9">' + p.computedPts + ' <span style="font-size:0.7rem;font-weight:600;opacity:0.4">PTS</span></span>'
        + '</div>'
        + '</div>'
        + '<div>'
        + '<p style="font-size:0.6rem;font-weight:800;color:rgba(148,163,184,0.6);margin-bottom:14px;text-transform:uppercase;letter-spacing:0.14em;display:flex;align-items:center;gap:6px">'
        + '<span style="width:6px;height:6px;border-radius:50%;background:#3b82f6;display:inline-block"></span> Tier Matrix'
        + '</p>'
        + '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">' + tiersHtml + '</div>'
        + '</div>'
        + '</div>';
}

/* ─── STYLE CONFIG ────────────────────────────────────────────────── */
function getStyleConfig(rank) {
    var cfg = {
        containerClass: '',
        pillStyle: 'background:rgba(30,30,40,0.9);color:#94a3b8;border-color:rgba(255,255,255,0.1)',
        avatarStyle: 'border:2px solid rgba(255,255,255,0.1)'
    };
    if (rank === 1) {
        cfg.containerClass = 'top-1';
        cfg.pillStyle = 'background:#ffd700;color:#000;border-color:#fff8d6;font-weight:900';
        cfg.avatarStyle = 'border:2px solid #ffd700;box-shadow:0 0 0 4px rgba(255,215,0,0.15)';
    } else if (rank === 2) {
        cfg.containerClass = 'top-2';
        cfg.pillStyle = 'background:#d4d4d8;color:#000;border-color:#fff;font-weight:900';
        cfg.avatarStyle = 'border:2px solid #a1a1aa;box-shadow:0 0 0 4px rgba(161,161,170,0.12)';
    } else if (rank === 3) {
        cfg.containerClass = 'top-3';
        cfg.pillStyle = 'background:#cd7f32;color:#fff;border-color:#daa06d;font-weight:900';
        cfg.avatarStyle = 'border:2px solid #cd7f32;box-shadow:0 0 0 4px rgba(205,127,50,0.12)';
    }
    return cfg;
}

/* ─── DESKTOP PROFILE ─────────────────────────────────────────────── */
function updateDesktopProfile(id, rank) {
    var p = null;
    for (var i = 0; i < players.length; i++) {
        if (players[i].id === id) { p = players[i]; break; }
    }
    if (!p) p = players[0];

    var deskCard = document.getElementById('desktopProfileCard');
    var deskBody = document.getElementById('desktopProfileBody');
    if (!deskCard || !deskBody) return;

    var cfg = getStyleConfig(rank);
    deskCard.classList.remove('desktop-top-1', 'desktop-top-2', 'desktop-top-3');
    if (cfg.containerClass) deskCard.classList.add('desktop-' + cfg.containerClass);

    deskBody.style.opacity = '0';
    deskBody.style.transform = 'translateY(8px)';
    setTimeout(function() {
        deskBody.innerHTML = buildProfileMarkup(p, rank, cfg.pillStyle, cfg.avatarStyle);
        deskBody.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1)';
        deskBody.style.opacity = '1';
        deskBody.style.transform = 'translateY(0)';
    }, 100);
}

/* ─── MOBILE MODAL ────────────────────────────────────────────────── */
function openMobileProfile(id, rank) {
    var p = null;
    for (var i = 0; i < players.length; i++) {
        if (players[i].id === id) { p = players[i]; break; }
    }
    if (!p) return;

    var modal = document.getElementById('profileModal');
    var modalContainer = document.getElementById('modalContainer');
    var modalBody = document.getElementById('modalBody');
    if (!modal || !modalContainer || !modalBody) return;

    var cfg = getStyleConfig(rank);
    modalContainer.classList.remove('modal-top-1', 'modal-top-2', 'modal-top-3');
    if (cfg.containerClass) modalContainer.classList.add('modal-' + cfg.containerClass);

    modalBody.innerHTML = buildProfileMarkup(p, rank, cfg.pillStyle, cfg.avatarStyle)
        + '<div style="padding:0 24px 24px">'
        + '<button onclick="closeProfile()" style="width:100%;padding:14px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:18px;font-size:0.72rem;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;color:#f1f5f9;cursor:pointer">Close</button>'
        + '</div>';

    modal.style.display = 'flex';
    requestAnimationFrame(function() { modal.classList.add('modal-visible'); });
}

function closeProfile() {
    var modal = document.getElementById('profileModal');
    if (!modal) return;
    modal.classList.remove('modal-visible');
    setTimeout(function() { modal.style.display = 'none'; }, 500);
}

/* ─── OTHERS MODAL ────────────────────────────────────────────────── */
function openOthersModal() {
    var modal = document.getElementById('othersModal');
    if (!modal) return;
    modal.style.display = 'flex';
    requestAnimationFrame(function() { modal.classList.add('modal-visible'); });
}

function closeOthersModal() {
    var modal = document.getElementById('othersModal');
    if (!modal) return;
    modal.classList.remove('modal-visible');
    setTimeout(function() { modal.style.display = 'none'; }, 500);
}

/* ─── FILTER ──────────────────────────────────────────────────────── */
function filterBy(mode, el) {
    currentFilter = mode;
    var tabs = document.querySelectorAll('.tab-item');
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active');
    }
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
function init() {
    buildLedger();
    renderList();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
