/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import{d as o,w as s}from"./p-66a5d6a8.js";import{f as a,s as t}from"./p-e7309bfa.js";import{c as f}from"./p-b9ea58ef.js";import"./p-3f4327f7.js";import"./p-597ff9af.js";const r=()=>{const r=window;r.addEventListener("statusTap",(()=>{o((()=>{const o=document.elementFromPoint(r.innerWidth/2,r.innerHeight/2);if(!o)return;const p=a(o);p&&new Promise((o=>f(p,o))).then((()=>{s((async()=>{p.style.setProperty("--overflow","hidden"),await t(p,300),p.style.removeProperty("--overflow")}))}))}))}))};export{r as startStatusTap}