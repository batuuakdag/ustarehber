// Araç kataloğu data/vehicles.js dosyasından yüklenir.
const catalogData = window.USTAREHBER_VEHICLE_DATA;
if (!catalogData || !Array.isArray(catalogData.brands)) throw new Error("Araç kataloğu yüklenemedi.");
const $ = id => document.getElementById(id);
const make=$("make"), model=$("model"), year=$("year"), engine=$("engine");
const brandRecords = new Map(catalogData.brands.map(b => [b.make, b]));
function resetSelect(el,label){el.innerHTML="";const o=document.createElement("option");o.value="";o.textContent=label;el.append(o);el.disabled=true;}
function fillSelect(el,values,label){resetSelect(el,label);values.forEach(v=>{const o=document.createElement("option");o.value=v;o.textContent=v;el.append(o);});el.disabled=!values.length;}
function feedback(s){$("vehicleFeedback").textContent=s;}
function selectedModelRecord(){return brandRecords.get(make.value)?.models?.find(m=>m.name===model.value);}
function generationsForSelectedModel(){return selectedModelRecord()?.generation_records||[];}
function generationsForYear(y){return generationsForSelectedModel().filter(g=>Number(y)>=g.start_year&&Number(y)<=g.end_year);}
function engineChoicesForYear(y){
 return generationsForYear(y).flatMap(g=>(g.engine_variants||[]).map(e=>({generation:g,engine:e})));
}
let currentEngineChoice=null;

fillSelect(make,catalogData.brands.map(b=>b.make),"Marka seçin");
resetSelect(model,"Önce marka seçin");resetSelect(year,"Önce model seçin");resetSelect(engine,"Önce yıl seçin");

