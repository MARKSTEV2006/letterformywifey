const screens = {
  gate: document.querySelector('#gate-screen'),
  auth: document.querySelector('#auth-screen'),
  letter: document.querySelector('#letter-screen')
};
const backgroundMusic = document.querySelector('#background-music');
const musicToggle = document.querySelector('#music-toggle');
const musicLabel = musicToggle.querySelector('.music-label');
let musicWanted = true;

function showScreen(name) {
  Object.values(screens).forEach(screen => screen.classList.remove('active'));
  screens[name].classList.add('active');
  window.scrollTo({ top: 0, behavior: 'instant' });
}

document.querySelector('#open-gate').addEventListener('click', () => {
  backgroundMusic.volume = 0.45;
  backgroundMusic.play().then(() => {
    musicToggle.hidden = false;
  }).catch(() => {
    musicToggle.hidden = false;
    musicToggle.classList.add('muted');
    musicLabel.textContent = 'Tap for music';
  });
  screens.gate.classList.add('opening');
  setTimeout(() => showScreen('auth'), 1550);
});

musicToggle.addEventListener('click', () => {
  if (backgroundMusic.paused) {
    musicWanted = true;
    backgroundMusic.play();
    musicToggle.classList.remove('muted');
    musicLabel.textContent = 'Music on';
  } else {
    musicWanted = false;
    backgroundMusic.pause();
    musicToggle.classList.add('muted');
    musicLabel.textContent = 'Music off';
  }
});

const memoryVideo = document.querySelector('.video-frame video');
memoryVideo.addEventListener('play', () => {
  if (!backgroundMusic.paused) backgroundMusic.pause();
});
memoryVideo.addEventListener('pause', () => {
  if (musicWanted) backgroundMusic.play().catch(() => {});
});
memoryVideo.addEventListener('ended', () => {
  if (musicWanted) backgroundMusic.play().catch(() => {});
});

const authNote = document.querySelector('#auth-note');
const passwordForm = document.querySelector('#password-form');
const passwordInput = document.querySelector('#love-password');

passwordForm.addEventListener('submit', event => {
  event.preventDefault();
  if (passwordInput.value === 'JULY19') {
    authNote.textContent = 'Password accepted — welcome, my wifey! ♡';
    setTimeout(revealLetter, 500);
    return;
  }

  authNote.textContent = 'That’s not our special password. Try again, wifey ♡';
  passwordForm.classList.remove('shake');
  void passwordForm.offsetWidth;
  passwordForm.classList.add('shake');
  passwordInput.select();
});

document.querySelector('#toggle-password').addEventListener('click', event => {
  const showing = passwordInput.type === 'text';
  passwordInput.type = showing ? 'password' : 'text';
  event.currentTarget.textContent = showing ? '♡' : '♥';
  event.currentTarget.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
  passwordInput.focus();
});

function revealLetter() {
  showScreen('letter');
  makeHeartRain(46);
  setTimeout(() => makeHeartRain(24), 1600);
}

function makeHeartRain(amount) {
  const container = document.querySelector('#heart-rain');
  const symbols = ['♥', '♡', '❥', '✿', '❀'];
  for (let i = 0; i < amount; i += 1) {
    const heart = document.createElement('span');
    heart.className = 'falling-heart';
    heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.fontSize = `${12 + Math.random() * 24}px`;
    heart.style.animationDuration = `${3.5 + Math.random() * 4}s`;
    heart.style.animationDelay = `${Math.random() * 2}s`;
    heart.style.opacity = `${.35 + Math.random() * .6}`;
    container.appendChild(heart);
    heart.addEventListener('animationend', () => heart.remove());
  }
}

document.querySelector('#replay-button').addEventListener('click', () => {
  const bear = document.querySelector('#love-bear');
  bear.classList.remove('hugging');
  bear.setAttribute('aria-expanded', 'false');
  document.querySelector('#bear-message').classList.remove('visible');
  screens.gate.classList.remove('opening');
  showScreen('gate');
});

document.querySelector('#love-bear').addEventListener('click', event => {
  const bear = event.currentTarget;
  const hugging = bear.classList.toggle('hugging');
  bear.setAttribute('aria-expanded', String(hugging));
  document.querySelector('#bear-message').classList.toggle('visible', hugging);
  if (hugging) makeHeartRain(18);
});

const galleryPhotos = [...document.querySelectorAll('.photo')];
const lightbox = document.querySelector('#photo-lightbox');
const lightboxImage = document.querySelector('#lightbox-image');
const lightboxCaption = document.querySelector('#lightbox-caption');
const lightboxCount = document.querySelector('#lightbox-count');
let currentPhoto = 0;

galleryPhotos.forEach((photo, index) => {
  photo.tabIndex = 0;
  photo.setAttribute('role', 'button');
  photo.setAttribute('aria-label', `Expand photo: ${photo.querySelector('figcaption').textContent}`);
  photo.addEventListener('click', () => openPhoto(index));
  photo.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openPhoto(index);
    }
  });
});

function openPhoto(index) {
  currentPhoto = (index + galleryPhotos.length) % galleryPhotos.length;
  const sourceImage = galleryPhotos[currentPhoto].querySelector('img');
  lightboxImage.src = sourceImage.src;
  lightboxImage.alt = sourceImage.alt;
  lightboxCaption.textContent = galleryPhotos[currentPhoto].querySelector('figcaption').textContent;
  lightboxCount.textContent = `${currentPhoto + 1} / ${galleryPhotos.length}`;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lightbox-open');
  document.querySelector('#lightbox-close').focus();
}

function closePhoto() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lightbox-open');
  galleryPhotos[currentPhoto].focus();
}

document.querySelector('#lightbox-close').addEventListener('click', closePhoto);
document.querySelector('#lightbox-prev').addEventListener('click', () => openPhoto(currentPhoto - 1));
document.querySelector('#lightbox-next').addEventListener('click', () => openPhoto(currentPhoto + 1));
lightbox.addEventListener('click', event => {
  if (event.target === lightbox) closePhoto();
});
document.addEventListener('keydown', event => {
  if (!lightbox.classList.contains('open')) return;
  if (event.key === 'Escape') closePhoto();
  if (event.key === 'ArrowLeft') openPhoto(currentPhoto - 1);
  if (event.key === 'ArrowRight') openPhoto(currentPhoto + 1);
});

document.addEventListener('click', event => {
  if (!screens.letter.classList.contains('active') || event.target.closest('button, a')) return;
  const burst = document.createElement('span');
  burst.className = 'falling-heart';
  burst.textContent = '♥';
  burst.style.left = `${event.clientX}px`;
  burst.style.top = `${event.clientY}px`;
  burst.style.position = 'fixed';
  burst.style.animation = 'unlock .8s forwards';
  document.body.appendChild(burst);
  setTimeout(() => burst.remove(), 900);
});
