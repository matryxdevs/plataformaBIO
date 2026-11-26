'use strict';
document.getElementById('print-report').addEventListener('click',async()=>{await Promise.all([...document.images].map(i=>i.decode?.().catch(()=>{})||Promise.resolve()));window.print();});
