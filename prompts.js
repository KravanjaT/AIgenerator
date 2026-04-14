// ─── 4 VPRAŠANJA → 10 SLOJEV ──────────────────────────────
function applyAnswers(){
  const q1=gv('q1').toLowerCase();
  const q2=gv('q2').toLowerCase();
  const q3=document.querySelector('#q3 .qchip.active')?.dataset.val||'instagram';
  const q4=document.querySelector('#q4 .qchip.active')?.dataset.val||'trust';

  // Niša iz q1
  let niche='beauty';
  if(q1.match(/krema|serum|ličila|parfum|šampon|koža|lepot|make|beauty|kosmetik/)) niche='beauty';
  else if(q1.match(/hrana|recept|kuhanje|chef|restavr|kava|vino|pijač|čokolad/)) niche='food';
  else if(q1.match(/fitnes|vadba|trening|šport|tek|joga|gym|zdravj|prehransk/)) niche='fitness';
  else if(q1.match(/vrt|orodje|dom|pohišt|notranj|delavnic|čiščen|rastlin/)) niche='home';
  else if(q1.match(/oblač|moda|čevlj|torb|nakit|fashion|stajl/)) niche='fashion';
  else if(q1.match(/app|aplikacij|software|tech|ai|računalnik|telefon|digital/)) niche='tech';
  else if(q1.match(/ura|avto|jahta|luksuz|premium|luxury|hotel|potovan/)) niche='luxury';
  else if(q1.match(/otrok|igrač|starš|dojenč|šola/)) niche='kids';
  else if(q1.match(/pes|mačka|hišn|žival|pet|veterinar/)) niche='pet';
  ST.niche=niche;

  // Spol in starost iz q2
  let spol='woman',starost='32';
  if(q2.match(/moški|mosk|men|man|oče|dad|brat/)) spol='man';
  if(q2.match(/žensk|woman|girl|mama/)) spol='woman';
  const ageM=q2.match(/(\d{2})\s*[-–]\s*(\d{2})|(\d{2})\s*let/);
  if(ageM){const a=parseInt(ageM[1]||ageM[3]),b=parseInt(ageM[2]||ageM[3]);starost=String(Math.round((a+(b||a))/2));}
  document.getElementById('spol').value=spol;
  document.getElementById('starost').value=starost;

  // Tip obraza iz q2
  let face='mediteran';
  if(q2.match(/skandinav|nordic|nem|avstr|šved|britansk/)) face='nordic';
  else if(q2.match(/asian|azij|japan|korea|kitaj/)) face='eastasian';
  else if(q2.match(/latin|brasil|špan|mehik/)) face='latin';
  else if(q2.match(/afrišk|afric/)) face='african';
  ST.face=face;
  document.querySelectorAll('.ftcard').forEach(x=>x.classList.remove('active'));
  document.getElementById('ft-'+face)?.classList.add('active');

  // Platforma → aesthetic, objektiv, svetloba, grading
  const platP={
    instagram:{l01:1,l05:3,l06:1,l08:1,angle:0},
    tiktok:   {l01:0,l05:0,l06:2,l08:2,angle:2},
    linkedin: {l01:1,l05:3,l06:1,l08:1,angle:0},
    spletna:  {l01:1,l05:3,l06:3,l08:1,angle:0},
  };
  const pp=platP[q3]||platP.instagram;

  // Občutek → izraz, energija, mood, koža
  const feelP={
    trust:  {expr:4,l02:3,l10:3,l09:1},
    fun:    {expr:4,l02:1,l10:2,l09:1},
    luxury: {expr:0,l02:3,l10:4,l09:1},
    relax:  {expr:4,l02:2,l10:0,l09:3},
    expert: {expr:5,l02:3,l10:3,l09:1},
  };
  const pf=feelP[q4]||feelP.trust;

  // Apliciraj
  const nicheP=NPRESET[niche]||NPRESET.beauty;
  setCI('c-l01',pp.l01);setCI('c-l02',pf.l02);setCI('c-l03',nicheP.l03);
  setCI('c-l05',pp.l05);setCI('c-l06',pp.l06);setCI('c-l07',nicheP.l07||4);
  setCI('c-l08',pp.l08);setCI('c-l09',pf.l09);setCI('c-l10',pf.l10);
  setCI('c-expr',pf.expr);setCI('c-angle',pp.angle);
  setCI('c-body',nicheP.bodyIdx||1);setCI('c-ostyle',nicheP.ostyle||1);

  // Poklic
  const poklicM={beauty:'lifestyle creator',food:'food blogger',fitness:'fitnes trener/ka',
    home:'lifestyle blogger',fashion:'fashion influencer',tech:'tech creator',
    luxury:'luxury lifestyle creator',kids:'parenting creator',pet:'pet owner & creator'};
  if(!gv('poklic')) document.getElementById('poklic').value=poklicM[niche]||'content creator';

  // Prikaz povzetka
  const ni=NICHES.find(x=>x.id===niche);
  const platL={instagram:'Instagram',tiktok:'TikTok / Reels',linkedin:'LinkedIn',spletna:'Spletna stran'};
  const feelL={trust:'Zaupanje & strokovnost',fun:'Zabavno & sproščeno',luxury:'Luksuz',relax:'Relax & lifestyle',expert:'Ekspert'};
  const res=document.getElementById('wizard-result');
  res.innerHTML=`
    <div style="font-size:11px;color:var(--green-light);font-weight:500;margin-bottom:7px">✓ AI je nastavil parametre</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:3px">
      <div class="wr-row"><span class="wr-key">Niša</span><span class="wr-val">${ni?.name||niche}</span></div>
      <div class="wr-row"><span class="wr-key">Karakter</span><span class="wr-val">${spol==='woman'?'Ženska':'Moški'}, ~${starost} let</span></div>
      <div class="wr-row"><span class="wr-key">Platforma</span><span class="wr-val">${platL[q3]||q3}</span></div>
      <div class="wr-row"><span class="wr-key">Občutek</span><span class="wr-val">${feelL[q4]||q4}</span></div>
    </div>
    <div style="font-size:11px;color:var(--text3);margin-top:7px">Popravi detajle v naslednjem koraku ali nadaljuj →</div>`;
  res.classList.add('vis');
  document.getElementById('btn-p0').style.display='block';
  lu();
}

