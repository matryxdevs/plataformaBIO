/* V71: bloqueia os gestos de zoom que o navegador entrega à página.
   Não tenta forçar a escala do sistema operacional nem impedir acessibilidade. */
(() => {
  'use strict';
  const options = {capture: true, passive: false};
  const cancel = event => { if (event.cancelable) event.preventDefault(); };
  let start = null, previous = null, multiple = false;
  const reset = () => { start = previous = null; multiple = false; };
  const near = (a,b,d) => Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY) <= d;
  // Os controles nativos continuam editáveis; CSS e viewport bloqueiam seus gestos de zoom.
  const editable = target => Boolean(target?.closest?.('input, textarea, select, [contenteditable]:not([contenteditable="false"]), video, audio, #signature, #signature-pad'));
  for (const type of ['gesturestart','gesturechange','gestureend']) {
    document.addEventListener(type, event => { reset(); cancel(event); }, options);
  }
  document.addEventListener('touchstart', event => {
    if (event.touches.length > 1) { start = previous = null; multiple = true; cancel(event); return; }
    if (multiple) { cancel(event); return; }
    start = event.touches.length === 1 ? event.touches[0] : null;
  }, options);
  document.addEventListener('touchmove', event => {
    if (multiple || event.touches.length > 1 || (typeof event.scale === 'number' && event.scale !== 1)) {
      start = previous = null; multiple = true; cancel(event); return;
    }
    if (start && event.touches.length === 1 && !near(start,event.touches[0],12)) reset();
  }, options);
  document.addEventListener('touchcancel', reset, {capture:true,passive:true});
  document.addEventListener('touchend', event => {
    if (multiple) { cancel(event); if (!event.touches.length) reset(); return; }
    if (event.touches.length || event.changedTouches.length !== 1 || !start || editable(event.target)) { reset(); return; }
    const touch = event.changedTouches[0], now = performance.now();
    if (!near(start,touch,12)) { reset(); return; }
    start = null;
    // Não depende de o segundo toque atingir o mesmo nó HTML (ex.: texto e ícone).
    if (previous && now-previous.time <= 350 && near(previous,touch,32)) {
      previous = null; cancel(event); return;
    }
    previous = {clientX:touch.clientX,clientY:touch.clientY,time:now};
  }, options);
  document.addEventListener('wheel', event => {
    if (event.ctrlKey || event.metaKey) cancel(event);
  }, options);
  document.addEventListener('keydown', event => {
    if (!(event.ctrlKey || event.metaKey) || event.altKey) return;
    if (['+','=','-','Add','Subtract','ZoomIn','ZoomOut'].includes(event.key) || ['NumpadAdd','NumpadSubtract','Equal','Minus'].includes(event.code)) cancel(event);
  }, options);
})();
