const SHEET_ID = "1oyhiKl50W4J6ky52-rilwKiHW-8RzYvIciII2Alb8tc";
const SHEET_URL = `https://docs.google.com/spreadsheets/d/1oyhiKl50W4J6ky52-rilwKiHW-8RzYvIciII2Alb8tc/gviz/tq?tqx=out:json`;

function fetchProduits(callback) {
  fetch(SHEET_URL)
    .then(res => res.text())
    .then(text => {
      const json = JSON.parse(text.substr(47).slice(0, -2));
      const rows = json.table.rows.map(r => {
        const cells = r.c;
        return {
          id: cells[0]?.v,
          titre: cells[1]?.v,
          description: cells[2]?.v,
          prix: cells[3]?.v,
          media: cells[4]?.v,
          tarifs: cells[5]?.v
        };
      });
      callback(rows);
    });
}

function afficherProduits() {
  if (!document.getElementById('produits')) return;
  fetchProduits(produits => {
    const container = document.getElementById("produits");
    container.innerHTML = "";
    produits.forEach(p => {
      const div = document.createElement("div");
      div.className = "produit";
      div.innerHTML = `
        <h2>${p.titre}</h2>
        ${p.media.includes('.mp4') ?
          `<video src="${p.media}" autoplay muted loop></video>` :
          `<img src="${p.media}" alt="${p.titre}">`}
        <p>${p.description}</p>
        <a href="produit.html?id=${p.id}">Voir le produit</a>
      `;
      container.appendChild(div);
    });
  });
}

function afficherProduitIndividuel() {
  if (!document.getElementById('fiche-produit')) return;
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  fetchProduits(produits => {
    const produit = produits.find(p => p.id == id);
    if (!produit) return;
    const container = document.getElementById("fiche-produit");

    let tarifsHTML = "";
    try {
      const tarifs = JSON.parse(produit.tarifs.replace(/'/g, '"'));
      tarifsHTML = "<h3>Tarifs au gramme :</h3><ul>";
      for (let [quantite, prix] of Object.entries(tarifs)) {
        tarifsHTML += `<li>${quantite}g → ${prix} €/g</li>`;
      }
      tarifsHTML += "</ul>";
    } catch (e) {
      tarifsHTML = "<p><em>Tarifs non disponibles.</em></p>";
    }

    container.innerHTML = `
      <h2>${produit.titre}</h2>
      ${produit.media.includes('.mp4') ?
        `<video src="${produit.media}" autoplay muted loop></video>` :
        `<img src="${produit.media}" alt="${produit.titre}">`}
      <p>${produit.description}</p>
      ${tarifsHTML}
    `;
  });
}

window.onload = () => {
  afficherProduits();
  afficherProduitIndividuel();
};
