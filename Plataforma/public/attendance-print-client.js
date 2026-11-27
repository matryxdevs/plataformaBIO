'use strict';
for(const id of ['print-report','save-pdf'])document.getElementById(id).addEventListener('click',async()=>{await Promise.all([...document.images].map(img=>img.decode?.().catch(()=>{})||Promise.resolve()));window.print();});