make.addEventListener("change",()=>{
 resetSelect(model,"Model seçin");resetSelect(year,"Önce model seçin");resetSelect(engine,"Önce yıl seçin");
 $("vehicleProfile").hidden=true;
 const names=(brandRecords.get(make.value)?.models||[]).map(b=>b.name);
 fillSelect(model,names,"Model seçin");
 feedback(names.length?`${make.value} markası için ${names.length} model listelendi.`:"Bu marka için model kaydı bulunamadı.");
});
model.addEventListener("change",()=>{
 resetSelect(year,"Model yılı seçin");resetSelect(engine,"Önce yıl seçin");$("vehicleProfile").hidden=true;
 const gens=generationsForSelectedModel();
 if(!gens.length){feedback(`${model.value} model kaydı mevcut; kasa/yıl verileri henüz araştırılmadı.`);return;}
 const years=new Set();
 gens.forEach(g=>{for(let y=g.start_year;y<=g.end_year;y++)years.add(y);});
 fillSelect(year,[...years].sort((a,b)=>b-a).map(String),"Model yılı seçin");
 feedback(`${model.value} için ${gens.length} kasa/nesil kaydı ve ${years.size} model yılı listelendi. Motor uyumlulukları doğrulama durumuyla gösterilir.`);
});
year.addEventListener("change",()=>{
 resetSelect(engine,"Motor seçeneği");currentEngineChoice=null;
 const gens=generationsForYear(year.value);
 const groups=engineChoicesForYear(year.value);
 if(!gens.length){feedback("Bu yıl için kasa kaydı bulunamadı.");return;}
 if(!groups.length){feedback(`${year.value} yılı için kasa kaydı var; motor seçeneği henüz araştırılmadı.`);return;}
 engine.innerHTML='<option value="">Motor ailesi seçin</option>';
 groups.forEach((choice,i)=>{
   const g=choice.engine;
   const o=document.createElement("option");o.value=String(i);
   o.textContent=`${choice.generation.generation}: ${g.description} · doğrulama bekliyor`;
   engine.append(o);
 });
 engine.disabled=false;
 feedback(`${year.value} için ${gens.map(g=>g.generation).join(", ")} kasa kaydı bulundu. Motorlar aday listedir; Türkiye uyumluluğu ve motor kodu doğrulanmalıdır.`);
});
engine.addEventListener("change",()=>{
 const groups=engineChoicesForYear(year.value);
 currentEngineChoice=groups[Number(engine.value)]||null;
});
$("vehicleSubmit").addEventListener("click",()=>{
 const missing=[];if(!make.value)missing.push("marka");if(!model.value)missing.push("model");if(!year.value)missing.push("model yılı");if(!engine.value)missing.push("motor ailesi");
 if(missing.length){feedback("Lütfen "+missing.join(", ")+" seçin. Motor verisi bulunmayan kombinasyonlarda profil açılmaz.");return;}
 const choice=currentEngineChoice;
 if(!choice){feedback("Seçilen kombinasyon için motor verisi bulunamadı.");return;}
 const code=$("engineCode").value.trim();
 $("profileTitle").textContent=`${year.value} ${make.value} ${model.value}`;
 $("profileSubtitle").textContent=`${choice.generation.generation} · ${choice.engine.description}${code?" · Girilen kod: "+code+" (doğrulanmadı)":""}`;
 $("vehicleProfile").hidden=false;
 feedback("Araç profili açıldı. Motor ailesi aday veridir; Türkiye uyumluluğu, motor kodu ve teknik değerler doğrulanmadan kesin kabul edilmemelidir.");
 $("vehicleProfile").scrollIntoView({behavior:"smooth",block:"start"});
});
$("yearNow").textContent=new Date().getFullYear();
$("menuToggle").addEventListener("click",()=>$("mainNav").classList.toggle("open"));
const dialog=$("infoDialog");
function show(title,html){$("dialogTitle").textContent=title;$("dialogContent").innerHTML=html;dialog.showModal()}
$("dialogClose").addEventListener("click",()=>dialog.close());
const genericNotice='<p>Bu başlık için araç ve motor koduna özel, kaynak belgesiyle doğrulanmış içerik hazırlanmalıdır.</p><p class="notice"><b>Önemli:</b> Bu sayfadaki prototip, henüz üretici dokümanlarıyla doğrulanmış bakım aralığı, yağ kapasitesi, tork değeri veya parça uyumluluğu sunmaz. Bu değerleri tahmin etmeyin; aracın kullanım kılavuzuna ve yetkili teknik dokümanına başvurun.</p>';
document.querySelectorAll(".guide-body a").forEach(a=>a.addEventListener("click",e=>{e.preventDefault();show(a.closest(".guide-card").querySelector("h3").textContent,genericNotice)}));
document.querySelectorAll("[data-symptom]").forEach(a=>a.addEventListener("click",e=>{e.preventDefault();show(a.dataset.symptom,`<p>Bu belirti birden fazla nedenden kaynaklanabilir; tek başına kesin arıza teşhisi değildir.</p><ul><li>Belirtinin ne zaman ve hangi koşullarda oluştuğunu not edin.</li><li>Gösterge uyarılarını ve varsa arıza kodlarını kaydedin.</li><li>Güvenliği etkileyen durumda aracı kullanmayı bırakıp profesyonel destek alın.</li></ul><p class="notice">Aracın marka, model, yıl, motor ve arıza kodu bilgileri olmadan parça değişimi veya kesin teşhis önerilmez.</p>`)}));
$("allSymptoms").addEventListener("click",()=>show("Belirti rehberi",genericNotice));
$("searchForm").addEventListener("submit",e=>{e.preventDefault();const q=$("globalSearch").value.trim();if(!q){$("globalSearch").focus();return}show("Arama: "+q,`<p>“${escapeHtml(q)}” için arama altyapısı bu ilk sürümde henüz bağlı değil.</p><p>Bir sonraki geliştirme aşamasında araç uyumlu rehberler ve doğrulanmış içerikler arasında arama yapılacak.</p>`)}); 

