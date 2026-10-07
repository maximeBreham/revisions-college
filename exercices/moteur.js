/*
 * Moteur commun des questions du défi du jour (repris de la page de maths).
 *
 * Un fichier de questions appelle Moteur.banque(id, generateurs), où chaque générateur
 * renvoie une question { cat, run(el, sous_titre, done) } ; run affiche la question dans el
 * et appelle done(reussi, reponse) quand l'élève passe à la suite.
 * Moteur.QCM et Moteur.INPUT fabriquent ces questions à partir de simples données.
 */
(function () {
  const h = html => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = (a, n) => shuffle(a).slice(0, n);
  const nextBtn = (el, onDone, label = "Question suivante") => { const nx = h(`<button class="main-btn">${label}</button>`); nx.onclick = onDone; el.append(nx); return nx; };
  const feedback = (el, ok, title, body) => el.append(h(`<div class="fb ${ok ? "" : "bad"}"><b>${title}</b>${body || ""}</div>`));

  // QCM : options en HTML, correct = index de la bonne réponse
  function QCM(q){return {cat:q.cat,run(el,sub,done){
    el.innerHTML='';if(sub)el.append(h(`<p class="muted small">${sub}</p>`));
    if(q.fig)el.append(h(`<div class="fig">${q.fig}</div>`));
    el.append(h(`<p class="prompt">${q.prompt}</p>`));
    const order=q.keep?q.options.map((o,i)=>i):shuffle(q.options.map((o,i)=>i));
    const box=h(`<div class="opts ${q.grid?'grid2':''}"></div>`);el.append(box);
    order.forEach(i=>{const b=h(`<button class="opt ${q.center?'c':''}">${q.options[i]}</button>`);
      b.onclick=()=>{const ok=i===q.correct;box.querySelectorAll('button').forEach(x=>x.disabled=true);b.classList.add(ok?'ok':'bad');if(!ok)box.children[order.indexOf(q.correct)].classList.add('ok');
        feedback(el,ok,ok?'Bravo !':'Pas tout à fait.',(ok?'':`La bonne réponse : <strong>${q.options[q.correct]}</strong>. `)+(q.explain||''));
        nextBtn(el,()=>done(ok,q.answerText||q.options[q.correct]),q.nextLabel).focus({preventScroll:true})};
      box.append(b)});
  }}}

  // Saisie : fields [{label, after, w}] ou frac, check(valeurs) -> bool ou {ok, note}, answer en HTML
  function INPUT(q){return {cat:q.cat,run(el,sub,done){
    el.innerHTML='';if(sub)el.append(h(`<p class="muted small">${sub}</p>`));
    if(q.fig)el.append(h(`<div class="fig">${q.fig}</div>`));
    el.append(h(`<p class="prompt">${q.prompt}</p>`));
    const box=h('<div class="fields"></div>');el.append(box);const ins=[];
    if(q.frac){const f=h(`<div class="field">${q.fracBefore||''}<span class="fracin"><input inputmode="numeric" aria-label="numérateur"><i></i><input inputmode="numeric" aria-label="dénominateur"></span></div>`);box.append(f);ins.push(...f.querySelectorAll('input'))}
    else q.fields.forEach(f=>{const r=h(`<label class="field">${f.label?`<span>${f.label}</span>`:''}<input inputmode="${f.mode||'decimal'}" autocomplete="off" style="--w:${f.w||'9em'}" aria-label="${esc((f.label||'réponse').replace(/<[^>]+>/g,''))}">${f.after?`<span>${f.after}</span>`:''}</label>`);box.append(r);ins.push(r.querySelector('input'))});
    const go=h('<button class="main-btn">Vérifier</button>');el.append(go);
    const submit=()=>{if(ins.some(i=>!i.value.trim())){go.classList.remove('shake');void go.offsetWidth;go.classList.add('shake');return}
      const vals=ins.map(i=>i.value);const res=q.check(vals);const ok=res===true||(res&&res.ok);
      ins.forEach(i=>{i.disabled=true;i.classList.add(ok?'ok':'bad')});go.remove();
      feedback(el,ok,ok?'Exact !':'Pas tout à fait.',(ok?'':`La bonne réponse : <strong>${q.answer}</strong>. `)+((res&&res.note)||'')+(q.explain||''));
      nextBtn(el,()=>done(ok,q.answer)).focus({preventScroll:true})};
    go.onclick=submit;ins.forEach(i=>i.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();const k=ins.indexOf(i);if(k<ins.length-1)ins[k+1].focus();else submit()}}));
  }}}

  const banques = {};
  window.Moteur = { h, esc, shuffle, pick, QCM, INPUT, banques, banque(id, generateurs) { banques[id] = generateurs; } };
})();
