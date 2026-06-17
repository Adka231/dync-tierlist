let currentFilter = 'overall';
let selectedPlayerId = 1;
const POINT_VALUES = { 'HT1': 65, 'LT1': 50, 'HT2': 40, 'LT2': 35, 'HT3': 20, 'LT3': 15, 'HT4': 10, 'LT4': 5, 'HT5': 3, 'LT5': 1 };
const abbreviations = { sword: "SW", crystal: "CR", mace: "ME", smp: "SM", diapot: "DP", nethpot: "NP", axe: "AX", uhc: "UHC" };
const fullNames = { sword: "Sword", crystal: "Crystal", mace: "Mace", smp: "SMP", diapot: "Diapot", nethpot: "Nethpot", axe: "Axe", uhc: "UHC" };

const players = [
    { id: 1, name: "X1an_", title: "Combat Grandmaster", region: "Asia", pfp: "https://i.postimg.cc/zfhd3dML/custom-ava-(6).png", tiers: { sword: "LT1", crystal: "LT3", mace: "HT4", smp: "LT2", diapot: "LT2", nethpot: "HT4", axe: "LT3", uhc: "LT3" } },
    { id: 2, name: "ugood", title: "Average pros", region: "Asia", pfp: "https://i.postimg.cc/02qqHcHW/custom-ava-(10).png", tiers: { sword: "HT3", smp: "LT3", mace: "LT3" } },
    { id: 3, name: "aozora", title: "Sword carried", region: "Asia", pfp: "https://i.postimg.cc/mrnwppVs/custom-ava-(8).png", tiers: { sword: "LT4" } },
    { id: 4, name: "Nelllwkwkwk", title: "Top 1 wannabe", region: "Asia", pfp: "https://i.postimg.cc/bJzzMLv1/custom-ava-(9).png", tiers: { sword: "HT5", uhc: "LT5" } },
    { id: 5, name: "owllyarv", title: "Mace Specialist", region: "Asia", pfp: "https://i.postimg.cc/fT79Sq90/custom-ava-(7).png", tiers: { crystal: "HT5", mace: "LT4", sword: "HT5" } },
    { id: 6, name: "none", title: "Survival Pro", region: "North America", pfp: "link", tiers: { smp: "LT5" } },
    { id: 7, name: "none", title: "Rising Star", region: "South East Asia", pfp: "link", tiers: { sword: "LT5" } }
];

function calculatePoints(tierList) { return Object.values(tierList).reduce((acc, tier) => acc + (POINT_VALUES[tier] || 0), 0); }