// ─── INIT ─────────────────────────────────────────────────
function initAll(){
  document.querySelectorAll('.qchip').forEach(c=>{
    c.addEventListener('click',()=>{
      const g=c.closest('.qchip-group');
      g.querySelectorAll('.qchip').forEach(x=>x.classList.remove('active'));
      c.classList.add('active');
    });
  });
  document.querySelectorAll('.cg').forEach(g=>{
    g.querySelectorAll('.chip').forEach(c=>{
      c.addEventListener('click',()=>{g.querySelectorAll('.chip').forEach(x=>x.classList.remove('active'));c.classList.add('active');lu();});
    });
  });
  document.getElementById('pl-grid').innerHTML=PLACEMENTS.map(p=>
    `<div class="plcard" id="pl-${p.id}" onclick="selPlacement('${p.id}')"><div class="plcard-icon">${p.icon}</div><div class="plcard-name">${p.name}</div></div>`
  ).join('');
  mkSw('sw-hair',HAIR_COLORS,'lbrown','selH');
  mkSw('sw-eyes',EYE_COLORS,'gbrown','selE');
  mkSw('sw-skin',SKIN_COLORS,'olive','selS');
  document.getElementById('ftgrid').innerHTML=FACE_TYPES.map(f=>
    `<div class="ftcard${f.id==='mediteran'?' active':''}" id="ft-${f.id}" onclick="selFT('${f.id}')"><div class="ftcard-icon">${f.icon}</div><div class="ftcard-lbl">${f.lbl}</div><div class="ftcard-desc">${f.desc.split(',')[0]}</div></div>`
  ).join('');
  const ia=document.getElementById('ai-intent');
  if(ia) ia.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();aiAnalyzeIntent();}});
  setMode('std');pgr();plist();lu();
}
function mkSw(cid,arr,activeId,fn){
  document.getElementById(cid).innerHTML=arr.map(x=>
    `<div class="sw-item"><div class="sw${x.id===activeId?' active':''}" id="sw${cid}${x.id}" style="background:${x.hex};${x.id===activeId?'border-color:var(--accent)':''}" onclick="${fn}('${x.id}')" title="${x.lbl}"></div><div class="sw-lbl">${x.lbl}</div></div>`
  ).join('');
}

