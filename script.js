
// ---1 dividere i drink per lettera registrando la quantita di drink per lettera
// ---2 sistemare logo bicchieri
// ---3 sistemare il tasto az
// ---3.1 sistemare il tasto az toglere lettera per evitare il doppio click 
// ---3.2 sistemare il tasto az non si puo cliccare sulle carte dei drink
// ---3.3 sistemare il tasto az trasformare il tasto dado in un tasto per riavere tutti i drink
// ---4 aggiungere il nome nella foto 
// ---4.1 aggiungere il logo certificazione iba nella foto 
// ---5 aggiungere il logo certificazione iba nella pg drink
// ---ancorare img drinkcard quando si torna in dietro
// 6 selezionase i drink preferiti
// 7 ---sistemare un po di grandezze


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

// , "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"
let lettere = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
let lettereLength = [];
let CocktailList = [];
let progresLoading = 0;
let lastDrinkY = 0;



//Scarica drink per lettera in ordine alfabetico
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

//esegue il download dei drink per lettera in ordine alfabetico
//e li carica in un ogetto unico
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

    progresLoadingBar(lettere.length);
  }
  usaLista();
}

// funzione che sia avvia dopo aver creato l'oggetto CocktailList
function usaLista() {
  allDrinkList();
  createOptionLetter()
  drinkBtn();
  //cambia schermata 
  azBtn();
  dadoBtn();
  selectBtn();
  setAppState('drinkList');
}
// crea lista drinkCard e del select in basso a destra di tutti i drink
function allDrinkList() {
  console.log(CocktailList);
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
    while (phList.firstChild) {
      phList.firstChild.remove();
    }
    while (selectDropdown.firstChild) {
      selectDropdown.firstChild.remove();
    }
    let idFirst = 0;
    let idLast = 0;
    if (Letterlist.selectedIndex === (Letterlist.length - 1)) {
      h2[0].textContent = "TUTTI I DRINK";
      dado.firstElementChild.textContent = "ifl";
      while (phList.firstChild) {
        phList.firstChild.remove();
      }
      while (selectDropdown.firstChild) {
        selectDropdown.firstChild.remove();
      }
      allDrinkList();
    } else {
      for (let i = 0; i < Letterlist.selectedIndex; i++) {
        idFirst = idFirst + lettereLength[i];
      }
      idLast = idFirst + lettereLength[Letterlist.selectedIndex];
      for (let key = idFirst; key < idLast; key++) {
        createImgList(CocktailList[key].immageUrl, CocktailList[key].nome, CocktailList[key].id, !!CocktailList[key].IBA);
        createOption(CocktailList[key].nome, CocktailList[key].id);
      }
      h2[0].textContent = "DRINK : " + lettere[Letterlist.selectedIndex].toUpperCase();
      dado.firstElementChild.textContent = "sort_by_alpha";
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

function dadoBtn() {
  dado.addEventListener('click', () => {
    const dadoIcon = dado.firstElementChild.textContent;
    if (dadoIcon === "ifl") {
      drinkSection(Math.round(Math.random() * CocktailList.length));
    } else {
      h2[0].textContent = "TUTTI I DRINK";
      dado.firstElementChild.textContent = "ifl";
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

// inserisce le informazioni del drink nella schermata drink
function drinkSection(id) {
  setAppState('drink');
  inserisciIconaBicchiere(id);
  imgDrink.setAttribute("src", CocktailList[id].immageUrl);
  drinkName.innerText = CocktailList[id].nome;
  inserisciIngredienti(id);

  drinkMetod.innerText = CocktailList[id].metodo;
  const ibaContainer = document.getElementsByClassName("ibaContainer")
  if (!!CocktailList[id].IBA) {
    ibaContainer[0].classList.remove('hidden');
    ibaContainer[0].lastElementChild.textContent = CocktailList[id].IBA;
  } else {
    ibaContainer[0].classList.add('hidden');
  }

  imgDrink.addEventListener("click", function () {
    setAppState('drinkList');
    window.scrollTo(0, lastDrinkY);
  });
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

// inserisce immagine nel body all'interno di phList e assegno il nome
function createImgList(urlImg, nameCk, idCk, iba) {
  const div = document.createElement("div");
  div.classList.add('drinkCard');
  div.setAttribute("data-id", idCk);
  div.setAttribute("data-nome", nameCk);
  const img = document.createElement("img");
  img.setAttribute("src", urlImg);
  img.classList.add('drinkCardImg');
  const p = document.createElement("p");
  p.textContent = nameCk;
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
}

// torna alla schermata drinkList premando il logo o titolo dell'header
const logoBt = document.getElementById("logoBt");
logoBt.addEventListener("click", function () {
  h2[0].textContent = "TUTTI I DRINK";
  dado.firstElementChild.textContent = "ifl";
  while (phList.firstChild) {
    phList.firstChild.remove();
  }
  while (selectDropdown.firstChild) {
    selectDropdown.firstChild.remove();
  }
  allDrinkList();
  drinkBtn();
  setAppState('drinkList');
});
// torna alla schermata drinkList premando il logo o titolo dell'header
backArrow.addEventListener("click", function () {
  setAppState('drinkList');
  window.scrollTo(0, lastDrinkY);
});

// apre il select
const searchbtn = document.getElementById("searchbtn");
searchbtn.addEventListener("click", function () {
  selectDropdown.classList.add('searchFocus');
});

// funzione primaria che avvia il download dei dati dall API
creaCocktailList();
