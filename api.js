// ─── CLAUDE API ────────────────────────────────────────────
async function callClaude(messages,system,maxTokens=600){
  try{
    const res=await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:maxTokens,system,messages})
    });
    const data=await res.json();
    return data.content?.map(x=>x.text||'').join('')||'';
  }catch(e){throw new Error('API klic ni uspel');}
}

// API 1 — Naravni jezik → nastavitve
async function aiAnalyzeIntent(){
  const txt=document.getElementById('ai-intent').value.trim();
  if(!txt) return;
  const btn=document.getElementById('btn-ai-intent');
  const sp=document.getElementById('sp-intent');
  btn.disabled=true;sp.style.display='inline-block';
  document.getElementById('res-intent').classList.remove('vis');
  try{
    const reply=await callClaude([{role:'user',content:txt}],
      `You extract character parameters from descriptions for an AI image generation tool. Return ONLY valid JSON:
{"spol":"man"/"woman","starost":number,"poklic":string,"ime":string,"niche":"beauty"/"food"/"fitness"/"home"/"fashion"/"tech"/"luxury"/"kids"/"pet","hairColor":"blonde"/"lbrown"/"dbrown"/"black"/"sp"/"silver"/"auburn"/"plat","eyeColor":"blue"/"gbrown"/"dbrown"/"grey"/"hazel"/"green","skinColor":"fair"/"light"/"olive"/"tan"/"brown"/"dark","faceType":"nordic"/"mediteran"/"latin"/"eastasian"/"southasian"/"african"/"mideast"/"mixed","explanation":"1 sentence in Slovenian"}`,600);
    const p=JSON.parse(reply.replace(/```json|```/g,'').trim());
    if(p.spol) document.getElementById('spol').value=p.spol;
    if(p.starost) document.getElementById('starost').value=p.starost;
    if(p.poklic) document.getElementById('poklic').value=p.poklic;
    if(p.ime) document.getElementById('ime').value=p.ime;
    if(p.niche) selNiche(p.niche);
    if(p.hairColor){ST.hair=p.hairColor;selH(p.hairColor);}
    if(p.eyeColor){ST.eye=p.eyeColor;selE(p.eyeColor);}
    if(p.skinColor){ST.skin=p.skinColor;selS(p.skinColor);}
    if(p.faceType) selFT(p.faceType);
    if(!ST.purpose) selPurpose('product');
    lu();
    document.getElementById('res-intent').innerHTML=`<strong>Nastavljeno:</strong> ${p.explanation||'Parametri nastavljeni.'}`;
    document.getElementById('res-intent').classList.add('vis');
    document.getElementById('btn-p0').style.display='block';
  }catch(e){
    document.getElementById('res-intent').innerHTML=`<strong>Napaka:</strong> Poskusi z ročno izbiro.`;
    document.getElementById('res-intent').classList.add('vis');
  }
  btn.disabled=false;sp.style.display='none';
}

// API 2 — Analiza slike
async function aiAnalyzeCharImage(b64,mimeType){
  document.getElementById('char-sub').textContent='Claude analizira sliko...';
  try{
    const reply=await callClaude([{role:'user',content:[
      {type:'image',source:{type:'base64',media_type:mimeType,data:b64}},
      {type:'text',text:'Analyze this AI-generated character image. Describe: age, gender, face type/ethnicity, hair, eyes, skin, expression, clothing, lighting, background. Max 2 sentences in Slovenian.'}
    ]}],'You are an AI image analyst. Be specific and concise.',300);
    document.getElementById('char-sub').textContent=reply;
    document.getElementById('ai-ac-text').textContent=reply;
    document.getElementById('ai-ac').classList.add('vis');
  }catch(e){
    document.getElementById('char-sub').textContent='Analiza ni bila mogoča. Karakter je zaklenjen.';
  }
}

// API 3 — Ocena prompta
async function aiEval(ptId,resId,btnId,spId){
  const prompt=document.getElementById(ptId).textContent;
  if(!prompt||prompt==='—') return;
  const btn=document.getElementById(btnId),sp=document.getElementById(spId);
  const res=document.getElementById(resId);
  btn.disabled=true;sp.style.display='inline-block';res.classList.remove('vis');
  try{
    const reply=await callClaude([{role:'user',content:`Evaluate this Higgsfield AI image prompt:\n\n${prompt}`}],
      `You evaluate AI image prompts for the 10-layer AI Universa protocol. Return ONLY valid JSON:
{"score":1-10,"strengths":["s1","s2"],"weaknesses":["w1"],"suggestion":"improvement in Slovenian","missing_layers":["layer names"]}`,400);
    const p=JSON.parse(reply.replace(/```json|```/g,'').trim());
    const sc=p.score>=8?'score-good':p.score>=6?'score-warn':'score-bad';
    let html=`<div class="eval-score"><span class="score-pill ${sc}">${p.score}/10</span>${(p.missing_layers||[]).map(l=>`<span class="score-pill score-warn">${l}</span>`).join('')}</div>`;
    if(p.strengths?.length) html+=`<div style="margin-bottom:5px"><strong style="color:var(--green-light)">Dobro:</strong> ${p.strengths.join(', ')}</div>`;
    if(p.weaknesses?.length) html+=`<div style="margin-bottom:5px"><strong style="color:#ef9f27">Slabo:</strong> ${p.weaknesses.join(', ')}</div>`;
    if(p.suggestion) html+=`<div><strong style="color:var(--blue-light)">Predlog:</strong> ${p.suggestion}</div>`;
    res.innerHTML=html;res.classList.add('vis');
  }catch(e){res.innerHTML='<span style="color:var(--text3)">Ocena ni bila mogoča.</span>';res.classList.add('vis');}
  btn.disabled=false;sp.style.display='none';
}

