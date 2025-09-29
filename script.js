// ===== Scroll-trigger utilities (IntersectionObserver) =====
function scrollTrigger(selector, options = {}){
  let els = Array.from(document.querySelectorAll(selector));
  els.forEach(el => addObserver(el, options));
  function addObserver(el, options){
    if(!('IntersectionObserver' in window)){
      el.classList.add('active');
      if(options.cb) options.cb(el);
      return;
    }
    const obs = new IntersectionObserver((entries, observer)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('active');
          if(options.cb) options.cb(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, options);
    obs.observe(el);
  }
}
// Apply to hero and sections
window.addEventListener('DOMContentLoaded', ()=>{
  scrollTrigger('.scroll-reveal', { rootMargin: '-12% 0px' });
});
/* Ref: IntersectionObserver patterns and scroll-trigger animation basics. */

// ===== Parallax particles (subtle) =====
const canvas = document.getElementById('particles');
if(canvas){
  const ctx = canvas.getContext('2d');
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = Math.max(window.innerHeight * 0.88, 520);
  let particles = Array.from({length: 60}, ()=> ({
    x: Math.random()*w, y: Math.random()*h, r: Math.random()*1.8+0.6,
    vx: (Math.random()*0.4-0.2), vy:(Math.random()*0.3-0.15),
    hue: Math.random()<0.5 ? 160 : 270
  }));
  function draw(){
    ctx.clearRect(0,0,w,h);
    particles.forEach(p=>{
      p.x += p.vx; p.y += p.vy;
      if(p.x<0) p.x=w; if(p.x>w) p.x=0;
      if(p.y<0) p.y=h; if(p.y>h) p.y=0;
      ctx.beginPath();
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r*4);
      grad.addColorStop(0, `hsla(${p.hue},80%,60%,0.8)`);
      grad.addColorStop(1, `hsla(${p.hue},80%,60%,0)`);
      ctx.fillStyle = grad;
      ctx.arc(p.x,p.y,p.r*4,0,Math.PI*2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
  window.addEventListener('resize', ()=>{
    w = canvas.width = window.innerWidth;
    h = canvas.height = Math.max(window.innerHeight * 0.88, 520);
  });
}

// Smooth scroll from hero CTA
const learnBtn = document.getElementById('scroll-learn');
if(learnBtn){
  learnBtn.addEventListener('click', ()=>{
    document.getElementById('app-root')?.scrollIntoView({behavior:'smooth'});
  });
}

// ===== Dynamic groups (same as before) =====
function makeExperienceItem(){
  const wrap = document.createElement('div');
  wrap.className = 'card';
  wrap.innerHTML = `
    <label>Role <input type="text" class="exp-role" placeholder="e.g., Frontend Developer"/></label>
    <label>Company <input type="text" class="exp-company" placeholder="Company"/></label>
    <label>Location <input type="text" class="exp-loc" placeholder="City, Country"/></label>
    <label>Start - End <input type="text" class="exp-dates" placeholder="Jun 2023 - Present"/></label>
    <label>Description <textarea rows="3" class="exp-desc" placeholder="Impact, responsibilities, achievements"></textarea></label>
    <hr/>
  `;
  return wrap;
}
function makeEducationItem(){
  const wrap = document.createElement('div');
  wrap.className = 'card';
  wrap.innerHTML = `
    <label>Degree <input type="text" class="edu-degree" placeholder="BCA"/></label>
    <label>Institution <input type="text" class="edu-inst" placeholder="College / University"/></label>
    <label>Location <input type="text" class="edu-loc" placeholder="City"/></label>
    <label>Year(s) <input type="text" class="edu-year" placeholder="2023 - 2026"/></label>
    <label>Highlights <textarea rows="2" class="edu-desc" placeholder="CGPA, coursework, awards"></textarea></label>
    <hr/>
  `;
  return wrap;
}
function makeProjectItem(){
  const wrap = document.createElement('div');
  wrap.className = 'card';
  wrap.innerHTML = `
    <label>Project <input type="text" class="prj-name" placeholder="C Compiler Web Runner"/></label>
    <label>Link <input type="text" class="prj-link" placeholder="https://..."/></label>
    <label>Tech <input type="text" class="prj-tech" placeholder="HTML, CSS, JS, Node"/></label>
    <label>Description <textarea rows="3" class="prj-desc" placeholder="Problem, approach, result"></textarea></label>
    <hr/>
  `;
  return wrap;
}

// Mount initial
const expList = document.getElementById('experience-list');
const eduList = document.getElementById('education-list');
const prjList = document.getElementById('project-list');
document.getElementById('add-experience').addEventListener('click', ()=> expList.appendChild(makeExperienceItem()));
document.getElementById('add-education').addEventListener('click', ()=> eduList.appendChild(makeEducationItem()));
document.getElementById('add-project').addEventListener('click', ()=> prjList.appendChild(makeProjectItem()));
expList.appendChild(makeExperienceItem());
eduList.appendChild(makeEducationItem());
prjList.appendChild(makeProjectItem());

// Binding
const bind = (id, outId, transform=(v)=>v) => {
  const el = document.getElementById(id);
  const out = document.getElementById(outId);
  const sync = ()=> { out.textContent = transform(el.value); };
  el.addEventListener('input', sync);
  sync();
};
bind('name','out-name');
bind('title','out-title');
bind('summary','out-summary');
bind('email','out-email');
bind('phone','out-phone');
bind('location','out-location');
bind('website','out-website');

const skillsInput = document.getElementById('skills');
const outSkills = document.getElementById('out-skills');
function renderChips(){
  outSkills.innerHTML = '';
  skillsInput.value.split(',').map(s=>s.trim()).filter(Boolean).forEach(skill=>{
    const li = document.createElement('li'); li.textContent = skill; outSkills.appendChild(li);
  });
}
skillsInput.addEventListener('input', renderChips); renderChips();

// Render sections with reveal animation
function revealEntries(container){
  requestAnimationFrame(()=>{
    container.querySelectorAll('.entry').forEach((el, i)=>{
      setTimeout(()=> el.classList.add('revealed'), i*40);
    });
  });
}
function renderExperience(){
  const container = document.getElementById('out-experience');
  container.innerHTML = '';
  Array.from(expList.children).forEach(card=>{
    const role = card.querySelector('.exp-role').value.trim();
    const company = card.querySelector('.exp-company').value.trim();
    const loc = card.querySelector('.exp-loc').value.trim();
    const dates = card.querySelector('.exp-dates').value.trim();
    const desc = card.querySelector('.exp-desc').value.trim();
    if(!role && !company && !desc) return;
    const entry = document.createElement('div');
    entry.className = 'entry';
    entry.innerHTML = `
      <div class="entry-header">
        <div class="entry-title">${role || ''} ${company ? ' • '+company : ''}</div>
        <div class="entry-sub">${dates || ''}${loc ? ' — '+loc : ''}</div>
      </div>
      ${desc ? `<p>${desc}</p>` : ''}
    `;
    container.appendChild(entry);
  });
  revealEntries(container);
}
function renderEducation(){
  const container = document.getElementById('out-education');
  container.innerHTML = '';
  Array.from(eduList.children).forEach(card=>{
    const degree = card.querySelector('.edu-degree').value.trim();
    const inst = card.querySelector('.edu-inst').value.trim();
    const loc = card.querySelector('.edu-loc').value.trim();
    const year = card.querySelector('.edu-year').value.trim();
    const desc = card.querySelector('.edu-desc').value.trim();
    if(!degree && !inst) return;
    const entry = document.createElement('div');
    entry.className = 'entry';
    entry.innerHTML = `
      <div class="entry-header">
        <div class="entry-title">${degree || ''} ${inst ? ' • '+inst : ''}</div>
        <div class="entry-sub">${year || ''}${loc ? ' — '+loc : ''}</div>
      </div>
      ${desc ? `<p>${desc}</p>` : ''}
    `;
    container.appendChild(entry);
  });
  revealEntries(container);
}
function renderProjects(){
  const container = document.getElementById('out-projects');
  container.innerHTML = '';
  Array.from(prjList.children).forEach(card=>{
    const name = card.querySelector('.prj-name').value.trim();
    const link = card.querySelector('.prj-link').value.trim();
    const tech = card.querySelector('.prj-tech').value.trim();
    const desc = card.querySelector('.prj-desc').value.trim();
    if(!name && !desc) return;
    const entry = document.createElement('div');
    entry.className = 'entry';
    const title = document.createElement('div');
    title.className = 'entry-header';
    const left = document.createElement('div');
    left.className = 'entry-title';
    left.textContent = name;
    const right = document.createElement('div');
    right.className = 'entry-sub';
    right.textContent = tech;
    title.append(left, right);
    entry.appendChild(title);
    if(link){
      const p = document.createElement('p');
      p.innerHTML = `<a href="${link}" target="_blank" rel="noopener">${link}</a>`;
      entry.appendChild(p);
    }
    if(desc){
      const p2 = document.createElement('p'); p2.textContent = desc; entry.appendChild(p2);
    }
    container.appendChild(entry);
  });
  revealEntries(container);
}
document.addEventListener('input', e=>{
  if(e.target.closest('#experience-list')) renderExperience();
  if(e.target.closest('#education-list')) renderEducation();
  if(e.target.closest('#project-list')) renderProjects();
});

// Theme
const primaryColor = document.getElementById('primaryColor');
const accentColor = document.getElementById('accentColor');
const fontScale = document.getElementById('fontScale');
function applyTheme(){
  document.documentElement.style.setProperty('--primary', primaryColor.value);
  document.documentElement.style.setProperty('--accent', accentColor.value);
  document.documentElement.style.setProperty('--scale', fontScale.value);
  document.documentElement.style.setProperty('--glow', `0 0 24px ${hexToRgba(primaryColor.value, .35)}, 0 0 48px ${hexToRgba(accentColor.value, .18)}`);
}
[primaryColor, accentColor, fontScale].forEach(el=> el.addEventListener('input', applyTheme));
applyTheme();
function hexToRgba(hex, a){
  const h = hex.replace('#','');
  const bigint = parseInt(h,16);
  const r = (bigint >> 16) & 255, g = (bigint >> 8) & 255, b = bigint & 255;
  return `rgba(${r},${g},${b},${a})`;
}

// Demo
document.getElementById('load-demo').addEventListener('click', ()=>{
  document.getElementById('name').value = 'Arjun Sharma';
  document.getElementById('title').value = 'Frontend Developer';
  document.getElementById('summary').value = 'Frontend developer focusing on accessible, performant web apps with modern JavaScript and clean UI systems.';
  document.getElementById('email').value = 'arjun@example.com';
  document.getElementById('phone').value = '+91-9876543210';
  document.getElementById('location').value = 'Meerut, Uttar Pradesh, India';
  document.getElementById('website').value = 'https://github.com/arjun';
  document.getElementById('skills').value = 'HTML, CSS, JavaScript, React, Tailwind, Git, REST, Web Accessibility';

  // Reset lists
  expList.innerHTML = ''; eduList.innerHTML=''; prjList.innerHTML='';
  expList.appendChild(makeExperienceItem());
  eduList.appendChild(makeEducationItem());
  prjList.appendChild(makeProjectItem());

  const exp0 = expList.children[0];
  exp0.querySelector('.exp-role').value = 'Frontend Developer';
  exp0.querySelector('.exp-company').value = 'MMD Hiring Solution';
  exp0.querySelector('.exp-loc').value = 'Remote';
  exp0.querySelector('.exp-dates').value = 'Jan 2025 - Present';
  exp0.querySelector('.exp-desc').value = 'Built responsive UI components, improved Lighthouse scores by 25%, and led migration to modular CSS.';

  const edu0 = eduList.children[0];
  edu0.querySelector('.edu-degree').value = 'BCA';
  edu0.querySelector('.edu-inst').value = 'Vinayak Vidyapeeth Modipura';
  edu0.querySelector('.edu-loc').value = 'Meerut';
  edu0.querySelector('.edu-year').value = '2023 - 2026';
  edu0.querySelector('.edu-desc').value = 'Relevant coursework: DSA, OOP in Java/C++, Web Development.';

  const prj0 = prjList.children[0];
  prj0.querySelector('.prj-name').value = 'C Language Web Compiler';
  prj0.querySelector('.prj-link').value = 'https://example.com/c-compiler';
  prj0.querySelector('.prj-tech').value = 'HTML, CSS, JavaScript';
  prj0.querySelector('.prj-desc').value = 'Built a browser-based C code runner with sandboxed execution UI and shareable links.';

  // Trigger renders
  ['name','title','summary','email','phone','location','website','skills'].forEach(id=>{
    document.getElementById(id).dispatchEvent(new Event('input'));
  });
  renderExperience(); renderEducation(); renderProjects();
});

// ===== Export modal flow (unchanged core, tuned options) =====
const exportModal = document.getElementById('export-modal');
document.getElementById('print-save').addEventListener('click', ()=>{
  document.getElementById('export-filename').value = (document.getElementById('name').value || 'resume').toLowerCase().replace(/\s+/g,'-');
  exportModal.showModal();
});

document.getElementById('export-confirm').addEventListener('click', async (e)=>{
  e.preventDefault();
  const filenameBase = document.getElementById('export-filename').value || 'resume';
  const type = [...exportModal.querySelectorAll('input[name="filetype"]')].find(r=>r.checked)?.value || 'pdf';
  exportModal.close();
  const resume = document.getElementById('resume-root');

  if(type === 'pdf'){
    const opt = {
      margin:       [10,10,10,10], // mm
      filename:     `${filenameBase}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak:    { mode: ['css', 'legacy'] }
    };
    await html2pdf().set(opt).from(resume).save();
    /* html2pdf.js best practices and cut-off mitigation tips */
  } else if(type === 'png'){
    const canvas = await html2canvas(resume, { scale: 2, useCORS: true });
    const dataURL = canvas.toDataURL('image/png');
    const a = document.createElement('a'); a.href = dataURL; a.download = `${filenameBase}.png`; a.click();
  } else if(type === 'html'){
    const doc = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${filenameBase}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
<style>${collectPrintStyles()}</style></head>
<body>${resume.outerHTML}</body></html>`;
    const blob = new Blob([doc], { type:'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${filenameBase}.html`; a.click(); URL.revokeObjectURL(url);
  }
});

// Minimal CSS for HTML snapshot
function collectPrintStyles(){
  const css = `
  :root{--primary:${getComputedStyle(document.documentElement).getPropertyValue('--primary')};--scale:${getComputedStyle(document.documentElement).getPropertyValue('--scale')};}
  body{margin:0;background:#fff;color:#0f172a;font-family:Inter,system-ui,Arial,sans-serif;}
  .resume-a4{width:210mm;min-height:297mm;padding:18mm;}
  .resume-header{display:flex;justify-content:space-between;gap:24px;margin-bottom:16px;border-bottom:2px solid var(--primary);padding-bottom:12px;}
  .identity h1{margin:0;font-family:"Space Grotesk", Inter, Arial, sans-serif;}
  .muted{color:#475569;}
  section h3{color:#0f766e;text-transform:uppercase;font-weight:700;font-size:12px;}
  .chips{list-style:none;padding:0;margin:0;display:flex;flex-wrap:wrap;gap:8px;}
  .chips li{border:1px solid #e5e7eb;border-radius:999px;padding:6px 10px;background:#f1f5f9;font-size:12px;}
  .entry{margin:10px 0 14px;}
  .entry-header{display:flex;justify-content:space-between;gap:16px;}
  .entry-title{font-weight:700;}
  .entry-sub{color:#64748b;font-size:12px;}
  @media print{ .resume-a4{border:none;width:auto;min-height:auto;padding:0;} }
  `;
  return css;
}

// Trigger renders on any input in dynamic lists
document.addEventListener('input', e=>{
  if(e.target.closest('#experience-list')) renderExperience();
  if(e.target.closest('#education-list')) renderEducation();
  if(e.target.closest('#project-list')) renderProjects();
});

// Initial render
renderExperience(); renderEducation(); renderProjects();
