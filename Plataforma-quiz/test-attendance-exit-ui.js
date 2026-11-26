'use strict';
const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
(async()=>{
 const elements={},node=()=>({hidden:false,disabled:false,required:false,value:'',textContent:'',append(){},querySelectorAll(){return [];}}),get=k=>elements[k]??=node();
 const stage=node(),exitOption=node(),company=node(),participant=node(),button=node();stage.value='entry';stage.querySelector=()=>exitOption;participant.value='p1';const form=get('#public-form');form.hidden=true;form.elements={stage,companyId:company,participantId:participant};form.querySelector=()=>button;
 let current={status:'open',exitAllowed:false},poll;
 const context=vm.createContext({document:{querySelector:get,createElement:node,addEventListener(){},hidden:false},window:{addEventListener(){}},location:{hash:'#test'},fetch:async url=>({ok:true,json:async()=>url.includes('branding')?{}:url.includes('/info')?{...current,title:'NR 12',trainings:['NR 12'],category:'Online',date:'2026-11-26',mode:'roster',participants:[{id:'p1',name:'Pessoa Teste',companyId:'company'}],companies:[{id:'company',name:'Empresa Teste'}]}:current}),setInterval(fn,ms){assert.equal(ms,10000);poll=fn;return 1;},clearInterval(){},encodeURIComponent,Date});
 vm.runInContext(fs.readFileSync('public/attendance-public.js','utf8'),context);await new Promise(setImmediate);assert(poll);assert.equal(form.hidden,false);assert.equal(get('#public-stage-label').hidden,true);assert.equal(exitOption.disabled,true);assert.equal(button.textContent,'Confirmar entrada');
 current={status:'open',exitAllowed:true};await poll();assert.equal(get('#public-stage-label').hidden,false);assert.equal(exitOption.disabled,false);assert.equal(exitOption.hidden,false);stage.value='exit';stage.onchange();assert.equal(button.textContent,'Confirmar saída');
 current={status:'open',exitAllowed:false};await poll();assert.equal(get('#public-stage-label').hidden,true);assert.equal(exitOption.disabled,true);assert.equal(stage.value,'entry');assert.equal(button.textContent,'Confirmar entrada');
 current={status:'archived',exitAllowed:false};await poll();assert.equal(form.hidden,true);console.log('PASSOU: interface pública simulada oculta saída, libera via consulta, bloqueia novamente e encerra formulário.');
})().catch(e=>{console.error(e);process.exitCode=1;});