function handleImgError(image) {
    image.onerror = null;
    image.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(image.dataset.name)}&backgroundType=solid&backgroundColor=131316`;
}

function getTierIconHtml(mode, tier, isProfile = false, delayIndex = 0) {
    const level = tier.replace(/\D/g, '');
    const delayStyle = `style="animation-delay: ${delayIndex * 30}ms;"`;
    return `
    <div class="tier-capsule t${level}-theme animate-tier-bar" ${delayStyle}>
        <span class="text-[9px] font-bold opacity-45 tracking-widest">${abbreviations[mode]}</span>
        <span class="text-xs font-black mt-0.5 tracking-tight">${tier}</span>
        ${isProfile ? `<span class="text-[8px] opacity-30 font-bold mt-1.5 text-center truncate w-full tracking-wider uppercase">${fullNames[mode]}</span>` : ''}
    </div>`;
}

function buildLedger() {
    const ledger = document.getElementById('ledgerContainer');
    ledger.innerHTML = Object.entries(POINT_VALUES).map(([tier, pts]) => {
        const level = tier.replace(/\D/g, '');
        return `
            <div class="bg-white/[0.02] backdrop-blur border border-white/[0.04] p-3 rounded-xl flex items-center justify-between">
                <span class="px-2.5 py-1 rounded-md text-[11px] font-black bg-black border border-white/[0.05] t${level}-theme">${tier}</span>
                <span class="text-xs font-extrabold text-white">${pts} <span class="text-[9px] opacity-40 font-medium">PTS</span></span>
            </div>
        `;
    }).join('');
}

function renderList() {
    const container = document.getElementById('playerContainer');
    container.innerHTML = '';
    players.forEach(p => p.computedPts = calculatePoints(p.tiers));
    players.sort((a, b) => b.computedPts - a.computedPts);

    players.forEach((p, index) => {
        const rank = index + 1;
        let cardRankTheme = 'border-white/[0.04]';
        if (rank === 1) cardRankTheme = 'card-top-1';
        else if (rank === 2) cardRankTheme = 'card-top-2';
        else if (rank === 3) cardRankTheme = 'card-top-3';

        const rankClass = rank <= 3 ? `rank-${rank}` : 'rank-other';
        if (rank > 3) cardRankTheme += ' hover:shadow-[0_40px_80px_-15px_rgba(255,255,255,0.05)]';
        
        let TiersHtml = (currentFilter === 'overall') 
            ? Object.entries(p.tiers).map(([m, t], i) => getTierIconHtml(m, t, false, i)).join('')
            : (p.tiers[currentFilter] ? getTierIconHtml(currentFilter, p.tiers[currentFilter], false, 0) : '');

        if (!TiersHtml) return;

        const card = document.createElement('div');
        card.className = `mctiers-card ${cardRankTheme} p-5.5`;
        card.onclick = () => handlePlayerClick(p.id, rank);
        
        card.innerHTML = `
            <div class="flex items-center justify-between gap-4">
                <div class="flex items-center gap-4 min-w-0">
                    <div class="rank-box ${rankClass}"><span>${rank}</span></div>
                    <div class="relative flex-shrink-0" style="width: 52px; height: 52px;">
                        <img src="${p.pfp}" data-name="${p.name}" onerror="handleImgError(this)" class="w-full h-full rounded-2xl object-cover bg-neutral-900 border border-white/[0.08] shadow-lg">
                        <div class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-white border-2 border-neutral-950 rounded-full shadow-md"></div>
                    </div>
                    <div class="min-w-0">
                        <h3 class="font-extrabold text-base text-white tracking-tight truncate max-w-[160px] md:max-w-[240px]">${p.name}</h3>
                        <p class="text-xs text-neutral-400 font-semibold flex items-center gap-1 mt-0.5">
                            <span class="truncate text-neutral-500">${p.title}</span>
                        </p>
                    </div>
                </div>
                <div class="text-right flex-shrink-0">
                    <div class="pts-pill px-3.5 py-1.5 rounded-xl border text-xs font-black inline-block bg-black/50 border-white/[0.05] shadow-inner tracking-tight">
                        ${p.computedPts} <span class="text-[9px] font-bold text-neutral-400 ml-0.5 tracking-wider">PTS</span>
                    </div>
                    <p class="text-[9px] text-neutral-500 font-black mt-2.5 uppercase tracking-widest">${p.region}</p>
                </div>
            </div>
            <div class="mt-4 pt-4 border-t border-white/[0.04] flex gap-2 overflow-x-auto no-scrollbar">${TiersHtml}</div>
        `;
        container.appendChild(card);
    });
    
    updateDesktopProfile(selectedPlayerId, 1);
}

function handlePlayerClick(id, rank) {
    selectedPlayerId = id;
    if (window.innerWidth >= 1024) {
        updateDesktopProfile(id, rank);
    } else {
        openMobileProfile(id, rank);
    }
}

function filterBy(mode, el) {
    currentFilter = mode;
    document.querySelectorAll('.tab-item').forEach(t => {
        t.classList.remove('active', 'text-black');
        t.classList.add('text-neutral-400');
    });
    el.classList.add('active');
    el.classList.remove('text-neutral-400');
    renderList();
}

function buildProfileMarkup(p, rank, rankPillColor, avatarBorder) {
    const tiersDetail = Object.entries(p.tiers).map(([mode, tier], i) => getTierIconHtml(mode, tier, true, i)).join('');
    return `
        <div class="p-6 text-center border-b border-white/[0.04] bg-white/[0.01]">
            <div class="relative inline-block mt-2 mb-4" style="width: 88px; height: 88px;">
                <img src="${p.pfp}" data-name="${p.name}" onerror="handleImgError(this)" class="modal-avatar-frame rounded-3xl ${avatarBorder} shadow-2xl mx-auto transition-all duration-500">
                <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 ${rankPillColor} border text-[9px] px-3.5 py-1 rounded-full uppercase tracking-widest shadow-xl font-bold whitespace-nowrap">RANK #${rank}</div>
            </div>
            <h2 class="text-2xl font-black text-white tracking-tight mb-1 mt-2">${p.name}</h2>
            <p class="text-xs text-neutral-500 font-bold uppercase tracking-widest mb-4">📍 ${p.region} Network</p>
            <div class="inline-flex items-center bg-white/[0.04] border border-white/[0.08] px-5 py-2 rounded-2xl shadow-2xl">
                <span class="text-white text-xs font-extrabold tracking-wide">🏆 ${p.title}</span>
            </div>
        </div>
        <div class="p-6 space-y-6">
            <div class="grid grid-cols-2 gap-3.5">
                <div class="bg-black/30 backdrop-blur border border-white/[0.04] rounded-2xl p-4 text-left shadow-inner">
                    <span class="text-[9px] text-neutral-500 font-black uppercase tracking-widest block mb-0.5">POSITION</span>
                    <span class="text-xl font-black text-white tracking-tight">#${rank} Place</span>
                </div>
                <div class="bg-black/30 backdrop-blur border border-white/[0.04] rounded-2xl p-4 text-left shadow-inner">
                    <span class="text-[9px] text-neutral-500 font-black uppercase tracking-widest block mb-0.5">NET WORTH</span>
                    <span class="text-xl font-black text-white tracking-tight">${p.computedPts} <span class="text-xs font-bold text-neutral-500">PTS</span></span>
                </div>
            </div>
            <div class="text-left">
                <p class="text-[10px] font-black text-neutral-400 mb-4 uppercase tracking-widest pl-0.5 opacity-80 flex items-center gap-1.5">
                    <span class="w-1.5 h-1.5 rounded-full bg-white"></span> COMPETITIVE TIER MATRIX
                </p>
                <div class="grid grid-cols-4 gap-2 pb-2">${tiersDetail}</div>
            </div>
        </div>
    `;
}

function getStyleConfig(rank) {
    let config = { containerClass: '', pill: 'bg-neutral-900 text-neutral-300 border-white/[0.08] font-bold', avatar: 'border-white/[0.08]', button: 'bg-neutral-900 text-neutral-400' };
    if (rank === 1) {
        config.containerClass = 'top-1';
        config.pill = 'bg-white text-black border-white font-black';
        config.avatar = 'border-white ring-4 ring-white/10';
        config.button = 'bg-white text-black hover:bg-neutral-200';
    } else if (rank === 2) {
        config.containerClass = 'top-2';
        config.pill = 'bg-neutral-200 text-black border-neutral-300 font-black';
        config.avatar = 'border-neutral-300 ring-4 ring-white/5';
        config.button = 'bg-neutral-800 text-white hover:bg-neutral-700';
    } else if (rank === 3) {
        config.containerClass = 'top-3';
        config.pill = 'bg-neutral-700 text-white border-neutral-600 font-black';
        config.avatar = 'border-neutral-600 ring-4 ring-white/5';
        config.button = 'bg-neutral-800 text-white hover:bg-neutral-700';
    }
    return config;
}

function updateDesktopProfile(id, rank) {
    const p = players.find(x => x.id === id) || players[0];
    const deskCard = document.getElementById('desktopProfileCard');
    const deskBody = document.getElementById('desktopProfileBody');
    const config = getStyleConfig(rank);

    deskCard.classList.remove('desktop-top-1', 'desktop-top-2', 'desktop-top-3');
    if (config.containerClass) deskCard.classList.add(`desktop-${config.containerClass}`);
    deskBody.innerHTML = buildProfileMarkup(p, rank, config.pill, config.avatar);
}

function openMobileProfile(id, rank) {
    const p = players.find(x => x.id === id);
    const modal = document.getElementById('profileModal');
    const modalContainer = document.getElementById('modalContainer');
    const modalBody = document.getElementById('modalBody');
    const config = getStyleConfig(rank);

    modalContainer.classList.remove('modal-top-1', 'modal-top-2', 'modal-top-3');
    if (config.containerClass) modalContainer.classList.add(`modal-${config.containerClass}`);

    modalBody.innerHTML = buildProfileMarkup(p, rank, config.pill, config.avatar) + `
        <div class="p-6 pt-0">
            <button onclick="closeProfile()" class="w-full py-4 ${config.button} border border-transparent rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300">Close Data Feed</button>
        </div>
    `;
    modal.style.display = 'flex';
    requestAnimationFrame(() => modal.classList.add('modal-visible'));
}

function closeProfile() { 
    const modal = document.getElementById('profileModal');
    modal.classList.remove('modal-visible');
    setTimeout(() => { modal.style.display = 'none'; }, 600);
}

function openOthersModal() {
    const modal = document.getElementById('othersModal');
    modal.style.display = 'flex';
    requestAnimationFrame(() => modal.classList.add('modal-visible'));
}

function closeOthersModal() {
    const modal = document.getElementById('othersModal');
    modal.classList.remove('modal-visible');
    setTimeout(() => { modal.style.display = 'none'; }, 600);
}

// Run Systems
document.addEventListener("DOMContentLoaded", () => {
    buildLedger();
    renderList();
});
