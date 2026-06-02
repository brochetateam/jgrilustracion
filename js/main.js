const revealTargets = document.querySelectorAll('.section-name, .circle-bio, .projects-rail, .contact-info, .social-icons');

revealTargets.forEach((el, i) => {
  el.classList.add('reveal-target');
  el.style.transitionDelay = `${i * 0.1}s`;
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

revealTargets.forEach(el => revealObserver.observe(el));

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const offset = 50;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

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
