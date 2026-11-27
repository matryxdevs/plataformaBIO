'use strict';
const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
(async()=>{
 const nodes=new Map(),calls=[],transforms=[],stopped=[],events={};let facing='user',streamNo=0;
 const context={save(){transforms.push('save')},restore(){transforms.push('restore')},translate(...v){transforms.push(['translate',...v])},scale(...v){transforms.push(['scale',...v])},drawImage(){transforms.push('draw')}};
 function node(s){if(!nodes.has(s)){const classes=new Set();nodes.set(s,{hidden:false,disabled:false,textContent:'',dataset:{},attributes:{},classList:{toggle(k,v){v?classes.add(k):classes.delete(k);},contains:k=>classes.has(k)},setAttribute(k,v){this.attributes[k]=v},videoWidth:640,videoHeight:480,play:async()=>{},getContext:()=>context,toDataURL:()=> 'data:image/jpeg;base64,'+'A'.repeat(120)});}return nodes.get(s);}
 const navigator={mediaDevices:{getUserMedia:async opts=>{assert.equal(opts.video.facingMode.ideal,'user');const id=++streamNo;return {getVideoTracks:()=>[{getSettings:()=>({facingMode:facing})}],getTracks:()=>[{stop(){stopped.push(id)}}]};}},geolocation:{getCurrentPosition(success,failure,options){calls.push({success,failure,options});}}};
 const window={addEventListener(k,v){events[k]=v;}};
 vm.runInNewContext(fs.readFileSync('public/attendance-camera.js','utf8'),{document:{querySelector:node},navigator,window});
 const api=window.attendanceCamera,open=node('#evidence-open'),mirror=node('#evidence-mirror'),video=node('#evidence-video'),capture=node('#evidence-capture'),preview=node('#evidence-preview'),loc=node('#location-open'),status=node('#location-status');
 const flush=()=>new Promise(setImmediate),ok=(i,accuracy=12)=>calls[i].success({coords:{latitude:-6.1,longitude:-49.2,accuracy}});
 assert.equal(loc.textContent,'Ativar localização');await assert.rejects(api.collect(),/selfie obrigatória/);
 await open.onclick();assert(video.classList.contains('is-mirrored'));assert.equal(mirror.hidden,false);mirror.onclick();assert(!video.classList.contains('is-mirrored'));capture.onclick();assert.deepEqual(transforms,['save','draw','restore']);assert.equal(preview.hidden,false);assert.equal(video.hidden,true);assert.equal(stopped.length,1);
 await node('#evidence-retake').onclick();transforms.length=0;capture.onclick();assert.deepEqual(transforms,['save',['translate',640,0],['scale',-1,1],'draw','restore']);
 // Explicit button, permission refusal, retry with position unavailable, fallback.
 let pending=loc.onclick();assert.equal(status.dataset.state,'loading');assert(loc.disabled);assert.equal(calls[0].options.maximumAge,0);calls[0].failure({code:1});await pending;assert.equal(status.dataset.state,'error');assert.match(status.textContent,/permissões do navegador/);assert.equal(calls.length,1);
 pending=loc.onclick();calls[1].failure({code:2});await flush();assert.equal(calls[2].options.enableHighAccuracy,false);ok(2,24);await pending;assert.equal(status.dataset.state,'ready');assert.match(status.textContent,/24 m/);assert.equal(loc.textContent,'Atualizar localização');
 // A new location is mandatory on submit, even after a successful preflight.
 let submitted=api.collect();assert.equal(calls.length,4);ok(3,7);const proof=await submitted;assert.equal(proof.location.accuracy,7);assert.match(proof.photo,/^data:image\/jpeg/);
 submitted=api.collect();calls[4].failure({code:1});await assert.rejects(submitted,/Localização bloqueada/);
 submitted=api.collect();api.reset();ok(5);await assert.rejects(submitted,/confirmação mudou/);assert.equal(status.dataset.state,'idle');assert.equal(preview.hidden,true);
 // Back camera fallback does not mirror automatically; no persistent location.
 facing='environment';await open.onclick();assert(!video.classList.contains('is-mirrored'));capture.onclick();
 pending=loc.onclick();submitted=api.collect();assert.equal(calls.length,7);ok(6);await pending;await submitted;
 // A capture changed while geolocation is pending cannot be sent as the previous photo.
 submitted=api.collect();await node('#evidence-retake').onclick();ok(7);await assert.rejects(submitted,/confirmação mudou/);
 events.pagehide();assert.equal(status.dataset.state,'idle');assert.equal(preview.hidden,true);
 const html=fs.readFileSync('public/attendance-public.html','utf8'),css=fs.readFileSync('public/attendance.css','utf8');assert.match(html,/id="location-open">Ativar localização/);assert.match(html,/id="evidence-mirror"/);assert.match(css,/is-mirrored\{transform:scaleX\(-1\)\}/);
 console.log('PASSOU V77: câmera frontal, espelhamento consistente na captura, localização explícita, recusa, retry, precisão, atualização no envio e descarte de solicitações antigas.');
})().catch(e=>{console.error(e);process.exitCode=1;});
