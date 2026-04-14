// ─── STATE ────────────────────────────────────────────────
let CUR=0,MODE='std',CHAR_IMGS=[],CHAR_B64=null,PROD_IMG=null;
let SHOT_TYPE='portrait',LIB_TYPE='portrait',SEL_SHOT='p-front',SEL_LIB='lp-f';
let ST={hair:'lbrown',eye:'gbrown',skin:'olive',face:'mediteran',niche:null,purpose:null,placement:null};

// ─── MODE SWITCH ──────────────────────────────────────────
function setMode(m){
  MODE=m;
  const isAI=m==='ai';
  document.getElementById('btn-mode-std').className='mode-btn'+(isAI?'':' active-std');
  document.getElementById('btn-mode-ai').className='mode-btn'+(isAI?' active-ai':'');
  document.getElementById('mode-info').textContent=isAI
    ?'Claude AI — naravni jezik, analiza slike, ocena prompta'
    :'Deluje povsod — GitHub Pages, brez API ključa';
  // Show/hide AI panels
  document.querySelectorAll('.ai-panel').forEach(el=>el.classList.toggle('vis',isAI));
  document.querySelectorAll('.eval-box').forEach(el=>el.classList.toggle('vis',isAI));
  document.getElementById('manual-label').style.display=isAI?'block':'none';
}

