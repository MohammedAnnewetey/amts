

// AMTS crisp image load: force browser to decode full-quality images before final paint.
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('img').forEach((img) => {
    img.style.imageRendering = 'auto';
    if ('decode' in img && !img.complete) {
      img.decode().catch(() => {}).finally(() => img.classList.add('is-crisp-loaded'));
    } else {
      img.classList.add('is-crisp-loaded');
    }
  });
});
