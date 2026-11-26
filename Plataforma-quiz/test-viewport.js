'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const handlers=new Map();let time=1000;
const document={addEventListener(type,fn,options){assert.equal(options.capture,true);if(type!=='touchcancel')assert.equal(options.passive,false);handlers.set(type,fn);}};
vm.runInNewContext(fs.readFileSync('public/viewport.js','utf8'),{document,performance:{now:()=>time},Math});
const point=(x,y)=>({clientX:x,clientY:y});const a=point(10,10),b=point(20,20);
const surface={closest:()=>null};
function emit(type,props={}){let prevented=false;handlers.get(type)({cancelable:true,target:surface,preventDefault(){prevented=true;},...props});return prevented;}
assert(emit('gesturestart'));assert(emit('gesturechange'));assert(emit('gestureend'));
assert(emit('touchstart',{touches:[a,b]}));assert(emit('touchmove',{touches:[a,b]}));
assert(!emit('touchstart',{touches:[a]}));assert(!emit('touchmove',{touches:[point(10,80)]}));assert(!emit('touchend',{touches:[],changedTouches:[point(10,80)]}));
function tap(target){emit('touchstart',{touches:[a]});return emit('touchend',{touches:[],changedTouches:[a],...(target?{target}:{})});}
assert(!tap());time+=200;assert(tap());time+=500;assert(!tap());
const editable={closest:()=>true};time+=200;assert(!tap(editable));time+=200;assert(!tap(editable));
assert(emit('wheel',{ctrlKey:true}));assert(emit('wheel',{metaKey:true}));assert(!emit('wheel'));assert(!emit('wheel',{ctrlKey:true,cancelable:false}));
assert(emit('keydown',{ctrlKey:true,key:'+'}));assert(emit('keydown',{metaKey:true,key:'-'}));assert(!emit('keydown',{ctrlKey:true,key:'0'}));assert(!emit('keydown',{ctrlKey:true,key:'c'}));
for(const f of ['index','race','team']){const html=fs.readFileSync(`public/${f}.html`,'utf8');assert.match(html,/maximum-scale=1, user-scalable=no/);assert.match(html,/\/release-v64\/viewport\.js/);assert.match(html,/\/release-v64\/viewport\.css/);}
assert.match(fs.readFileSync('server.js','utf8'),/['"]\/viewport\.js['"]\s*:\s*['"]viewport\.js['"]/);
console.log('PASSOU: gestos canceláveis, toque duplo, roda, atalhos, rolagem, edição e inclusão nas três páginas.');
