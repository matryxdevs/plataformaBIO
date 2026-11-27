'use strict';
const {spawnSync}=require('node:child_process');
// V58: testes de fluxos antigos de aluno foram substituídos pelo cenário de convidados.
for(const file of ['test-admin-sidebar.js','test-branding-v32.js','test-viewport.js','test-scoring.js','test-autoplay.js','test-mysql-store.js','test-reconnect.js','test-attendance-exit-ui.js','test-attendance-inspection-ui.js','test-staff-guests.js','test-image-terms.js']){const r=spawnSync(process.execPath,[file],{stdio:'inherit',env:{...process.env,NODE_ENV:'test',STORAGE_DRIVER:'json'}});if(r.status!==0)process.exit(r.status||1);}
