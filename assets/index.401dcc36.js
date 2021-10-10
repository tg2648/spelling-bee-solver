const g=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&s(l)}).observe(document,{childList:!0,subtree:!0});function n(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerpolicy&&(o.referrerPolicy=r.referrerpolicy),r.crossorigin==="use-credentials"?o.credentials="include":r.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(r){if(r.ep)return;r.ep=!0;const o=n(r);fetch(r.href,o)}};g();async function y(e){try{return await(await fetch(e)).text()}catch(t){console.error(t)}}async function m(){const e=await y(L);sessionStorage.setItem("words",e)}sessionStorage.length==0?(console.log("Loading words"),async function(){await m()}()):console.log("Words already loaded");const L="https://raw.githubusercontent.com/tg2648/spelling-bee-solver/main/wordlist/spelling-bee-dictionary.txt",w=3,u=6,f=1;function h(e){let t=[];for(let n=0;n<e;n++)t.push("");return t.concat()}let i=document.querySelectorAll("#input-container > input"),d=h(f),p=h(u),a=0;for(let e=0;e<i.length;e++)i[e].addEventListener("keyup",function(t){t.key==="Backspace"?i[e].value==""?(a&&a--,e!=0&&i[e-1].focus()):i[e].value="":t.key==="ArrowLeft"&&e!=0?i[e-1].focus():t.key==="ArrowRight"&&e!=i.length-1?i[e+1].focus():t.key!=="ArrowLeft"&&t.key!=="ArrowRight"&&(a<f+u&&a++,e!==i.length-1&&i[e+1].focus())});for(let e=0;e<i.length;e++)i[e].addEventListener("keyup",function(t){var o,l;let n=t.target,s=n.attributes.name.value,r=n.value.toLowerCase();if(s==="required"){let c=(o=n.attributes.requiredIdx)==null?void 0:o.value;d[c]=r}else if(s==="optional"){let c=(l=n.attributes.optionalIdx)==null?void 0:l.value;p[c]=r}a==f+u&&S(d,p)});function v(){return sessionStorage.getItem("words").split(`
`)}function A(e,t){for(let n=0;n<e.length;n++){const s=e.charAt(n);if(t.indexOf(s)==-1)return!1}return!0}function E(e,t){return t.every(n=>e.indexOf(n)!=-1)}function O(e,t){let n=v(),s=[];return n.forEach(r=>{r.length>w&&E(r,e)&&A(r,t.concat(e))&&s.push(r)}),s}function x(e){let t=[];return e.forEach(n=>{let s=[];for(let r=0;r<n.length;r++){const o=n.charAt(r);d.indexOf(o)!=-1?s.push(`<span class="result required">${o}</span>`):s.push(`<span class="result">${o}</span>`)}t.push(`<p>${s.join("")}</p>`)}),t.join("")}function S(e,t){let n=O(e,t),s=x(n);document.querySelector("#results").innerHTML=`
    <h2 class="title" >Results:</h2>
    ${s}
    `}