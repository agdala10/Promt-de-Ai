const cardsEl = document.getElementById('cards');
const buscarEl = document.getElementById('buscar');
let currentPrompt = '';

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function render(list) {
  cardsEl.innerHTML = list.map(p => `
    <div class="col-12 col-sm-6 col-lg-3">
      <div class="card h-100 shadow-sm">
        <img src="${p.image}" class="card-img-top" alt="${p.title}" loading="lazy" onclick="viewPrompt(${p.id})" title="Haz clic para ampliar" style="cursor:pointer" />
        <div class="card-body d-flex flex-column">
          <span class="badge badge-cat align-self-start mb-2">${p.category}</span>
          <h5 class="card-title">${p.title}</h5>
          <pre class="flex-grow-1">${escapeHtml(p.prompt.substring(0, 180))}...</pre>
          <div class="d-flex gap-2 mt-2">
            <button class="btn btn-primary btn-sm flex-fill" onclick="copyPrompt(${p.id})"><i class="fa-solid fa-copy me-1"></i>Copiar</button>
            <button class="btn btn-outline-light btn-sm flex-fill" onclick="viewPrompt(${p.id})"><i class="fa-solid fa-eye me-1"></i>Ver</button>
          </div>
        </div>
      </div>
    </div>`).join('');
}

function copyText(text) {
  navigator.clipboard.writeText(text).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); ta.remove();
  });
  const t = document.getElementById('toast');
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

function copyPrompt(id) {
  const p = PROMPTS.find(x => x.id === id);
  if (p) copyText(p.prompt);
}

const modal = new bootstrap.Modal(document.getElementById('modalPrompt'));
function viewPrompt(id) {
  const p = PROMPTS.find(x => x.id === id);
  if (!p) return;
  currentPrompt = p.prompt;
  document.getElementById('modalTitle').textContent = p.title;
  document.getElementById('modalImg').src = p.image;
  document.getElementById('modalImg').onclick = () => window.open(p.image, '_blank');
  document.getElementById('modalImg').style.cursor = 'zoom-in';
  document.getElementById('modalImg').title = 'Haz clic para ver la imagen completa';
  document.getElementById('modalText').textContent = p.prompt;
  modal.show();
}

document.getElementById('modalCopy').addEventListener('click', () => copyText(currentPrompt));
buscarEl.addEventListener('input', e => {
  const q = e.target.value.toLowerCase();
  render(PROMPTS.filter(p => (p.title + p.category + p.prompt).toLowerCase().includes(q)));
});

render(PROMPTS);
