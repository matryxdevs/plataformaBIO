'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),net=require('node:net'),{spawn}=require('node:child_process');
const {phoneNumber}=require('./registration');assert.equal(phoneNumber('(94) 99999-1234'),'+5594999991234');assert.equal(phoneNumber('+55 94 99999-1234'),'+5594999991234');assert.equal(phoneNumber('123'),null);
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'bq-reg-'));let child,base;
async function stop(){if(child?.exitCode===null){child.kill();await new Promise(r=>child.once('exit',r));}}
async function start(enabled){const n=net.createServer();await new Promise(r=>n.listen(0,'127.0.0.1',r));const port=n.address().port;await new Promise(r=>n.close(r));base='http://127.0.0.1:'+port;child=spawn(process.execPath,['server.js'],{env:{...process.env,NODE_ENV:'test',STORAGE_DRIVER:'json',PORT:String(port),DATA_DIR:dir,ADMIN_LOGIN:'admin',ADMIN_PASSWORD:'BackupTest!2026',COOKIE_SECURE:'false',SELF_REGISTRATION:String(enabled)},stdio:'ignore'});for(let i=0;i<100;i++){try{if((await(await fetch(base+'/health')).json()).ready)return;}catch{}await new Promise(r=>setTimeout(r,40));}throw Error('Não iniciou');}
async function req(url,status=200,data,cookie){const r=await fetch(base+url,{headers:{...(data!==undefined?{'Content-Type':'application/json'}:{}),...(cookie?{Cookie:cookie}:{})},...(data!==undefined?{method:'POST',body:JSON.stringify(data)}:{})});const v=await r.json();assert.equal(r.status,status,url+' '+JSON.stringify(v).slice(0,200));return {body:v,cookie:r.headers.get('set-cookie')?.split(';')[0]};}
(async()=>{try{
 await start(false);assert.equal((await req('/api/registration/config')).body.enabled,false);
 const form={name:'Aluno teste',login:'novo.aluno',companyStatus:'company',password:'SenhaTeste!1',phone:'(94) 99999-1234',acceptPhone:true,educationStatus:'Cursando atualmente',educationGrade:'2º ano do Ensino Médio',technicalInterest:'Técnico em Segurança do Trabalho',role:'admin',phoneVerifiedAt:'2026-01-01'};
 await req('/api/registration/create',503,form);await stop();await start(true);
 assert.equal((await req('/api/registration/config')).body.enabled,true);
 const admin=(await req('/api/login',200,{login:'admin',password:'BackupTest!2026'})).cookie;
 assert.deepEqual((await req('/api/registration/config')).body.companies,[]);
 await req('/api/registration/create',400,{...form,company:'Empresa inventada'});
 const active=(await req('/api/attendance/companies/create',201,{name:'Empresa Ativa'},admin)).body;
 const inactive=(await req('/api/attendance/companies/create',201,{name:'Empresa Inativa'},admin)).body;
 await req('/api/attendance/companies/status',200,{id:inactive.id,active:false},admin);
 assert.deepEqual((await req('/api/registration/config')).body.companies,[{id:active.id,name:active.name}]);
 form.companyId=active.id;
 await req('/api/registration/create',400,{...form,companyStatus:undefined});
 await req('/api/registration/create',400,{...form,companyId:'inventada'});
 await req('/api/registration/create',400,{...form,companyId:inactive.id});
 await req('/api/registration/create',400,{...form,companyStatus:'none'});
 form.company='Nome falsificado';

 await req('/api/registration/create',400,{...form,phone:''});await req('/api/registration/create',400,{...form,phone:'123'});await req('/api/registration/create',400,{...form,acceptPhone:false});await req('/api/registration/create',400,{...form,password:'short'});
 await req('/api/registration/create',400,{...form,educationStatus:''});await req('/api/registration/create',400,{...form,educationStatus:'invalido'});await req('/api/registration/create',400,{...form,educationGrade:''});await req('/api/registration/create',400,{...form,technicalInterest:''});await req('/api/registration/create',400,{...form,technicalInterest:'x'.repeat(151)});
 await req('/api/registration/start',404,form);await req('/api/registration/confirm',404,{challenge:'123',code:'123456'});
 const user=(await req('/api/registration/create',201,form)).cookie;assert(user);
 const me=(await req('/api/me',200,undefined,user)).body;assert.equal(me.role,'student');assert.equal(me.company,active.name);assert.equal(me.companyId,active.id);assert.equal(me.companyStatus,'company');assert.equal(me.phone,'+5594999991234');assert.equal(me.phoneVerifiedAt,null);assert(!me.password);assert.equal(me.educationStatus,form.educationStatus);assert.equal(me.educationGrade,form.educationGrade);assert.equal(me.technicalInterest,form.technicalInterest);
 await req('/api/courses',200,undefined,user);await req('/api/registration/create',409,{...form,login:'outro'});await req('/api/registration/create',409,{...form,phone:'94988881234'});
 const list=(await req('/api/admin/users',200,undefined,admin)).body;assert.equal(list.find(u=>u.id===me.id).phoneVerifiedAt,null);assert.equal(list.find(u=>u.id===me.id).technicalInterest,form.technicalInterest);assert.equal(list.find(u=>u.role==='admin').educationStatus,null);
 const opt=(await req('/api/registration/create',201,{...form,login:'sem.escola',phone:'94988881235',companyStatus:'none',companyId:undefined,educationStatus:'Nenhuma série concluída',educationGrade:'ignored',technicalInterest:'Ainda não decidi'})).cookie;const noCompany=(await req('/api/me',200,undefined,opt)).body;assert.equal(noCompany.educationGrade,null);assert.equal(noCompany.company,'');assert.equal(noCompany.companyStatus,'none');assert.equal(noCompany.companyId,null);
 const unknown=(await req('/api/registration/create',201,{...form,login:'sem.info',phone:'94988881236',companyStatus:'unknown',companyId:undefined})).cookie;assert.equal((await req('/api/me',200,undefined,unknown)).body.companyStatus,'unknown');
 await req('/api/attendance/companies/status',200,{id:active.id,active:false},admin);
 await req('/api/registration/create',400,{...form,login:'depois',phone:'94988881237'});
 assert.deepEqual((await req('/api/registration/config')).body.companies,[]);
 assert.equal((await req('/api/me',200,undefined,user)).body.company,active.name);

 const csv=await fetch(base+'/api/admin/education.csv',{headers:{Cookie:admin}});assert.equal(csv.status,200);const csvText=await csv.text();assert(csvText.includes(form.technicalInterest));assert(csvText.includes('Empresa Ativa'));assert(csvText.includes('Sem vínculo com empresa'));assert(csvText.includes('Não sabe informar'));assert(!csvText.includes(form.password));assert.equal((await fetch(base+'/api/admin/education.csv',{headers:{Cookie:user}})).status,403);await req('/api/admin/users',403,undefined,user);
 assert.equal((await req('/api/admin/marketing-contacts',200,undefined,admin)).body.length,0);
 await req('/api/logout',200,{},user);const login=(await req('/api/login',200,{login:form.login,password:form.password})).cookie;
 await req('/api/admin/users/access',200,{id:me.id,action:'block'},admin);await req('/api/me',401,undefined,login);await stop();await start(true);await req('/api/login',403,{login:form.login,password:form.password});
 const backup=(await req('/api/admin/backup.json',200,undefined,admin)).body;assert.equal(backup.users.find(u=>u.id===me.id).phoneVerifiedAt,null);assert.equal(backup.users.find(u=>u.id===me.id).companyId,active.id);assert.equal(backup.users.find(u=>u.id===me.id).company,active.name);assert.equal(backup.users.find(u=>u.id===me.id).educationGrade,form.educationGrade);assert.equal(backup.users.find(u=>u.id===me.id).technicalInterest,form.technicalInterest);assert(!JSON.stringify(backup).includes(form.password));
 console.log('PASSOU: cadastro sem SMS, telefone obrigatório, sem falso status verificado, conta de aluno, duplicidade, proteção, backup e persistência.');
 }finally{await stop();fs.rmSync(dir,{recursive:true,force:true});}})().catch(e=>{console.error(e);process.exitCode=1;});
