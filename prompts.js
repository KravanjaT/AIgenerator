// ─── INIT ─────────────────────────────────────────────────
function initAll(){
  document.getElementById('pgrid').innerHTML=PURPOSES.map(p=>
    `<div class="pcard" id="pu-${p.id}" onclick="selPurpose('${p.id}')"><div class="pdot"></div><div class="pcard-name">${p.name}</div></div>`).join('');
  document.getElementById('ngrid').innerHTML=NICHES.map(n=>
    `<div class="ncard" id="ni-${n.id}" onclick="selNiche('${n.id}')"><div class="ncard-icon">${n.icon}</div><div class="ncard-name">${n.name}</div><div class="ncard-desc">${n.desc}</div></div>`).join('');
  document.getElementById('pl-grid').innerHTML=PLACEMENTS.map(p=>
    `<div class="plcard" id="pl-${p.id}" onclick="selPlacement('${p.id}')"><div class="plcard-icon">${p.icon}</div><div class="plcard-name">${p.name}</div></div>`).join('');
  mkSw('sw-hair',HAIR_COLORS,'lbrown','selH');
  mkSw('sw-eyes',EYE_COLORS,'gbrown','selE');
  mkSw('sw-skin',SKIN_COLORS,'olive','selS');
  document.getElementById('ftgrid').innerHTML=FACE_TYPES.map(f=>
    `<div class="ftcard${f.id==='mediteran'?' active':''}" id="ft-${f.id}" onclick="selFT('${f.id}')"><div class="ftcard-icon">${f.icon}</div><div class="ftcard-lbl">${f.lbl}</div><div class="ftcard-desc">${f.desc.split(',')[0]}</div></div>`).join('');
  // Chip groups
  document.querySelectorAll('.cg').forEach(g=>{
    g.querySelectorAll('.chip').forEach(c=>{
      c.addEventListener('click',()=>{g.querySelectorAll('.chip').forEach(x=>x.classList.remove('active'));c.classList.add('active');lu();});
    });
  });
  // Enter on intent textarea
  const ia=document.getElementById('ai-intent');
  if(ia) ia.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();aiAnalyzeIntent();}});
  // Init mode
  setMode('std');
  pgr();plist();lu();
}

function mkSw(cid,arr,activeId,fn){
  document.getElementById(cid).innerHTML=arr.map(x=>
    `<div class="sw-item"><div class="sw${x.id===activeId?' active':''}" id="sw${cid}${x.id}" style="background:${x.hex};${x.id===activeId?'border-color:var(--accent)':''}" onclick="${fn}('${x.id}')" title="${x.lbl}"></div><div class="sw-lbl">${x.lbl}</div></div>`
  ).join('');
}

// ─── SELECTIONS ────────────────────────────────────────────
function selPurpose(id){ST.purpose=id;document.querySelectorAll('.pcard').forEach(x=>x.classList.remove('active'));document.getElementById('pu-'+id)?.classList.add('active');checkBtn();lu();}
function selNiche(id){ST.niche=id;document.querySelectorAll('.ncard').forEach(x=>x.classList.remove('active'));document.getElementById('ni-'+id)?.classList.add('active');applyPreset(id);checkBtn();lu();}
function selPlacement(id){ST.placement=id;document.querySelectorAll('.plcard').forEach(x=>x.classList.remove('active'));document.getElementById('pl-'+id)?.classList.add('active');lu();}
function checkBtn(){document.getElementById('btn-p0').style.display=(ST.niche&&ST.purpose)?'block':'none';}
function applyPreset(nid){
  const p=NPRESET[nid];if(!p) return;
  ['c-l01','c-l02','c-l03','c-l05','c-l06','c-l08','c-l09','c-l10','c-expr','c-angle','c-body','c-ostyle'].forEach((g,i)=>{
    setCI(g,[p.l01,p.l02,p.l03,p.l05,p.l06,p.l08,p.l09,p.l10,p.expr,p.angle,p.bodyIdx,p.ostyle][i]);
  });
}
function selH(id){ST.hair=id;updSw('sw-hair',id);lu();}
function selE(id){ST.eye=id;updSw('sw-eyes',id);lu();}
function selS(id){ST.skin=id;updSw('sw-skin',id);lu();}
function selFT(id){ST.face=id;document.querySelectorAll('.ftcard').forEach(x=>x.classList.remove('active'));document.getElementById('ft-'+id)?.classList.add('active');lu();}
function updSw(prefix,id){
  document.querySelectorAll(`[id^="sw${prefix}"]`).forEach(el=>{el.classList.remove('active');el.style.borderColor='transparent';});
  const el=document.getElementById('sw'+prefix+id);
  if(el){el.classList.add('active');el.style.borderColor='var(--accent)';}
}
function setCI(gid,idx){document.querySelectorAll('#'+gid+' .chip').forEach((c,i)=>c.classList.toggle('active',i===idx));}
function getAL(gid){const a=document.querySelector('#'+gid+' .chip.active');return a?a.textContent.trim():'—';}
function gc(id){const a=document.querySelector('#'+id+' .chip.active');return a?a.dataset.val:'';}
function gv(id){const el=document.getElementById(id);return el?el.value.trim():'';}