const repairLibrary = {
  motor: {
    title:"Motor ve turbo tamir rehberleri",
    intro:"Motor arızalarında aynı belirti birden fazla nedenden kaynaklanabilir. Parça değiştirmeden önce teşhis yapılmalıdır.",
    items:[
      ["Motor yağ eksiltiyor / yağ yakıyor","Yağ seviyesi ve kaçak kontrolü; egzoz dumanının rengi ve oluştuğu koşulların kaydı; karter havalandırması, turbo ve silindir içi aşınma ihtimallerinin servis tarafından değerlendirilmesi."],
      ["Turbo basıncı düşük veya çekiş zayıf","Arıza kodlarının okunması; emiş ve basınç hortumları, intercooler bağlantıları ve vakum/aktüatör sisteminin kontrolü. Turbo doğrudan arızalı kabul edilmemelidir."],
      ["Motor tekliyor / düzensiz çalışıyor","Arıza kodu, canlı sensör verileri, ateşleme veya enjeksiyon sistemi ve kompresyon kontrolleri motor tipine uygun prosedürle değerlendirilir."]
    ]
  },
  transmission:{
    title:"Şanzıman ve debriyaj rehberleri",
    intro:"Şanzıman türü (manuel, tork konvertörlü, çift kavramalı, CVT) belirlenmeden işlem tarifi verilemez.",
    items:[
      ["Vites geçişleri sert veya gecikmeli","Şikâyetin soğuk/sıcak koşullarda oluşup oluşmadığı kaydedilir; arıza kodları, yağ seviyesi/şartnamesi ve bağlantı-elektronik kontrolleri üretici prosedürüyle incelenir."],
      ["Debriyaj kaçırıyor veya titriyor","Kavrama noktası, pedal hissi, koku ve yük altındaki davranış not edilir. Baskı-balata ve volan değerlendirmesi uygun ekipmanla servis tarafından yapılır."],
      ["Şanzımandan uğultu geliyor","Sesin vites, hız ve yükle ilişkisi belirlenir. Yağ kaçağı ve mekanik boşluk kontrolleri uzman incelemesi gerektirir."]
    ]
  },
  brakes:{
    title:"Fren ve yürüyen aksam rehberleri",
    intro:"Fren ve direksiyon parçaları doğrudan sürüş güvenliğini etkiler. Bu bölüm arıza belirtilerini tanımaya yardımcı olur; onarım profesyonel kontrol gerektirir.",
    items:[
      ["Fren yaparken ses geliyor","Sesin sürtme, ötme veya vuruntu şeklinde olup olmadığı; fren pedalında titreşim ve uyarı lambaları not edilir. Disk, balata ve kaliper kontrolü yapılmalıdır."],
      ["Fren pedalı yumuşak veya dibe yaklaşıyor","Aracı kullanmaya devam etmeyin. Hidrolik kaçak, hava veya hidrolik bileşen arızası ihtimali nedeniyle çekici ve servis desteği alın."],
      ["Araç yolda sağa veya sola çekiyor","Lastik basınçları, lastik hasarı ve fren sıkışması ihtimalleri değerlendirilir; rot ayarı ve süspansiyon kontrolü uzman tarafından yapılır."]
    ]
  },
  electrical:{
    title:"Elektrik ve elektronik rehberleri",
    intro:"Elektrik arızalarında ölçüm ve devre şeması önemlidir. Rastgele kablo köprüleme veya sigorta değerini büyütme yapılmamalıdır.",
    items:[
      ["Araç marş basmıyor","Akü kutup başı ve voltajı, şase bağlantıları, marş komutu ve marş motoru devresi uygun ölçüm cihazıyla kontrol edilir."],
      ["Akü lambası yanıyor","Şarj sistemi, alternatör, kayış ve kablo bağlantıları kontrol edilmelidir. Şarj uyarısı varken sürüşe devam etmek aracın stop etmesine neden olabilir."],
      ["Motor arıza lambası yanıyor","OBD arıza kodu ve donmuş kare verisi okunur. Kod, tek başına değişmesi gereken parçayı kesin olarak göstermez."]
    ]
  },
  cooling:{
    title:"Soğutma sistemi rehberleri",
    intro:"Aşırı ısınma motor hasarına yol açabilir. Sıcak motorda genleşme kabı kapağı açılmaz.",
    items:[
      ["Motor hararet yapıyor","Güvenli yerde durun, motoru zorlamayın. Sıcak soğutma sistemi kapağını açmayın. Kaçak, fan, termostat, radyatör ve pompa kontrolleri soğuduktan sonra uzman tarafından yapılmalıdır."],
      ["Soğutma suyu eksiltiyor","Seviye takibi ve görünür kaçak kontrolü yapılır. Hortum, radyatör, pompa, kalorifer peteği ve motor içi kaçak olasılıkları test edilmelidir."],
      ["Kalorifer yeterince ısıtmıyor","Soğutma sıvısı seviyesi, hava yapma, termostat ve kalorifer devresi olasılıkları değerlendirilir. Sıcak sistem üzerinde işlem yapılmamalıdır."]
    ]
  },
  fuel:{
    title:"Yakıt ve egzoz sistemi rehberleri",
    intro:"Yakıt ve egzoz sistemlerinde yüksek basınç ve sıcaklık tehlikesi olabilir. Özellikle dizel common-rail hatlarına müdahale edilmemelidir.",
    items:[
      ["Araç siyah, beyaz veya mavi duman atıyor","Dumanın motor sıcaklığı, hızlanma ve yükle ilişkisi not edilir. Renk tek başına kesin teşhis değildir; motor, turbo, yakıt ve emisyon sistemi birlikte değerlendirilir."],
      ["Dizel araç zor çalışıyor","Akü-marş hızı, kızdırma sistemi, yakıt beslemesi, hava yapma ve arıza kodları motor tipine uygun testlerle incelenir."],
      ["DPF / EGR uyarısı var","Arıza kodları, diferansiyel basınç ve sıcaklık sensörleri ile rejenerasyon geçmişi değerlendirilir. Uyarıyı söndürmek için emisyon sistemini iptal etmek önerilmez."]
    ]
  }
};
function openRepair(key){
  const data=repairLibrary[key]; if(!data)return;
  const cards=data.items.map(([title,desc])=>`<li><b>${escapeHtml(title)}</b><br>${escapeHtml(desc)}</li>`).join("");
  show(data.title,`<p>${escapeHtml(data.intro)}</p><ul class="repair-modal-list">${cards}</ul><p class="notice"><b>Doğrulama notu:</b> Bunlar genel ön değerlendirme açıklamalarıdır; araç özelinde sökme-takma sırası, tork, ölçüm limiti ve parça kodu değildir. Kesin işlem için marka, model, yıl, motor kodu ve üretici teknik dokümanı gerekir.</p>`);
}
document.querySelectorAll("[data-repair]").forEach(button=>button.addEventListener("click",()=>openRepair(button.dataset.repair)));

