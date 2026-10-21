// Kitchen Genome PWA. No framework, no build step; www/ is also the Capacitor webDir.
(() => {
const C = window.KG_CONFIG, $ = s => document.querySelector(s);
let L = localStorage.getItem('kg_lang') || (navigator.language.startsWith('ko') ? 'ko' : 'en'), D = null;
const T = {
 ko:{kitchens:'계보의 뿌리 주방', alumni:'출신 셰프 식당', chef:'셰프', from:'출신 주방', area:'지역', cuisine:'요리', michelin:'미쉐린', closed:'폐업', src:'출처', search:'식당·셰프 검색', none:'결과 없음', offline:'오프라인 사본', updated:'데이터', back:'← 목록', open:'사이트에서 보기', prev:'이전 이름'},
 en:{kitchens:'Root kitchens', alumni:'Alumni restaurants', chef:'Chef', from:'Trained at', area:'Area', cuisine:'Cuisine', michelin:'MICHELIN', closed:'Closed', src:'Source', search:'Search restaurants or chefs', none:'No results', offline:'Offline copy', updated:'Data', back:'← All', open:'View on site', prev:'Formerly'}};
const t = k => T[L][k];
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const nm = x => L === 'en' ? (x.name_en || x.en || x.name) : x.name;
const chef = r => L === 'en' ? (r.chef_en || r.chef) : r.chef;
const link = u => u && /^https?:/.test(u) ? `<a href="${esc(u)}" rel="noopener" target="_blank">${esc(new URL(u).hostname.replace('www.',''))}</a>` : '';
function load(src) { return new Promise((ok, no) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = no; document.head.appendChild(s); }); }
async function boot() {
  let off = false;
  try { await load(C.DATA_URL + '?v=' + Math.floor(Date.now() / 36e5)); } catch { off = true; }
  if (!window.SEED) { off = true; try { await load(C.FALLBACK); } catch {} }
  D = window.SEED || {kitchens: [], restaurants: []};
  $('#stamp').textContent = off ? t('offline') : t('updated') + ' ' + (D.restaurants.map(r => r.checked || '').sort().pop() || '');
  render();
}
const card = r => `<a class="card${r.closed_at ? ' closed' : ''}" href="#/r/${esc(r.id)}"><b>${esc(nm(r))}</b><span>${esc(chef(r))}</span><small>${esc(r.area || '')}${r.closed_at ? ' · ' + t('closed') : ''}</small></a>`;
function home(q) {
  const ks = D.kitchens.filter(k => D.restaurants.some(r => r.kitchen === k.id));
  if (q) {
    const ql = q.toLowerCase(), hit = D.restaurants.filter(r => [r.name, r.name_en, r.chef, r.chef_en, r.area].some(v => v && v.toLowerCase().includes(ql)));
    return `<h2>${esc(q)}</h2>` + (hit.length ? `<div class="grid">${hit.map(card).join('')}</div>` : `<p class="muted">${t('none')}</p>`);
  }
  return `<h2>${t('kitchens')}</h2>` + ks.map(k => { const al = D.restaurants.filter(r => r.kitchen === k.id && r.type === 'alumni');
    return `<section><h3><a href="#/k/${esc(k.id)}">${esc(nm(k))}</a> <small>${esc(k.michelin || '')}</small></h3><div class="grid">${al.map(card).join('')}</div></section>`; }).join('');
}
function kitchen(id) {
  const k = D.kitchens.find(x => x.id === id); if (!k) return `<p>${t('none')}</p>`;
  const al = D.restaurants.filter(r => r.kitchen === id && r.type === 'alumni');
  return `<a href="#/">${t('back')}</a><h2>${esc(nm(k))}</h2><p class="muted">${t('michelin')}: ${esc(k.michelin || '-')} ${link(k.michelin_src)}</p><h3>${t('alumni')}</h3><div class="grid">${al.map(card).join('')}</div>
  <p><a href="${C.SITE}${L === 'en' ? '/en' : ''}/k/${esc(id)}/" rel="noopener">${t('open')}</a></p>`;
}
function rest(id) {
  const r = D.restaurants.find(x => x.id === id); if (!r) return `<p>${t('none')}</p>`;
  const k = D.kitchens.find(x => x.id === r.kitchen);
  const row = (a, b) => b ? `<tr><th>${a}</th><td>${b}</td></tr>` : '';
  return `<a href="#/">${t('back')}</a><h2>${esc(nm(r))}</h2>${r.prev_names ? `<p class="muted">${t('prev')}: ${esc(r.prev_names.join(', '))}</p>` : ''}
  <table>${row(t('chef'), esc(chef(r)))}${row(t('from'), k ? `<a href="#/k/${esc(k.id)}">${esc(nm(k))}</a> · ${esc(r.role || '')}` : '')}${row(t('area'), esc(r.area))}${row(t('cuisine'), esc(r.cuisine))}
  ${row(t('michelin'), esc(r.michelin || '') + ' ' + link(r.michelin_src))}${row(t('closed'), r.closed_at ? esc(r.closed_at) + ' ' + link(r.closed_src) : '')}${row(t('src'), link(r.lineage_src))}</table>
  <p><a href="${C.SITE}${L === 'en' ? '/en' : ''}/r/${esc(id)}/" rel="noopener">${t('open')}</a></p>`;
}
function render() {
  if (!D) return;
  document.documentElement.lang = L; $('#lang').textContent = L === 'ko' ? 'EN' : '한국어'; $('#q').placeholder = t('search');
  const [, kind, id] = location.hash.split('/');
  $('#view').innerHTML = kind === 'k' ? kitchen(id) : kind === 'r' ? rest(id) : home($('#q').value.trim());
}
$('#lang').onclick = () => { L = L === 'ko' ? 'en' : 'ko'; localStorage.setItem('kg_lang', L); render(); };
$('#q').oninput = () => { if (location.hash.length > 2) location.hash = '#/'; render(); };
addEventListener('hashchange', () => { render(); scrollTo(0, 0); });
if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js');
boot();
})();