// ─── LIVE UPDATE ───────────────────────────────────────────
function lu(){
  const h=HAIR_COLORS.find(x=>x.id===ST.hair);
  const e=EYE_COLORS.find(x=>x.id===ST.eye);
  const s=SKIN_COLORS.find(x=>x.id===ST.skin);
  const f=FACE_TYPES.find(x=>x.id===ST.face);
  const ni=NICHES.find(x=>x.id===ST.niche);
  const pu=PURPOSES.find(x=>x.id===ST.purpose);
  const ime=gv('ime')||'—',st=gv('starost'),pk=gv('poklic');
  document.getElementById('sum-name').textContent=ime;
  document.getElementById('sum-role').textContent=(st?st+' let':'')+(pk?', '+pk:'')+(ni?' · '+ni.name:'');
  let badges='';
  if(ni) badges+=`<span class="nbadge">${ni.icon} ${ni.name}</span>`;
  if(pu) badges+=`<span class="pbadge">${pu.name}</span>`;
  document.getElementById('sum-badges').innerHTML=badges;
  sv('sv-face',f?f.lbl+' — '+f.desc.split(',')[0]:'—');
  sv('sv-hair',(h?.lbl||'—')+' · '+getAL('c-hlen'));
  sv('sv-eyes',e?.lbl||'—');
  sv('sv-skin',s?.lbl||'—');
  sv('sv-fdet',getAL('c-fdet'));
  sv('sv-expr',getAL('c-expr'));
  sv('sv-l06',getAL('c-l06'));
  sv('sv-l03',getAL('c-l03'));
  sv('sv-l08',getAL('c-l08'));
  sv('sv-l10',getAL('c-l10'));
  const pn=gv('prod-name'),pp=PLACEMENTS.find(x=>x.id===ST.placement);
  if(PROD_IMG||pn){
    document.getElementById('prod-sum').classList.add('vis');
    document.getElementById('prod-sum-name').textContent=pn||'Produkt';
    document.getElementById('prod-sum-sub').textContent=pp?'Postavitev: '+pp.name:'—';
    if(PROD_IMG) document.getElementById('prod-sum-img').style.display='block';
  }
  if(CUR===3) genMain();
  if(CUR===5) genLib();
}
function sv(id,val){const el=document.getElementById(id);if(el){el.textContent=val;el.className='sum-val'+(val&&val!=='—'?' set':'');}}

// ─── PROMPT BUILDER ────────────────────────────────────────
function getPhysDesc(){
  const h=HAIR_COLORS.find(x=>x.id===ST.hair)||HAIR_COLORS[1];
  const e=EYE_COLORS.find(x=>x.id===ST.eye)||EYE_COLORS[1];
  const s=SKIN_COLORS.find(x=>x.id===ST.skin)||SKIN_COLORS[2];
  const f=FACE_TYPES.find(x=>x.id===ST.face)||FACE_TYPES[1];
  return `${s.val}. ${f.desc}. ${gc('c-hlen')}, ${h.val}, ${gc('c-htex')||'naturally styled'}. ${e.val}. ${gc('c-fdet')||'natural features'}. ${gc('c-body')||'natural proportions'}.`;
}
function getProdLine(){
  const pn=gv('prod-name'),pd=gv('prod-desc');
  const pp=PLACEMENTS.find(x=>x.id===ST.placement);
  if(!pn&&!pp) return '';
  let line='';
  if(pp) line+=pp.val+'. ';
  if(pn) line+=`The product is "${pn}"${pd?', '+pd:''}.`;
  return line.trim();
}
function buildPrompt(pose,sceneOvr,outfitOvr,withProduct){
  const ime=gv('ime')||'Subject',st=gv('starost')||'30';
  const sp=gv('spol')==='woman'?'woman':'man',pk=gv('poklic')||'professional';
  const scene=sceneOvr||(gc('c-l03')||'pure white seamless background, clean neutral studio');
  const outf=outfitOvr||((gv('outfit')||'simple quality clothing')+'. '+(gc('c-ostyle')||'smart casual'));
  const prodLine=withProduct?getProdLine():'';
  return `LAYER 01: ${gc('c-l01')||'hyper-realistic, editorial photograph'}

LAYER 02: ${st}-year-old ${sp} named ${ime}, ${pk}. ${getPhysDesc()} ${gc('c-l02')||'confident, self-assured'}. ${gc('c-expr')||'genuine subtle smile'}. ${pose}${prodLine?' '+prodLine:''} ${gc('c-angle')||'eye level camera angle'}.

LAYER 03: ${scene}

LAYER 04: ${outf}

LAYER 05: ${gc('c-l05')||'85mm lens, shallow depth of field, soft bokeh'}

LAYER 06: ${gc('c-l06')||'soft natural window light, warm golden tones'}

LAYER 07: ${gc('c-l07')||'clean minimal atmosphere'}

LAYER 08: ${gc('c-l08')||'clean natural grading, true-to-life colors'}

LAYER 09: ${gc('c-l09')||'natural skin, healthy glow, minor imperfections'}

LAYER 10: ${gc('c-l10')||'focused, present and purposeful'}`;
}
const NEG="perfect skin, plastic skin, airbrushed, studio lighting, symmetrical, 3D render, CGI, cartoon, doll-like, professional model pose, beauty filter, too sharp, overly lit, wet hair, greasy hair";

