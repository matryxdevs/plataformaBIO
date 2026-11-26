'use strict';
/* Real polygonal 3D geometry, projected to Canvas 2D. No GPU, CDN or library required. */
(()=>{
 const reduce=matchMedia('(prefers-reduced-motion: reduce)'),TAU=Math.PI*2;
 const add=(a,b)=>a.map((v,i)=>v+b[i]),sub=(a,b)=>a.map((v,i)=>v-b[i]),mul=(a,k)=>a.map(v=>v*k),dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],norm=a=>mul(a,1/(Math.hypot(...a)||1));
 const rgb=h=>{let s=String(h).trim().replace('#','');if(!/^[0-9a-f]{6}$/i.test(s))s='54e8a4';return [0,2,4].map(i=>parseInt(s.slice(i,i+2),16));};
 const cache=new Map(),observed=new WeakSet(),animations=new WeakMap();
 function render(color,phase,quality,hero){
  const size=hero?420:150,key=[color,phase,quality,hero].join(':');if(cache.has(key))return cache.get(key);
  const c=document.createElement('canvas');c.width=c.height=size;const ctx=c.getContext('2d');if(!ctx)return c;
  const faces=[],light=norm([-0.25,0.85,0.55]),view=norm([.64,.10,.86]),right=norm([view[2],0,-view[0]]),up=norm(cross(view,right));
  const accent=rgb(color),metal=[29,46,57],dark=[12,22,29],white=[205,233,232],visor=[11,38,51],gold=[227,188,102];
  const steps=quality?18:10,rings=quality?12:7;
  function face(a,b,d,col){let n=norm(cross(sub(b,a),sub(d,a)));let center=mul(add(add(a,b),d),1/3);if(dot(n,view)<=0)return;let intensity=.31+.65*Math.max(0,dot(n,light))+.13*Math.pow(1-Math.max(0,dot(n,view)),2);let spec=Math.pow(Math.max(0,dot(n,norm(add(light,view)))),15)*42;let fill=col.map(v=>Math.min(255,Math.round(v*intensity+spec)));faces.push({p:[a,b,d],z:dot(center,view),fill:`rgb(${fill.join(',')})`});}
  function ell(center,rad,col,axes){const base=axes||[[1,0,0],[0,1,0],[0,0,1]],pt=(t,p)=>add(center,add(add(mul(base[0],rad[0]*Math.sin(t)*Math.cos(p)),mul(base[1],rad[1]*Math.cos(t))),mul(base[2],rad[2]*Math.sin(t)*Math.sin(p))));for(let j=0;j<rings;j++)for(let i=0;i<steps;i++){let t=j*Math.PI/rings,u=(j+1)*Math.PI/rings,p=i*TAU/steps,q=(i+1)*TAU/steps;let a=pt(t,p),b=pt(u,p),d=pt(u,q),e=pt(t,q); // orient outward using center
    const f=(v,w,x)=>{if(dot(cross(sub(w,v),sub(x,v)),sub(v,center))<0)face(v,x,w,col);else face(v,w,x,col);};f(a,b,d);f(a,d,e);}}
  function limb(a,b,r1,r2,col){const axis=norm(sub(b,a)),x=norm(cross(axis,Math.abs(axis[2])<.9?[0,0,1]:[1,0,0])),z=norm(cross(x,axis));ell(mul(add(a,b),.5),[(r1+r2)/2,Math.hypot(...sub(a,b))*.61,(r1+r2)/2],col,[x,axis,z]);}
  const cycle=phase/8*TAU,sw=Math.sin(cycle),other=-sw,bob=phase===0?0:Math.abs(sw)*.04;
  const hip=[-.12,1.02+bob,0],chest=[.09,1.46+bob,0],head=[.23,1.79+bob,0];
  // Boots, articulated legs, elbow joints and torso are actual 3D ellipsoids with independent axes.
  for(const side of [-1,1]){const s=side===1?sw:other,z=side*.105,hh=add(hip,[0,0,z]),k=[-.12+.28*s,.57+bob,z],foot=[-.12-.30*s,.17+Math.max(0,-s)*.19,z];limb(hh,k,.104,.084,metal);ell(k,[.102,.09,.105],accent);limb(k,foot,.075,.06,dark);ell(add(foot,[.09,-.03,0]),[.166,.077,.098],metal);ell(add(foot,[.115,-.068,0]),[.146,.03,.101],white);}
  ell(hip,[.174,.17,.17],metal);limb(hip,chest,.18,.22,accent);ell([.055,1.37+bob,0],[.22,.28,.18],accent);ell([.235,1.40+bob,0],[.044,.125,.114],white);ell([.211,1.16+bob,0],[.055,.07,.12],dark);
  for(const side of [-1,1]){const s=side===1?other:sw,z=side*.207,shoulder=[.07,1.46+bob,z],elbow=[.07+.25*s,1.19+bob,z*1.1],fist=[.30+.25*s,1.27+bob,z*1.1];ell(shoulder,[.11,.117,.115],accent);limb(shoulder,elbow,.084,.07,metal);ell(elbow,[.078,.076,.079],dark);limb(elbow,fist,.064,.054,white);ell(fist,[.076,.075,.069],dark);}
  ell([.17,1.61+bob,0],[.08,.10,.085],metal);ell(head,[.171,.193,.153],metal);ell([.285,1.81+bob,0],[.115,.126,.143],accent);ell([.355,1.81+bob,0],[.071,.079,.139],visor);ell([.407,1.836+bob,0],[.021,.018,.108],[114,255,218]);ell([.16,1.92+bob,0],[.095,.05,.125],white);
  const scale=size*.43,origin=[size*.45,size*.92];function proj(p){return [origin[0]+dot(p,right)*scale,origin[1]-dot(p,up)*scale];}
  const shadow=ctx.createRadialGradient(size*.49,size*.91,0,size*.49,size*.91,size*.34);shadow.addColorStop(0,'rgba(0,0,0,.55)');shadow.addColorStop(1,'rgba(0,0,0,0)');ctx.save();ctx.translate(size*.49,size*.91);ctx.scale(1,.25);ctx.translate(-size*.49,-size*.91);ctx.fillStyle=shadow;ctx.fillRect(0,0,size,size);ctx.restore();
  faces.sort((a,b)=>a.z-b.z);for(const f of faces){const a=f.p.map(proj);ctx.beginPath();ctx.moveTo(...a[0]);ctx.lineTo(...a[1]);ctx.lineTo(...a[2]);ctx.closePath();ctx.fillStyle=f.fill;ctx.strokeStyle=f.fill;ctx.lineWidth=.55;ctx.fill();ctx.stroke();}
  if(cache.size>=96)cache.delete(cache.keys().next().value);cache.set(key,c);return c;
 }
 function draw(el,phase=1){if(!el?.isConnected)return;const hero=el.dataset.avatar==='hero',color=el.dataset.color||getComputedStyle(el).getPropertyValue('--runner-color').trim()||'#56e9aa';const img=render(color,phase,hero,hero);const ctx=el.getContext('2d');if(!ctx)return;el.width=img.width;el.height=img.height;ctx.clearRect(0,0,el.width,el.height);ctx.drawImage(img,0,0);}
 function drawNew(el){if(!observed.has(el)&&el.isConnected){observed.add(el);draw(el);}}
 function scan(){document.querySelectorAll('canvas[data-avatar]').forEach(drawNew);}
 function advance(actor){const el=actor?.querySelector('canvas[data-avatar]');if(!el)return;scan();if(reduce.matches){draw(el);return;}const prev=animations.get(el);if(prev)clearInterval(prev);let frame=0;const id=setInterval(()=>{if(!el.isConnected||++frame>12){clearInterval(id);animations.delete(el);draw(el);return;}draw(el,frame%8);},80);animations.set(el,id);}
 window.ArenaFX={advance,scan};
 const start=()=>{scan();new MutationObserver(records=>{for(const record of records)for(const node of record.addedNodes){if(node.nodeType!==1)continue;if(node.matches('canvas[data-avatar]'))drawNew(node);node.querySelectorAll('canvas[data-avatar]').forEach(drawNew);}}).observe(document.body,{childList:true,subtree:true});};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
