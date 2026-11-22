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

// Interactive Hanging Lanyard ID (Gravity Pendulum Physics)
const lanyardStage = document.querySelector(".lanyard-stage");
const isMobileView = () => window.matchMedia("(max-width: 740px)").matches;

let isDragging = false;
let startX = 0;
let angle = 0;          // degrees
let angularVel = 0;     // deg/sec
let rafId = null;
let lastTime = 0;

if (lanyardStage) {
  const MAX_ANGLE = 34;
  const GRAVITY_STIFFNESS = 42; // higher = snappier gravity pull
  const DAMPING = 4.2;          // air/strap damping so it swings then settles

  const renderAngle = () => {
    lanyardStage.style.transform = `rotate(${angle.toFixed(2)}deg)`;
  };

  const stopLoop = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  const stepPendulum = (now) => {
    if (isDragging) {
      rafId = null;
      return;
    }

    const dt = Math.min((now - lastTime) / 1000, 0.032);
    lastTime = now;

    // Restoring torque from gravity (-k * theta) minus damping (-c * omega)
    const angularAcc = -GRAVITY_STIFFNESS * angle - DAMPING * angularVel;
    angularVel += angularAcc * dt;
    angle += angularVel * dt;

    renderAngle();

    if (Math.abs(angle) < 0.04 && Math.abs(angularVel) < 0.05) {
      angle = 0;
      angularVel = 0;
      renderAngle();
      rafId = null;
      return;
    }

    rafId = requestAnimationFrame(stepPendulum);
  };

  const startSwing = () => {
    stopLoop();
    lastTime = performance.now();
    rafId = requestAnimationFrame(stepPendulum);
  };

  const startDrag = (clientX) => {
    stopLoop();
    lanyardStage.classList.remove("mobile-drop-ready", "mobile-drop-animate");
    lanyardStage.style.opacity = "1";
    isDragging = true;
    startX = clientX;
    angularVel = 0;
    lanyardStage.classList.add("dragging");
  };

  const moveDrag = (clientX) => {
    if (!isDragging) return;
    // Negative sign so pulling right swings the hanging bottom right (with gravity)
    const targetAngle = -((clientX - startX) * 0.18);
    const clamped = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, targetAngle));
    const deltaAngle = clamped - angle;
    angularVel = deltaAngle * 45;
    angle = clamped;
    renderAngle();
  };

  const endDrag = () => {
    if (!isDragging) return;
    isDragging = false;
    lanyardStage.classList.remove("dragging");
    startSwing();
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

// F1 Starting Lights Preloader + Mobile ID Drop
const preloader = document.getElementById("f1Preloader");
const preloaderStatus = document.getElementById("preloaderStatus");
const gantryLights = preloader ? Array.from(preloader.querySelectorAll(".gantry-light")) : [];

if (lanyardStage && isMobileView()) {
  lanyardStage.classList.add("mobile-drop-ready");
}

function triggerMobileIdDrop() {
  if (!lanyardStage || !isMobileView() || isDragging) return;
  lanyardStage.classList.remove("mobile-drop-ready");
  void lanyardStage.offsetWidth;
  lanyardStage.classList.add("mobile-drop-animate");
  setTimeout(() => {
    if (!isDragging) {
      lanyardStage.classList.remove("mobile-drop-animate");
      lanyardStage.style.transform = "rotate(0deg)";
      lanyardStage.style.opacity = "1";
    }
  }, 900);
}

function finishPreloader() {
  if (!preloader) {
    triggerMobileIdDrop();
    return;
  }
  preloader.classList.add("done");
  triggerMobileIdDrop();
  setTimeout(() => {
    preloader.remove();
  }, 500);
}

if (preloader && gantryLights.length > 0) {
  let step = 0;
  const lightTimer = setInterval(() => {
    if (step < gantryLights.length) {
      gantryLights[step].classList.add("lit");
      if (preloaderStatus) {
        preloaderStatus.textContent = `GRID LIGHT ${step + 1} / ${gantryLights.length}`;
      }
      step += 1;
    } else {
      clearInterval(lightTimer);
      gantryLights.forEach((light) => {
        light.classList.remove("lit");
        light.classList.add("go");
      });
      if (preloaderStatus) {
        preloaderStatus.textContent = "LIGHTS OUT — GREEN FLAG";
      }
      setTimeout(finishPreloader, 260);
    }
  }, 190);
} else {
  finishPreloader();
}