function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}


// Genel OBD-II DTC başlangıç kütüphanesi: araç özelindeki üretici kodlarından ayrı tutulur.
(async function initDtcLibrary(){
 const input=document.getElementById("dtcSearch"), btn=document.getElementById("dtcSearchBtn"), host=document.getElementById("dtcResults");
 if(!input||!btn||!host)return;
 let records=[];
 try{const r=await fetch("data/dtc-library.json");if(!r.ok)throw new Error("DTC verisi okunamadı");const d=await r.json();records=d.records||[];}
 catch(e){host.textContent="Arıza kodu kütüphanesi yüklenemedi. Dosyaların birlikte yüklendiğini kontrol edin.";return;}
 const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 function render(){
  const q=input.value.trim().toUpperCase();
  if(!q){host.innerHTML='<p class="dtc-empty">Aramak için bir OBD-II kodu veya belirti yazın.</p>';return;}
  const hits=records.filter(x=>[x.code,x.title,x.system,x.meaning,...x.causes].join(" ").toUpperCase().includes(q));
  if(!hits.length){host.innerHTML='<p class="dtc-empty">Bu kod bu başlangıç kütüphanesinde bulunamadı. Üreticiye özel kodlar ve modül kodları ayrıca araştırılmalıdır.</p>';return;}
  host.innerHTML=hits.map(x=>`<article class="dtc-card"><div class="dtc-card-head"><span class="dtc-code">${esc(x.code)}</span><span class="dtc-system">${esc(x.system)}</span></div><h3>${esc(x.title)}</h3><p>${esc(x.meaning)}</p><div class="dtc-columns"><div><b>Olası nedenler</b><ul>${x.causes.map(v=>`<li>${esc(v)}</li>`).join("")}</ul></div><div><b>Önerilen teşhis sırası</b><ol>${x.checks.map(v=>`<li>${esc(v)}</li>`).join("")}</ol></div></div><p class="dtc-warning">${esc(x.warning)}</p><small>${esc(x.status)}</small></article>`).join("");
 }
 btn.addEventListener("click",render);input.addEventListener("keydown",e=>{if(e.key==="Enter")render();});input.addEventListener("input",()=>{if(input.value.trim().length>=4)render();});
 host.innerHTML='<p class="dtc-empty">Kütüphanede '+records.length+' genel OBD-II kodu var. Arama yaparak başlayın.</p>';
})();


