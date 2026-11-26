'use strict';
const {identity}=require('./identity');
const crypto=require('node:crypto');
const {qrSvg,token}=require('./teams');
const {scoring,duration}=require('./scoring');
const digest=v=>crypto.createHash('sha256').update(v).digest('hex');
const safeQuestions=qs=>qs.map(({correct,explanation,...q})=>q);
const activeCompany=c=>!c.disabledAt&&!c.deletedAt;
module.exports=({getState,change,body,send,fail,rate,txt,csvCell,courseMedia})=>{
 const find=(id)=>{const l=getState().quizLinks.find(l=>l.id===id);if(!l)fail(404,'Link não encontrado.');return l;};
 const codeLink=code=>{const l=typeof code==='string'&&/^[a-f0-9]{48}$/.test(code)&&getState().quizLinks.find(l=>l.code===code);if(!l)fail(404,'Convite inválido.');return l;};
 const open=l=>{if(l.closedAt)fail(409,'O acesso a este quiz foi encerrado.');};
 const attempt=(req,l)=>{const raw=(req.headers.authorization||'').match(/^Bearer ([a-f0-9]{48})$/)?.[1];const a=raw&&getState().quizGuests.find(a=>a.linkId===l.id&&a.sessionHash===digest(raw));if(!a)fail(401,'Sessão de avaliação indisponível.');return a;};
 const stat=(a,l)=>({name:a.name,answers:a.answers,started:a.started,submitted:a.submitted,score:a.score,total:l.snapshot.questions.length,...(a.submitted?scoring(a.score,l.snapshot.questions.length,duration(a.started,a.submitted)):{})});
 const rows=l=>getState().quizGuests.filter(a=>a.linkId===l.id).map(a=>({id:a.id,name:a.name,email:a.email||'',cpf:a.cpf||'',phone:a.phone||'',login:a.cpf||a.email||'',company:a.company||'',status:a.submitted?'Concluído':'Em andamento',answered:Object.keys(a.answers).length,total:l.snapshot.questions.length,started:a.started,submitted:a.submitted,score:a.score,...(a.submitted?scoring(a.score,l.snapshot.questions.length,duration(a.started,a.submitted)):{points:null})}));
 const detail=l=>({id:l.id,code:l.code,title:l.title,courseId:l.courseId,course:l.snapshot.title,total:l.snapshot.questions.length,createdAt:l.createdAt,closedAt:l.closedAt,participants:getState().quizGuests.filter(a=>a.linkId===l.id).length});
 return async(req,res,url,user)=>{const p=url.pathname,m=req.method,s=getState();
 if(p.startsWith('/api/quiz-public/')){
   rate('public-quiz:'+req.socket.remoteAddress,m==='GET'?1200:600);
   const l=codeLink(url.searchParams.get('code'));
   if(m==='GET'&&p==='/api/quiz-public/info')return send(res,200,{title:l.title,course:l.snapshot.title,description:l.snapshot.description,total:l.snapshot.questions.length,closed:!!l.closedAt});
   if(m==='POST'&&p==='/api/quiz-public/start'){
     open(l);rate('public-quiz-start:'+req.socket.remoteAddress,120);const b=await body(req),person=identity(b,fail);if(s.quizGuests.some(a=>a.linkId===l.id&&a.cpf===person.cpf))fail(409,'Este CPF já iniciou uma avaliação neste link. Use a aba original ou procure a administração.');if(rows(l).length>=500)fail(409,'Limite de participantes atingido.');const raw=token(),id=crypto.randomUUID();await change(n=>n.quizGuests.push({id,linkId:l.id,...person,company:'',sessionHash:digest(raw),started:new Date().toISOString(),submitted:null,score:null,answers:{}}));return send(res,201,{token:raw});
   }
   if(['GET','HEAD'].includes(m)&&p.startsWith('/api/quiz-public/media/')){open(l);return await courseMedia.serve(req,res,{role:'quiz-link',linkId:l.id},p.split('/').at(-1));}
   const a=attempt(req,l);
   if(m==='GET'&&p==='/api/quiz-public/state'){if(!a.submitted)open(l);return send(res,200,{title:l.snapshot.title,theory:l.snapshot.theory,preMedia:l.snapshot.preMedia||[],quizMedia:l.snapshot.quizMedia||[],questions:a.submitted?l.snapshot.questions:safeQuestions(l.snapshot.questions),attempt:stat(a,l)});}
   if(m==='POST'&&p==='/api/quiz-public/answer'){open(l);if(a.submitted)fail(409,'Avaliação já concluída.');const b=await body(req);if(!Number.isInteger(b.id)||!l.snapshot.questions.some(q=>q.id===b.id)||!Number.isInteger(b.option)||b.option<0||b.option>3)fail(400,'Alternativa inválida.');await change(n=>{n.quizGuests.find(x=>x.id===a.id).answers[b.id]=b.option;});return send(res,200,{ok:true});}
   if(m==='POST'&&p==='/api/quiz-public/submit'){if(!a.submitted){open(l);if(l.snapshot.questions.some(q=>!Object.hasOwn(a.answers,q.id)))fail(400,'Responda todas as questões.');await change(n=>{const v=n.quizGuests.find(x=>x.id===a.id);v.submitted=new Date().toISOString();v.score=l.snapshot.questions.reduce((total,q)=>total+Number(v.answers[q.id]===q.correct),0);});}return send(res,200,stat(getState().quizGuests.find(x=>x.id===a.id),l));}
   fail(404,'Recurso não encontrado.');
 }
 if(!user)fail(401,'Faça login para continuar.');if(!['admin','instructor'].includes(user.role))fail(403,'Acesso administrativo necessário.');
 if(m==='GET'&&p==='/api/admin/quiz-links')return send(res,200,s.quizLinks.map(detail).reverse());
 if(m==='POST'&&p==='/api/admin/quiz-links/create'){const b=await body(req),c=s.courses.find(c=>c.id===b.courseId&&c.published&&c.questions.length);if(!c)fail(400,'Selecione uma matéria publicada.');const l={id:crypto.randomUUID(),code:token(),title:txt(b.title??c.title,150),courseId:c.id,snapshot:structuredClone(c),createdAt:new Date().toISOString(),closedAt:null,createdBy:user.id};await change(n=>n.quizLinks.push(l));return send(res,201,detail(l));}
 if(m==='POST'&&p==='/api/admin/quiz-links/access'){const b=await body(req),l=find(b.id);if(typeof b.open!=='boolean')fail(400,'Ação inválida.');await change(n=>{n.quizLinks.find(x=>x.id===l.id).closedAt=b.open?null:l.closedAt||new Date().toISOString();});return send(res,200,{ok:true});}
 const l=find(url.searchParams.get('id'));
 if(m==='GET'&&p==='/api/admin/quiz-links/detail')return send(res,200,{...detail(l),rows:rows(l)});
 if(m==='GET'&&p==='/api/admin/quiz-links/result'){const a=s.quizGuests.find(a=>a.id===url.searchParams.get('participant')&&a.linkId===l.id);if(!a?.submitted)fail(404,'Resultado não encontrado.');return send(res,200,{attempt:stat(a,l),questions:l.snapshot.questions});}
 if(m==='GET'&&p==='/api/admin/quiz-links/qr'){let origin;try{const u=new URL(url.searchParams.get('origin'));if(!['https:','http:'].includes(u.protocol)||u.username||u.password||u.origin.length>200)throw Error();origin=u.origin;}catch{fail(400,'Endereço inválido.');}res.writeHead(200,{'Content-Type':'image/svg+xml','Cache-Control':'no-store'});return res.end(qrSvg(origin+'/quiz-convidado#'+l.code));}
 if(m==='GET'&&p==='/api/admin/quiz-links/export.csv'){const data=[['Quiz','Matéria','Nome','CPF','Telefone','E-mail histórico','Empresa','Situação','Respondidas','Total','Acertos','Início (UTC)','Conclusão (UTC)','Pontuação'],...rows(l).map(r=>[l.title,l.snapshot.title,r.name,r.cpf,r.phone,r.email,r.company,r.status,r.answered,r.total,r.score,r.started,r.submitted,r.points])];res.writeHead(200,{'Content-Type':'text/csv; charset=utf-8','Content-Disposition':'attachment; filename="quiz-convidados.csv"','Cache-Control':'no-store'});return res.end('\ufeff'+data.map(r=>r.map(csvCell).join(';')).join('\r\n'));}
 if(m==='GET'&&p==='/api/admin/quiz-links/print'){const html=require('./evaluation-print').render(l.title+' — '+l.snapshot.title,rows(l),'/logo');res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'private, no-store','X-Robots-Tag':'noindex, nofollow'});return res.end(html);}
 fail(404,'Recurso não encontrado.');
 };
};
