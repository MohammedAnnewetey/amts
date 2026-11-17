const menuToggle=document.querySelector('.menu-toggle');const nav=document.querySelector('.main-nav');if(menuToggle&&nav){menuToggle.addEventListener('click',()=>{const isOpen=nav.classList.toggle('open');menuToggle.classList.toggle('is-open',isOpen);menuToggle.setAttribute('aria-expanded',String(isOpen));document.body.classList.toggle('menu-open',isOpen);});}
window.addEventListener('scroll',()=>{document.querySelector('.site-header')?.classList.toggle('scrolled',window.scrollY>20);},{passive:true});
const revealItems=document.querySelectorAll('.reveal');if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}})},{threshold:.12});revealItems.forEach(item=>observer.observe(item));}else{revealItems.forEach(item=>item.classList.add('visible'));}
const tabButtons=document.querySelectorAll('[data-gallery-tab]');const panels=document.querySelectorAll('[data-gallery-panel]');tabButtons.forEach(button=>{button.addEventListener('click',()=>{const target=button.dataset.galleryTab;tabButtons.forEach(btn=>btn.classList.toggle('active',btn===button));panels.forEach(panel=>panel.classList.toggle('active',panel.dataset.galleryPanel===target));});});
// Professional gallery lightbox for Portfolio and Polaroids
const galleryImages = Array.from(document.querySelectorAll('.gallery-panel .model-shot img'));
let currentGallery = [];
let currentIndex = 0;

function createLightbox(){
  let box = document.querySelector('.image-lightbox');
  if(box) return box;
  box = document.createElement('div');
  box.className = 'image-lightbox';
  box.setAttribute('aria-hidden','true');
  box.innerHTML = `
    <button class="lightbox-close" type="button" aria-label="Close image viewer"><i class="fa-solid fa-xmark"></i></button>
    <button class="lightbox-nav lightbox-prev" type="button" aria-label="Previous image"><i class="fa-solid fa-chevron-left"></i></button>
    <figure class="lightbox-frame">
      <img class="lightbox-img" src="" alt="">
      <figcaption class="lightbox-caption"></figcaption>
    </figure>
    <button class="lightbox-nav lightbox-next" type="button" aria-label="Next image"><i class="fa-solid fa-chevron-right"></i></button>
  `;
  document.body.appendChild(box);
  box.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  box.querySelector('.lightbox-prev').addEventListener('click', showPreviousImage);
  box.querySelector('.lightbox-next').addEventListener('click', showNextImage);
  box.addEventListener('click', event => { if(event.target === box) closeLightbox(); });
  return box;
}

function openLightbox(image){
  const panel = image.closest('.gallery-panel');
  currentGallery = Array.from(panel.querySelectorAll('.model-shot img'));
  currentIndex = currentGallery.indexOf(image);
  const box = createLightbox();
  box.classList.add('open');
  box.setAttribute('aria-hidden','false');
  document.body.classList.add('lightbox-open');
  updateLightboxImage();
}

function updateLightboxImage(){
  const image = currentGallery[currentIndex];
  const box = createLightbox();
  const largeImage = box.querySelector('.lightbox-img');
  const caption = box.querySelector('.lightbox-caption');
  largeImage.src = image.getAttribute('src');
  largeImage.alt = image.getAttribute('alt') || 'Model gallery image';
  const label = image.closest('.model-shot')?.dataset.label || `Image ${currentIndex + 1}`;
  caption.textContent = `${label} / ${currentIndex + 1} of ${currentGallery.length}`;
}

function showNextImage(){
  if(!currentGallery.length) return;
  currentIndex = (currentIndex + 1) % currentGallery.length;
  updateLightboxImage();
}

function showPreviousImage(){
  if(!currentGallery.length) return;
  currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
  updateLightboxImage();
}

function closeLightbox(){
  const box = document.querySelector('.image-lightbox');
  if(!box) return;
  box.classList.remove('open');
  box.setAttribute('aria-hidden','true');
  document.body.classList.remove('lightbox-open');
}

galleryImages.forEach(image => {
  image.closest('.model-shot')?.classList.add('is-clickable');
  image.addEventListener('click', () => openLightbox(image));
});

document.addEventListener('keydown', event => {
  if(!document.querySelector('.image-lightbox.open')) return;
  if(event.key === 'Escape') closeLightbox();
  if(event.key === 'ArrowRight') showNextImage();
  if(event.key === 'ArrowLeft') showPreviousImage();
});

// AMTS final fallback: never leave reveal sections hidden.
window.addEventListener('load',()=>document.querySelectorAll('.reveal').forEach(el=>{el.classList.add('show','visible');el.style.opacity='1';el.style.visibility='visible';el.style.transform='none';}));
