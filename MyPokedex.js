const PokeProject = (() => {
  'use strict';
  let
  //ページのターゲットNo
  pokeTargetNo,

  //最小/最大のNo取得
  pokeMinNo,
  pokeMaxNo,

  //データ関連
  pokeNo,
  pokeName,
  pokeType1,
  pokeType2,
  pokeUnionType,
  pokeRegion,
  pokeGen,
  //pokePathNormal,
  //pokePathShiny,
  pokeDisplayImage,

  //HTML関連(位置判定)
  areaPageTitle,
  areaPokeImage,
  areaPokeTitle,
  areaPokeType,
  areaPokeInfo,
  areaControlButtons,
  areaSearchButton,
  areaDisplayPokeList,

  //HTML関連(挿入)
  htmlPageTitle,
  htmlPokeImage,
  htmlPokeTitle,
  htmlPokeType,
  htmlPokeInfo,
  htmlControlButtons,
  htmlSearchButton,

  //js上で必要となり得る要素
  func,
  flag,

  //画像の切り替え
  whichImage,
  imageNormal,
  imageShiny,

  active;

  imageNormal = 'NORMAL'
  imageShiny = 'SHINY'

  const conf ={
    fieldPageTitle: `field-page-title`,
    fieldPokeImage: `field-selected-poke-image`,
    fieldPokeTitle: `field-selected-poke-title`,
    fieldPokeType: `field-selected-poke-type`,
    fieldPokeInfo: `field-selected-poke-info`,
    fieldControlButtons: `field-control-buttons`,
    fieldDisplayPokeList: `field-display-poke-list`,
    fieldSearchButton: `field-search-button`,
  };
  func = {
    init: function(){
      flag = true;
      active = true;
      pokeTargetNo = 1;
      whichImage = imageNormal;
      return this;
    },
    makeFieldPageTitle(){
      if(flag){
        areaPageTitle = document.querySelector(`[${conf.fieldPageTitle}]`);
        htmlPageTitle =
        `<h1>～ My PokeDex ～</h1>`;

        areaPageTitle.insertAdjacentHTML('beforeend', htmlPageTitle);

      }
      return this;
    },
    makeFieldControlButtons(){
      if(flag){
        areaControlButtons = document.querySelector(`[${conf.fieldControlButtons}]`);
        htmlControlButtons =
        `
        <button id="BtnPrevPoke">⇐</button>
        <button id="BtnSwitchImage">通常/色違い</button>
        <button id="BtnNextPoke">⇒</button>
        `;
        areaControlButtons.insertAdjacentHTML('beforeend', htmlControlButtons);

        //current-1の個体にリンク
        let BtnPrevPoke = document.getElementById('BtnPrevPoke');
        if(BtnPrevPoke)
          BtnPrevPoke.addEventListener('click', func.prevPoke);

        //current+1の個体にリンク
        let BtnNextPoke = document.getElementById('BtnNextPoke');
        if(BtnNextPoke)
          BtnNextPoke.addEventListener('click', func.nextPoke);

        //画像を通常⇔色違いに反転
        let BtnSwitchImage = document.getElementById('BtnSwitchImage');
        if(BtnSwitchImage)
          BtnSwitchImage.addEventListener('click', func.switchImage);
      }
      return this;
    },
    makeFieldSearchButton(){
      if(flag){
        areaSearchButton = document.querySelector(`[${conf.fieldSearchButton}]`);
        htmlSearchButton =
        `<button id="BtnSearch">検索</button>`;
        //MySearchdex.htmlへリンクさせたい
        areaSearchButton.insertAdjacentHTML('beforeend', htmlSearchButton);

        let BtnSearch = document.getElementById(`BtnSearch`);
        if(BtnSearch)
          BtnSearch.addEventListener('click', func.linkSearch);
      }
      return this;
    },
    linkSearch(){
      if(flag){
        window.location.href = "MySearchdex.html";
      }
      return this;
    },
    getMinNo: async function(){
      if(flag){
        try{
          const res = await fetch("http://localhost:3001/api/poke/minNo");
          const data = await res.json();
          pokeMinNo = Number(data.min);
        }
        catch (error) {
          console.error('Error fetching data:', error);
        }

      }
      return this;
    },
    getMaxNo: async function(){
      if(flag){
        try{
          const res = await fetch("http://localhost:3001/api/poke/maxNo");
          const data = await res.json();
          pokeMaxNo = Number(data.max);
        }
        catch (error) {
          console.error('Error fetching data:', error);
        }
      }
      return this;
    },
    //getPokeData: async function
    getPokeData: async function(getNo){
      if(flag){
        if(getNo !== undefined)
          pokeTargetNo = getNo
        
        try{
          const res = await fetch(`http://localhost:3001/api/poke?pokeid=${pokeTargetNo}`);
          const data = await res.json();
          pokeNo = data.pokeid;
            pokeName = data.name;
            pokeType1 = data.type1;
            pokeType2 = data.type2;
            pokeRegion = data.region;
            pokeGen = data.gen;

            if(whichImage === imageNormal)
            {
              pokeDisplayImage = data.pathnormal;
            }
            else if(whichImage === imageShiny)
            {
              pokeDisplayImage = data.pathshiny;
            }
            else
            {
              pokeDisplayImage = data.pathnormal;
            }

            //タイプの調整
            if(pokeType2 === null)
            {
              pokeUnionType = pokeType1;
            }
            else
            {
              pokeUnionType = pokeType1 + "/" + pokeType2;
            }

            //画像の判断
            func
              .initFieldPokeData()
              .makeFieldPokeImage()
              .makeFieldPokeTitle()
              .makeFieldPokeType()
              .makeFieldPokeInfo()
        }
        catch (error){
          console.error('Error fetching data:', error);
        }
      }
      return this;
    },
    initFieldPokeData(){
      if(flag){
        areaPokeImage = document.querySelector(`[${conf.fieldPokeImage}]`);
        areaPokeTitle = document.querySelector(`[${conf.fieldPokeTitle}]`);
        areaPokeType = document.querySelector(`[${conf.fieldPokeType}]`);
        areaPokeInfo = document.querySelector(`[${conf.fieldPokeInfo}]`);

        areaPokeImage.innerHTML = '';
        areaPokeTitle.innerHTML = '';
        areaPokeType.innerHTML = '';
        areaPokeInfo.innerHTML = '';

      }
      return this;
    },
    makeFieldPokeImage(){
      if(flag){
        areaPokeImage = document.querySelector(`[${conf.fieldPokeImage}]`);
        htmlPokeImage =
        `<img id="pokeImage" src="${pokeDisplayImage}">`;

        areaPokeImage.insertAdjacentHTML('beforeend', htmlPokeImage);
      }
      return this;
    },
    makeFieldPokeTitle(){
      if(flag){
        areaPokeTitle = document.querySelector(`[${conf.fieldPokeTitle}]`);
        htmlPokeTitle =
        `<p id="pokeNo" tag="${pokeNo}">No: ${pokeNo}</p><p id="pokeName">なまえ: ${pokeName}</p>`;

        areaPokeTitle.insertAdjacentHTML('beforeend', htmlPokeTitle);
      }
      return this;
    },
    makeFieldPokeType(){
      if(flag){
        areaPokeType = document.querySelector(`[${conf.fieldPokeType}]`);
        htmlPokeType =
        `<p id="pokeType">タイプ: ${pokeUnionType}</p>`;

        areaPokeType.insertAdjacentHTML('beforeend', htmlPokeType);
      }
      return this;
    },
    makeFieldPokeInfo(){
      if(flag){
        areaPokeInfo = document.querySelector(`[${conf.fieldPokeInfo}]`);
        htmlPokeInfo =
        `<p id="pokeRegion">地方: ${pokeRegion}</p><p id="pokeGen">地方: ${pokeGen}</p>`;

        areaPokeInfo.insertAdjacentHTML('beforeend', htmlPokeInfo);
      }
      return this;
    },
    //ボタンの挙動メソッド
    prevPoke(){
      if(flag){

        //現在のNoを取得
        let elementNo = document.getElementById('pokeNo');
        let currentNo = Number(elementNo.getAttribute('tag'));
        let prevTargetNo = currentNo - 1;
        localStorage.setItem('pokeMaxNo', pokeMaxNo);

        if(prevTargetNo >= pokeMinNo)
        {
          //現No-1した個体を参照
          func.getPokeData(prevTargetNo);
        }
        else
        {
          //最大Noの個体を参照
          func.getPokeData(pokeMaxNo);
        }
      }
      return this;
    },
    nextPoke(){
      if(flag){
        let elementNo = document.getElementById('pokeNo');
        let currentNo = Number(elementNo.getAttribute('tag'));
        let nextTargetNo = currentNo + 1;
        localStorage.setItem('pokeMinNo', pokeMinNo);

        if(nextTargetNo <= pokeMaxNo)
        {
          //現No+1した個体を参照
          func.getPokeData(nextTargetNo);
        }
        else
        {
          //最小Noの個体を参照
          func.getPokeData(pokeMinNo);
        }

      }
      return this;
    },
    switchImage(){
      if(flag){

        if(whichImage === imageNormal)
        {
          whichImage = imageShiny;
        }
        else if(whichImage === imageShiny)
        {
          whichImage = imageNormal;
        }
        else
        {
          whichImage = imageNormal;
        }
        
        let elementNo = document.getElementById('pokeNo');
        let currentNo = Number(elementNo.getAttribute('tag'));
        //currentNo = Number(document.getElementById('pokeNo').getAttribute('tag'));でも同様の結果取得可能
        func.getPokeData(currentNo);
        func.makeFieldDisplayPokeList();

      }
      return this;
    },
    makeFieldDisplayPokeList: async function(){
      if(flag){
        try{
          const response = await fetch('/api/pokelist');
          const data = await response.json();

          areaDisplayPokeList = document.querySelector(`[${conf.fieldDisplayPokeList}]`);
          areaDisplayPokeList.innerHTML = '';

          data.forEach(pokemon => {
            const img = document.createElement('img');
            if(whichImage === imageNormal)
            {
              img.src = pokemon.pathnormal;
            }
            else if(whichImage === imageShiny)
            {
              img.src = pokemon.pathshiny;
            }
            else
            {
              img.src = pokemon.pathnormal;
            }
            img.alt = `Pokemon ${pokemon.pokeid}`;
            img.dataset.pokeid = pokemon.pokeid;
            img.classList.add('poke-image');

            img.addEventListener('click', () => {
              func.getPokeData(pokemon.pokeid);
            });

            areaDisplayPokeList.appendChild(img);
          })

        }
        catch (error) {
          console.error('ポケモンリストの獲得に失敗しました。', error);
        }
      }
      return this;
    }
  };

  active = async () => {
    func
      .init()
      .makeFieldPageTitle()
      .makeFieldControlButtons()
      .makeFieldSearchButton();

      await func.getMinNo();
      await func.getMaxNo();
      console.log(pokeMinNo, pokeMaxNo);
      await func.getPokeData();
      await func.makeFieldDisplayPokeList();
    return;
  }
  return (active);
})();

window.addEventListener('load', function(){
  PokeProject();
});
//メソッド全体図

//init
//makeFieldTitle
//makeFieldControlButtons
//	[prevPoke]
//	[nextPoke]
//	[switchImage]

//getMinNo(async)
//getMaxNo(async)
//getPokeData(async)
//	[initFieldPokeData]
//	[makeFieldPokeImage]
//	[makeFieldPokeTitle]
//	[makeFieldPokeType]
//	[makeFieldPokeInfo]

//initFieldPokeData
//makeFieldPokeImage
//makeFieldPokeTitle
//makeFieldPokeType
//makeFieldPokeInfo

//prevPoke
//nextPoke
//switchImage
//	[getPokeData]
//	[makeFieldDisplayPokeList]

//makeFieldDisplayPokeList(async)


//active
//	[init]
//	[makeFieldPageTitle]
//	[makeFieldControlButtons]
//	[getMinNo]
//	[getMaxNo]
//	[getPokeData]
//	[makeFieldDisplayPokeList]