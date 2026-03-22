document.getElementById('ava').src = INFO.avatar;
document.getElementById('ava').alt = INFO.username;
document.getElementById('username').textContent = INFO.username;
document.title = INFO.username;
document.querySelector('link[rel="icon"]') && (document.querySelector('link[rel="icon"]').href = INFO.avatar);
document.getElementById('repos-btn').href = INFO.github + '?tab=repositories';

const favicon = document.createElement('link');
favicon.rel = 'icon';
favicon.href = INFO.avatar;
document.head.appendChild(favicon);

const SOCIALS = [
  {
    href: INFO.telegram,
    label: 'Telegram',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor" style="color:#24a1de"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>'
  },
  {
    href: INFO.twitter,
    label: 'X / Twitter',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor" style="color:#111"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>'
  },
  {
    href: 'mailto:' + INFO.email,
    label: INFO.email,
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" style="color:#888"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5"/></svg>'
  }
];

const slist = document.getElementById('slist');
SOCIALS.forEach(s => {
  const a = document.createElement('a');
  a.href = s.href;
  a.className = 'spill';
  if (!s.href.startsWith('mailto')) a.target = '_blank';
  a.innerHTML = s.svg + s.label;
  slist.appendChild(a);
});

INFO.crypto.forEach(c => {
  const item = document.createElement('div');
  item.className = 'citem';
  item.onclick = () => cp(c.address);
  item.innerHTML = `
    <div class="cdata">
      <span class="ctag ${c.cls}">${c.tag}</span>
      <span class="caddr">${c.address}</span>
    </div>
    <svg class="cic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
  `;
  document.getElementById('clist').appendChild(item);
});

let cur=0,total=0;
const track=document.getElementById('track'),dotsEl=document.getElementById('dots'),
      counter=document.getElementById('counter'),prev=document.getElementById('prev'),
      next=document.getElementById('next'),mask=document.getElementById('mask');

function goto(i){
  cur=Math.max(0,Math.min(i,total-1));
  track.style.transform=`translateX(-${cur*100}%)`;
  dotsEl.querySelectorAll('.dot').forEach((d,j)=>d.classList.toggle('on',j===cur));
  counter.textContent=`${cur+1}/${total}`;
  prev.disabled=cur===0;next.disabled=cur===total-1;
}
function mkdots(n){
  dotsEl.innerHTML='';
  for(let i=0;i<n;i++){
    const d=document.createElement('span');
    d.className='dot'+(i===0?' on':'');
    d.onclick=()=>goto(i);
    dotsEl.appendChild(d);
  }
}
prev.onclick=()=>goto(cur-1);next.onclick=()=>goto(cur+1);

let sx=0,drag=false,dx=0;
mask.addEventListener('mousedown',e=>{sx=e.clientX;drag=true;dx=0});
mask.addEventListener('mousemove',e=>{if(drag)dx=e.clientX-sx});
mask.addEventListener('mouseup',()=>{if(!drag)return;drag=false;if(dx<-44)goto(cur+1);else if(dx>44)goto(cur-1)});
mask.addEventListener('mouseleave',()=>{drag=false});
mask.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;drag=true;dx=0},{passive:true});
mask.addEventListener('touchmove',e=>{if(drag)dx=e.touches[0].clientX-sx},{passive:true});
mask.addEventListener('touchend',()=>{drag=false;if(dx<-44)goto(cur+1);else if(dx>44)goto(cur-1)});
document.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')goto(cur-1);if(e.key==='ArrowRight')goto(cur+1)});

(async()=>{
  try{
    const r=await fetch(`https://api.github.com/users/${INFO.username}/repos?per_page=100&sort=stars`);
    const repos=await r.json();
    const list=repos.filter(r=>r.description&&!r.fork).sort((a,b)=>b.stargazers_count-a.stargazers_count);
    if(!list.length){track.innerHTML='<div class="pcard"><p class="pdesc" style="text-align:center">No projects found.</p></div>';return}
    total=list.length;
    track.innerHTML=list.map(r=>`
      <a href="${r.html_url}" target="_blank" class="pcard" draggable="false">
        <div class="pcard-top">
          <div class="pname">${r.name}</div>
          ${r.stargazers_count>0?`<span class="pstars"><svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>${r.stargazers_count}</span>`:''}
        </div>
        <div class="pdesc">${r.description.replace(/</g,'&lt;')}</div>
      </a>`).join('');
    mkdots(total);prev.disabled=false;next.disabled=false;goto(0);
  }catch(e){
    track.innerHTML='<div class="pcard"><p style="text-align:center">Failed to load.</p></div>';
  }
})();

function cp(txt){
  navigator.clipboard.writeText(txt).catch(()=>{
    const t=document.createElement('textarea');
    t.value=txt;t.style.cssText='position:fixed;opacity:0';
    document.body.appendChild(t);t.select();document.execCommand('copy');t.remove();
  });
  const toast=document.getElementById('toast');
  toast.classList.add('on');setTimeout(()=>toast.classList.remove('on'),2000);
}
