let currentFilter = 'overall';
const abbreviations = { sword: "SW", crystal: "CR", mace: "ME", smp: "SM", diapot: "DP", nethpot: "NP", axe: "AX", uhc: "UHC" };

const players = [
    { id: 1, name: "X1an_", title: "Combat Grandmaster", region: "AS", pfp: "https://i.postimg.cc/zfhd3dML/custom-ava-(6).png", tiers: { sword: "LT1", crystal: "LT3", mace: "HT4", smp: "LT2", diapot: "LT2", nethpot: "HT4", axe: "LT3", uhc: "LT3" } },
    { id: 2, name: "ugood", title: "Average pros", region: "AS", pfp: "https://i.postimg.cc/02qqHcHW/custom-ava-(10).png", tiers: { sword: "HT3", smp: "LT3", mace: "LT3" } },
    { id: 3, name: "aozora", title: "Sword carried", region: "AS", pfp: "https://i.postimg.cc/mrnwppVs/custom-ava-(8).png", tiers: { sword: "LT4" } },
    { id: 4, name: "Nelllwkwkwk", title: "Top 1 wannabe", region: "AS", pfp: "https://i.postimg.cc/bJzzMLv1/custom-ava-(9).png", tiers: { sword: "HT5", uhc: "LT5" } },
    { id: 5, name: "owllyarv", title: "Mace Specialist", region: "AS", pfp: "https://i.postimg.cc/fT79Sq90/custom-ava-(7).png", tiers: { crystal: "HT5", mace: "LT4", sword: "HT5" } }
];

function fallbackAvatar(image) {
    image.onerror = null;
    image.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(image.dataset.name)}&backgroundColor=0d121f`;
}

function getTierBadge(mode, tier) {
    if (!tier) return '<span class="text-slate-700 font-bold text-xs pointer-events-none">—</span>';
    const parsedLevel = tier.toLowerCase();
    return `
        <div class="tier-tag t-${parsedLevel}">
            <span class="opacity-35 text-[9px] uppercase font-black">${abbreviations[mode]}</span>
            <span>${tier}</span>
        </div>
    `;
}

// Fixed Render Engine Logic loops to completely clear initial-boot render blocks
function renderTable() {
    const tableBody = document.getElementById('leaderboardRows');
    const tableHeader = document.getElementById('dynamicTableHeader');
    tableBody.innerHTML = '';

    // Update table header contextual layout depending on navigation filter selection
    if (currentFilter === 'overall') {
        tableHeader.innerHTML = "Tiers";
    } else {
        const titleName = currentFilter.charAt(0).toUpperCase() + currentFilter.slice(1);
        tableHeader.innerHTML = `${titleName} Tier`;
    }

    // Sort strategy modeled directly after competitive list ranking
    const sorted = [...players].sort((a, b) => {
        if (currentFilter === 'overall') {
            return (Object.keys(b.tiers).length) - (Object.keys(a.tiers).length);
        }
        const tierA = a.tiers[currentFilter] || "ZZZ";
        const tierB = b.tiers[currentFilter] || "ZZZ";
        return tierA.localeCompare(tierB);
    });

    sorted.forEach((p, index) => {
        const rankNum = index + 1;
        let rankHtml = `<span class="rank-badge rb-other">${rankNum}</span>`;
        if (rankNum === 1) rankHtml = `<span class="rank-badge rb-1">1</span>`;
        if (rankNum === 2) rankHtml = `<span class="rank-badge rb-2">2</span>`;
        if (rankNum === 3) rankHtml = `<span class="rank-badge rb-3">3</span>`;

        let tiersDisplayContainer = '';
        if (currentFilter === 'overall') {
            // Render all existing game mode skill metrics in horizontal array mapping
            tiersDisplayContainer = `
                <div class="flex flex-wrap gap-1.5 max-w-[420px]">
                    ${Object.entries(p.tiers).map(([mode, t]) => getTierBadge(mode, t)).join('')}
                </div>
            `;
        } else {
            tiersDisplayContainer = getTierBadge(currentFilter, p.tiers[currentFilter]);
        }

        const tr = document.createElement('tr');
        tr.className = "mctiers-row cursor-pointer border-b border-slate-900/40";
        tr.onclick = () => showModal(p.id, rankNum);

        tr.innerHTML = `
            <td class="py-3.5 px-4 text-center">${rankHtml}</td>
            <td class="py-3.5 px-4">
                <div class="flex items-center gap-3">
                    <img src="${p.pfp}" data-name="${p.name}" onerror="fallbackAvatar(this)" class="w-8 h-8 rounded-md bg-slate-950 object-cover border border-slate-800/40 flex-shrink-0">
                    <div class="min-w-0">
                        <div class="font-bold text-sm text-slate-100 hover:text-blue-400 transition-colors truncate">${p.name}</div>
                        <div class="text-[11px] text-slate-400 truncate font-medium mt-0.5">${p.title}</div>
                    </div>
                </div>
            </td>
            <td class="py-3.5 px-4 text-center">
                <span class="text-xs font-bold text-slate-400 tracking-wide uppercase">${p.region}</span>
            </td>
            <td class="py-3.5 px-4">${tiersDisplayContainer}</td>
        `;
        tableBody.appendChild(tr);
    });
}

function setFilter(mode, element) {
    currentFilter = mode;
    document.querySelectorAll('.tab-item').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
    renderTable();
}

function showModal(id, rank) {
    const p = players.find(x => x.id === id);
    const modal = document.getElementById('profileModal');
    const content = document.getElementById('modalContent');
    const fullGrid = Object.entries(p.tiers).map(([m, t]) => getTierBadge(m, t)).join('');

    content.innerHTML = `
        <div class="p-6">
            <div class="flex items-start gap-4">
                <img src="${p.pfp}" data-name="${p.name}" onerror="fallbackAvatar(this)" class="w-16 h-16 rounded-xl object-cover bg-slate-950 border border-slate-800">
                <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2">
                        <h2 class="text-xl font-black text-white tracking-tight truncate">${p.name}</h2>
                        <span class="text-[10px] font-bold px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded uppercase">${p.region}</span>
                    </div>
                    <p class="text-xs text-slate-400 font-medium mt-1">${p.title}</p>
                    <p class="text-[11px] text-slate-500 font-bold mt-0.5">Leaderboard Ranking: #${rank}</p>
                </div>
            </div>
            <div class="mt-6 border-t border-slate-800/60 pt-5">
                <h4 class="text-xs font-extrabold tracking-wider text-slate-400 uppercase mb-3">Registered Tier Rankings</h4>
                <div class="flex flex-wrap gap-1.5">${fullGrid}</div>
            </div>
            <button onclick="closeModal()" class="w-full mt-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition-colors">Return to Matrix</button>
        </div>
    `;
    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('profileModal').style.display = 'none';
}

// CRITICAL FIX: Direct function call execution to resolve the empty starting viewport state.
document.addEventListener("DOMContentLoaded", () => {
    renderTable();
});
