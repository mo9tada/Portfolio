// Intro loading screen. Plain HTML + CSS + one inline script, so it paints with the
// first byte of HTML and never waits for the JS bundle. It is only shown when the
// <head> script adds `html.loading` (no JS → no loader, nothing can get stuck).
//
// The markup goes in via dangerouslySetInnerHTML because the inline script updates
// it before React hydrates; React leaves innerHTML alone, so there's no mismatch.

const name = "MOKTADA ZAIDI";

const letters = name
  .split("")
  .map((ch, i) => `<span style="animation-delay:${0.25 + i * 0.045}s">${ch === " " ? "&nbsp;" : ch}</span>`)
  .join("");

const markup = `
<div class="ld-glow"></div>
<div class="ld-content">
  <div class="ld-emblem">
    <div class="ld-arc ld-arc-a"></div>
    <div class="ld-arc ld-arc-b"></div>
    <div class="ld-orbit"><i></i><i></i><i></i></div>
    <div class="ld-core">MZ</div>
  </div>
  <p class="ld-name">${letters}</p>
  <div class="ld-meter">
    <div class="ld-track"><div class="ld-bar" data-ld-bar></div></div>
    <div class="ld-meta">
      <span class="ld-status"><b>&gt;</b> <span data-ld-status>booting interface</span><em class="caret">_</em></span>
      <span class="ld-pct"><span data-ld-pct>0</span>%</span>
    </div>
  </div>
</div>
<span class="sr-only">Loading</span>`;

// Drives the counter from real page progress: eases toward 90% while resources load,
// completes after `load` (respecting a short minimum), then hands over to the site.
// It also holds while the home hero's WebGL scene is still rendering: hero-visual.tsx
// marks it data-scene="pending" until it reports "ready" (or "off" on devices that keep
// the CSS orb), so the 3D is already on screen when the loader lifts — on phones too.
// CAP bounds that wait so a slow network never traps anyone behind the loader.
const script = `(function(){
var d=document.documentElement,el=document.getElementById('loader');
if(!el||!d.classList.contains('loading'))return;
var pct=el.querySelector('[data-ld-pct]'),bar=el.querySelector('[data-ld-bar]'),st=el.querySelector('[data-ld-status]');
var msgs=[[0,'booting interface'],[28,'loading projects'],[55,'rendering 3D scene'],[82,'polishing pixels'],[100,'ready']];
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var repeat=false;try{repeat=sessionStorage.getItem('ld-seen')==='1'}catch(e){}
var MIN=reduce?250:(repeat?550:1100),CAP=8000,t0=performance.now(),last=t0,loaded=document.readyState==='complete',shown=0,target=0,msg='';
addEventListener('load',function(){loaded=true});
setTimeout(function(){loaded=true;MIN=0},5000);
function ease(k,f){return 1-Math.pow(1-k,f)}
function frame(t){
  // f = elapsed time in 60fps frames: a phone busy rendering the 3D scene underneath
  // drops frames, and the counter still advances on time instead of crawling.
  var f=Math.max(0,Math.min((t-last)/16.7,30));last=t;
  var base=loaded&&t-t0>=MIN;
  var held=base&&!reduce&&t-t0<CAP&&!!document.querySelector('[data-scene="pending"]');
  var ready=base&&!held,ceil=held?97:90;
  target=ready?100:Math.min(ceil,target+(ceil-target)*ease(held?0.008:0.025,f)+(held?0:0.2*f));
  shown+=(target-shown)*ease(ready?0.2:0.1,f);
  if(ready&&100-shown<0.6)shown=100;
  var p=Math.round(shown),next=msg;pct.textContent=p;bar.style.transform='scaleX('+(shown/100)+')';
  if(held)next='rendering 3D scene';else for(var i=msgs.length-1;i>=0;i--){if(p>=msgs[i][0]){next=msgs[i][1];break}}
  if(next!==msg){msg=next;st.textContent=msg}
  if(shown===100){setTimeout(done,reduce?0:180);return}
  requestAnimationFrame(frame);
}
function done(){
  d.classList.add('loaded');d.classList.remove('loading');
  try{sessionStorage.setItem('ld-seen','1')}catch(e){}
}
requestAnimationFrame(frame);
})();`;

export function LoadingScreen() {
  return (
    <>
      <div id="loader" role="status" aria-live="polite" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: markup }} />
      <script dangerouslySetInnerHTML={{ __html: script }} />
    </>
  );
}
