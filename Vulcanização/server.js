'use strict';
const http=require('node:http'), fs=require('node:fs'), path=require('node:path'), crypto=require('node:crypto');
const {DatabaseSync}=require('node:sqlite');
const questions=require('./questions.json');
const port=Number(process.env.PORT||3000), dir=path.resolve(process.env.DATA_DIR||path.join(__dirname,'data'));
fs.mkdirSync(dir,{recursive:true,mode:0o700});
const db=new DatabaseSync(path.join(dir,'quiz.sqlite')); db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, login TEXT UNIQUE NOT NULL, name TEXT NOT NULL, company TEXT NOT NULL DEFAULT '', role TEXT NOT NULL, password TEXT NOT NULL); CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY, uid INTEGER REFERENCES users(id), expires INTEGER); CREATE TABLE IF NOT EXISTS attempts(uid INTEGER PRIMARY KEY REFERENCES users(id), answers TEXT NOT NULL DEFAULT '{}', started TEXT NOT NULL, submitted TEXT, score INTEGER);`);
const one=(sql,...args)=>db.prepare(sql).get(...args), all=(sql,...args)=>db.prepare(sql).all(...args), run=(sql,...args)=>db.prepare(sql).run(...args);
const hash=p=>{let s=crypto.randomBytes(16).toString('hex');return s+':'+crypto.scryptSync(p,s,64).toString('hex')};
const verify=(p,h)=>{let [s,k]=h.split(':');return crypto.timingSafeEqual(crypto.scryptSync(p,s,64),Buffer.from(k,'hex'))};
const adminLogin=(process.env.ADMIN_LOGIN||'admin').toLowerCase();
if(!one("SELECT id FROM users WHERE role='admin'")){if(!process.env.ADMIN_PASSWORD||process.env.ADMIN_PASSWORD.length<12)throw Error('Defina ADMIN_PASSWORD com pelo menos 12 caracteres no primeiro início.');run('INSERT INTO users(login,name,role,password) VALUES(?,?,?,?)',adminLogin,'Administrador','admin',hash(process.env.ADMIN_PASSWORD));}
const cookieSecure=process.env.COOKIE_SECURE==='true';
const digest=s=>crypto.createHash('sha256').update(s).digest('hex');
const publicQ=questions.map(({correct,explanation,...q})=>q);
const files={'/':'index.html','/app.js':'app.js','/style.css':'style.css','/theory.json':'theory.json'};
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8'};
function send(res,status,data){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(data));}
function fail(status,message){throw Object.assign(Error(message),{status});}
async function body(req){if(!(req.headers['content-type']||'').startsWith('application/json'))fail(415,'Formato inválido.');let size=0,chunks=[];for await(const c of req){size+=c.length;if(size>20000)fail(413,'Dados excedem o limite.');chunks.push(c);}try{let v=JSON.parse(Buffer.concat(chunks));if(!v||typeof v!=='object'||Array.isArray(v))throw Error();return v;}catch{fail(400,'Dados inválidos.');}}
const attemptsLogin=new Map();
function rate(req){const key=req.socket.remoteAddress;const now=Date.now();if(attemptsLogin.size>10000)for(const [k,v] of attemptsLogin)if(v.until<now)attemptsLogin.delete(k);let v=attemptsLogin.get(key);if(!v||v.until<now)v={n:0,until:now+60000};v.n++;attemptsLogin.set(key,v);if(v.n>60)fail(429,'Muitas tentativas. Aguarde um minuto.');}
function session(req){let t=(req.headers.cookie||'').match(/(?:^|;\s*)quiz_session=([a-f0-9]{64})(?:;|$)/)?.[1];if(!t)return null;return one('SELECT u.id,u.login,u.name,u.company,u.role,s.token FROM sessions s JOIN users u ON u.id=s.uid WHERE s.token=? AND s.expires>?',digest(t),Date.now());}
function cookie(t,age){return `quiz_session=${t}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${age}${cookieSecure?'; Secure':''}`;}
function attempt(uid){let a=one('SELECT * FROM attempts WHERE uid=?',uid);return a?{...a,answers:JSON.parse(a.answers)}:null;}
function score(a){return questions.reduce((n,q)=>n+(a[q.id]===q.correct?1:0),0);}
function details(a){return questions.map(q=>({...q,selected:a.answers[q.id]??null}));}
function report(){return all(`SELECT u.id,u.name,u.login,u.company,a.started,a.submitted,a.score,a.answers FROM users u LEFT JOIN attempts a ON a.uid=u.id WHERE u.role='student' ORDER BY a.score DESC,u.name COLLATE NOCASE`).map(({answers,...r})=>({...r,answered:answers?Object.keys(JSON.parse(answers)).length:0,status:r.submitted?'Concluído':r.started?'Em andamento':'Não iniciado'}));}
const csvCell=v=>'"'+String(v??'').replace(/^[\s]*[=+@-]|^[\t\r\n]/,m=>"'"+m).replace(/"/g,'""')+'"';
const server=http.createServer(async(req,res)=>{res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('X-Frame-Options','DENY');res.setHeader('Referrer-Policy','no-referrer');res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
try{const u=new URL(req.url,'http://localhost'), p=u.pathname,m=req.method;
if(m==='GET'&&files[p]){const f=path.join(__dirname,'public',files[p]);res.writeHead(200,{'Content-Type':mime[path.extname(f)],'Cache-Control':'no-cache'});return res.end(fs.readFileSync(f));}
if(!p.startsWith('/api/'))return send(res,404,{error:'Página não encontrada.'});
if(m==='POST'&&req.headers['sec-fetch-site']==='cross-site')fail(403,'Origem não permitida.');
if(m==='POST'&&p==='/api/login'){rate(req);let b=await body(req);if(typeof b.login!=='string'||typeof b.password!=='string'||b.password.length>200)fail(400,'Credenciais inválidas.');let a=one('SELECT * FROM users WHERE login=?',b.login.trim().toLowerCase());if(!a||!verify(b.password,a.password))fail(401,'Usuário ou senha incorretos.');let old=session(req);if(old)run('DELETE FROM sessions WHERE token=?',old.token);run('DELETE FROM sessions WHERE expires<=?',Date.now());let t=crypto.randomBytes(32).toString('hex');run('INSERT INTO sessions VALUES(?,?,?)',digest(t),a.id,Date.now()+86400000);res.setHeader('Set-Cookie',cookie(t,86400));return send(res,200,{role:a.role,name:a.name});}
const user=session(req);if(!user)fail(401,'Faça login para continuar.');
if(m==='POST'&&p==='/api/logout'){await body(req);run('DELETE FROM sessions WHERE token=?',user.token);res.setHeader('Set-Cookie',cookie('',0));return send(res,200,{ok:true});}
if(m==='GET'&&p==='/api/me'){const {token,...safe}=user;return send(res,200,safe);}
if(user.role==='student'){
 if(m==='GET'&&p==='/api/quiz'){return send(res,200,{questions:publicQ,attempt:attempt(user.id)});}
 if(m==='POST'&&p==='/api/start'){await body(req);run('INSERT OR IGNORE INTO attempts(uid,started) VALUES(?,?)',user.id,new Date().toISOString());return send(res,200,attempt(user.id));}
 if(m==='POST'&&p==='/api/answer'){let b=await body(req),a=attempt(user.id);if(!a||a.submitted)fail(409,'Avaliação não disponível para edição.');if(!Number.isInteger(b.id)||!questions.some(q=>q.id===b.id)||!Number.isInteger(b.option)||b.option<0||b.option>3)fail(400,'Alternativa inválida.');a.answers[b.id]=b.option;run('UPDATE attempts SET answers=? WHERE uid=? AND submitted IS NULL',JSON.stringify(a.answers),user.id);return send(res,200,{answered:Object.keys(a.answers).length});}
 if(m==='POST'&&p==='/api/submit'){await body(req);let a=attempt(user.id);if(!a)fail(409,'Inicie a avaliação.');if(!a.submitted){if(Object.keys(a.answers).length!==questions.length)fail(400,'Responda todas as questões.');run('UPDATE attempts SET submitted=?,score=? WHERE uid=? AND submitted IS NULL',new Date().toISOString(),score(a.answers),user.id);}return send(res,200,attempt(user.id));}
 if(m==='GET'&&p==='/api/result'){let a=attempt(user.id);if(!a?.submitted)fail(409,'Conclua a avaliação primeiro.');return send(res,200,{attempt:a,questions:details(a)});}
}else if(user.role==='admin'){
 if(m==='POST'&&p==='/api/students'){let b=await body(req);let name=String(b.name||'').trim(),login=String(b.login||'').trim().toLowerCase(),company=String(b.company||'').trim(),password=b.password;if(!name||name.length>120||company.length>120||!/^[a-z0-9._@-]{3,80}$/.test(login)||typeof password!=='string'||password.length<8||password.length>100)fail(400,'Confira nome, usuário (3–80 caracteres, sem espaços) e senha (8–100 caracteres).');if(one('SELECT id FROM users WHERE login=?',login))fail(409,'Este usuário já existe.');run('INSERT INTO users(login,name,company,role,password) VALUES(?,?,?,?,?)',login,name,company,'student',hash(password));return send(res,201,{ok:true});}
 if(m==='GET'&&p==='/api/report')return send(res,200,report());
 if(m==='GET'&&p==='/api/report.csv'){let rows=report();let lines=[['Aluno','Usuário','Empresa/Turma','Situação','Respondidas','Acertos','Erros','Percentual','Início (ISO UTC)','Conclusão (ISO UTC)'],...rows.map(r=>[r.name,r.login,r.company,r.status,r.answered,r.score,r.score==null?'':40-r.score,r.score==null?'':(r.score/40*100).toFixed(1)+'%',r.started,r.submitted])];res.writeHead(200,{'Content-Type':'text/csv; charset=utf-8','Content-Disposition':'attachment; filename="relatorio-vulcanizacao.csv"','Cache-Control':'no-store'});return res.end('\ufeff'+lines.map(r=>r.map(csvCell).join(';')).join('\r\n'));}
 if(m==='GET'&&/^\/api\/report\/\d+$/.test(p)){let id=Number(p.split('/').pop()),student=one("SELECT id,name,login,company FROM users WHERE id=? AND role='student'",id),a=attempt(id);if(!student||!a?.submitted)fail(404,'Resultado não encontrado.');return send(res,200,{student,attempt:a,questions:details(a)});}
 if(m==='POST'&&p==='/api/password'){let b=await body(req);if(!Number.isInteger(b.id)||typeof b.password!=='string'||b.password.length<8||b.password.length>100)fail(400,'Senha inválida.');if(!one("SELECT id FROM users WHERE id=? AND role='student'",b.id))fail(404,'Aluno não encontrado.');run('UPDATE users SET password=? WHERE id=?',hash(b.password),b.id);run('DELETE FROM sessions WHERE uid=?',b.id);return send(res,200,{ok:true});}
}
return send(res,404,{error:'Recurso não encontrado ou não autorizado.'});
}catch(e){if(!e.status)console.error(e);if(!res.headersSent)send(res,e.status||500,{error:e.status?e.message:'Erro interno. Tente novamente.'});else res.end();}});
server.listen(port,'0.0.0.0',()=>console.log(`Quiz disponível na porta ${port}`));
