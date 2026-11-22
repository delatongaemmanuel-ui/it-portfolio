// Dynamic Footer Year
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Mouse-Tracking Redline Spotlight on Cards
document.querySelectorAll(".spotlight").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mx", `${x}px`);
    card.style.setProperty("--my", `${y}px`);
  });
});

// Screenshot Lightbox Modal
const modal = document.getElementById("shotModal");
const modalImg = document.getElementById("modalImg");
const modalTitle = document.getElementById("modalTitle");
const modalClose = document.getElementById("modalClose");
const modalBackdrop = document.querySelector(".modal-backdrop");

function openModal(src, title) {
  if (!modal || !modalImg) return;
  modalImg.src = src;
  modalImg.alt = title || "Expanded project screenshot";
  if (modalTitle) modalTitle.textContent = title || "Screenshot Preview";
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  if (modalImg) modalImg.src = "";
}

document.querySelectorAll(".shot-frame").forEach((frame) => {
  frame.addEventListener("click", () => {
    const shotSrc = frame.getAttribute("data-shot");
    const shotTitle = frame.getAttribute("data-title");
    if (shotSrc) {
      openModal(shotSrc, shotTitle);
    }
  });
});

if (modalClose) modalClose.addEventListener("click", closeModal);
if (modalBackdrop) modalBackdrop.addEventListener("click", closeModal);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal && modal.classList.contains("open")) {
    closeModal();
  }
});

// Interactive Hanging Lanyard ID (Pointer Drag + Spring Return)
const lanyardStage = document.querySelector(".lanyard-stage");

if (lanyardStage) {
  let isDragging = false;
  let startX = 0;

  const setAngle = (angle) => {
    const clamped = Math.max(-28, Math.min(28, angle));
    lanyardStage.style.transform = `rotate(${clamped.toFixed(2)}deg)`;
  };

  const startDrag = (clientX) => {
    isDragging = true;
    startX = clientX;
    lanyardStage.classList.add("dragging");
  };

  const moveDrag = (clientX) => {
    if (!isDragging) return;
    const deltaX = clientX - startX;
    setAngle(deltaX * 0.16);
  };

  const endDrag = () => {
    if (!isDragging) return;
    isDragging = false;
    lanyardStage.classList.remove("dragging");
    setAngle(0);
  };

  lanyardStage.addEventListener("pointerdown", (e) => {
    if (e.button !== undefined && e.button !== 0 && e.pointerType === "mouse") return;
    lanyardStage.setPointerCapture(e.pointerId);
    startDrag(e.clientX);
  });

  lanyardStage.addEventListener("pointermove", (e) => {
    moveDrag(e.clientX);
  });

  lanyardStage.addEventListener("pointerup", endDrag);
  lanyardStage.addEventListener("pointercancel", endDrag);
}