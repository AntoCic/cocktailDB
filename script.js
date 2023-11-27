// al momento mi feromo ma si deve abbellire la grafica e sistemare i colori 
//per il resto funsiona tutto 
//o almeno spero

//__________________________________________________________________
const bottombar = document.getElementsByClassName("bottombar");
const ibaContainer = document.getElementsByClassName("ibaContainer");
const favoriteListIcon = document.getElementById("favoriteListIcon");
const favoriteBtn = document.getElementById("favoriteIcon");
const btCondividi = document.getElementById("btCondividi");
const h2 = document.getElementsByTagName("h2");
const selectDropdown = document.getElementById("listDk");
const Letterlist = document.getElementById("Letterlist");
const phList = document.getElementById("phList");
const loadingBar = document.querySelector(".loadingBar")
const drinkName = document.getElementById("drinkName");
const drinkIngredients = document.getElementById("drinkIngredients");
const drinkMetod = document.getElementById("drinkMetod");
const imgDrink = document.getElementById("imgDrink");
const drinkGlass = document.getElementById("drinkGlass");
const backArrow = document.getElementById("backArrow");
const dado = document.getElementById("dado");
const searchbtn = document.getElementById("searchbtn");
const drinkHeader = document.getElementsByClassName("drinkHeader");
const drinkPg = document.getElementById("drinkPg");
const footer2 = document.getElementById("footer2");

// , "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"
let lettere = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
let lettereLength = [];
let CocktailList = [];
let progresLoading = 0;
let lastDrinkY = 0;
let btfavoriteListIcon = true;
let currentDrink = null;
let savedIdDrink = [];
let currentUrlImg;
// chiave localstorage
const storageKey = '_AC_DR_';

// contorlla se ci sono drink preferiti salvati in locale
const storage = localStorage.getItem(storageKey);
if (storage) {
  savedIdDrink = JSON.parse(storage);
  console.log("savedIdDrink in memoria locale", savedIdDrink);
} else {
  currentDrink = { nameSave: "", idSave: "a" };
  console.log("non ci sono drink ne push uno per inizializzare la variabile: ", currentDrink);
  savedIdDrink.push(currentDrink);
}


// funzione che si avvia dopo aver creato l'oggetto CocktailList
function usaLista() {
  console.log(CocktailList);
  // crea le drink card ea aggiunge tutti i drink nel select in basso a destra(nel bottomlBar)
  allDrinkList();
  // aggiunge tutte le lettere nel select in basso a sinistra nel bottomBar
  createOptionLetter()
  // aggiunge l'evento onClick alle drink card create
  drinkBtn();
  // aggiunge l'evento onChange nel select in basso a sinistra nel bottomBar
  azBtn();
  // aggiunge l'evento onClick al dado in basso che mostra un drink caruale
  dadoBtn();
  // aggiunge l'evento onChange nel select in basso a destra
  selectBtn();
  //cambia schermata 
  setAppState('drinkList');
  // mostra la bottom bar
  bottombar[0].classList.remove('hidden');
}

// salva un drink nei preferiti
function saveDrink() {
  savedIdDrink.push(currentDrink);
  console.log("Salvo currentDrink in:", savedIdDrink);
  updateStorage();
}

// rimuove un drink dai preferiti
function remuveDrink() {
  const idRimuovere = ceckIdSavedIdDrink();
  if (idRimuovere) {
    savedIdDrink.splice(idRimuovere, 1);
  } else {
    console.log("Errore drink da rimuovere non trovato");
  }
  console.log("rimuovo currentDrink da:", savedIdDrink);
  updateStorage();
}

// cerca id da rimuovere
function ceckIdSavedIdDrink() {
  for (let key in Object.keys(savedIdDrink)) {
    if (currentDrink.idSave === savedIdDrink[key].idSave) {
      return key;
    }
  }
  return 0;
}

// carica i drink salvati nello storage locale
function updateStorage() {
  localStorage.setItem(storageKey, JSON.stringify(savedIdDrink));
}