// ─── SELECTIONS ────────────────────────────────────────────
function selPlacement(id){ST.placement=id;document.querySelectorAll('.plcard').forEach(x=>x.classList.remove('active'));document.getElementById('pl-'+id)?.classList.add('active');lu();}
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
  const ime=gv('ime')||'—',st=gv('starost'),pk=gv('poklic');
  document.getElementById('sum-name').textContent=ime;
  document.getElementById('sum-role').textContent=(st?st+' let':'')+(pk?', '+pk:'')+(ni?' · '+ni.name:'');
  if(ni) document.getElementById('sum-badges').innerHTML=`<span class="nbadge">${ni.icon} ${ni.name}</span>`;
  sv('sv-face',f?f.lbl+' — '+f.desc.split(',')[0]:'—');
  sv('sv-hair',(h?.lbl||'—')+' · '+getAL('c-hlen'));
  sv('sv-eyes',e?.lbl||'—');sv('sv-skin',s?.lbl||'—');
  sv('sv-fdet',getAL('c-fdet'));sv('sv-expr',getAL('c-expr'));
  sv('sv-l06',getAL('c-l06'));sv('sv-l03',getAL('c-l03'));
  sv('sv-l08',getAL('c-l08'));sv('sv-l10',getAL('c-l10'));
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

LAYER 07: ${gc('c-l07')||'clean minimal atmosphere, no distracting particles'}

LAYER 08: ${gc('c-l08')||'clean natural grading, true-to-life colors'}

LAYER 09: ${gc('c-l09')||'natural skin, healthy glow, visible pores, minor imperfections, no retouching'}

LAYER 10: ${gc('c-l10')||'focused, present and purposeful'}

LAYER 11: subtle micro-expressions, natural facial muscle tension, authentic emotional depth
LAYER 12: hands relaxed and natural, exactly two hands if visible, anatomically correct fingers
LAYER 13: environmental lighting consistency, shadows match light source direction`;
}
const NEG="perfect skin, plastic skin, airbrushed, symmetrical, 3D render, CGI, cartoon, doll-like, professional model pose, beauty filter, too sharp, overly lit, wet hair, greasy hair, extra limbs, three hands, deformed fingers, missing fingers";

// ─── SHOTS ─────────────────────────────────────────────────
const SHOTS={
  portrait:[
    {id:'p-front',lbl:'Frontalni',pose:'close portrait head and shoulders, looking straight into camera, natural and confident.'},
    {id:'p-34',lbl:'3/4 kot',pose:'close portrait, head and body turned 3/4, gaze slightly off-camera.'},
    {id:'p-profil',lbl:'Profil',pose:'close portrait, pure side profile, gaze into distance.'},
  ],
  fullbody:[
    {id:'fb-front',lbl:'Spredaj',pose:'full body head to toe, facing camera, weight on one leg, hands relaxed at sides.'},
    {id:'fb-34',lbl:'3/4 kot',pose:'full body, 3/4 angle, head slightly toward camera, one hand mid-gesture, other hand relaxed.'},
    {id:'fb-back',lbl:'Zadaj',pose:'full body from behind, back to camera, head slightly turned.'},
  ]
};
function getNicheLib(){
  const nid=ST.niche||'beauty';
  return {
    outfit:(NOUTFITS[nid]||NOUTFITS.beauty).map(x=>({id:x.id,lbl:x.lbl,pose:'full body, standing naturally, slightly off camera, hands relaxed.',sc:null,ou:x.ou,withProd:false})),
    scene:(NSCENES[nid]||NSCENES.beauty).map(x=>({id:x.id,lbl:x.lbl,pose:x.pose,sc:x.sc,ou:null,withProd:false})),
    video:(NVIDEOS[nid]||NVIDEOS.beauty),
    product:[
      {id:'pr-hero',lbl:'Hero shot',pose:'full body or half body, product clearly in focus, confident natural presentation, one hand holding product naturally.',withProd:true,sc:null,ou:null},
      {id:'pr-life',lbl:'Lifestyle',pose:'candid lifestyle moment, naturally using or holding product, not looking at camera.',withProd:true,sc:null,ou:null},
      {id:'pr-close',lbl:'Close-up',pose:'close portrait, product partially in frame near face or hands, natural and intimate.',withProd:true,sc:null,ou:null},
      {id:'pr-story',lbl:'Story / vertical',pose:'vertical framing, full body or half body, product visible, designed for social media story.',withProd:true,sc:null,ou:null},
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
  CUR=n;document.getElementById('phase-'+n).classList.add('active');
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
