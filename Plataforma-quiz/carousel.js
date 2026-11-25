'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
module.exports=({getState,change,body,send,fail,logoValue,txt})=>{
 const read=()=>structuredClone(getState()?.carousel??{seconds:5,slides:[]});
 const info=(data,admin=false)=>({seconds:data.seconds,slides:data.slides.filter(s=>admin||s.active).map(({image,...s})=>({...s,url:'/api/login-carousel/image/'+s.id+'?v='+s.revision}))});
 return async(req,res,url,user)=>{
  const p=url.pathname,m=req.method;
  if(m==='GET'&&p==='/api/login-carousel')return send(res,200,info(read()));
  if(m==='GET'&&/^\/api\/login-carousel\/image\/[a-f0-9-]{36}$/.test(p)){
   const s=read().slides.find(s=>s.id===p.split('/').pop());if(!s||(!s.active&&user?.role!=='admin'))fail(404,'Imagem indisponível.');
   const bytes=Buffer.from(s.image.data,'base64');res.writeHead(200,{'Content-Type':s.image.type,'Content-Length':bytes.length,'Cache-Control':'no-store'});return res.end(bytes);
  }
  if(user?.role!=='admin')fail(user?403:401,'Acesso administrativo necessário.');
  if(m==='GET'&&p==='/api/admin/login-carousel')return send(res,200,info(read(),true));
  if(m!=='POST'||p!=='/api/admin/login-carousel')fail(404,'Recurso não encontrado.');
  const b=await body(req),data=read();
  if(b.action==='add'){
   if(data.slides.length>=8)fail(400,'Limite de 8 imagens.');
   const image=logoValue({logo:b.image});if(!image)fail(400,'Selecione uma imagem.');
   data.slides.push({id:crypto.randomUUID(),revision:crypto.randomUUID(),image,alt:txt(b.alt??'',120,false),active:true});
  }else if(b.action==='interval'){
   if(!Number.isInteger(b.seconds)||b.seconds<3||b.seconds>15)fail(400,'Use um intervalo de 3 a 15 segundos.');data.seconds=b.seconds;
  }else{
   const i=data.slides.findIndex(s=>s.id===b.id);if(i<0)fail(404,'Imagem não encontrada.');const s=data.slides[i];
   if(b.action==='replace'){const image=logoValue({logo:b.image});if(!image)fail(400,'Selecione uma imagem.');s.image=image;s.revision=crypto.randomUUID();}
   else if(b.action==='toggle'){if(typeof b.active!=='boolean')fail(400,'Estado inválido.');s.active=b.active;}
   else if(b.action==='alt'){s.alt=txt(b.alt??'',120,false);}
   else if(b.action==='remove'){data.slides.splice(i,1);}
   else if(b.action==='move'){if(![-1,1].includes(b.direction))fail(400,'Direção inválida.');const j=i+b.direction;if(j>=0&&j<data.slides.length)[data.slides[i],data.slides[j]]=[data.slides[j],data.slides[i]];}
   else fail(400,'Operação inválida.');
  }
  await change(s=>{s.carousel=data;});return send(res,200,info(data,true));
 };
};
