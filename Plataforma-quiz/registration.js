'use strict';
const crypto=require('node:crypto');
// Brazilian mobile format only; no proof of ownership.
function phoneNumber(value){if(typeof value!=='string'||value.length>32||!/^\+?[0-9().\s-]+$/.test(value.trim()))return null;let n=value.replace(/\D/g,'');if(n.length===11&&!value.trim().startsWith('+'))n='55'+n;return /^55[1-9][1-9]9\d{8}$/.test(n)?'+'+n:null;}
const EDUCATION_STATUS=['Cursando atualmente','Última série concluída','Nenhuma série concluída','Prefiro não informar'];
function educationFields(b,fail){
 const status=b.educationStatus;
 if(!EDUCATION_STATUS.includes(status))fail(400,'Selecione sua situação escolar.');
 const needsGrade=['Cursando atualmente','Última série concluída'].includes(status);
 const grade=typeof b.educationGrade==='string'?b.educationGrade.trim():'';
 const interest=typeof b.technicalInterest==='string'?b.technicalInterest.trim():'';
 if(needsGrade&&(!grade||grade.length>120||/[\x00-\x1f\x7f]/.test(grade)))fail(400,'Informe o ano, série ou etapa escolar (até 120 caracteres).');
 if(!interest||interest.length>150||/[\x00-\x1f\x7f]/.test(interest))fail(400,'Informe o curso técnico de interesse ou indique que ainda não decidiu (até 150 caracteres).');
 return {educationStatus:status,educationGrade:needsGrade?grade:null,technicalInterest:interest};
}
function create({env=process.env,getState,change,body,send,fail,hash,cookie,digest,session}){
 const enabled=env.SELF_REGISTRATION==='true';
 const limits=new Map();
 function limit(key,max,window){const now=Date.now();for(const [k,v] of limits)if(v.until<=now)limits.delete(k);let v=limits.get(key);if(!v){if(limits.size>=10000)fail(429,'Limite de solicitações. Tente mais tarde.');v={n:0,until:now+window};limits.set(key,v);}if(v.n>=max)fail(429,'Limite de solicitações. Tente mais tarde.');v.n++;}
 async function route(req,res,p){
  if(req.method==='GET'&&p==='/api/registration/config')return send(res,200,{enabled});
  if(req.method!=='POST'||p!=='/api/registration/create')fail(404,'Recurso indisponível.');
  if(!enabled)fail(503,'Cadastro público desativado. Procure a administração.');
  const ip=req.socket.remoteAddress||'unknown';limit('request:'+ip,120,60000);
  const b=await body(req),name=typeof b.name==='string'?b.name.trim():'',login=typeof b.login==='string'?b.login.trim().toLowerCase():'',company=typeof b.company==='string'?b.company.trim():'',phone=phoneNumber(b.phone);
  if(!name||name.length>120||company.length>120||!/^[a-z0-9._@-]{3,80}$/.test(login)||typeof b.password!=='string'||b.password.length<8||b.password.length>100||!phone)fail(400,'Confira nome, usuário, senha (mínimo 8 caracteres) e celular brasileiro com DDD.');
  if(b.acceptPhone!==true)fail(400,'Confirme a ciência do armazenamento do telefone.');
  const education=educationFields(b,fail);
  if(getState().users.some(u=>u.login===login||u.phone===phone))fail(409,'Usuário ou telefone indisponível para cadastro. Procure a administração se já possui conta.');
  limit('create:global',60,60000);limit('create:ip:'+ip,60,60000);
  const old=session(req),t=crypto.randomBytes(32).toString('hex'),password=hash(b.password);
  await change(s=>{if(s.users.some(u=>u.login===login||u.phone===phone))fail(409,'Usuário ou telefone indisponível para cadastro.');const id=Math.max(0,...s.users.map(u=>u.id))+1;s.users.push({id,name,login,company,password,phone,phoneVerifiedAt:null,...education,role:'student'});s.sessions=s.sessions.filter(x=>x.expires>Date.now()&&x.token!==old?.token);s.sessions.push({token:digest(t),uid:id,expires:Date.now()+86400000});});
  res.setHeader('Set-Cookie',cookie(req,t,86400));return send(res,201,{ok:true});
 }
 return {route,enabled};
}
module.exports={create,phoneNumber};
