'use strict';
// All durations originate from server timestamps, not the device clock.
function duration(start,end){const a=Date.parse(start),b=Date.parse(end);return Number.isFinite(a)&&Number.isFinite(b)&&b>=a?b-a:null;}
function scoring(correct,total,ms){const accuracy=total>0?Math.max(0,Math.min(1,correct/total)):0;const base=80*accuracy;const bonus=ms===null?0:20*accuracy*Math.max(0,1-ms/(total*60000));const accuracyPoints=Math.round(base*100)/100,timePoints=Math.round(bonus*100)/100;return {durationMs:ms,accuracyPoints,timePoints,points:Math.round((accuracyPoints+timePoints)*100)/100};}
function compare(a,b){return Number(b.durationMs!==null)-Number(a.durationMs!==null)||b.points-a.points||b.score-a.score||(a.durationMs??Infinity)-(b.durationMs??Infinity)||a.uid-b.uid;}
module.exports={duration,scoring,compare};
