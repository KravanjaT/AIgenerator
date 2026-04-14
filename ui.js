// ─── UPLOADS ───────────────────────────────────────────────
async function handleCharUpload(evt){
  const f=evt.target.files[0];if(!f) return;
  const url=URL.createObjectURL(f);
  CHAR_IMGS.push(url);
  document.getElementById('char-upload-zone').style.display='none';
  const cu=document.getElementById('char-uploaded');
  cu.classList.add('vis');
  document.getElementById('char-thumb').src=url;
  document.getElementById('ai-ac-img').src=url;
  if(MODE==='ai'){
    const reader=new FileReader();
    reader.onload=async()=>{
      const b64=reader.result.split(',')[1];
      CHAR_B64={data:b64,type:f.type||'image/jpeg'};
      await aiAnalyzeCharImage(b64,f.type||'image/jpeg');
      setTimeout(()=>goTo(4),600);
    };
    reader.readAsDataURL(f);
  } else {
    document.getElementById('char-sub').textContent='Karakter shranjen kot reference.';
    setTimeout(()=>goTo(4),400);
  }
}
function handleProdUpload(evt){
  const f=evt.target.files[0];if(!f) return;
  const url=URL.createObjectURL(f);
  PROD_IMG=url;
  const prev=document.getElementById('prod-preview');
  prev.src=url;prev.style.display='block';
  document.getElementById('prod-ph').style.display='none';
  document.getElementById('prod-upload-area').classList.add('has-img');
  document.getElementById('prod-sum-img').src=url;
  lu();
}

// ─── LIBRARY ───────────────────────────────────────────────
function rdrLib(){
  const lib=getNicheLib();
  const BASE_P=[
    {id:'lp-f',lbl:'Frontalni',pose:'close portrait, head and shoulders, straight into camera, natural.',sc:null,ou:null},
    {id:'lp-34',lbl:'3/4 kot',pose:'close portrait, 3/4 angle, gaze slightly off-camera.',sc:null,ou:null},
    {id:'lp-pr',lbl:'Profil',pose:'close portrait, pure side profile.',sc:null,ou:null},
  ];
  const BASE_FB=[
    {id:'lfb-f',lbl:'Spredaj',pose:'full body head to toe, facing camera.',sc:null,ou:null},
    {id:'lfb-34',lbl:'3/4 kot',pose:'full body, 3/4 angle, one hand mid-gesture.',sc:null,ou:null},
    {id:'lfb-b',lbl:'Zadaj',pose:'full body from behind, back to camera.',sc:null,ou:null},
  ];
  const list=LIB_TYPE==='portrait'?BASE_P:LIB_TYPE==='fullbody'?BASE_FB:LIB_TYPE==='outfit'?lib.outfit:LIB_TYPE==='scene'?lib.scene:LIB_TYPE==='product'?lib.product:lib.video;
  document.getElementById('lib-shot-row').innerHTML=list.map((s,i)=>
    `<button class="shot-btn${i===0?' active':''}" id="ls-${s.id}" onclick="selL('${s.id}')">${s.lbl}</button>`).join('');
  SEL_LIB=list[0]?.id;genLib();
}
function selL(id){
  document.querySelectorAll('[id^="ls-"]').forEach(el=>el.classList.remove('active'));
  document.getElementById('ls-'+id)?.classList.add('active');
  SEL_LIB=id;genLib();
}
function setLib(t){
  LIB_TYPE=t;
  ['portrait','fullbody','outfit','scene','product','video'].forEach(x=>document.getElementById('lib-'+x).classList.toggle('active',x===t));
  rdrLib();
}
function genLib(){
  const lib=getNicheLib();
  const all=[
    {id:'lp-f',pose:'close portrait, head and shoulders, straight into camera.',sc:null,ou:null},
    {id:'lp-34',pose:'close portrait, 3/4 angle, gaze slightly off-camera.',sc:null,ou:null},
    {id:'lp-pr',pose:'close portrait, pure side profile.',sc:null,ou:null},
    {id:'lfb-f',pose:'full body head to toe, facing camera.',sc:null,ou:null},
    {id:'lfb-34',pose:'full body, 3/4 angle, one hand mid-gesture.',sc:null,ou:null},
    {id:'lfb-b',pose:'full body from behind, back to camera.',sc:null,ou:null},
    ...(lib.outfit||[]),...(lib.scene||[]),...(lib.product||[]),
  ];
  const item=all.find(x=>x.id===SEL_LIB)||(lib.video||[]).find(x=>x.id===SEL_LIB);
  if(!item) return;
  let pt='',nt=NEG;
  if(LIB_TYPE==='video'){
    const v=(lib.video||[]).find(x=>x.id===SEL_LIB)||(lib.video||[])[0];
    if(!v) return;
    const sp=gv('spol')==='woman'?'Woman':'Man',pk=gv('poklic')||'person';
    pt=`Subtle realistic human motion. ${sp}, ${pk}. ${v.mot} Natural eye blinking, slow chest movement from breathing. Camera completely static, no movement, no zoom, no pan.`;
    nt="fast movement, talking exaggeratedly, walking off frame, camera movement, zoom, pan, morphing, distortion, unnatural motion, too smooth, CGI, blurry face, materializing objects";
  } else {
    pt=buildPrompt(item.pose,item.sc||undefined,item.ou||undefined,item.withProd||false);
    if(LIB_TYPE==='fullbody') nt=NEG+', cropped body, portrait only';
    if(LIB_TYPE==='scene') nt=NEG+', posing, looking at camera, staged';
    if(LIB_TYPE==='product') nt=NEG+', product floating, product distorted, no product visible';
  }
  document.getElementById('pt-lib').textContent=pt;
  document.getElementById('nt-lib').textContent=nt;
  const rb=document.getElementById('rbox');rb.style.display='block';
  document.getElementById('rimgs').innerHTML=(CHAR_IMGS.length
    ?CHAR_IMGS.slice(0,3).map(u=>`<img class="ref-img" src="${u}" alt="ref">`).join('')
    :'<span style="font-size:11px;color:var(--text3)">Uploadaj character sliko za reference</span>')
    +(PROD_IMG&&LIB_TYPE==='product'?`<img class="ref-img" src="${PROD_IMG}" alt="produkt" style="border-color:var(--green-light)">`:'' );
}

// ─── HELPERS ───────────────────────────────────────────────
function togSec(id){document.getElementById(id).classList.toggle('open');}
function cp(id,btn){
  navigator.clipboard.writeText(document.getElementById(id).textContent).then(()=>{const o=btn.textContent;btn.textContent='✓ Kopirano';setTimeout(()=>btn.textContent=o,2000);});
}
function cpAll(pid,nid,btn){
  const p=document.getElementById(pid).textContent,n=document.getElementById(nid).textContent;
  navigator.clipboard.writeText('PROMPT:\n'+p+'\n\nNEGATIVE PROMPT:\n'+n).then(()=>{btn.textContent='✓ Kopirano';setTimeout(()=>btn.textContent='Kopiraj vse ↗',2000);});
}

document.addEventListener('DOMContentLoaded',initAll);

