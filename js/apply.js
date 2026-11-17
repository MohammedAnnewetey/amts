const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('.main-nav'),header=document.querySelector('.site-header');
function closeMenu(){if(!menu||!nav)return;nav.classList.remove('open');menu.classList.remove('is-open');document.body.classList.remove('menu-open');menu.setAttribute('aria-expanded','false')}
if(menu&&nav){menu.addEventListener('click',()=>{const opened=nav.classList.toggle('open');menu.classList.toggle('is-open',opened);document.body.classList.toggle('menu-open',opened);menu.setAttribute('aria-expanded',opened?'true':'false')});nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu))}
function updateHeader(){if(header)header.classList.toggle('scrolled',window.scrollY>18)} updateHeader();window.addEventListener('scroll',updateHeader,{passive:true});window.addEventListener('resize',()=>{if(window.innerWidth>900)closeMenu()});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
const reveals=document.querySelectorAll('.reveal');if('IntersectionObserver'in window){const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('show');io.unobserve(entry)}}),{threshold:.12});reveals.forEach(el=>io.observe(el))}else reveals.forEach(el=>el.classList.add('show'));
window.addEventListener('load',()=>document.querySelectorAll('.reveal').forEach(el=>{el.classList.add('show','visible');el.style.opacity='1';el.style.visibility='visible';el.style.transform='none'}));

// AMTS application configuration. These two public values are safe for a static GitHub Pages site.
const AMTS_APPLICATION_CONFIG={
  cloudName:'YOUR_CLOUDINARY_CLOUD_NAME',
  uploadPreset:'YOUR_UNSIGNED_UPLOAD_PRESET',
  web3formsAccessKey:'YOUR_WEB3FORMS_ACCESS_KEY'
};

const form=document.querySelector('#amts-application-form');
const imageInput=document.querySelector('input[name="images"]');
const videoInput=document.querySelector('input[name="videos"]');
const uploadSummary=document.querySelector('.upload-summary');
const submitButton=form?.querySelector('button[type="submit"]');
function updateUploadSummary(){if(!uploadSummary)return;const images=imageInput?.files?.length||0,videos=videoInput?.files?.length||0;uploadSummary.textContent=(images||videos)?`${images} image(s) and ${videos} video(s) selected.`:''}
[imageInput,videoInput].forEach(input=>input?.addEventListener('change',updateUploadSummary));

async function uploadToCloudinary(file,folder){
  const data=new FormData();data.append('file',file);data.append('upload_preset',AMTS_APPLICATION_CONFIG.uploadPreset);data.append('folder',folder);
  const response=await fetch(`https://api.cloudinary.com/v1_1/${AMTS_APPLICATION_CONFIG.cloudName}/auto/upload`,{method:'POST',body:data});
  if(!response.ok)throw new Error(`Could not upload ${file.name}`);return response.json();
}

form?.addEventListener('submit',async event=>{
  event.preventDefault();
  const note=form.querySelector('.form-success');
  if(Object.values(AMTS_APPLICATION_CONFIG).some(value=>value.startsWith('YOUR_'))){note.textContent='Application delivery is awaiting the website administrator’s upload/email configuration.';note.classList.add('error');return}
  if(!imageInput.files.length){note.textContent='Please select at least one image.';note.classList.add('error');return}
  submitButton.disabled=true;submitButton.textContent='Uploading application…';note.textContent='Uploading your media securely. Please keep this page open.';note.classList.remove('error');
  try{
    const stamp=new Date().toISOString().replace(/[:.]/g,'-');const folder=`amts-applications/${stamp}`;
    const imageResults=await Promise.all([...imageInput.files].map(file=>uploadToCloudinary(file,folder)));
    const videoResults=await Promise.all([...videoInput.files].map(file=>uploadToCloudinary(file,folder)));
    const payload=new FormData();payload.append('access_key',AMTS_APPLICATION_CONFIG.web3formsAccessKey);payload.append('subject',`New AMTS Scouting Application — ${form.elements.name.value}`);payload.append('from_name','AMTS Website Applications');payload.append('replyto',form.elements.email.value);
    ['name','age','email','phone','city','height','category','portfolio'].forEach(key=>payload.append(key,form.elements[key]?.value||''));
    payload.append('Image Links',imageResults.map((r,i)=>`Image ${i+1}: ${r.secure_url}`).join('\n'));
    payload.append('Video Links',videoResults.length?videoResults.map((r,i)=>`Video ${i+1}: ${r.secure_url}`).join('\n'):'No videos submitted');
    const mailResponse=await fetch('https://api.web3forms.com/submit',{method:'POST',body:payload});const mailResult=await mailResponse.json();if(!mailResponse.ok||!mailResult.success)throw new Error(mailResult.message||'Email delivery failed');
    form.reset();updateUploadSummary();note.textContent='Application received successfully. Thank you for applying to AMTS.';
  }catch(error){console.error(error);note.textContent='We could not submit your application. Please check your connection and try again.';note.classList.add('error')}
  finally{submitButton.disabled=false;submitButton.textContent='Submit Application'}
});
