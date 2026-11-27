'use strict';
const {phoneNumber}=require('./registration');
function cpfNumber(v){if(typeof v!=='string'||v.length>20||!/^[-.\d ]+$/.test(v))return null;const n=v.replace(/\D/g,'');if(n.length!==11||/^(\d)\1{10}$/.test(n))return null;for(const size of [9,10]){let sum=0;for(let i=0;i<size;i++)sum+=Number(n[i])*(size+1-i);if(Number(n[size])!==(sum*10%11)%10)return null;}return n;}
function identity(b,fail){const name=typeof b.name==='string'?b.name.trim().normalize('NFC').replace(/\s+/g,' '):'',cpf=cpfNumber(b.cpf),phone=phoneNumber(b.phone);if(name.length>150||name.split(' ').length<2||!/^\p{L}[\p{L}\p{M} .’'\-]*$/u.test(name)||!cpf||!phone)fail(400,'Informe nome completo, CPF válido e celular brasileiro com DDD.');return {name,cpf,phone};}
module.exports={identity,cpfNumber};
