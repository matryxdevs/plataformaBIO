'use strict';
const {spawnSync}=require('node:child_process');
for(const file of ['test-scoring.js','test.js','test-race.js','test-ads.js','test-autoplay.js','test-carousel.js','test-marketing.js','test-instructors.js','test-teams.js','test-performance.js','test-mysql-store.js','test-reconnect.js']){const r=spawnSync(process.execPath,[file],{stdio:'inherit',env:{...process.env,NODE_ENV:'test',STORAGE_DRIVER:'json'}});if(r.status!==0)process.exit(r.status||1);}
