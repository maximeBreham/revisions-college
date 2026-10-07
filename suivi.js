/*
 * Suivi du défi du jour, partagé par l'accueil et la page du défi.
 * Tout est rangé dans le localStorage de l'appareil, sous des clés « defi: ».
 *   defi:jours   dates (AAAA-MM-JJ) des défis terminés
 *   defi:jour    le défi en cours ou fini aujourd'hui : { date, k, bons, rates, resultats, fini }
 *   defi:revoir  questions ratées à faire revenir : { "banque:generateur": nombre d'échecs }
 */
window.Suivi = (function () {
  const lire = (cle, defaut) => { try { const v = localStorage.getItem("defi:" + cle); return v ? JSON.parse(v) : defaut; } catch (e) { return defaut; } };
  const ecrire = (cle, v) => { try { localStorage.setItem("defi:" + cle, JSON.stringify(v)); } catch (e) {} };

  const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const decaler = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const aujourdhui = () => iso(new Date());

  // Jours d'affilée : la série tient encore tant que le défi d'hier est fait.
  function serie() {
    const fait = new Set(lire("jours", []));
    let d = new Date();
    if (!fait.has(iso(d))) d = decaler(d, -1);
    let n = 0;
    while (fait.has(iso(d))) { n++; d = decaler(d, -1); }
    return n;
  }

  // Les 7 derniers jours, du plus ancien à aujourd'hui.
  function semaine() {
    const fait = new Set(lire("jours", []));
    return Array.from({ length: 7 }, (_, i) => {
      const d = decaler(new Date(), i - 6);
      return { lettre: "DLMMJVS"[d.getDay()], fait: fait.has(iso(d)), aujourdhui: i === 6 };
    });
  }

  function etatDuJour() {
    const e = lire("jour", null);
    return e && e.date === aujourdhui() ? e : null;
  }

  return { lire, ecrire, aujourdhui, serie, semaine, etatDuJour };
})();