// Scarica drink per lettera in ordine alfabetico
async function scaricaDrink(lettera) {
  return new Promise(function (resolve, reject) {
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${lettera}`)
      .then(function (response) {
        if (response.ok) {
          resolve(response.json());
        } else {
          reject("Errore nel caricamento dei dati");
        }
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

// esegue il download dei drink per lettera in ordine alfabetico
// e li carica in un ogetto unico
async function creaCocktailList() {
  let idEl = 0;
  for (let lettera of lettere) {
    const elementiScaicati = await scaricaDrink(lettera)
      .catch(function (errore) {
        console.log(errore);
      });
    const drink = elementiScaicati.drinks;
    //creo un ogetto con tutti i drink
    for (let key in drink) {
      CocktailList.push({ id: idEl, nome: drink[key].strDrink, immageUrl: drink[key].strDrinkThumb, bicchiere: drink[key].strGlass, IBA: drink[key].strIBA, misura1: drink[key].strMeasure1, ingrediente1: drink[key].strIngredient1, misura2: drink[key].strMeasure2, ingrediente2: drink[key].strIngredient2, misura3: drink[key].strMeasure3, ingrediente3: drink[key].strIngredient3, misura4: drink[key].strMeasure4, ingrediente4: drink[key].strIngredient4, misura5: drink[key].strMeasure5, ingrediente5: drink[key].strIngredient5, misura6: drink[key].strMeasure6, ingrediente6: drink[key].strIngredient6, misura7: drink[key].strMeasure7, ingrediente7: drink[key].strIngredient7, misura8: drink[key].strMeasure8, ingrediente8: drink[key].strIngredient8, misura9: drink[key].strMeasure9, ingrediente9: drink[key].strIngredient9, misura10: drink[key].strMeasure10, ingrediente10: drink[key].strIngredient10, metodo: drink[key].strInstructionsIT })
      idEl++;
    }
    //crea un riferimento per capire da quale drink partire per ogni lettera
    if (drink) {
      lettereLength.push(drink.length);
    } else { lettereLength.push(0); }
    // progres bar va aumentantando ad ogni lista di drink per lettera
    progresLoadingBar(lettere.length);
  }
  usaLista();
}

// crea lista drinkCard e del select in basso a destra di tutti i drink
function allDrinkList() {
  for (let key in Object.keys(CocktailList)) {
    createImgList(CocktailList[key].immageUrl, CocktailList[key].nome, CocktailList[key].id, !!CocktailList[key].IBA);
    createOption(CocktailList[key].nome, CocktailList[key].id);
  }
}

// gestisce il clic della drinkCard
function drinkBtn() {
  const drinkCard = document.querySelectorAll('.drinkCard');
  drinkCard.forEach(function (el) {
    el.addEventListener('click', function (e) {
      const idDrink = el.getAttribute("data-id");
      lastDrinkY = window.scrollY;
      drinkSection(idDrink);
    });
  });
}

// gestisce il clic della Select List
function azBtn() {
  Letterlist.addEventListener('change', () => {
    btFavoriteListoOff();
    svuotaDrinkList();
    let idFirst = 0;
    let idLast = 0;
    if (Letterlist.selectedIndex === (Letterlist.length - 1)) {
      h2[0].textContent = "TUTTI I DRINK";
      dado.textContent = "ifl";
      svuotaDrinkList();
      allDrinkList();
    } else {
      for (let i = 0; i < Letterlist.selectedIndex; i++) {
        idFirst = idFirst + lettereLength[i];
      }
      idLast = idFirst + lettereLength[Letterlist.selectedIndex];
      if (idFirst - idLast) {
        for (let key = idFirst; key < idLast; key++) {
          createImgList(CocktailList[key].immageUrl, CocktailList[key].nome, CocktailList[key].id, !!CocktailList[key].IBA);
          createOption(CocktailList[key].nome, CocktailList[key].id);
        }
      } else {
        const p = document.createElement("p");
        p.textContent = "Non ci sono drink con la lettera " + lettere[Letterlist.selectedIndex];
        phList.appendChild(p);
        createOption("no drink", 1000);
      }

      h2[0].textContent = "DRINK : " + lettere[Letterlist.selectedIndex].toUpperCase();
      dado.textContent = "sort_by_alpha";
    }

    drinkBtn();
    setAppState('drinkList');
  });
  Letterlist.selectedIndex = lettere.length;
}

// gestisce il clic della Select List
function selectBtn() {
  selectDropdown.addEventListener('change', () => {
    drinkSection(selectDropdown.value)
  });
}

// gestisce il clic sul dadoBt
function dadoBtn() {
  dado.addEventListener('click', () => {
    const dadoIcon = dado.textContent;
    if (dadoIcon === "ifl") {
      drinkSection(Math.round(Math.random() * CocktailList.length));
    } else {
      h2[0].textContent = "TUTTI I DRINK";
      dado.textContent = "ifl";
      while (phList.firstChild) {
        phList.firstChild.remove();
      }
      while (selectDropdown.firstChild) {
        selectDropdown.firstChild.remove();
      }
      allDrinkList();
      drinkBtn();
      setAppState('drinkList');
      Letterlist.selectedIndex = lettere.length;
    }
  });
}

async function scaricaImgdrink(id) {
  const imgScaricata = await creaBlob(CocktailList[id].immageUrl)
    .catch(function (errore) {
      console.log(errore);
    });
  currentUrlImg = URL.createObjectURL(imgScaricata);


  btFavoriteListoOff();
  currentDrink = { nameSave: CocktailList[id].nome, idSave: String(id) };
  console.log("currentDrink:", currentDrink);
  if (ceckSavedIdDrink()) {
    favoriteBtn.classList.add('full');
  } else { favoriteBtn.classList.remove('full'); }
  setAppState('drink');
  inserisciIconaBicchiere(id);
  imgDrink.setAttribute("src", currentUrlImg);
  drinkName.innerText = CocktailList[id].nome;
  inserisciIngredienti(id);
  drinkMetod.innerText = CocktailList[id].metodo;
  if (!!CocktailList[id].IBA) {
    ibaContainer[0].classList.remove('hidden');
    ibaContainer[0].lastElementChild.textContent = CocktailList[id].IBA;
  } else {
    ibaContainer[0].classList.add('hidden');
  }
  //torna in dietro  cliccando sull'immagine
  imgDrink.addEventListener("click", function () {
    if (h2[0].textContent === "FAVORITE DRINK") {
      btfavoriteListIcon = false;
      favoriteListIcon.classList.add('full');
      svuotaDrinkList();
      favoriteDrinkList();
      drinkBtn();
    }
    setAppState('drinkList');
    window.scrollTo(0, lastDrinkY);
  });



}

async function creaBlob(urlImgDaScaricare) {
  return new Promise(function (resolve, reject) {
    fetch(urlImgDaScaricare)
      .then(function (response) {
        if (response.ok) {
          resolve(response.blob());
        } else {
          reject("Errore nel caricamento dei dati");
        }
      })
      .catch(function (error) {
        reject(error);
      });
  });
}


// inserisce le informazioni del drink nella schermata drink
function drinkSection(id) {
  setAppState('drink');
  scaricaImgdrink(id);


}

// inserisce l'icona nella drink Page
function inserisciIconaBicchiere(id) {
  switch (CocktailList[id].bicchiere) {
    case "Cocktail glass" || "Martini Glass" || "Coupe Glass":
      drinkGlass.setAttribute("src", "img/martini.png");
      break;
    case "Old-Fashioned glass" || "Whiskey sour glass" || "Punch bowl":
      drinkGlass.setAttribute("src", "img/rock.png");
      break;
    case "Collins Glass" || "Highball glass" || "Pint glass":
      drinkGlass.setAttribute("src", "img/collins.png");
      break;
    case "Beer pilsner" || "Beer Glass" || "Beer mug" || "Mason jar":
      drinkGlass.setAttribute("src", "img/beer.png");
      break;
    case "Shot glass":
      drinkGlass.setAttribute("src", "img/shot.png");
      break;
    case "Champagne Flute":
      drinkGlass.setAttribute("src", "img/flute.png");
      break;
    case "Coffee mug":
      drinkGlass.setAttribute("src", "img/beer.png");
      break;
    case "Punch bowl" || "Pitcher":
      drinkGlass.setAttribute("src", "img/pitcher.png");
      break;
    case "Hurricane glass":
      drinkGlass.setAttribute("src", "img/hurricane.png");
      break;
    default:
      drinkGlass.setAttribute("src", "img/martini.png");
  }
}
// inserisce gli ingradienti nella drink Page
function inserisciIngredienti(id) {
  let ingredientsList = CocktailList[id].misura1 + " : " + CocktailList[id].ingrediente1 + "\n";

  if (!!CocktailList[id].ingrediente2) {
    if (!!CocktailList[id].misura2) {
      ingredientsList = ingredientsList + CocktailList[id].misura2 + " : " + CocktailList[id].ingrediente2 + "\n";
    } else {
      ingredientsList = ingredientsList + "Un pó di " + CocktailList[id].ingrediente2 + "\n";
    }
  }
  if (!!CocktailList[id].ingrediente3) {
    if (!!CocktailList[id].misura3) {
      ingredientsList = ingredientsList + CocktailList[id].misura3 + " : " + CocktailList[id].ingrediente3 + "\n";
    } else {
      ingredientsList = ingredientsList + "Un pó di " + CocktailList[id].ingrediente3 + "\n";
    }
  }
  if (!!CocktailList[id].ingrediente4) {
    if (!!CocktailList[id].misura4) {
      ingredientsList = ingredientsList + CocktailList[id].misura4 + " : " + CocktailList[id].ingrediente4 + "\n";
    } else {
      ingredientsList = ingredientsList + "Un pó di " + CocktailList[id].ingrediente4 + "\n";
    }
  }
  if (!!CocktailList[id].ingrediente5) {
    if (!!CocktailList[id].misura5) {
      ingredientsList = ingredientsList + CocktailList[id].misura5 + " : " + CocktailList[id].ingrediente5 + "\n";
    } else {
      ingredientsList = ingredientsList + "Un pó di " + CocktailList[id].ingrediente5 + "\n";
    }
  }
  if (!!CocktailList[id].ingrediente6) {
    if (!!CocktailList[id].misura6) {
      ingredientsList = ingredientsList + CocktailList[id].misura6 + " : " + CocktailList[id].ingrediente6 + "\n";
    } else {
      ingredientsList = ingredientsList + "Un pó di " + CocktailList[id].ingrediente6 + "\n";
    }
  }
  if (!!CocktailList[id].ingrediente7) {
    if (!!CocktailList[id].misura7) {
      ingredientsList = ingredientsList + CocktailList[id].misura7 + " : " + CocktailList[id].ingrediente7 + "\n";
    } else {
      ingredientsList = ingredientsList + "Un pó di " + CocktailList[id].ingrediente7 + "\n";
    }
  }
  if (!!CocktailList[id].ingrediente8) {
    if (!!CocktailList[id].misura8) {
      ingredientsList = ingredientsList + CocktailList[id].misura8 + " : " + CocktailList[id].ingrediente8 + "\n";
    } else {
      ingredientsList = ingredientsList + "Un pó di " + CocktailList[id].ingrediente8 + "\n";
    }
  }
  if (!!CocktailList[id].ingrediente9) {
    if (!!CocktailList[id].misura9) {
      ingredientsList = ingredientsList + CocktailList[id].misura9 + " : " + CocktailList[id].ingrediente9 + "\n";
    } else {
      ingredientsList = ingredientsList + "Un pó di " + CocktailList[id].ingrediente9 + "\n";
    }
  }
  if (!!CocktailList[id].ingrediente10) {
    if (!!CocktailList[id].misura10) {
      ingredientsList = ingredientsList + CocktailList[id].misura10 + " : " + CocktailList[id].ingrediente10 + "\n";
    } else {
      ingredientsList = ingredientsList + "Un pó di " + CocktailList[id].ingrediente10 + "\n";
    }
  }

  drinkIngredients.innerText = ingredientsList;
}

// inserisce le lettere nel menu a tendina in basso a sinistra
function createOptionLetter() {
  for (let key in lettere) {
    const option = document.createElement("option");
    option.value = lettereLength[key];
    option.appendChild(document.createTextNode(lettere[key].toUpperCase()));
    Letterlist.appendChild(option);
  }
  // crea una optin nel select lettere che descrive il contenuto del select(A-Z dalla A alla Z)
  const option = document.createElement("option");
  option.value = 0;
  option.appendChild(document.createTextNode("A-Z"));
  Letterlist.appendChild(option);
}

// inserisce i nomi dei drink nel menu a tendina in basso a destra
function createOption(value, idCk) {
  const option = document.createElement("option");
  option.value = idCk;
  option.appendChild(document.createTextNode(value));
  selectDropdown.appendChild(option);
}

// (crea la drinkCard)inserisce immagine nella drilikList Page e assegna il nome
function createImgList(urlImg, nameCk, idCk, iba) {
  const div = document.createElement("div");
  div.classList.add('drinkCard');
  div.setAttribute("data-id", idCk);
  div.setAttribute("data-nome", nameCk);
  const img = document.createElement("img");
  img.setAttribute("src", urlImg);
  img.classList.add('drinkCardImg');
  const p = document.createElement("p");
  p.textContent = ridimensionaNome(nameCk);
  div.appendChild(img);
  div.appendChild(p);
  //inserisce logo se in iba c'é qualcosa
  if (iba) {
    const imglogoIba = document.createElement("img");
    imglogoIba.setAttribute("src", "img/logo-iba.svg");
    imglogoIba.classList.add('listLogoIba');
    div.appendChild(imglogoIba);
  }
  phList.appendChild(div);
}

// aumenta barra di caricamento
function ridimensionaNome(nameCk) {
  if (nameCk.length > 18) {
    let nameCkRidimensionato = nameCk.slice(0, 17);
    return nameCkRidimensionato;
  }
  return nameCk;
}

// aumenta barra di caricamento
function progresLoadingBar(max) {
  progresLoading++;
  loadingBar.style.width = `${max * 8}px`;
  const div = document.createElement("div");
  div.classList.add('loadingContent');
  loadingBar.appendChild(div);
  if (progresLoading === max) { progresLoading = 0; }
}

//cambia schermata tra "loading" "drinkList"  "drink"
function setAppState(state) {
  document.documentElement.dataset.state = state;
  if (state === "drinkList") {
    backArrow.classList.remove('material-symbols-outlined');
    backArrow.classList.add('hidden');
  }
  else {
    backArrow.classList.remove('hidden');
    backArrow.classList.add('material-symbols-outlined');
  }
  selectDropdown.classList.remove('searchFocus');
}

// torna alla schermata drinkList premando il logo o titolo dell'header
const logoBt = document.getElementById("logoBt");
logoBt.addEventListener("click", function () {
  btFavoriteListoOff();
  h2[0].textContent = "TUTTI I DRINK";
  dado.textContent = "ifl";
  svuotaDrinkList();
  allDrinkList();
  drinkBtn();
  setAppState('drinkList');
});

// torna alla schermata drinkList la freccia indietro in alto a destra dell'header
backArrow.addEventListener("click", function () {
  if (h2[0].textContent === "FAVORITE DRINK") {
    btfavoriteListIcon = false;
    favoriteListIcon.classList.add('full');
    svuotaDrinkList();
    favoriteDrinkList();
    drinkBtn();
  }
  setAppState('drinkList');
  window.scrollTo(0, lastDrinkY);
});

// apre il select
searchbtn.addEventListener("click", function () {
  selectDropdown.classList.add('searchFocus');
});

// favorite button clik
favoriteBtn.addEventListener("click", function () {
  // if id é nell'elenco lo toglie ne no aggiunge
  if (ceckSavedIdDrink()) {
    remuveDrink();
    favoriteBtn.classList.remove('full');
  } else {
    saveDrink();
    favoriteBtn.classList.add('full');
  }
});

// controlla se nella lista dei drik salvati é presente il drink corrente
function ceckSavedIdDrink() {
  for (let key in Object.keys(savedIdDrink)) {
    if (currentDrink.idSave === savedIdDrink[key].idSave) {
      return true;
    }
  }
  return false;
}

// aggiunge l'evento onClick al button favoriteList(lista dei drink preferiti) in basso
favoriteListIcon.addEventListener("click", function () {
  if (btfavoriteListIcon) {
    btfavoriteListIcon = false;
    favoriteListIcon.classList.add('full');
    svuotaDrinkList();
    favoriteDrinkList();
  } else {
    btfavoriteListIcon = true;
    favoriteListIcon.classList.remove('full');
    h2[0].textContent = "TUTTI I DRINK";
    dado.textContent = "ifl";
    svuotaDrinkList();
    allDrinkList();
  }
  drinkBtn();
  setAppState('drinkList');
});

// reset del button favoriteList(lista dei drink preferiti) in basso
function btFavoriteListoOff() {
  btfavoriteListIcon = true;
  favoriteListIcon.classList.remove('full');
}

// crea la lista dei drik preferiti
function favoriteDrinkList() {
  if (savedIdDrink.length > 1) {
    for (let keySavedIdDrink in Object.keys(savedIdDrink)) {
      if (keySavedIdDrink != 0) {
        console.log("______________________");
        console.log("Drink preferiti: ", keySavedIdDrink);
        console.log("______________________");
        const key = savedIdDrink[keySavedIdDrink].idSave;
        createImgList(CocktailList[key].immageUrl, CocktailList[key].nome, CocktailList[key].id, !!CocktailList[key].IBA);
        createOption(CocktailList[key].nome, CocktailList[key].id);

      }
    }
  } else {
    const p = document.createElement("p");
    p.textContent = "Non ci sono drink preferiti";
    phList.appendChild(p);
    createOption("no drink", 1000);
  }
  h2[0].textContent = "FAVORITE DRINK";
  dado.textContent = "sort_by_alpha";
}

// rimuove tutte le drink card e le option nel select in basso a destra
function svuotaDrinkList() {
  while (phList.firstChild) {
    phList.firstChild.remove();
  }
  while (selectDropdown.firstChild) {
    selectDropdown.firstChild.remove();
  }
}

// aggiunge l'evento onClick al button condividi
btCondividi.addEventListener("click", function () {
  drinkHeader[0].classList.remove('hidden');
  footer2.classList.remove('hidden');
  favoriteBtn.classList.remove('material-symbols-outlined');
  favoriteBtn.classList.add('hidden');
  btCondividi.classList.remove('material-symbols-outlined');
  btCondividi.classList.add('hidden');

  // html2canvas(drinkPg).then(canvas => {
  //   const link = document.createElement('a');
  //   link.download = 'drink.jpeg';
  //   link.href = canvas.toDataURL('img/jpeg');
  //   link.click();
  // });

  shareImage();

  drinkHeader[0].classList.add('hidden');
  footer2.classList.add('hidden');
  favoriteBtn.classList.remove('hidden');
  favoriteBtn.classList.add('material-symbols-outlined');
  btCondividi.classList.remove('hidden');
  btCondividi.classList.add('material-symbols-outlined');
});


async function shareImage() {

  html2canvas(drinkPg).then(canvas => {
    canvas.toBlob(function (blob) {
      const filesArray = [
        new File(
          [blob],
          'drink.png',
          {
            type: "image/png",
            lastModified: new Date().getTime()
          }
        )
      ];
      const shareData = {
        files: filesArray,
        title: 'Vacation Pictures',
        text: 'Photos from September 27 to October 14.',
      };
      navigator.share(shareData);
    });


  });

}



// funzione primaria che avvia il download dei dati dall API
creaCocktailList();

