const galleryData = [
  {
    title: 'Boss Demon',
    category: '2d',
    image: 'https://cdna.artstation.com/p/assets/covers/images/086/990/136/smaller_square/julio-garzon-julio-garzon-icono.jpg?1744627706',
    full: 'https://cdna.artstation.com/p/assets/covers/images/086/990/136/smaller_square/julio-garzon-julio-garzon-icono.jpg?1744627706',
    desc: 'Zombie Survival'
  },
  {
    title: 'Zombie Doberman',
    category: '2d',
    image: 'https://cdna.artstation.com/p/assets/covers/images/086/328/880/smaller_square/julio-garzon-julio-garzon-icono.jpg?1742923730',
    full: 'https://cdna.artstation.com/p/assets/covers/images/086/328/880/smaller_square/julio-garzon-julio-garzon-icono.jpg?1742923730',
    desc: 'Diseño de criatura'
  },
  {
    title: 'Zombie Rat',
    category: '2d',
    image: 'https://cdna.artstation.com/p/assets/covers/images/086/328/114/smaller_square/julio-garzon-julio-garzon-icono.jpg?1742921683',
    full: 'https://cdna.artstation.com/p/assets/covers/images/086/328/114/smaller_square/julio-garzon-julio-garzon-icono.jpg?1742921683',
    desc: 'Diseño de criatura'
  },
  {
    title: 'Toy Escape',
    category: '3d',
    image: 'https://cdnb.artstation.com/p/assets/images/images/086/647/977/smaller_square/julio-garzon-character-toypark-robot.jpg?1743697589',
    full: 'https://cdnb.artstation.com/p/assets/images/images/086/647/977/smaller_square/julio-garzon-character-toypark-robot.jpg?1743697589',
    desc: 'Personajes y armas 3D'
  },
  {
    title: 'Survival Weapons',
    category: '3d',
    image: 'https://cdnb.artstation.com/p/assets/covers/images/086/388/113/smaller_square/julio-garzon-julio-garzon-icono.jpg?1743077342',
    full: 'https://cdnb.artstation.com/p/assets/covers/images/086/388/113/smaller_square/julio-garzon-julio-garzon-icono.jpg?1743077342',
    desc: 'Glock, H&K, M-16'
  },
  {
    title: 'Dear Rotten Land',
    category: '2d',
    image: 'https://cdnb.artstation.com/p/assets/covers/images/057/514/027/smaller_square/julio-garzon-julio-garzon-icono.jpg?1671799216',
    full: 'https://cdnb.artstation.com/p/assets/covers/images/057/514/027/smaller_square/julio-garzon-julio-garzon-icono.jpg?1671799216',
    desc: 'Ilustración'
  },
  {
    title: 'Japanese Medieval Characters',
    category: '2d',
    image: 'https://cdna.artstation.com/p/assets/covers/images/017/514/574/20190426081301/smaller_square/julio-garzon-ranaronina.jpg?1556284381',
    full: 'https://cdna.artstation.com/p/assets/covers/images/017/514/574/20190426081301/smaller_square/julio-garzon-ranaronina.jpg?1556284381',
    desc: 'Diseño anfibio'
  }
];

const galleryGrid = document.getElementById('galleryGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.innerHTML = '<button class="lightbox-close">&times;</button><img src="" alt="">';
document.body.appendChild(lightbox);

let currentFilter = 'all';

function renderGallery(filter) {
  const filtered = filter === 'all'
    ? galleryData
    : galleryData.filter(item => item.category === filter);

  galleryGrid.innerHTML = filtered.map(item => `
    <div class="gallery-item" data-full="${item.full}" data-category="${item.category}">
      <img src="${item.image}" alt="${item.title}" loading="lazy">
      <div class="gallery-item-info">
        <h3>${item.title}</h3>
        <span>${item.desc}</span>
      </div>
    </div>
  `).join('');
}

renderGallery('all');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderGallery(currentFilter);
  });
});

galleryGrid.addEventListener('click', (e) => {
  const item = e.target.closest('.gallery-item');
  if (!item) return;
  const img = lightbox.querySelector('img');
  img.src = item.dataset.full;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
});

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
});

const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
});

navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
  });
});

let lastScroll = 0;
window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  if (currentScroll > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  lastScroll = currentScroll;
});

const revealElements = document.querySelectorAll('.section-title, .section-divider, .section-desc, .about-grid, .skills-grid, .gallery-grid, .timeline, .contact-content');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

revealElements.forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const originalText = btn.textContent;
  btn.textContent = 'Mensaje enviado ✓';
  btn.style.background = '#4a9e5a';
  e.target.reset();
  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.background = '';
  }, 3000);
});
