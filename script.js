// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Spotlight hover tracking
document.querySelectorAll('.spotlight').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--my', `${e.clientY - rect.top}px`);
  });
});

// Screenshot lightbox modal
const modal = document.getElementById('shotModal');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalClose = document.getElementById('modalClose');
const modalBackdrop = modal.querySelector('.modal-backdrop');

document.querySelectorAll('.shot-frame').forEach(frame => {
  frame.addEventListener('click', () => {
    const img = frame.querySelector('img');
    if (!img || img.style.display === 'none') return;
    modalImg.src = frame.dataset.shot;
    modalTitle.textContent = frame.dataset.title || 'Project Screenshot';
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  });
});

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  modalImg.src = '';
}

modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});