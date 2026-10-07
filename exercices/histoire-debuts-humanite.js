/* Questions du défi pour « Les débuts de l'humanité ».
 * Données copiées de revisions/histoire-debuts-humanite.html (sans les questions sur carte). */
(function () {
const { shuffle, pick } = Moteur;
const DEFS = [
 ["Décennie","Période de 10 ans."],
 ["Siècle","Période de 100 ans."],
 ["Millénaire","Période de 1 000 ans."],
 ["Hominidés","Famille qui regroupe les êtres humains, leurs ancêtres et les grands singes (chimpanzés, gorilles, orangs-outans)."],
 ["Paléolithique","« Âge de la pierre ancienne » (pierre taillée) : première et plus longue période de la Préhistoire. Les humains sont nomades et vivent de la chasse, de la pêche et de la cueillette."],
 ["Néolithique","« Âge de la pierre nouvelle » (pierre polie) : période de la Préhistoire où les humains deviennent agriculteurs, éleveurs et sédentaires."],
 ["Homo habilis","« Homme habile » : première espèce du genre humain. Il fabrique des outils en pierre taillée (vers -2,5 millions d'années)."],
 ["Homo erectus","« Homme debout » : espèce humaine qui maîtrise le feu et qui sort d'Afrique (vers -2 millions d'années)."],
 ["Homo sapiens","« Homme sage » : notre espèce. Apparu en Afrique vers -300 000 ans, il a peuplé toute la Terre."],
 ["Nomades","Personnes qui n'ont pas d'habitation fixe et qui se déplacent pour trouver leur nourriture."],
 ["Sédentaires","Personnes qui vivent toujours au même endroit."],
 ["Art pariétal","Peintures et gravures réalisées sur les parois des grottes."],
 ["Art rupestre","Peintures et gravures réalisées sur des rochers, en plein air."],
 ["Art mobilier","Objets d'art que l'on peut déplacer : statuettes, os ou bois gravés…"],
 ["Artisanat","Fabrication d'objets à la main : poteries, tissus, outils…"],
 ["Croissant fertile","Région du Proche-Orient en forme de croissant, aux terres fertiles grâce aux fleuves (Tigre, Euphrate). L'agriculture y apparaît vers -10 000 ans."],
 ["Révolution néolithique","Ensemble des grands changements du Néolithique : les humains deviennent agriculteurs, éleveurs et sédentaires."],
 ["Préhistoire","Période qui va de l'apparition des premiers humains jusqu'à l'invention de l'écriture (vers -3300)."],
 ["Histoire","Période qui commence avec l'invention de l'écriture (vers -3300) et continue jusqu'à aujourd'hui."],
 ["Antiquité","Première période de l'Histoire : de l'invention de l'écriture (vers -3300) jusqu'en 476."],
];
const DATES = [
 {k:"Toumaï (début de la lignée humaine)", d:"vers -7 millions d'années", v:-7e6},
 {k:"Lucy", d:"vers -3,2 millions d'années", v:-3.2e6},
 {k:"Homo habilis (début du genre humain)", d:"vers -2,5 millions d'années", v:-2.5e6},
 {k:"Homo erectus", d:"vers -2 millions d'années", v:-2e6},
 {k:"Domestication du feu", d:"vers -400 000 ans", v:-4e5},
 {k:"Homme de Néandertal", d:"vers -350 000 ans", v:-3.5e5},
 {k:"Homo sapiens", d:"vers -300 000 ans", v:-3e5},
 {k:"Peintures de la grotte de Lascaux", d:"vers -18 000 ans", v:-18000},
 {k:"Apparition de l'agriculture", d:"vers -10 000 ans", v:-10000},
 {k:"Apparition de l'écriture", d:"vers -3300", v:-3300},
 {k:"Point de départ pour compter les années", d:"l'an 1 : naissance de Jésus-Christ (selon la tradition)", v:1},
];
const SPANS = [
 {k:"Préhistoire", d:"de -7 millions d'années à -3300"},
 {k:"Paléolithique", d:"de -3 millions d'années à -10 000 ans"},
 {k:"Néolithique", d:"de -10 000 à -3300 (au Proche-Orient)"},
 {k:"Histoire", d:"depuis -3300 (invention de l'écriture)"},
 {k:"Antiquité", d:"de -3300 à 476"},
];
const PERIOD_EVENTS = [
 ["Homo habilis fabrique ses premiers outils","Paléolithique"],
 ["Homo erectus sort d'Afrique","Paléolithique"],
 ["Domestication du feu","Paléolithique"],
 ["Homme de Néandertal","Paléolithique"],
 ["Apparition d'Homo sapiens","Paléolithique"],
 ["Peintures de Lascaux","Paléolithique"],
 ["Chasseurs-cueilleurs nomades","Paléolithique"],
 ["Premiers villages d'agriculteurs","Néolithique"],
 ["Domestication des chèvres et des moutons","Néolithique"],
 ["Premières poteries pour stocker les grains","Néolithique"],
 ["Haches en pierre polie","Néolithique"],
 ["Invention de l'écriture","Antiquité"],
 ["Naissance de Jésus-Christ (an 1)","Antiquité"],
 ["Construction des pyramides d'Égypte","Antiquité"],
];
const QCM = [
 {q:"Où a été découvert Toumaï ?",o:["Au Tchad","En Éthiopie","En France","En Chine"],e:"Toumaï a été découvert en 2001 dans le désert du Djourab, au Tchad, en Afrique."},
 {q:"Il y a combien de temps vivait Toumaï ?",o:["Environ 7 millions d'années","Environ 3,2 millions d'années","Environ 300 000 ans","Environ 18 000 ans"],e:"Toumaï (vers -7 millions d'années) est le plus ancien représentant connu de la lignée humaine."},
 {q:"Que veut dire « Toumaï » ?",o:["Espoir de vie","Homme debout","Homme habile","Premier chasseur"],e:"En langue gorane (au Tchad), Toumaï signifie « espoir de vie »."},
 {q:"Où et quand a été découverte Lucy ?",o:["En Éthiopie, en 1974","Au Tchad, en 2001","En France, en 1940","En Égypte, en 1922"],e:"Lucy a été découverte en Éthiopie en 1974."},
 {q:"Lucy a vécu il y a environ…",o:["3,2 millions d'années","7 millions d'années","300 000 ans","10 000 ans"],e:"Lucy date d'environ -3,2 millions d'années."},
 {q:"Qu'est-ce que Lucy ?",o:["Une australopithèque qui marchait debout","Une Homo sapiens","Une femme de Néandertal","Un grand singe d'aujourd'hui"],e:"Lucy est une australopithèque : elle marchait debout (bipède) mais grimpait encore aux arbres."},
 {q:"Pourquoi dit-on que l'Afrique est le « berceau de l'humanité » ?",o:["Parce qu'on y a trouvé les plus anciens fossiles de la lignée humaine","Parce que l'écriture y a été inventée","Parce que les premières villes y ont été construites","Parce que tous les humains y vivent encore"],e:"Toumaï, Lucy, Homo habilis et les premiers Homo sapiens ont été trouvés en Afrique : c'est là que l'histoire humaine a commencé."},
 {q:"Sur quel continent est apparu Homo sapiens ?",o:["En Afrique","En Europe","En Asie","En Amérique"],e:"Homo sapiens est apparu en Afrique vers -300 000 ans, puis il a peuplé tous les continents."},
 {q:"Laquelle de ces phrases décrit Homo sapiens ?",o:["Il a un gros cerveau et crée des œuvres d'art","Il marche à quatre pattes","Il ne fabrique pas d'outils","Il n'a jamais quitté l'Afrique"],e:"Homo sapiens marche debout, a un gros cerveau et un front droit, fabrique des outils fins (aiguilles, harpons), crée de l'art et enterre ses morts."},
 {q:"Homo sapiens a peuplé…",o:["Tous les continents","Seulement l'Afrique","Seulement l'Europe et l'Asie","Seulement l'Amérique"],e:"Parti d'Afrique, Homo sapiens s'est installé sur tous les continents, jusqu'en Amérique et en Océanie."},
 {q:"Quel outil est un outil du Paléolithique ?",o:["Le biface","La charrue","L'épée en bronze","La faucille en fer"],e:"Le biface est une pierre taillée sur ses deux faces, qui sert à couper, gratter ou frapper."},
 {q:"À quoi sert le propulseur ?",o:["À lancer une sagaie plus loin et plus fort","À allumer le feu","À moudre les grains","À coudre les peaux"],e:"Le propulseur (souvent en bois de renne) prolonge le bras pour lancer la sagaie plus loin."},
 {q:"Au Paléolithique, avec quoi coud-on les vêtements en peau ?",o:["Une aiguille en os","Une aiguille en fer","Une machine à coudre","Un fil de nylon"],e:"Homo sapiens invente l'aiguille en os, avec un chas pour passer le fil (tendon ou fibre)."},
 {q:"À quoi sert le harpon ?",o:["À pêcher","À cultiver la terre","À tisser","À peindre"],e:"Le harpon, en os ou en bois de renne, possède des barbelures pour attraper les poissons."},
 {q:"Au Paléolithique, les outils sont fabriqués en…",o:["Pierre taillée, os et bois","Pierre polie","Fer","Bronze"],e:"Paléolithique = âge de la pierre taillée. La pierre polie, c'est le Néolithique ; les métaux viennent bien après."},
 {q:"À quoi sert le feu pour les hommes du Paléolithique ?",o:["À cuire, se chauffer, s'éclairer et se protéger","Seulement à cuire la viande","Seulement à faire peur aux animaux","Il ne sert à rien"],e:"Le feu, maîtrisé vers -400 000 ans, a de nombreux usages : cuisson, chaleur, lumière, protection contre les animaux."},
 {q:"Où se trouve la grotte de Lascaux ?",o:["En Dordogne, en France","En Espagne","Au Tchad","En Égypte"],e:"Lascaux se trouve en Dordogne, dans le sud-ouest de la France."},
 {q:"Qui a découvert la grotte de Lascaux en 1940 ?",o:["Quatre adolescents","Un archéologue célèbre","Le président de la République","Un astronaute"],e:"Ce sont quatre adolescents qui ont découvert la grotte en 1940."},
 {q:"Dans quelle région l'agriculture apparaît-elle vers -10 000 ans ?",o:["Le Croissant fertile","L'Europe du Nord","L'Amérique du Nord","L'Australie"],e:"L'agriculture apparaît d'abord au Proche-Orient, dans le Croissant fertile, puis dans d'autres foyers."},
 {q:"Quel outil est typique du Néolithique ?",o:["La hache en pierre polie","Le biface","Le propulseur","Le harpon"],e:"Néolithique = âge de la pierre polie. La hache polie sert à défricher les forêts pour cultiver."},
];
function toRoman(n){const m=[[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];let r='';for(const[v,s]of m)while(n>=v){r+=s;n-=v}return r}
function centuryOf(y){return Math.floor((Math.abs(y)-1)/100)+1}
function fmtYear(y){return y<0?`${-y} av. J.-C.`:`${y}`}
function randYear(){
  const r=Math.random();
  if(r<.15){const c=1+Math.floor(Math.random()*20);return Math.random()<.7?c*100:-c*100}
  if(r<.4) return -(1+Math.floor(Math.random()*3299));
  return 1+Math.floor(Math.random()*2025);
}
function explainCentury(y){
  const a=Math.abs(y),c=centuryOf(y),era=y<0?' av. J.-C.':'';
  if(a%100===0) return `${a} se termine par 00 : c'est la <b>dernière année</b> du ${toRoman(c)}e siècle${era}. Pas besoin d'ajouter 1 (${a/100} → ${toRoman(c)}e).`;
  if(a<100) return `${a} est entre 1 et 100${era} : c'est le <b>Ier siècle${era}</b>.`;
  const cent=Math.floor(a/100);
  return `Dans ${a}, il y a <b>${cent}</b> centaine${cent>1?'s':''}. On ajoute 1 : ${cent} + 1 = <b>${c}</b> → ${toRoman(c)}e siècle${era}.`;
}
function dateQ(){
  const pool=[...DATES,...SPANS.map(s=>({k:s.k,d:s.d}))];
  const x=pool[Math.floor(Math.random()*pool.length)];
  const same=pool.filter(y=>y!==x && (!!x.v===!!y.v));
  const wrong=pick(same,3).map(y=>y.d);
  return {prompt:x.v!==undefined?`Quand date : ${x.k} ?`:`De quand à quand va : ${x.k} ?`,options:[x.d,...wrong],correct:0,explain:''};
}
function periodeQ(){
  const [ev,per]=PERIOD_EVENTS[Math.floor(Math.random()*PERIOD_EVENTS.length)];
  if(Math.random()<.3){
    const ans=per==='Antiquité'?'Histoire':'Préhistoire';
    return {prompt:`« ${ev} » : Préhistoire ou Histoire ?`,options:['Préhistoire','Histoire'],correct:ans==='Préhistoire'?0:1,explain:ans==='Histoire'?'L\'Histoire commence avec l\'écriture, vers -3300.':'Avant l\'invention de l\'écriture (vers -3300), c\'est la Préhistoire.'};
  }
  const opts=['Paléolithique','Néolithique','Antiquité'];
  const ex={Paléolithique:'Paléolithique : de -3 millions d\'années à -10 000 ans.',Néolithique:'Néolithique : de -10 000 à -3300, quand apparaissent l\'agriculture et l\'élevage.',Antiquité:'Antiquité : de l\'écriture (vers -3300) jusqu\'en 476.'};
  return {prompt:`« ${ev} » : à quelle période ?`,options:opts,correct:opts.indexOf(per),explain:ex[per]};
}

const q = (cat, prompt, options, explain) => Moteur.QCM({ cat, prompt, options: options.map(Moteur.esc), correct: 0, explain: explain || "" });

Moteur.banque("histoire-debuts-humanite", {
  definir() {
    const [w, d] = pick(DEFS, 1)[0];
    const autres = pick(DEFS.filter(x => x[0] !== w), 3);
    return Math.random() < .5
      ? q("Définir", `Que veut dire « ${w} » ?`, [d, ...autres.map(x => x[1])])
      : q("Définir", `Quel mot correspond à cette définition ? « ${d} »`, [w, ...autres.map(x => x[0])]);
  },
  dater() { const x = dateQ(); return q("Dater", x.prompt, x.options, x.explain); },
  periode() { const x = periodeQ(); return Moteur.QCM({ cat: "Période", ...x, options: x.options.map(Moteur.esc) }); },
  siecle() {
    const y = randYear(), c = centuryOf(y), e = y < 0 ? " av. J.-C." : "";
    const faux = [...new Set([c - 1, c + 1, c + 2, c - 2].filter(x => x > 0))].slice(0, 2).map(x => toRoman(x) + "e siècle" + e);
    faux.push(toRoman(c) + "e siècle" + (y < 0 ? "" : " av. J.-C."));
    return q("Siècle", `En quel siècle se situe l'année ${fmtYear(y)} ?`, [toRoman(c) + "e siècle" + e, ...faux], explainCentury(y));
  },
  connaitre() { const x = pick(QCM, 1)[0]; return q("Connaître", x.q, x.o, x.e); },
});
})();
