'use strict';
(()=>{
 const $=s=>document.querySelector(s),video=$('#evidence-video'),preview=$('#evidence-preview'),open=$('#evidence-open'),capture=$('#evidence-capture'),retake=$('#evidence-retake'),mirror=$('#evidence-mirror'),status=$('#evidence-status'),locationButton=$('#location-open'),locationStatus=$('#location-status');
 let stream=null,photo=null,generation=0,cameraGeneration=0,mirrored=true,positionPending=null;
 function setMirror(value){mirrored=value;video.classList.toggle('is-mirrored',value);mirror.setAttribute('aria-pressed',String(value));mirror.textContent=value?'Desespelhar câmera':'Espelhar câmera';}
 function stop(){if(stream)stream.getTracks().forEach(t=>t.stop());stream=null;video.srcObject=null;video.hidden=true;capture.hidden=true;mirror.hidden=true;}
 function resetCamera(){cameraGeneration++;stop();photo=null;preview.hidden=true;preview.width=0;preview.height=0;open.hidden=false;open.disabled=false;retake.hidden=true;status.textContent='Nenhuma selfie registrada.';setMirror(true);}
 function showLocation(state,message){locationStatus.dataset.state=state;locationStatus.textContent=message;locationButton.disabled=state==='loading';locationButton.textContent=state==='loading'?'Obtendo localização…':state==='ready'?'Atualizar localização':state==='error'?'Tentar ativar localização novamente':'Ativar localização';}
 function reset(){generation++;positionPending=null;resetCamera();showLocation('idle','Localização ainda não obtida.');}
 async function start(){resetCamera();const id=cameraGeneration;open.disabled=true;try{
  if(!navigator.mediaDevices?.getUserMedia)throw Error('Câmera indisponível.');
  const next=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'user'},width:{ideal:640},height:{ideal:480}},audio:false});
  if(id!==cameraGeneration){next.getTracks().forEach(t=>t.stop());return;}
  stream=next;setMirror(next.getVideoTracks?.()[0]?.getSettings?.().facingMode!=='environment');video.srcObject=stream;video.hidden=false;await video.play();if(id!==cameraGeneration)return;
  open.hidden=true;capture.hidden=false;mirror.hidden=false;status.textContent='Enquadre seu rosto. Ajuste o espelhamento se necessário; a foto ficará como na prévia.';
 }catch(e){if(id!==cameraGeneration)return;stop();status.textContent='Não foi possível abrir a câmera. Autorize a câmera e tente novamente em HTTPS.';}finally{if(id===cameraGeneration)open.disabled=false;}}
 open.onclick=start;retake.onclick=start;mirror.onclick=()=>{if(stream)setMirror(!mirrored);};
 capture.onclick=()=>{if(!stream||!video.videoWidth||!video.videoHeight){status.textContent='Aguarde a câmera iniciar.';return;}
  const factor=Math.min(1,640/Math.max(video.videoWidth,video.videoHeight));preview.width=Math.round(video.videoWidth*factor);preview.height=Math.round(video.videoHeight*factor);
  try{const ctx=preview.getContext('2d');ctx.save();try{if(mirrored){ctx.translate(preview.width,0);ctx.scale(-1,1);}ctx.drawImage(video,0,0,preview.width,preview.height);}finally{ctx.restore();}
   let quality=.8;photo=preview.toDataURL('image/jpeg',quality);while(photo.length>350000&&quality>.3){quality-=.1;photo=preview.toDataURL('image/jpeg',quality);}if(!photo.startsWith('data:image/jpeg;')||photo.length>350000)throw Error('Foto inválida.');
  }catch(e){resetCamera();status.textContent='Não foi possível preparar a foto. Tente novamente.';return;}
  stop();preview.hidden=false;retake.hidden=false;open.hidden=true;status.textContent='Selfie capturada. Confira a imagem antes de confirmar.';
 };
 function locationMessage(e){if(e?.code===1)return 'Localização bloqueada. Ative a localização nas configurações do celular e permita o acesso à localização deste site nas permissões do navegador. Depois, toque em Tentar ativar localização novamente.';if(e?.code===2)return 'Não foi possível localizar o dispositivo. Ligue a localização/GPS nas configurações do aparelho, verifique a conexão e tente novamente.';if(e?.code===3)return 'A localização demorou mais que o esperado. Verifique se o GPS está ligado, procure um local com melhor sinal e tente novamente.';return 'Localização indisponível. Abra o link em um navegador compatível, com HTTPS, e habilite a localização do aparelho.';}
 const getPosition=highAccuracy=>new Promise((resolve,reject)=>navigator.geolocation.getCurrentPosition(p=>{const location={latitude:p.coords.latitude,longitude:p.coords.longitude,accuracy:p.coords.accuracy};if(!Object.values(location).every(Number.isFinite)||Math.abs(location.latitude)>90||Math.abs(location.longitude)>180||location.accuracy<0||location.accuracy>1000000){reject({code:2});return;}resolve(location);},reject,{enableHighAccuracy:highAccuracy,maximumAge:0,timeout:highAccuracy?12000:8000}));
 function requestLocation(){if(positionPending)return positionPending;const id=generation;showLocation('loading','Obtendo a localização atual do dispositivo…');const task=(async()=>{try{
  if(!navigator.geolocation)throw Error('Localização indisponível.');let location;
  try{location=await getPosition(true);}catch(e){if(id!==generation||![2,3].includes(e?.code))throw e;location=await getPosition(false);}
  if(id!==generation)throw Error('A confirmação mudou. Obtenha a localização novamente.');
  showLocation('ready',`Localização obtida. Precisão estimada: ${Math.round(location.accuracy)} m.`);return location;
 }catch(e){if(id!==generation)throw Error('A confirmação mudou. Obtenha a localização novamente.');const message=locationMessage(e);showLocation('error',message);throw Error(message);}})();positionPending=task;task.then(()=>{if(positionPending===task)positionPending=null;},()=>{if(positionPending===task)positionPending=null;});return task;}
 locationButton.onclick=()=>requestLocation().catch(()=>{});
 window.addEventListener('pagehide',reset);
 async function collect(){if(!photo)throw Error('Capture a selfie obrigatória antes de confirmar.');const id=generation,cameraId=cameraGeneration,current=photo;
  // A confirmação exige uma posição nova; uma solicitação já em curso pode ser aproveitada.
  const location=await requestLocation();if(id!==generation||cameraId!==cameraGeneration||photo!==current)throw Error('A confirmação mudou. Capture uma nova selfie e confirme novamente.');return {photo:current,location};
 }
 window.attendanceCamera={collect,reset};reset();
})();