// Model/motor bazli kronik ariza arastirma kayitlari
(async function initModelFaultLibrary(){
 const filter=document.getElementById("faultModelFilter"),host=document.getElementById("modelFaultResults");
 if(!filter||!host)return;
 let records=[];
 try{const r=await fetch("data/model-faults.json");if(!r.ok)throw new Error("Model ariza verisi okunamadi");const d=await r.json();records=d.records||[];}
 catch(e){host.textContent="Model arıza araştırmaları yüklenemedi. Dosyaların birlikte yüklendiğini kontrol edin.";return;}
 const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const opts=[...new Set(records.map(x=>x.id))];
 filter.innerHTML='<option value="">Tüm araştırmalar</option>'+records.map(x=>`<option value="${esc(x.id)}">${esc(x.make+" "+x.model+" — "+x.engine)}</option>`).join("");
 function render(){
  const selected=filter.value;
  const list=records.filter(x=>!selected||x.id===selected);
  host.innerHTML=list.map(v=>`<article class="model-fault-card"><div class="model-fault-top"><div><span class="fault-model-label">${esc(v.make+" "+v.model)}</span><h3>${esc(v.generation)}</h3><p>${esc(v.engine)} · ${esc(v.years)}</p></div><span class="fault-count">${v.faults.length} arıza başlığı</span></div>${v.faults.map(f=>`<div class="model-fault-item"><h4>${esc(f.name)}</h4><div class="fault-detail-grid"><div><b>Belirtiler</b><ul>${f.symptoms.map(s=>`<li>${esc(s)}</li>`).join("")}</ul></div><div><b>Arıza kodları</b>${f.codes.length?f.codes.map(c=>`<p><code>${esc(c.code)}</code> — ${esc(c.note)}</p>`).join(""):'<p class="no-code">Bu kaynakta bu arıza için kesin kod doğrulanmadı; kod eklenmedi.</p>'}</div></div><b>Teşhis sırası</b><ol>${f.checks.map(s=>`<li>${esc(s)}</li>`).join("")}</ol><p class="repair-suggestion"><b>Çözüm yaklaşımı:</b> ${esc(f.fix)}</p><p class="dtc-warning"><b>Dikkat:</b> ${esc(f.caution)}</p></div>`).join("")}<div class="model-fault-sources"><b>Kaynaklar</b>${v.sources.map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)} ↗</a>`).join("")}<small>${esc(v.evidence)}</small></div></article>`).join("");
 }
 filter.addEventListener("change",render);render();
})();


// Kaynaklarda tekrar eden yüksek dikkatli binek araç/motor kombinasyonları
(async function initHighRiskVehicles(){
 const host=document.getElementById("highRiskResults"), search=document.getElementById("highRiskSearch"), filter=document.getElementById("highRiskFilter");
 if(!host||!search||!filter)return;
 let records=[];
 try{const r=await fetch("data/high-risk-vehicles.json");if(!r.ok)throw new Error("risk verisi yüklenemedi");const d=await r.json();records=d.records||[];}
 catch(e){host.textContent="Araç risk araştırmaları yüklenemedi. Dosyaların birlikte yüklendiğini kontrol edin.";return;}
 const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 function render(){
  const q=search.value.trim().toLocaleLowerCase("tr-TR"), risk=filter.value;
  const list=records.filter(x=>(!risk||x.risk===risk)&&(!q||[x.make,x.models,x.engine,x.years,x.issue,x.symptoms.join(" ")].join(" ").toLocaleLowerCase("tr-TR").includes(q)));
  host.innerHTML=list.length?list.map(v=>`<article class="high-risk-card"><div class="high-risk-head"><div><span class="high-risk-make">${esc(v.make)}</span><h3>${esc(v.issue)}</h3><p><b>Modeller:</b> ${esc(v.models)}</p><p><b>Motor/şanzıman:</b> ${esc(v.engine)} · ${esc(v.years)}</p></div><span class="high-risk-level">${esc(v.risk)}</span></div><div class="high-risk-grid"><div><b>Görülebilecek belirtiler</b><ul>${v.symptoms.map(s=>`<li>${esc(s)}</li>`).join("")}</ul></div><div><b>Ekspertiz / teşhis kontrolü</b><ol>${v.checks.map(s=>`<li>${esc(s)}</li>`).join("")}</ol></div></div><p class="high-risk-fix"><b>Onarım yaklaşımı:</b> ${esc(v.fix)}</p><p class="high-risk-warning"><b>Önemli:</b> ${esc(v.caution)}</p><div class="high-risk-sources"><b>Kaynaklar</b>${v.sources.map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)} ↗</a>`).join("")}<small>${esc(v.evidence)}</small></div></article>`).join(""):'<p class="high-risk-empty">Bu aramayla eşleşen kayıt bulunamadı.</p>';
 }
 search.addEventListener("input",render);filter.addEventListener("change",render);render();
})();


