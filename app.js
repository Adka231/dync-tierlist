let currentFilter = 'overall';
const POINT_VALUES = { 'HT1': 65, 'LT1': 50, 'HT2': 40, 'LT2': 35, 'HT3': 20, 'LT3': 15, 'HT4': 10, 'LT4': 5, 'HT5': 3, 'LT5': 1 };
const abbreviations = { sword: "SW", crystal: "CR", mace: "ME", smp: "SM", diapot: "DP", nethpot: "NP", axe: "AX", uhc: "UHC" };

const players = [
    { id: 1, name: "X1an_", title: "Combat Grandmaster", region: "Asia", pfp: "https://i.postimg.cc/zfhd3dML/custom-ava-(6).png", tiers: { sword: "LT1", crystal: "LT3", mace: "HT4", smp: "LT2", diapot: "LT2", nethpot: "HT4", axe: "LT3", uhc: "LT3" } },
    { id: 2, name: "ugood", title: "Average pros", region: "Asia", pfp: "https://i.postimg.cc/02qqHcHW/custom-ava-(10).png", tiers: { sword: "HT3", smp: "LT3", mace: "LT3" } },
    { id: 3, name: "aozora", title: "Sword carried", region: "Asia", pfp: "https://i.postimg.cc/mrnwppVs/custom-ava-(8).png", tiers: { sword: "LT4" } },
    { id: 4, name: "Nelllwkwkwk", title: "Top 1 wannabe", region: "Asia", pfp: "https://i.postimg.cc/bJzzMLv1/custom-ava-(9).png", tiers: { sword: "HT5", uhc: "LT5" } },
    { id: 5, name: "owllyarv", title: "Mace Specialist", region: "Asia", pfp: "https://i.postimg.cc/fT79Sq90/custom-ava-(7).png", tiers: { crystal: "HT5", mace: "LT4", sword: "HT5" } }
];

function calculatePoints(tierList) { return Object.values(tierList).reduce((acc, tier) => acc + (POINT_VALUES[tier] || 0), 0); }

function handleImgError(image) {
    image.onerror = null;
    image.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(image.dataset.name)}&backgroundType=solid&backgroundColor=1e2638`;
}

function getTierIconHtml(mode, tier) {
    const level = tier.replace(/\D/g, '');
    return `
    <div class="tier-capsule t${level}-theme">
        <span class="opacity-40 text-[9px] font-bold">${abbreviations[mode]}</span>
        <span>${tier}</span>
    </div>`;
}

function renderList() {
    const container = document.getElementById('playerContainer');
    container.innerHTML = '';
    players.forEach(p => p.computedPts = calculatePoints(p.tiers));
    players.sort((a, b) => b.computedPts - a.computedPts);

    players.forEach((p, index) => {
        const rank = index + 1;
        const rankClass = rank <= 3 ? `rank-${rank}` : 'rank-other';
        
        let TiersHtml = (currentFilter === 'overall') 
            ? Object.entries(p.tiers).map(([m, t]) => getTierIconHtml(m, t)).join('')
            : (p.tiers[currentFilter] ? getTierIconHtml(currentFilter, p.tiers[currentFilter]) : '');

        if (!TiersHtml) return;

        const card = document.createElement('div');
        card.className = "mctiers-card p-4";
        card.onclick = () => openMobileProfile(p.id, rank);
        
        card.innerHTML = `
            <div class="flex items-center justify-between gap-4">
                <div class="flex items-center gap-4 min-w-0">
                    <div class="rank-box ${rankClass} flex-shrink-0"><span>${rank}</span></div>
                    <img src="${p.pfp}" data-name="${p.name}" onerror="handleImgError(this)" class="w-11 h-11 rounded-lg object-cover bg-slate-900 border border-slate-800 shadow-inner flex-shrink-0">
                    <div class="min-w-0">
                        <h3 class="font-bold text-base text-slate-100 tracking-tight truncate">${p.name}</h3>
                        <p class="text-xs text-slate-400 truncate mt-0.5">${p.title}</p>
                    </div>
                </div>
                <div class="text-right flex-shrink-0">
                    <div class="text-sm font-black text-blue-400">${p.computedPts} <span class="text-[9px] text-slate-500 font-bold">PTS</span></div>
                    <p class="text-[10px] text-slate-500 font-bold mt-0.5 tracking-wider uppercase">${p.region}</p>
                </div>
            </div>
            <div class="mt-3 pt-3 border-t border-slate-800/50 flex gap-1.5 overflow-x-auto no-scrollbar">${TiersHtml}</div>
        `;
        container.appendChild(card);
    });
}

function filterBy(mode, el) {
    currentFilter = mode;
    document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    renderList();
}

function openMobileProfile(id, rank) {
    const p = players.find(x => x.id === id);
    const modal = document.getElementById('profileModal');
    const modalBody = document.getElementById('modalBody');
    const tiersDetail = Object.entries(p.tiers).map(([mode, tier]) => getTierIconHtml(mode, tier)).join('');

    modalBody.innerHTML = `
        <div class="p-6 text-center">
            <img src="${p.pfp}" data-name="${p.name}" onerror="handleImgError(this)" class="w-20 h-20 rounded-xl mx-auto border border-slate-800 shadow-md object-cover">
            <h2 class="text-xl font-bold text-slate-100 tracking-tight mt-3">${p.name}</h2>
            <p class="text-xs text-slate-400 mt-1">${p.title} • Rank #${rank}</p>
            <div class="mt-5 flex flex-wrap justify-center gap-1.5">${tiersDetail}</div>
            <button onclick="closeProfile()" class="w-full mt-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition-all">Dismiss Feed</button>
        </div>
    `;
    modal.style.display = 'flex';
}

function closeProfile() { document.getElementById('profileModal').style.display = 'none'; }
document.addEventListener("DOMContentLoaded", renderList);
