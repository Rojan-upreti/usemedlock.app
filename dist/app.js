(() => {
  const siteHeader = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const setMenu = open => {
    siteHeader.classList.toggle('menu-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
  };
  menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
  document.querySelectorAll('.nav-menu a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  addEventListener('resize', () => { if (innerWidth > 820) setMenu(false); });

  const stage = document.querySelector('#stage'), track = document.querySelector('.track');
  const canvas = document.querySelector('#pixels'), ui = document.querySelector('#overlay');
  const ctx = canvas.getContext('2d'), ux = ui.getContext('2d');
  const words = [...document.querySelectorAll('h1 > span, h1 > strong')];
  const contribution = document.querySelector('#about'), integrations = document.querySelector('#solution'), grid = document.querySelector('.grid'), cue = document.querySelector('#cue');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let d=1,W=0,H=0,p=0,target=0,mx=-1000,my=-1000,rx=-1000,ry=-1000,rr=0,tr=0,startedAt=0;
  const mascot = new Image(); mascot.src = './medlock.png';
  document.querySelectorAll('.brand-set img').forEach(img=>{img.onerror=()=>{if(img.dataset.fallback)return;img.dataset.fallback='true';img.src=`https://logo.clearbit.com/${img.dataset.domain}?size=96`}});
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)); const ease=t=>{t=clamp(t);return t*t*(3-2*t)};
  const hash=(x,y)=>(((x*73856093)^(y*19349663))>>>0)%1000/1000;
  const resize=()=>{d=devicePixelRatio||1;W=stage.clientWidth;H=stage.clientHeight;[canvas,ui].forEach(c=>{c.width=W*d;c.height=H*d});}; addEventListener('resize',resize);resize();
  // The mascot's own image tiles scatter only inside its original footprint, then fade as the page appears.
  function drawFigure(){ctx.setTransform(d,0,0,d,0,0);ctx.clearRect(0,0,W,H);if(!mascot.complete||!mascot.naturalWidth)return;const side=Math.min(W*.58,H*.68),ox=W/2-side/2,oy=H/2-side/2;if(p<.004){ctx.drawImage(mascot,ox,oy,side,side);return}const step=10,scale=side/mascot.naturalWidth;for(let sy=0;sy<mascot.naturalHeight;sy+=step)for(let sx=0;sx<mascot.naturalWidth;sx+=step){let q=clamp(p*1.5-hash(sx*3+1,sy*5+2)*.5);q=ease(q);if(q>.995)continue;const a=hash(sx,sy)*Math.PI*2,dist=q*(.015+hash(sy+7,sx+3)*.13)*side;ctx.globalAlpha=1-q*.92;ctx.drawImage(mascot,sx,sy,step,step,ox+sx*scale+Math.cos(a)*dist,oy+sy*scale+Math.sin(a)*dist,step*scale*(1-q*.34),step*scale*(1-q*.34));}ctx.globalAlpha=1}
  function line(x1,y1,x2,y2,c){ux.strokeStyle=c;ux.beginPath();ux.moveTo(x1+.5,y1+.5);ux.lineTo(x2+.5,y2+.5);ux.stroke()}
  function drawUI(){ux.setTransform(d,0,0,d,0,0);ux.clearRect(0,0,W,H);rx+=(mx-rx)*.35;ry+=(my-ry)*.35;rr+=(tr-rr)*.16;const hv=ease((p-.4)/.15),vis=1-hv;if(rr<2||vis<.01)return;ux.globalAlpha=vis;for(let x=0;x<W;x+=24)line(x,0,x,H,x%120?'#ff500017':'#ff500030');for(let y=0;y<H;y+=24)line(0,y,W,y%120?'#ff500017':'#ff500030');ux.strokeStyle='#1f3bff99';line(rx,0,rx,H,'#1f3bff99');line(0,ry,W,ry,'#1f3bff99');ux.strokeStyle='#1f3bff';ux.strokeRect(W*.31,H*.23,W*.38,H*.55);ux.fillStyle='#1f3bff';ux.fillRect(W*.31,H*.20,82,16);ux.fillStyle='#fff';ux.font='700 9px Space Mono';ux.fillText('Asha Iyer',W*.31+6,H*.20+11);ux.globalCompositeOperation='destination-in';const g=ux.createRadialGradient(rx,ry,0,rx,ry,rr*(1+p*.9));g.addColorStop(0,'#000');g.addColorStop(.7,'#000d');g.addColorStop(1,'#0000');ux.fillStyle=g;ux.fillRect(0,0,W,H);ux.globalCompositeOperation='source-over';ux.globalAlpha=1}
  function dom(){
    const navReady = reduced || p > .96;
    siteHeader.classList.toggle('nav-ready', navReady);
    siteHeader.inert = !navReady;
    siteHeader.setAttribute('aria-hidden', String(!navReady));
    words.forEach((e,i)=>{const k=ease((p-.4-i*.022)/.2);e.style.opacity=k;e.style.transform=`translateY(${(1-k)*22}px) scale(${.82+.18*k})`});
    grid.style.opacity=ease((p-.4)/.15);
    const k=ease((p-.82)/.16);
    contribution.style.opacity=k;
    contribution.style.transform=`translateY(${(1-k)*16}px)`;
    const m=ease((p-.72)/.2);
    integrations.style.opacity=m;
    integrations.style.transform=`translateY(${(1-m)*12}px)`;
    cue.style.opacity=1-ease(p/.12);
  }
  stage.onpointermove=e=>{const r=stage.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top;if(rr<2){rx=mx;ry=my}tr=240};stage.onpointerleave=()=>tr=0;
  function loop(ts){const r=track.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight){if(!startedAt)startedAt=ts;const elapsed=(ts-startedAt)/1000;const scrollTarget=reduced?0:clamp(-r.top/Math.max(1,track.offsetHeight-H));const autoTarget=elapsed<3?ease(elapsed/3):1;target=Math.max(scrollTarget,autoTarget);p+=(target-p)*.16;if(Math.abs(target-p)<.002)p=target;drawFigure(ts);drawUI();dom()}requestAnimationFrame(loop)}requestAnimationFrame(loop);
})();
