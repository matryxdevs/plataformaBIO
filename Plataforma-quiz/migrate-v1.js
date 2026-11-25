'use strict';
// Run on a COPY of the old data directory with Node >=22.13, old application stopped.
const fs=require('node:fs'),path=require('node:path');
const dir=process.argv[2];if(!dir)throw Error('Uso: node migrate-v1.js /diretorio/de/dados');
const old=path.join(dir,'quiz.sqlite'),dest=path.join(dir,'quiz-v2.json');if(!fs.existsSync(old)||fs.existsSync(dest))throw Error('Banco antigo ausente ou destino já existe. Nenhum dado sobrescrito.');
const {DatabaseSync}=require('node:sqlite');const db=new DatabaseSync(old,{readOnly:true});
try{const users=db.prepare('SELECT id,login,name,company,role,password FROM users').all();const attempts=db.prepare('SELECT uid,answers,started,submitted,score FROM attempts').all().map(a=>({...a,answers:JSON.parse(a.answers)}));if(!users.some(u=>u.role==='admin'))throw Error('Administrador não encontrado.');fs.writeFileSync(dest,JSON.stringify({version:2,users,sessions:[],attempts}),{flag:'wx',mode:0o600});console.log(`Migrados ${users.length} acessos e ${attempts.length} avaliações. Sessões anteriores encerradas.`);}finally{db.close();}
