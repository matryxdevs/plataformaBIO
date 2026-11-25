'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),net=require('node:net'),{spawn}=require('node:child_process');
const {today,status}=require('./attendance');
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'bq-att-'));let child,base;
async function stop(){if(child?.exitCode===null){child.kill();await new Promise(r=>child.once('exit',r));}}
async function start(enabled){const n=net.createServer();await new Promise(r=>n.listen(0,'127.0.0.1',r));const port=n.address().port;await new Promise(r=>n.close(r));base='http://127.0.0.1:'+port;child=spawn(process.execPath,['server.js'],{env:{...process.env,NODE_ENV:'test',STORAGE_DRIVER:'json',PORT:String(port),DATA_DIR:dir,ADMIN_LOGIN:'admin',ADMIN_PASSWORD:'BackupTest!2026',COOKIE_SECURE:'false',SELF_REGISTRATION:String(enabled)},stdio:'ignore'});for(let i=0;i<100;i++){try{if((await(await fetch(base+'/health')).json()).ready)return;}catch{}await new Promise(r=>setTimeout(r,40));}throw Error('Não iniciou');}
async function req(url,status=200,data,cookie){const r=await fetch(base+url,{headers:{...(data!==undefined?{'Content-Type':'application/json'}:{}),...(cookie?{Cookie:cookie}:{})},...(data!==undefined?{method:'POST',body:JSON.stringify(data)}:{})});const v=await r.json();assert.equal(r.status,status,url+' '+JSON.stringify(v).slice(0,200));return {body:v,cookie:r.headers.get('set-cookie')?.split(';')[0]};}
(async()=>{try{
 assert.equal(today(new Date('2026-11-25T01:00:00Z')),'2026-11-24');assert.equal(status({date:'2026-11-24'},'2026-11-25'),'expired');
 await start(true);const admin=(await req('/api/login',200,{login:'admin',password:'BackupTest!2026'})).cookie;
 for(const [login,company,role] of [['aluno1','Turma A','student'],['aluno2','Turma B','student'],['instrutor','Turma A','instructor']])await req('/api/students',201,{name:login,login,company,role,password:'SenhaTeste!1'},admin);
 const login=async l=>(await req('/api/login',200,{login:l,password:'SenhaTeste!1'})).cookie;const a=await login('aluno1'),b=await login('aluno2'),i=await login('instrutor');
 const date=today();const tomorrow=today(new Date(Date.now()+86400000));await req('/api/attendance/create',400,{title:'Inválido',date:'2026-02-30'},admin);await req('/api/attendance/create',403,{title:'Sem permissão',date},a);await req('/api/attendance/admin',403,undefined,i);await req('/api/attendance',401);
 const create=async(title,date,company='')=>(await req('/api/attendance/create',201,{title,date,company},admin)).body.id;
 const id=await create('NR-35',date,' turma a '),future=await create('NR-12',tomorrow),all=await create('NR-22',date);
 assert.deepEqual((await req('/api/attendance',200,undefined,a)).body.lists.map(l=>l.id).sort(),[id,all].sort());assert.deepEqual((await req('/api/attendance',200,undefined,b)).body.lists.map(l=>l.id),[all]);await req('/api/attendance/mark',403,{id},b);await req('/api/attendance/mark',403,{id:future},a);await req('/api/attendance/detail?id='+id,403,undefined,a);
 const one=await req('/api/attendance/mark',201,{id,uid:999,at:'2000-01-01'},a);const duplicate=await req('/api/attendance/mark',200,{id},a);assert.equal(duplicate.body.presentAt,one.body.presentAt);assert.equal(duplicate.body.already,true);await req('/api/attendance/mark',201,{id:all},b);
 const detail=(await req('/api/attendance/detail?id='+id,200,undefined,admin)).body;assert.equal(detail.entries.length,1);assert.equal(detail.entries[0].login,'aluno1');assert.notEqual(detail.entries[0].uid,999);assert.equal(detail.entries[0].at,one.body.presentAt);assert(!Object.hasOwn(detail.entries[0],'password'));
 await req('/api/attendance/close',200,{id:all},admin);await req('/api/attendance/mark',403,{id:all},a);await req('/api/attendance/close',200,{id},admin);assert.equal((await req('/api/attendance/detail?id='+id,200,undefined,admin)).body.status,'archived');
 const csv=await fetch(base+'/api/attendance/export.csv?id='+id,{headers:{Cookie:admin}});assert.equal(csv.status,200);assert((await csv.text()).includes('aluno1'));assert.equal((await fetch(base+'/api/attendance/export.csv?id='+id,{headers:{Cookie:a}})).status,403);
 const backup=(await req('/api/admin/backup.json',200,undefined,admin)).body;assert.equal(backup.attendance.length,3);assert.equal(backup.attendance.find(l=>l.id===id).entries[0].login,'aluno1');
 // V37: explicit company selection.
 await req('/api/attendance/create',400,{title:'Sem empresas',date,companyId:''},admin);
 await req('/api/attendance/companies/create',403,{name:'Empresa'},a);
 await req('/api/attendance/companies/create',403,{name:'Empresa'},i);
 const c1=(await req('/api/attendance/companies/create',201,{name:'Mineração A'},admin)).body;
 const c2=(await req('/api/attendance/companies/create',201,{name:'Empresa B'},admin)).body;
 await req('/api/attendance/companies/create',409,{name:' mineracao   a '},admin);
 const multi=(await req('/api/attendance/create',201,{title:'Treinamento geral',date,companyId:''},admin)).body.id;
 const specific=(await req('/api/attendance/create',201,{title:'Treinamento específico',date,companyId:c1.id},admin)).body.id;
 const available=(await req('/api/attendance',200,undefined,b)).body.lists;
 assert.equal(available.find(l=>l.id===multi).companies.length,2);
 assert.deepEqual(available.find(l=>l.id===specific).companies,[{id:c1.id,name:c1.name}]);
 await req('/api/attendance/mark',400,{id:multi},a);
 await req('/api/attendance/mark',400,{id:specific,companyId:c2.id},a);
 await req('/api/attendance/mark',400,{id:multi,companyId:'inventada'},a);
 await req('/api/attendance/mark',201,{id:multi,companyId:c1.id,company:'Nome falsificado'},a);
 await req('/api/attendance/mark',200,{id:multi,companyId:c2.id},a);
 await req('/api/attendance/companies/status',200,{id:c1.id,active:false},admin);
 await req('/api/attendance/mark',400,{id:specific,companyId:c1.id},b);
 await req('/api/attendance/mark',400,{id:multi,companyId:c1.id},b);
 await req('/api/attendance/mark',201,{id:multi,companyId:c2.id},b);
 const detailMulti=(await req('/api/attendance/detail?id='+multi,200,undefined,admin)).body;
 assert.deepEqual(detailMulti.entries.map(e=>e.company),[c1.name,c2.name]);
 assert.equal(detailMulti.entries[0].companyId,c1.id);
 assert.equal((await req('/api/attendance',200,undefined,a)).body.lists.find(l=>l.id===multi).presentCompany,c1.name);
 const csv2=await fetch(base+'/api/attendance/export.csv?id='+multi,{headers:{Cookie:admin}});assert((await csv2.text()).includes(c1.name));
 // V39: filters by archived company and unique student ID.
 const csvReport=async(params,cookie=admin,code=200)=>{const r=await fetch(base+'/api/attendance/export.csv?'+params,{headers:{Cookie:cookie}});assert.equal(r.status,code);return r.text();};
 const filters=(...pairs)=>new URLSearchParams([['id',multi],...pairs]);
 const uid=String(detailMulti.entries[0].uid);
 const companyOnly=await csvReport(filters(['company',c1.name]));assert(companyOnly.includes('aluno1'));assert(!companyOnly.includes('aluno2'));
 const twoCompanies=await csvReport(filters(['company',c1.name],['company',c2.name]));assert(twoCompanies.includes('aluno1')&&twoCompanies.includes('aluno2'));
 const oneStudent=await csvReport(filters(['uid',uid]));assert(oneStudent.includes('aluno1')&&!oneStudent.includes('aluno2'));
 const combined=await csvReport(filters(['company',c2.name],['uid',uid]));assert(!combined.includes('aluno1')&&!combined.includes('aluno2'));
 const unknown=await csvReport(filters(['company','Inexistente']));assert(!unknown.includes('aluno1')&&!unknown.includes('aluno2'));
 await csvReport(filters(['uid','inválido']),admin,400);await csvReport(filters(['company',c1.name]),a,403);await csvReport(filters(['uid',uid]),i,403);
 const oldList=await csvReport(new URLSearchParams({id,company:'Turma A'}));assert(oldList.includes('aluno1'));
 const backup2=(await req('/api/admin/backup.json',200,undefined,admin)).body;assert.equal(backup2.attendanceCompanies.length,2);assert.equal(backup2.attendance.find(l=>l.id===multi).entries.length,2);
 await stop();await start(true);assert.equal((await req('/api/attendance/admin',200,undefined,admin)).body.companies.length,2);assert.equal((await req('/api/attendance/detail?id='+multi,200,undefined,admin)).body.entries[0].company,c1.name);assert.equal((await req('/api/attendance/detail?id='+id,200,undefined,admin)).body.entries.length,1);assert.equal((await req('/api/attendance',200,undefined,a)).body.lists.find(l=>l.id===id).presentAt,one.body.presentAt);
 console.log('PASSOU: frequência por data/turma, permissões, confirmação única, horário do servidor, arquivo, exportação, backup e reinício.');
 }finally{await stop();fs.rmSync(dir,{recursive:true,force:true});}})().catch(e=>{console.error(e);process.exitCode=1});
