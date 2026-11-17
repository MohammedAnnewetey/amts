const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const header = document.querySelector('.site-header');

function closeMenu(){
  if(!menu || !nav) return;
  nav.classList.remove('open');
  menu.classList.remove('is-open');
  document.body.classList.remove('menu-open');
  menu.setAttribute('aria-expanded','false');
}

if(menu && nav){
  menu.addEventListener('click', () => {
    const opened = nav.classList.toggle('open');
    menu.classList.toggle('is-open', opened);
    document.body.classList.toggle('menu-open', opened);
    menu.setAttribute('aria-expanded', opened ? 'true' : 'false');
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
}

function updateHeader(){
  if(!header) return;
  header.classList.toggle('scrolled', window.scrollY > 18);
}
updateHeader();
window.addEventListener('scroll', updateHeader, {passive:true});
window.addEventListener('resize', () => { if(window.innerWidth > 900) closeMenu(); });

document.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeMenu(); });

const reveals = document.querySelectorAll('.reveal');
if('IntersectionObserver' in window){
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('show');
        io.unobserve(entry.target);
      }
    });
  }, {threshold:.12});
  reveals.forEach(el => io.observe(el));
}else{
  reveals.forEach(el => el.classList.add('show'));
}


// Demo form behaviour: prevents page reload and shows a clean success message.
document.querySelectorAll('form').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = form.dataset.formName || 'Form';
    let note = form.querySelector('.form-success');
    if(!note){
      note = document.createElement('p');
      note.className = 'form-success';
      form.appendChild(note);
    }
    note.textContent = `${name} received. Thank you.`;
  });
});

// AMTS final fallback: never leave reveal sections hidden.
window.addEventListener('load',()=>document.querySelectorAll('.reveal').forEach(el=>{el.classList.add('show','visible');el.style.opacity='1';el.style.visibility='visible';el.style.transform='none';}));
