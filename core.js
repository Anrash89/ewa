/* Deсятка. Local selection and normalization. No network requests. */
(function(root){
'use strict';
const aliases={user:['username','user name','user_name','user','author','author username','author_username','owner.username','nickname','ник','логин','автор','имя пользователя','пользователь','profile name','profile_name','имя аккаунта'],text:['comment','text','comment text','comment_text','комментарий','текст','текст комментария','сообщение'],id:['comment_id','comment id','id комментария','id','pk'],reply:['is_reply','is reply','reply','ответ','это ответ'],parent:['parent_id','parent_comment_id','reply_to_comment_id','reply_to','in_reply_to_id'],url:['comment_url','comment url','permalink','ссылка на комментарий','url'],userid:['user_id','author_id','owner.id','owner.pk']};
const clean=v=>String(v??'').replace(/^\uFEFF/,'').trim();
function username(v){let s=clean(v);if(/^https?:\/\//i.test(s)){try{const u=new URL(s);if(/(^|\.)instagram\.com$/i.test(u.hostname))s=u.pathname.split('/').filter(Boolean)[0]||''}catch{}}return s.replace(/^@/,'').trim()}
function key(v){return username(v).toLowerCase()}
function flatten(obj,prefix='',out={}){for(const [k,v]of Object.entries(obj||{})){const n=prefix?prefix+'.'+k:k;if(v&&typeof v==='object'&&!Array.isArray(v))flatten(v,n,out);else out[n]=Array.isArray(v)?v.map(x=>typeof x==='object'?JSON.stringify(x):x).join(' '):v}return out}
function detect(headers,kind){return headers.findIndex(h=>aliases[kind].includes(clean(h).toLowerCase()))}
function toBool(v){return v===true||v===1||/^(true|yes|1|да)$/i.test(clean(v))}
function normalize(rows,headers,ui,ti,header=true){const id=detect(headers,'id'),ri=detect(headers,'reply'),pi=detect(headers,'parent'),ur=detect(headers,'url');let bad=0,duplicates=0;const seen=new Set();const items=[];
for(let i=header?1:0;i<rows.length;i++){const r=rows[i];if(!r||!r.some(x=>clean(x)))continue;const user=username(r[ui]);if(!user){bad++;continue}const cid=id<0?'':clean(r[id]);if(cid&&seen.has(cid)){duplicates++;continue}if(cid)seen.add(cid);items.push({row:i+1,user,key:key(user),text:ti<0?'':clean(r[ti]),id:cid,isReply:(ri>=0&&toBool(r[ri]))||(pi>=0&&!!clean(r[pi])&&!/^(null|none|0|false|—|-)$/i.test(clean(r[pi]))),url:ur<0?'':clean(r[ur])})}
return {items,bad,duplicates,replyKnown:ri>=0||pi>=0}}
function eligible(items,settings){const ex=new Set((settings.excluded||'').split(/[\s,;]+/).filter(Boolean).map(key));const term=(settings.keyword||'').trim().toLowerCase();return items.filter(p=>!ex.has(p.key)&&(!term||p.text.toLowerCase().includes(term))&&(!settings.replies||!p.isReply))}
function randomInt(n,fill){if(!Number.isSafeInteger(n)||n<1||n>0x100000000)throw Error('Некорректный размер базы');const a=new Uint32Array(1),limit=0x100000000-(0x100000000%n);do{(fill||(v=>crypto.getRandomValues(v)))(a)}while(a[0]>=limit);return a[0]%n}
function select(items,count,mode,fill){let pool;if(mode==='authors'){const groups=new Map();for(const x of items)if(!groups.has(x.key))groups.set(x.key,x);pool=[...groups.values()]}else pool=items.slice();if(new Set(pool.map(x=>x.key)).size<count)throw Error('Недостаточно разных авторов');const out=[];for(let i=0;i<count;i++){const p=pool[randomInt(pool.length,fill)];out.push({...p});pool=pool.filter(x=>x.key!==p.key)}return out}
function csvCell(v){const s=String(v??'');return '"'+(/^[\s]*[=+@\-\t\r]/.test(s)?"'"+s:s).replace(/"/g,'""')+'"'}
const api={clean,username,key,flatten,detect,normalize,eligible,randomInt,select,csvCell};root.LuckyCore=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
