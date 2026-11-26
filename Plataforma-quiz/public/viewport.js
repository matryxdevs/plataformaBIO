/* Bloqueia apenas ações de zoom canceláveis entregues à página. */
(() => {
  'use strict';
  const options = {capture: true, passive: false};
  const cancel = event => { if (event.cancelable) event.preventDefault(); };
  let start = null, previous = null;
  const reset = () => { start = previous = null; };
  const near = (a,b,d) => Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY) <= d;
  const editable = target => Boolean(target?.closest?.('input, textarea, select, [contenteditable]:not([contenteditable="false"]), video, audio, #signature-pad'));
  // iOS/Safari gesture events, plus standard multitouch fallback.
  for (const type of ['gesturestart','gesturechange','gestureend']) {
    document.addEventListener(type, event => { reset(); cancel(event); }, options);
  }
  document.addEventListener('touchstart', event => {
    if (event.touches.length > 1) { reset(); cancel(event); return; }
    start = event.touches.length === 1 ? event.touches[0] : null;
  }, options);
  document.addEventListener('touchmove', event => {
    if (event.touches.length > 1 || (typeof event.scale === 'number' && event.scale !== 1)) {
      reset(); cancel(event); return;
    }
    if (start && event.touches.length === 1 && !near(start,event.touches[0],12)) reset();
  }, options);
  document.addEventListener('touchcancel', reset, {capture:true,passive:true});
  document.addEventListener('touchend', event => {
    if (event.touches.length || event.changedTouches.length !== 1 || !start || editable(event.target)) { reset(); return; }
    const touch = event.changedTouches[0], now = performance.now();
    if (!near(start,touch,12)) { reset(); return; }
    start = null;
    if (previous && previous.target === event.target && now-previous.time <= 320 && near(previous,touch,24)) {
      previous = null; cancel(event); return;
    }
    previous = {clientX:touch.clientX,clientY:touch.clientY,time:now,target:event.target};
  }, options);
  // Rodas e trackpads que entregam o gesto de ampliação à página.
  document.addEventListener('wheel', event => {
    if (event.ctrlKey || event.metaKey) cancel(event);
  }, options);
  // Não intercepta atalhos comuns (copiar, colar, etc.) nem a restauração Ctrl/⌘+0.
  document.addEventListener('keydown', event => {
    if (!(event.ctrlKey || event.metaKey) || event.altKey) return;
    if (['+','=','-','Add','Subtract'].includes(event.key) || ['NumpadAdd','NumpadSubtract'].includes(event.code)) cancel(event);
  }, options);
})();
