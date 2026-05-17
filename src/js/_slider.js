function initSlider() {
  console.log('Active slider initialized');

  const track = document.querySelector('.project__slider-track');
  if (!document.querySelector('.project__slider-track')) return;
  const nextBtn = document.querySelector('.next-btn');
  const prevBtn = document.querySelector('.prev-btn');
  const slides = Array.from(track.children);

  let currentIndex = 0;
  let startX = 0;

  function updateSlider() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
  }

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlider();
  });

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlider();
  });

  track.addEventListener('mousedown', (event) => {
    startX = event.clientX;
  });

  track.addEventListener('mouseup', (event) => {
    let endX = event.clientX;
    let diff = startX - endX;

    if (diff > 50) {
      currentIndex = (currentIndex + 1) % slides.length;
    } else if (diff < -50) {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    }

    updateSlider();
  });

  track.querySelectorAll('img').forEach((img) => {
    img.style.pointerEvents = 'none';
  });
}
