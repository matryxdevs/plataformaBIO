'use strict';
// Only loaded by the local reconnection integration test. No production usage.
const Module=require('node:module'),fs=require('node:fs'),path=require('node:path'),{EventEmitter}=require('node:events');
const root=process.env.DATA_DIR,flag=path.join(root,'simulate-outage'),committed=path.join(root,'simulate-commit-loss');
let tables={},connections=0;
function error(){return Object.assign(Error('simulated disconnect'),{code:'PROTOCOL_CONNECTION_LOST'});}
class Connection extends EventEmitter{
 constructor(){super();this.closed=false;this.tx=null;}
 check(){if(this.closed||fs.existsSync(flag))throw error();}
 async query(sql){this.check();const m=sql.match(/(?:CREATE TABLE IF NOT EXISTS|FROM) (gb_\w+)/);if(sql.startsWith('CREATE')){tables[m[1]]??={};return [[]];}return [Object.values(tables[m[1]]).sort((a,b)=>a.ord-b.ord)];}
 async execute(sql,args){this.check();if(sql.startsWith('SELECT GET_LOCK'))return [[{acquired:1}]];const t=sql.match(/(?:INTO|FROM) (gb_\w+)/)[1];if(sql.startsWith('DELETE'))delete this.tx[t][args[0]];else this.tx[t][args[0]]={rid:args[0],ord:args[1],payload:args[2]};return [[]];}
 async beginTransaction(){this.check();this.tx=structuredClone(tables);}
 async commit(){this.check();tables=this.tx;this.tx=null;if(fs.existsSync(committed)){fs.unlinkSync(committed);throw error();}}
 async rollback(){this.tx=null;}
 async ping(){this.check();}
 destroy(){this.closed=true;this.tx=null;}
 async end(){this.destroy();}
}
const load=Module._load;Module._load=function(name,...args){if(name==='mysql2/promise')return {createConnection:async()=>{if(fs.existsSync(flag))throw error();connections++;return new Connection();}};return load.call(this,name,...args);};