// ─── SHOTS ─────────────────────────────────────────────────
const SHOTS={
  portrait:[
    {id:'p-front',lbl:'Frontalni',pose:'close portrait head and shoulders, looking straight into camera, natural and confident.'},
    {id:'p-34',lbl:'3/4 kot',pose:'close portrait, head and body turned 3/4, gaze slightly off-camera.'},
    {id:'p-profil',lbl:'Profil',pose:'close portrait, pure side profile, gaze into distance.'},
  ],
  fullbody:[
    {id:'fb-front',lbl:'Spredaj',pose:'full body head to toe, facing camera, weight on one leg.'},
    {id:'fb-34',lbl:'3/4 kot',pose:'full body, 3/4 angle, head slightly toward camera, one hand mid-gesture.'},
    {id:'fb-back',lbl:'Zadaj',pose:'full body from behind, back to camera, head slightly turned.'},
  ]
};

function getNicheLib(){
  const nid=ST.niche||'beauty';
  return {
    outfit:(NOUTFITS[nid]||NOUTFITS.beauty).map(x=>({id:x.id,lbl:x.lbl,pose:'full body, standing naturally, slightly off camera.',sc:null,ou:x.ou,withProd:false})),
    scene:(NSCENES[nid]||NSCENES.beauty).map(x=>({id:x.id,lbl:x.lbl,pose:x.pose,sc:x.sc,ou:null,withProd:false})),
    video:(NVIDEOS[nid]||NVIDEOS.beauty),
    product:[
      {id:'pr-hero',lbl:'Hero shot',pose:'full body or half body, product clearly in focus, confident natural presentation.',withProd:true,sc:null,ou:null},
      {id:'pr-life',lbl:'Lifestyle',pose:'candid lifestyle moment, naturally using or holding product, not looking at camera.',withProd:true,sc:null,ou:null},
      {id:'pr-close',lbl:'Close-up',pose:'close portrait, product partially in frame near face or hands, natural and intimate.',withProd:true,sc:null,ou:null},
      {id:'pr-story',lbl:'Story / vertical',pose:'vertical framing, full body or half body, product visible, social media story.',withProd:true,sc:null,ou:null},
    ]
  };
}

// ─── NAVIGATION ────────────────────────────────────────────
function pgr(){
  document.getElementById('pgbar').innerHTML=PHASES.map((p,i)=>{
    const cls=i<CUR?'done':i===CUR?'active':'';
    return (i>0?`<div class="prog-line${i<=CUR?' done':''}"></div>`:'')+
      `<div class="prog-step"><div class="prog-dot ${cls}">${i<CUR?'✓':i+1}</div><div class="prog-label ${cls}">${p.name}</div></div>`;
  }).join('');
}
function plist(){
  document.getElementById('plist').innerHTML=PHASES.map((p,i)=>{
    const cls=i<CUR?'done':i===CUR?'current':'locked';
    return `<div class="pitem ${cls}"><div class="pitem-dot"></div><div class="pitem-name">${p.name}</div><div class="pitem-tag">${p.tag}</div></div>`;
  }).join('');
}
function goTo(n){
  document.getElementById('phase-'+CUR).classList.remove('active');
  CUR=n;
  document.getElementById('phase-'+n).classList.add('active');
  pgr();plist();lu();
  if(n===3){rdrShots();genMain();}
  if(n===5) rdrLib();
}
function rdrShots(){
  const list=SHOTS[SHOT_TYPE]||[];
  document.getElementById('shot-row').innerHTML=list.map((s,i)=>
    `<button class="shot-btn${i===0?' active':''}" id="sb-${s.id}" onclick="selS2('${s.id}')">${s.lbl}</button>`).join('');
  SEL_SHOT=list[0]?.id;
}
function selS2(id){
  SHOTS[SHOT_TYPE]?.forEach(s=>{document.getElementById('sb-'+s.id)?.classList.toggle('active',s.id===id);});
  SEL_SHOT=id;genMain();
}
function setType(t){
  SHOT_TYPE=t;['portrait','fullbody'].forEach(x=>document.getElementById('tc-'+x).classList.toggle('active',x===t));
  rdrShots();genMain();
}
function genMain(){
  const s=(SHOTS[SHOT_TYPE]||[]).find(x=>x.id===SEL_SHOT)||(SHOTS[SHOT_TYPE]||[])[0];
  if(!s) return;
  document.getElementById('pt-main').textContent=buildPrompt(s.pose);
  document.getElementById('nt-main').textContent=NEG+(SHOT_TYPE==='fullbody'?', cropped body, portrait only':'');
}