// ─── DATA ─────────────────────────────────────────────────
const PHASES=[
  {name:'Niša & namen',tag:'Start'},
  {name:'Videz',tag:'Fizično'},
  {name:'Stil & feel',tag:'10 slojev'},
  {name:'Character base',tag:'Generiranje'},
  {name:'Produkt',tag:'Oglaševanje'},
  {name:'Library',tag:'Vsi prompti'},
];
const PURPOSES=[
  {id:'product',name:'Predstavitev produkta'},
  {id:'influencer',name:'Influencer / content'},
  {id:'linkedin',name:'Profesionalni profil'},
  {id:'brand',name:'Brand ambassador'},
  {id:'ugc',name:'UGC content creator'},
  {id:'personal',name:'Osebni projekt'},
];
const NICHES=[
  {id:'beauty',icon:'✦',name:'Kozmetika & beauty',desc:'nega, make-up, parfumi'},
  {id:'food',icon:'◈',name:'Hrana & lifestyle',desc:'kuhanje, recepti, restavracije'},
  {id:'fitness',icon:'◉',name:'Fitnes & zdravje',desc:'šport, wellness, prehrana'},
  {id:'home',icon:'◫',name:'Dom & garden',desc:'notranjost, vrt, orodje'},
  {id:'fashion',icon:'◇',name:'Moda & oblačila',desc:'oblačila, dodatki, stajling'},
  {id:'tech',icon:'◎',name:'Tech & AI',desc:'tehnologija, aplikacije'},
  {id:'luxury',icon:'◈',name:'Luksuz & lifestyle',desc:'ure, avti, potovanja'},
  {id:'kids',icon:'◯',name:'Otroški produkti',desc:'igrače, oblačila, vzgoja'},
  {id:'pet',icon:'◉',name:'Hišni ljubljenci',desc:'hrana, oprema, nega'},
];
const PLACEMENTS=[
  {id:'holding',icon:'◻',name:'Drži v roki',val:'holding the product naturally in one hand, relaxed grip, product clearly visible'},
  {id:'using',icon:'◈',name:'Uporablja',val:'actively using the product, applying or engaging with it, mid-action'},
  {id:'table',icon:'◫',name:'Na površini',val:'product placed on surface nearby, character naturally in scene'},
  {id:'wearing',icon:'◉',name:'Nosi',val:'wearing or incorporating the product as part of appearance'},
  {id:'showing',icon:'◇',name:'Kaže kameri',val:'presenting the product toward camera, showing it clearly'},
  {id:'unboxing',icon:'◎',name:'Odkriva',val:'just received or opened the product, genuine curiosity reaction'},
];
const NPRESET={
  beauty:{l01:1,l02:3,l03:0,l05:3,l06:1,l07:4,l08:1,l09:1,l10:3,expr:4,angle:0,bodyIdx:0,ostyle:2},
  food:{l01:0,l02:1,l03:4,l05:0,l06:2,l07:1,l08:2,l09:1,l10:2,expr:4,angle:0,bodyIdx:2,ostyle:0},
  fitness:{l01:0,l02:3,l03:5,l05:0,l06:2,l07:4,l08:1,l09:1,l10:2,expr:4,angle:1,bodyIdx:2,ostyle:3},
  home:{l01:0,l02:0,l03:2,l05:0,l06:1,l07:0,l08:2,l09:0,l10:0,expr:2,angle:0,bodyIdx:1,ostyle:0},
  fashion:{l01:1,l02:3,l03:1,l05:3,l06:3,l07:4,l08:3,l09:1,l10:3,expr:0,angle:0,bodyIdx:0,ostyle:2},
  tech:{l01:0,l02:2,l03:2,l05:0,l06:0,l07:0,l08:0,l09:0,l10:3,expr:2,angle:0,bodyIdx:1,ostyle:2},
  luxury:{l01:1,l02:3,l03:1,l05:3,l06:4,l07:4,l08:3,l09:1,l10:4,expr:0,angle:1,bodyIdx:1,ostyle:4},
  kids:{l01:0,l02:3,l03:5,l05:1,l06:2,l07:4,l08:1,l09:1,l10:2,expr:4,angle:2,bodyIdx:0,ostyle:0},
  pet:{l01:0,l02:1,l03:5,l05:0,l06:2,l07:4,l08:1,l09:1,l10:2,expr:4,angle:0,bodyIdx:1,ostyle:0},
};
const NSCENES={
  beauty:[
    {id:'sc1',lbl:'Kopalnica — jutro',pose:'standing at bathroom vanity, looking at reflection, morning skincare routine, candid.',sc:'clean modern bathroom, soft morning light, products on vanity, intimate space'},
    {id:'sc2',lbl:'Dnevna soba',pose:'sitting on couch in natural light, relaxed, candid warm moment.',sc:'warm cozy living room, soft cushions, natural window light'},
    {id:'sc3',lbl:'Studio / belo',pose:'standing or sitting, confident natural pose.',sc:'pure white seamless studio background, clean editorial'},
    {id:'sc4',lbl:'Kavarna — jutro',pose:'sitting at cafe table, holding coffee cup, relaxed morning.',sc:'warm morning cafe, wooden tables, soft natural light, coffee visible'},
    {id:'sc5',lbl:'Narava / park',pose:'walking or standing outdoors, natural light, candid and relaxed.',sc:'green park, soft natural daylight, fresh outdoor atmosphere'},
  ],
  food:[
    {id:'sc1',lbl:'Kuhinja — priprava',pose:'standing at counter, preparing food, mid-action, utensil in hand.',sc:'warm home kitchen, fresh ingredients on counter, natural window light, lived-in'},
    {id:'sc2',lbl:'Jedilna miza',pose:'sitting at table, eating or tasting food, genuine candid reaction.',sc:'warm dining table, natural light, food plated, personal home'},
    {id:'sc3',lbl:'Tržnica',pose:'browsing fresh produce, picking up vegetables, candid outdoor.',sc:'outdoor farmers market, fresh produce stalls, natural daylight'},
    {id:'sc4',lbl:'Restavracija',pose:'sitting at restaurant, looking at menu, relaxed and present.',sc:'warm restaurant interior, candlelight or soft light, table setting'},
    {id:'sc5',lbl:'Kavarna',pose:'sitting with coffee and food, casual morning, relaxed.',sc:'cozy cafe, warm light, wooden surfaces, coffee and breakfast visible'},
  ],
  fitness:[
    {id:'sc1',lbl:'Park — tek',pose:'mid-run in park, dynamic action, caught mid-stride, candid.',sc:'green park early morning, soft golden light, trees and path'},
    {id:'sc2',lbl:'Telovadnica',pose:'using gym equipment, mid-action, focused and present.',sc:'modern gym interior, equipment visible, strong overhead lighting'},
    {id:'sc3',lbl:'Narava — pohodništvo',pose:'walking on trail, looking at landscape, candid outdoor.',sc:'mountain or forest trail, natural daylight, trees and nature'},
    {id:'sc4',lbl:'Doma — vadba',pose:'doing yoga or stretching on mat, focused and relaxed.',sc:'bright home interior, yoga mat on wooden floor, natural window light'},
    {id:'sc5',lbl:'Po vadbi',pose:'sitting relaxed after workout, holding water bottle, candid recovery.',sc:'cafe or outdoor bench, soft natural light, relaxed post-workout'},
  ],
  home:[
    {id:'sc1',lbl:'Vrt',pose:'working in garden, kneeling with tools, candid mid-action.',sc:'home garden, green plants and soil, natural daylight'},
    {id:'sc2',lbl:'Dnevna soba',pose:'arranging interior, standing or sitting, candid home moment.',sc:'warm lived-in living room, furniture and personal objects, window light'},
    {id:'sc3',lbl:'Delavnica',pose:'working with tools, mid-action, focused on task.',sc:'home workshop or garage, tools visible, work bench'},
    {id:'sc4',lbl:'Kuhinja — dom',pose:'cooking or cleaning in kitchen, casual home moment.',sc:'home kitchen, countertops, natural light, warm and personal'},
    {id:'sc5',lbl:'Zunaj hiše',pose:'standing in front of house or terrace, relaxed.',sc:'house exterior or terrace, garden visible, natural daylight'},
  ],
  fashion:[
    {id:'sc1',lbl:'Ulica — mesto',pose:'walking on city street, candid street style, mid-stride.',sc:'urban city street, architecture in background, natural daylight'},
    {id:'sc2',lbl:'Kavarna',pose:'sitting at cafe, relaxed, natural light, outfit clearly visible.',sc:'stylish cafe interior, warm light, wooden surfaces'},
    {id:'sc3',lbl:'Studio — editorial',pose:'standing, editorial fashion energy, confident.',sc:'minimal studio or white background, clean editorial'},
    {id:'sc4',lbl:'Park',pose:'walking in park, natural movement, candid.',sc:'green urban park, trees and path, soft natural light'},
    {id:'sc5',lbl:'Butik',pose:'browsing clothing, looking at items, candid shopping moment.',sc:'stylish boutique, clothing racks, warm interior lighting'},
  ],
  tech:[
    {id:'sc1',lbl:'Pisarna — desk',pose:'sitting at desk with laptop, working, focused.',sc:'modern clean desk setup, laptop and tech accessories, soft office light'},
    {id:'sc2',lbl:'Kavarna — laptop',pose:'sitting in cafe working on laptop, focused.',sc:'cafe, laptop on table, coffee nearby, soft natural light'},
    {id:'sc3',lbl:'Doma — couch',pose:'sitting on couch with laptop, relaxed work from home.',sc:'modern home interior, couch, natural window light'},
    {id:'sc4',lbl:'Na poti',pose:'standing or walking with phone, checking device, mid-action.',sc:'urban environment or transport, natural light'},
    {id:'sc5',lbl:'Event',pose:'standing at event or conference, networking, candid.',sc:'modern event space, people blurred in background, professional'},
  ],
  luxury:[
    {id:'sc1',lbl:'Hotelska soba',pose:'standing in luxury hotel suite, relaxed elegant moment.',sc:'luxury hotel room, premium furnishings, soft warm lighting'},
    {id:'sc2',lbl:'Fine dining',pose:'sitting at fine dining table, elegant posture, candid sophisticated.',sc:'upscale restaurant, candlelight, white tablecloth, refined'},
    {id:'sc3',lbl:'Luxury street',pose:'walking on luxury shopping street, elegant and confident.',sc:'high-end shopping district, luxury store fronts'},
    {id:'sc4',lbl:'Jahta / morje',pose:'standing on boat deck, looking at sea, relaxed luxury.',sc:'yacht deck or luxury boat, sea and sky, warm natural light'},
    {id:'sc5',lbl:'Dom — interior',pose:'standing in luxury interior, elegant posture.',sc:'high-end home interior, premium furniture, soft warm lighting'},
  ],
  kids:[
    {id:'sc1',lbl:'Dnevna soba — igra',pose:'sitting on floor with child, playing, genuine interaction.',sc:'warm family living room, toys, soft natural light'},
    {id:'sc2',lbl:'Igrišče',pose:'outdoor at playground, active and happy, candid.',sc:'outdoor playground or park, children equipment, natural daylight'},
    {id:'sc3',lbl:'Kuhinja — skupaj',pose:'in kitchen with child, baking together, candid warm moment.',sc:'warm home kitchen, baking items on counter, natural light'},
    {id:'sc4',lbl:'Spalnica — rutina',pose:'sitting on bed reading to child, warm intimate moment.',sc:"child's bedroom, soft warm lighting, books and toys visible"},
    {id:'sc5',lbl:'Narava',pose:'walking or playing outdoors with child, natural candid.',sc:'park or garden, natural daylight, green environment'},
  ],
  pet:[
    {id:'sc1',lbl:'Doma — z ljubimcem',pose:'sitting on floor or couch with pet, genuine interaction.',sc:'warm home interior, pet visible, natural window light'},
    {id:'sc2',lbl:'Sprehod — park',pose:'walking with dog on leash, outdoor candid.',sc:'park or urban street, natural daylight, authentic outdoor walk'},
    {id:'sc3',lbl:'Vrt',pose:'playing with pet in garden, active candid moment.',sc:'home garden or yard, natural daylight, grass and plants'},
    {id:'sc4',lbl:'Veterinar',pose:'holding or interacting with pet in care setting.',sc:'veterinary office or pet shop, clean professional environment'},
    {id:'sc5',lbl:'Kavarna — terasa',pose:'sitting at outdoor cafe with pet nearby, relaxed lifestyle.',sc:'outdoor cafe terrace, tables and chairs, natural daylight'},
  ],
};
const NOUTFITS={
  beauty:[
    {id:'ou1',lbl:'Jutranji ritual',ou:'soft silk or satin robe, slightly open, intimate morning wear. Barefoot. No jewelry.'},
    {id:'ou2',lbl:'Casual chic',ou:'clean white or neutral fitted t-shirt, high-waisted tailored trousers. Minimal jewelry. Fresh and effortless.'},
    {id:'ou3',lbl:'Editorial',ou:'structured blazer over minimal top, tailored fit. Understated luxury.'},
  ],
  food:[
    {id:'ou1',lbl:'Domači kuhar',ou:'casual linen apron over simple t-shirt, jeans. Sleeves rolled up. Natural and worn-in.'},
    {id:'ou2',lbl:'Chef',ou:'white chef jacket or kitchen wear, slightly used. Practical and real.'},
    {id:'ou3',lbl:'Casual lifestyle',ou:'casual comfortable outfit, light sweater or shirt, jeans. Relaxed.'},
  ],
  fitness:[
    {id:'ou1',lbl:'Athletic wear',ou:'quality athletic leggings or shorts, fitted workout top. Functional, slightly worn.'},
    {id:'ou2',lbl:'Post-workout',ou:'athletic joggers, oversized hoodie. Relaxed post-workout, comfortable.'},
    {id:'ou3',lbl:'Outdoor active',ou:'athletic outdoor wear, running jacket, leggings. Practical.'},
  ],
  home:[
    {id:'ou1',lbl:'Vrtnar',ou:'worn gardening clothes, practical trousers, simple t-shirt. Dirt marks acceptable. Real.'},
    {id:'ou2',lbl:'DIY',ou:'work clothes, worn jeans, flannel shirt. Practical and authentic.'},
    {id:'ou3',lbl:'Casual dom',ou:'comfortable casual home outfit, cotton trousers, soft t-shirt.'},
  ],
  fashion:[
    {id:'ou1',lbl:'Street style',ou:'current street fashion, interesting layering. Confident and effortless.'},
    {id:'ou2',lbl:'Smart casual',ou:'quality tailored pieces, interesting textures. Elevated everyday look.'},
    {id:'ou3',lbl:'Minimalist',ou:'clean minimal wardrobe, neutral tones, quality fabrics. Simple but refined.'},
  ],
  tech:[
    {id:'ou1',lbl:'Smart casual',ou:'quality chinos, clean shirt or subtle sweater. Professional but approachable.'},
    {id:'ou2',lbl:'Startup casual',ou:'clean jeans, quality t-shirt or hoodie. Modern and relaxed.'},
    {id:'ou3',lbl:'Business casual',ou:'blazer over open collar shirt, tailored trousers.'},
  ],
  luxury:[
    {id:'ou1',lbl:'Luxury casual',ou:'cashmere sweater or silk blouse, tailored trousers. No visible logos.'},
    {id:'ou2',lbl:'Evening elegant',ou:'elegant evening attire, refined and sophisticated. Quality fabrics.'},
    {id:'ou3',lbl:'Yacht / resort',ou:'linen or silk resort wear, relaxed elegant fit.'},
  ],
  kids:[
    {id:'ou1',lbl:'Casual parent',ou:'comfortable casual parent outfit, jeans and soft sweater. Real and approachable.'},
    {id:'ou2',lbl:'Active parent',ou:'casual active wear, comfortable and practical for movement.'},
    {id:'ou3',lbl:'Smart casual',ou:'smart casual family-friendly outfit, neat but comfortable.'},
  ],
  pet:[
    {id:'ou1',lbl:'Casual outdoor',ou:'casual outdoor outfit, comfortable jeans, practical jacket.'},
    {id:'ou2',lbl:'Active casual',ou:'comfortable active wear, joggers, practical top.'},
    {id:'ou3',lbl:'Casual home',ou:'relaxed home outfit, soft comfortable clothes.'},
  ],
};
const NVIDEOS={
  beauty:[
    {id:'vi1',lbl:'Nanašanje kreme',mot:'slowly applies product to face with gentle deliberate motion, eyes closed or looking down, peaceful and intimate. Movement amplitude: very low.'},
    {id:'vi2',lbl:'Ogledalo — reakcija',mot:'looking at reflection in mirror, slight satisfied expression, gently touches face. Natural eye blinking. Movement amplitude: very low.'},
    {id:'vi3',lbl:'Odkriva produkt',mot:'opens product packaging slowly, looks at it with genuine curiosity, subtle smile. Movement amplitude: low.'},
    {id:'vi4',lbl:'Jutranja rutina',mot:'picks up product from vanity, looks at it briefly, begins applying. Gentle and unhurried. Movement amplitude: low.'},
  ],
  food:[
    {id:'vi1',lbl:'Meša / kuha',mot:'stirring in bowl or pot, looking down at food with focus, occasional glance up. Movement amplitude: low.'},
    {id:'vi2',lbl:'Okusi',mot:'tastes food from spoon, eyes close briefly, genuine satisfied expression. Movement amplitude: low.'},
    {id:'vi3',lbl:'Reže / pripravlja',mot:'chopping ingredients on cutting board, focused and rhythmic motion. Movement amplitude: medium.'},
    {id:'vi4',lbl:'Vonja jed',mot:'lifts plate toward face, closes eyes briefly and smells, genuine pleasure. Movement amplitude: low.'},
  ],
  fitness:[
    {id:'vi1',lbl:'Razteza se',mot:'slow controlled stretching motion, eyes closed or looking forward. Movement amplitude: low.'},
    {id:'vi2',lbl:'Pije vodo',mot:'lifts water bottle to drink, takes sip, sets it down, brief pause. Movement amplitude: low.'},
    {id:'vi3',lbl:'Diha — recovery',mot:'slow deep breath in, chest rises, holds briefly, exhales slowly. Movement amplitude: very low.'},
    {id:'vi4',lbl:'Ogrevanje',mot:'gentle warm-up motion, rolls shoulders or neck, looks forward. Movement amplitude: low.'},
  ],
  home:[
    {id:'vi1',lbl:'Pregleda delo',mot:'steps back from task, looks at completed work with quiet satisfaction, slight nod. Movement amplitude: very low.'},
    {id:'vi2',lbl:'Dela z orodjem',mot:'using tool with focused deliberate motion, looks at work surface, adjusts grip. Movement amplitude: medium.'},
    {id:'vi3',lbl:'Zaliva rastlino',mot:'slowly waters plant, gentle and careful motion, looks at plants with care. Movement amplitude: low.'},
    {id:'vi4',lbl:'Odpakira',mot:'sets down or opens package, looks at contents with interest and satisfaction. Movement amplitude: low.'},
  ],
  fashion:[
    {id:'vi1',lbl:'Hodi mimo',mot:'confident natural walking motion, slight awareness of surroundings, effortless. Movement amplitude: medium.'},
    {id:'vi2',lbl:'Popravlja obleko',mot:'subtly adjusts collar or sleeve, glances down briefly, looks up with calm confidence. Movement amplitude: very low.'},
    {id:'vi3',lbl:'Gleda v izložbo',mot:'turns head to look at shop window, pauses briefly, continues. Movement amplitude: low.'},
    {id:'vi4',lbl:'Obrne se',mot:'slowly turns from side to face camera, natural and unhurried. Movement amplitude: low.'},
  ],
  tech:[
    {id:'vi1',lbl:'Tipka na laptopu',mot:'typing on laptop, looks at screen, pauses to think, continues typing. Movement amplitude: low.'},
    {id:'vi2',lbl:'Bere ekran',mot:'reading content on screen, slight lean forward, eyes move, occasional nod. Movement amplitude: very low.'},
    {id:'vi3',lbl:'Dvigne pogled',mot:'slowly raises gaze from screen, expression shifts from focus to quiet reflection. Movement amplitude: very low.'},
    {id:'vi4',lbl:'Razmišlja',mot:'pauses from work, looks away from screen, slight lean back, thinking, returns. Movement amplitude: low.'},
  ],
  luxury:[
    {id:'vi1',lbl:'Drži uro / nakit',mot:'lifts wrist to look at watch, slow elegant gesture, quiet appreciation. Movement amplitude: very low.'},
    {id:'vi2',lbl:'Gleda skozi okno',mot:'standing at window, looking out, calm and contemplative. Elegant stillness. Movement amplitude: very low.'},
    {id:'vi3',lbl:'Vzame kozarec',mot:'reaches for wine glass, lifts it slowly, looks briefly, takes slow sip. Movement amplitude: low.'},
    {id:'vi4',lbl:'Hodi elegantno',mot:'slow confident elegant walking motion, poised and unhurried. Movement amplitude: low.'},
  ],
  kids:[
    {id:'vi1',lbl:'Smeje se — iskren',mot:'genuine spontaneous laugh, eyes crinkle naturally, real and warm. Movement amplitude: low.'},
    {id:'vi2',lbl:'Gleda otroka',mot:'looks down with soft warm expression, slight smile, gentle and attentive. Movement amplitude: very low.'},
    {id:'vi3',lbl:'Drži produkt',mot:'holds product naturally, looks at it briefly, looks up with warm approving expression. Movement amplitude: low.'},
    {id:'vi4',lbl:'Pozdravlja',mot:'gentle natural wave or welcoming gesture, warm smile. Movement amplitude: low.'},
  ],
  pet:[
    {id:'vi1',lbl:'Gleda žival',mot:'looks down at pet with warm affectionate expression, gentle. Real connection. Movement amplitude: very low.'},
    {id:'vi2',lbl:'Hodi s psom',mot:'natural walking with slight pull of leash, looks down at dog briefly. Movement amplitude: medium.'},
    {id:'vi3',lbl:'Drži žival',mot:'holds pet naturally, gentle adjustment, looks with genuine affection. Movement amplitude: low.'},
    {id:'vi4',lbl:'Daje hrano',mot:'reaches down to place food bowl, looks at pet with caring expression, straightens up. Movement amplitude: low.'},
  ],
};
const HAIR_COLORS=[
  {id:'blonde',lbl:'Svetli',hex:'#E8D5A3',val:'blonde hair'},
  {id:'lbrown',lbl:'Sv.rjavi',hex:'#A0724A',val:'light brown hair'},
  {id:'dbrown',lbl:'T.rjavi',hex:'#5C3D2E',val:'dark brown hair'},
  {id:'black',lbl:'Črni',hex:'#1a1a1a',val:'black hair'},
  {id:'sp',lbl:'Sivo-t.',hex:'#888888',val:'salt-and-pepper hair'},
  {id:'silver',lbl:'Sivi',hex:'#C0C0C0',val:'silver grey hair'},
  {id:'auburn',lbl:'Rdeč.',hex:'#8B4513',val:'auburn red hair'},
  {id:'plat',lbl:'Platin.',hex:'#F0EDE0',val:'platinum blonde hair'},
];
const EYE_COLORS=[
  {id:'blue',lbl:'Modre',hex:'#4A90D9',val:'blue eyes'},
  {id:'gbrown',lbl:'Zel-rj.',hex:'#6B8E4E',val:'green-brown hazel eyes'},
  {id:'dbrown',lbl:'T.rjave',hex:'#3D1C02',val:'dark brown eyes'},
  {id:'grey',lbl:'Sive',hex:'#8A9BA8',val:'grey eyes'},
  {id:'hazel',lbl:'Hazel',hex:'#9B7653',val:'warm hazel eyes'},
  {id:'green',lbl:'Zelene',hex:'#2D8A4E',val:'bright green eyes'},
];
const SKIN_COLORS=[
  {id:'fair',lbl:'Svetla',hex:'#FDDBB4',val:'fair pale skin'},
  {id:'light',lbl:'Sv.koža',hex:'#F0C896',val:'light skin tone'},
  {id:'olive',lbl:'Olivna',hex:'#C68642',val:'olive Mediterranean skin'},
  {id:'tan',lbl:'Bronasta',hex:'#A0522D',val:'warm tan bronze skin'},
  {id:'brown',lbl:'Rjava',hex:'#7B4F2E',val:'medium brown skin'},
  {id:'dark',lbl:'Temna',hex:'#4A2C0A',val:'dark rich skin tone'},
];
const FACE_TYPES=[
  {id:'nordic',lbl:'Severni',icon:'◻',desc:'angular jaw, sharp features, deep-set eyes'},
  {id:'mediteran',lbl:'Mediter.',icon:'◼',desc:'olive skin, strong nose, expressive features'},
  {id:'latin',lbl:'Latinski',icon:'◈',desc:'warm tones, full lips, expressive eyes'},
  {id:'eastasian',lbl:'Vzh.az.',icon:'◎',desc:'smooth skin, defined cheekbones, almond eyes'},
  {id:'southasian',lbl:'Juž.az.',icon:'◉',desc:'dark expressive eyes, warm olive skin'},
  {id:'african',lbl:'Afriški',icon:'●',desc:'rich dark skin, strong facial structure'},
  {id:'mideast',lbl:'Bl.vzhod',icon:'◆',desc:'dark intense features, defined beard area'},
  {id:'mixed',lbl:'Mešan',icon:'◇',desc:'unique blend of multiple ethnic features'},
];

