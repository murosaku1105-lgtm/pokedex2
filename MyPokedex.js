const PokeSearch = (() => {
  'use strict';
  let
  area_greeting,
  html_greeting,
  area_contents,
  html_contents,
  func,
  flag,
  active;

  let selectedTypes = [];

  const conf ={
    search_field: `search-field`,
  };
  func = {
    init: function(){
      flag = true;
      return this;
    },
    initTypeTable: function(){
      if(flag){
        fetch('/api/poke/type')
          .then(res => res.json())
          .then(types => func.renderTypeTable(types));
      }
      return this;
    },
    renderTypeTable: function(types){
      if(flag){
        const areaTypes = document.getElementById('TblSearchType');
        areaTypes.innerHTML = "";

        let row;
        types.forEach((t, i) => {
          if(i % 6 === 0){
            row = document.createElement("div");
            row.classList.add("type-row");
            areaTypes.appendChild(row);
          }
          const img = document.createElement("img");
          img.src= t.pathtype;
          img.dataset.typeid = t.typeid;
          img.classList.add("type-icon");
          img.addEventListener("click", () => func.toggleTypeSelection(img));
          row.appendChild(img);
        });
      }
      return this;
    },
    initRegionList: function(){
      if(flag){
        fetch("/api/poke/region")
          .then(res => res.json())
          .then(regions => func.renderRegionList(regions));
      }
      return this;
    },
    renderRegionList(regions){
      if(flag){
        const ddlRegion = document.getElementById("DdlSearchRegion");

        regions.forEach(r => {
          const opt = document.createElement("option");
          opt.value = r.regionid;
          opt.textContent = `${r.regionid}: ${r.region}`;
          ddlRegion.appendChild(opt);
        });
      }
      return this;
    },
    initGenList: function(){
      if(flag){
        fetch("/api/poke/gen")
          .then(res => res.json())
          .then(gens => func.renderGenList(gens));
      }
      return this;
    },
    renderGenList: function(gens){
      if(flag){
        const ddlGen = document.getElementById("DdlSearchGen");

        gens.forEach(g => {
          const opt = document.createElement("option");
          opt.value = g.genid;
          opt.textContent = `${g.genid}: ${g.gen}`;
          ddlGen.appendChild(opt);
        });
      }
      return this;
    },
    searchPoke: function(){
      if(flag){
        const name = document.getElementById("TxtSearchName").value;
        const types = selectedTypes;
        const region = document.getElementById("DdlSearchRegion").value;
        const gen = document.getElementById("DdlSearchGen").value;

        fetch("/api/poke/search", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({name, types, region, gen})
        })
        .then(res => res.json())
        .then(data => func.renderSearchResult(data));
      }
      return this;
    },
    toggleTypeSelection: function(img){
      if(flag){
        const typeId = Number(img.dataset.typeid);

        if(selectedTypes.includes(typeId))
        {
          selectedTypes = selectedTypes.filter(x => x !== typeId);
          img.classList.remove("selected");
        }
        else
        {
          selectedTypes.push(typeId);
          img.classList.add("selected");
        }
      }
      return this;
    },
    renderSearchResult: function(list){
      if(flag){
        const body = document.getElementById("SearchResultBody");
        body.innerHTML = "";

        if(list.length ===0)
        {
          document.getElementById("LblNoResult").style.display = "block";
          return;
        }

        document.getElementById("LblNoResult").style.display = "none";
        list.forEach(p => {
          const tr = document.createElement("tr");
          tr.innerHTML =
          `
          <td><img src="${p.pathnormal}" class="middle-each-image"></td>
          <td>${p.pokeid}</td>
          <td>${p.name}</td>
          <td>${p.type1}${p.type2 ? "・" + p.type2 : ""}</td>
          <td>${p.region}</td>
          <td>${p.gen}</td>
          <td><a href="MyPokedex.html?No=${p.pokeid}">リンク</a></td>
          `;
          body.appendChild(tr);
        });
      }
      return this;
    }
  };

  active = () => {
    func
      .init()
      .initTypeTable()
      .initRegionList()
      .initGenList()
      .searchPoke();
    return;
  }
  return (active);
})();

window.addEventListener('load', function(){
  PokeSearch();
});