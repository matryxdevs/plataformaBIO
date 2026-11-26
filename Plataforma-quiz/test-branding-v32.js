'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
for(const name of ['index','race','team']){
 const html=fs.readFileSync(`public/${name}.html`,'utf8');
 const header=html.match(/<a class="brand"[^>]*>(.*?)<\/a>/s)[1];
 assert.match(header,/<img[^>]*src="\/release-v56\/default-logo\.png"/);
 assert.doesNotMatch(header,/<b>|<small>|brand-accent/);
 assert.doesNotMatch(html,/game\s+bioquality/i);
}
for(const file of ['app.js','ads-ui.js','race.js','team.js']) assert.doesNotMatch(fs.readFileSync('public/'+file,'utf8'),/game\s+bioquality/i);
assert.match(fs.readFileSync('public/team.js','utf8'),/api\('\/api\/branding'\)/);
console.log('PASSOU: cabeçalhos somente com logo e remoção do nome anterior das telas.');
