window.addEventListener("DOMContentLoaded", () => {
  initTypeTable();
  initRegionList();
  initGenList();
  searchPoke(); // 初期表示
});

function initTypeTable() {
  fetch("/api/poke/type")
    .then(res => res.json())
    .then(types => renderTypeTable(types));
}
function renderTypeTable(types) {
  const area = document.getElementById("TblSearchType");
  area.innerHTML = ""; // 初期化

  let row;
  types.forEach((t, i) => {
    if (i % 6 === 0) {
      row = document.createElement("div");
      row.classList.add("type-row");
      area.appendChild(row);
    }

    const img = document.createElement("img");
    img.src = t.pathtype; // ← DBに path があるならここを合わせる
    img.dataset.typeid = t.typeid;
    img.classList.add("type-icon");

    img.addEventListener("click", () => toggleTypeSelection(img));

    row.appendChild(img);
  });
}

function initRegionList() {
  fetch("/api/poke/region")
    .then(res => res.json())
    .then(regions => renderRegionList(regions));
}

function renderRegionList(regions) {
  const ddl = document.getElementById("DdlSearchRegion");

  regions.forEach(r => {
    const opt = document.createElement("option");
    opt.value = r.regionid;
    opt.textContent = `${r.regionid} : ${r.region}`;
    ddl.appendChild(opt);
  });
}

function initGenList() {
  fetch("/api/poke/gen")
    .then(res => res.json())
    .then(gens => renderGenList(gens));
}

function renderGenList(gens) {
  const ddl = document.getElementById("DdlSearchGen");

  gens.forEach(g => {
    const opt = document.createElement("option");
    opt.value = g.genid;
    opt.textContent = `${g.genid} : ${g.gen}`;
    ddl.appendChild(opt);
  });
}

function searchPoke() {
  const name = document.getElementById("TxtSearchName").value;
  const types = selectedTypes; // JSで管理
  const region = document.getElementById("DdlSearchRegion").value;
  const gen = document.getElementById("DdlSearchGen").value;

  fetch("/api/poke/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, types, region, gen })
  })
  .then(res => res.json())
  .then(data => renderSearchResult(data));
}


let selectedTypes = [];

function toggleTypeSelection(img) {
  const id = img.dataset.typeid;

  if (selectedTypes.includes(id)) {
    selectedTypes = selectedTypes.filter(x => x !== id);
    img.classList.remove("selected");
  } else {
    selectedTypes.push(id);
    img.classList.add("selected");
  }
}

function renderSearchResult(list) {
  const body = document.getElementById("SearchResultBody");
  body.innerHTML = "";

  if (list.length === 0) {
    document.getElementById("LblNoResult").style.display = "block";
    return;
  }

  document.getElementById("LblNoResult").style.display = "none";

  list.forEach(p => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td><img src="${p.pathnormal}" class="middle-each-image"></td>
      <td>${p.pokeid}</td>
      <td>${p.name}</td>
      <td>${p.type1}${p.type2 ? "・" + p.type2 : ""}</td>
      <td>${p.region}</td>
      <td>${p.gen}</td>
      <td><a href="MyPokedex.html?No=${p.pokeid}" class="dex-link">図鑑へ</a></td>
    `;

    body.appendChild(tr);
  });
}
