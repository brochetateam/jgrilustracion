const stage = document.getElementById('stage');
const hero = document.getElementById('hero');
const menu = document.getElementById('menu');
const panels = document.querySelectorAll('.panel');
const menuItems = document.querySelectorAll('.menu-item');
const backButtons = document.querySelectorAll('[data-back]');

let currentPanel = null;
let isTransitioning = false;

function openPanel(targetId) {
  if (isTransitioning) return;
  const panel = document.getElementById(`panel-${targetId}`);
  if (!panel) return;

  isTransitioning = true;
  currentPanel = panel;

  panel.hidden = false;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      panel.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  });

  setTimeout(() => {
    isTransitioning = false;
  }, 600);
}

function closePanel() {
  if (!currentPanel || isTransitioning) return;

  isTransitioning = true;
  const panel = currentPanel;

  panel.classList.remove('is-open');
  document.body.style.overflow = '';

  setTimeout(() => {
    panel.hidden = true;
    currentPanel = null;
    isTransitioning = false;
  }, 600);
}

menuItems.forEach(item => {
  item.addEventListener('click', (e) => {
    const target = item.dataset.target;
    if (target) openPanel(target);
  });
});

backButtons.forEach(btn => {
  btn.addEventListener('click', closePanel);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && currentPanel) closePanel();
});

if (location.hash === '#menu') {
  hero?.scrollIntoView({ behavior: 'smooth' });
}

const rail = document.querySelector('.projects-rail');
if (rail) {
  let isDown = false;
  let startX;
  let scrollLeft;

  rail.addEventListener('mousedown', (e) => {
    isDown = true;
    rail.style.cursor = 'grabbing';
    startX = e.pageX - rail.offsetLeft;
    scrollLeft = rail.scrollLeft;
  });

  rail.addEventListener('mouseleave', () => {
    isDown = false;
    rail.style.cursor = 'grab';
  });

  rail.addEventListener('mouseup', () => {
    isDown = false;
    rail.style.cursor = 'grab';
  });

  rail.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - rail.offsetLeft;
    const walk = (x - startX) * 1.5;
    rail.scrollLeft = scrollLeft - walk;
  });

  rail.style.cursor = 'grab';
}

const observerOptions = { threshold: 0.15 };
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.menu-item, .menu-social, .menu-footer').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  el.style.transitionDelay = `${i * 0.15}s`;
  revealObserver.observe(el);
});

document.addEventListener('scroll', () => {
  document.querySelectorAll('.menu-item.visible, .menu-social.visible, .menu-footer.visible').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  });
}, { passive: true });