// V10: genel sistem arıza ve teşhis kütüphanesi
(async function initSystemFaultLibrary(){
 const host=document.getElementById("systemFaultResults"), search=document.getElementById("systemFaultSearch"), filter=document.getElementById("systemFaultCategory");
 if(!host||!search||!filter)return;
 let data;
 try{const r=await fetch("data/system-fault-library.json");if(!r.ok)throw new Error("veri yüklenemedi");data=await r.json();}
 catch(e){host.textContent="Sistem arıza kütüphanesi yüklenemedi. ZIP içindeki data klasörünü kontrol edin.";return;}
 const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 (data.categories||[]).forEach(c=>{const o=document.createElement("option");o.value=c.id;o.textContent=c.name;filter.append(o);});
 function render(){
  const q=search.value.trim().toLocaleLowerCase("tr-TR"), cat=filter.value;
  const list=(data.records||[]).filter(x=>(!cat||x.category===cat)&&(!q||[x.title,x.system,x.symptoms.join(" "),x.possible_causes.join(" "),x.repair_approach].join(" ").toLocaleLowerCase("tr-TR").includes(q)));
  host.innerHTML=list.length?list.map(x=>`<article class="system-fault-card">
   <div class="system-fault-card-head"><div><span>${esc(x.system)}</span><h3>${esc(x.title)}</h3></div><code>${esc(x.id)}</code></div>
   <div class="system-fault-grid">
    <div><b>Belirtiler</b><ul>${x.symptoms.map(v=>`<li>${esc(v)}</li>`).join("")}</ul></div>
    <div><b>Muhtemel nedenler</b><ul>${x.possible_causes.map(v=>`<li>${esc(v)}</li>`).join("")}</ul></div>
    <div><b>Teşhis adımları</b><ol>${x.diagnostic_steps.map(v=>`<li>${esc(v)}</li>`).join("")}</ol></div>
    <div><b>Çözüm yaklaşımı</b><p>${esc(x.repair_approach)}</p></div>
   </div>
   <div class="system-fault-cost"><b>Tahmini onarım maliyeti:</b> ${esc(x.cost_estimate.status)}. ${esc(x.cost_estimate.note)}</div>
   <p class="system-fault-caution"><b>Güvenlik / doğrulama:</b> ${esc(x.caution)}</p>
   <div class="system-fault-source"><a href="${esc(x.sources[0].url)}" target="_blank" rel="noopener noreferrer">${esc(x.sources[0].label)} ↗</a><small>${esc(x.verification)}</small></div>
  </article>`).join(""):'<p class="system-fault-empty">Aramanızla eşleşen kayıt bulunamadı.</p>';
 }
 search.addEventListener("input",render);filter.addEventListener("change",render);render();
})();


// V11: Marka -> model -> kasa -> motor -> modele özel arıza zinciri
(async function initVehicleEngineChains(){
 const ids=["chainMake","chainModel","chainGeneration","chainEngine","vehicleChainDetails"];
 const els=ids.map(id=>document.getElementById(id));
 if(els.some(x=>!x))return;
 const [makeSel,modelSel,genSel,engineSel,details]=els;
 let db, faultDb;
 try{
  const [a,b]=await Promise.all([fetch("data/vehicle-engine-chains.json"),fetch("data/model-faults.json")]);
  if(!a.ok||!b.ok)throw new Error("Veri dosyaları yüklenemedi");
  db=await a.json();faultDb=await b.json();
 }catch(e){details.textContent="Araç/motor verisi yüklenemedi. data klasörünü kontrol edin.";return;}
 const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const unique=a=>[...new Set(a)];
 function fill(sel,values){sel.innerHTML=values.map((v,i)=>`<option value="${i}">${esc(v)}</option>`).join("");}
 function current(){const make=makeSel.options[makeSel.selectedIndex]?.textContent;return db.records.find(x=>x.make===make);}
 function modelRecords(){return db.records.filter(x=>x.make===current().make);}
 function selectedChain(){
  const m=current(), same=modelRecords();
  const model=same[Number(modelSel.value)];
  const g=model.generation;
  return {m,model,g,engine:model.engines[Number(engineSel.value)]};
 }
 function renderDetails(){
  const {model,engine}=selectedChain();
  const linked=(faultDb.records||[]).filter(r=>model.fault_record_ids.includes(r.id));
  details.innerHTML=`<article class="vehicle-chain-card">
   <div class="vehicle-chain-card-head"><div><span>${esc(model.make)} / ${esc(model.model)}</span><h3>${esc(model.generation)}</h3><small>${esc(model.years)} · ${esc(model.body)}</small></div><span class="vehicle-chain-engine-tag">${esc(engine.label)}</span></div>
   <div class="vehicle-chain-specs">
    <div><small>Motor ailesi</small><b>${esc(engine.engine_family)}</b></div>
    <div><small>Hacim</small><b>${engine.displacement_cc.toLocaleString("tr-TR")} cc</b></div>
    <div><small>Yakıt</small><b>${esc(engine.fuel)}</b></div>
    <div><small>Motor kodu adayları</small><b>${engine.engine_codes.map(esc).join(" · ")}</b></div>
   </div>
   <p class="vehicle-chain-code-note">${esc(engine.code_status)}</p>
   <p>${esc(model.note)}</p>
   <h4>Modele özel arıza ve çözüm kayıtları</h4>
   ${linked.length?linked.map(r=>`<div class="vehicle-chain-fault"><h5>${esc(r.make)} ${esc(r.model)} – ${esc(r.generation)}</h5><p><b>Motor:</b> ${esc(r.engine)}</p>${r.faults.map(f=>`<details><summary>${esc(f.name)}</summary><p><b>Belirtiler:</b> ${esc((f.symptoms||[]).join(" · "))}</p><p><b>Kontroller:</b> ${esc((f.checks||[]).join(" → "))}</p><p><b>Çözüm:</b> ${esc(f.fix||f.solution||"Teşhis sonucuna göre üretici prosedürüyle onarım.")}</p>${(f.codes||[]).length?`<p><b>İlgili kodlar:</b> ${f.codes.map(c=>esc(c.code)).join(", ")}. Kod tek başına parça arızasını kanıtlamaz.</p>`:""}</details>`).join("")}</div>`).join(""):'<p>Bu motor için henüz ayrı modele özel arıza kaydı eklenmedi.</p>'}
   <h4>Kaynaklar</h4><ul>${model.sources.map(s=>`<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)} ↗</a></li>`).join("")}</ul>
  </article>`;
 }
 function refreshModels(){
  const models=modelRecords();fill(modelSel,models.map(x=>x.model+" – "+x.generation));refreshEngines();
 }
 function refreshEngines(){
  const model=modelRecords()[Number(modelSel.value)]||modelRecords()[0];
  fill(genSel,[model.generation+" ("+model.years+")"]);fill(engineSel,model.engines.map(x=>x.label));renderDetails();
 }
 fill(makeSel,unique(db.records.map(x=>x.make)));
 makeSel.addEventListener("change",refreshModels);
 modelSel.addEventListener("change",refreshEngines);
 engineSel.addEventListener("change",renderDetails);
 refreshModels();
})();
