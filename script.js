
// ---1 dividere i drink per lettera registrando la quantita di drink per lettera
// ---2 sistemare logo bicchieri
// 3 sistemare il tasto az
// 4 aggiungere il nome nella foto 
// 4.1 aggiungere il logo certificazione iba nella foto 
// 5 aggiungere il logo certificazione iba nella pg drink
// 6 selezionase i drink preferiti
// 7 sistemare un po di grandezze




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
  console.log(CocktailList);
  for (let key in Object.keys(CocktailList)) {
    createImgList(CocktailList[key].immageUrl, CocktailList[key].nome, CocktailList[key].id);
    createOption(CocktailList[key].nome, CocktailList[key].id);
  }
  for (let key in lettere) {
    createOptionLetter(lettere[key], lettereLength[key]);
  }

  //cambia schermata 
  setAppState('drinkList');

  drinkBtn();
  selectBtn();
  dadoBtn();


}
// gestisce il clic della drinkCard
function drinkBtn() {
  const drinkCard = document.querySelectorAll('.drinkCard');
  drinkCard.forEach(function (el) {
    el.addEventListener('click', function () {
      const idDrink = el.getAttribute("data-id");
      drinkSection(idDrink);
    });
  });
}

// gestisce il clic della Select List
function selectBtn() {
  selectDropdown.addEventListener('change', () => {
    drinkSection(selectDropdown.value)
  });
}
function dadoBtn() {
  dado.addEventListener('click', () => {
    drinkSection(Math.round(Math.random() * CocktailList.length))
  });
}

// inserisce le informazioni del drink nella schermata drink
function drinkSection(id) {
  setAppState('drink');

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
  imgDrink.setAttribute("src", CocktailList[id].immageUrl);
  drinkName.innerText = CocktailList[id].nome;
  inserisciIngredienti(id);

  drinkMetod.innerText = CocktailList[id].metodo;
}

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
  console.log(!!CocktailList[id].ingrediente4);
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
function createOptionLetter(lettera, grandezza) {
  const option = document.createElement("option");
  option.value = grandezza;
  option.appendChild(document.createTextNode(lettera));
  Letterlist.appendChild(option);
}
// inserisce i nomi dei drink nel menu a tendina in basso a destra
function createOption(value, idCk) {
  const option = document.createElement("option");
  option.value = idCk;
  option.appendChild(document.createTextNode(value));
  selectDropdown.appendChild(option);
}
//sort_by_alpha
// inserisce immagine nel body all'interno di phList e assegno il nome
function createImgList(urlImg, nameCk, idCk) {
  const div = document.createElement("div");
  div.classList.add('drinkCard');
  div.setAttribute("data-id", idCk);
  div.setAttribute("data-nome", nameCk);
  const img = document.createElement("img");
  img.setAttribute("src", urlImg);
  div.appendChild(img);
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

// torna alla schermata drinkList premando l'header
const backBt = document.getElementById("backBt");
backBt.addEventListener("click", function () {
  setAppState('drinkList');
});



// funzione primaria che avvia il download dei dati dall API
creaCocktailList();








// for (i = 0; i < lettere.length; i++) {
//   fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${lettere[i]}`)
//     .then((response) => response.json())
//     .then((data) => {
//       const obj = data.drinks;
//       console.log(obj)
//       // for (let key of Object.keys(obj)) {
//       //   // console.log(key);
//       //   Cocktail.push({ id: obj[key].idDrink, nome: obj[key].strDrink, immage: obj[key].strDrinkThumb, bicchiere: obj[key].strGlass, IBA: obj[key].strIBA, misura1: obj[key].strMeasure1, ingrediente1: obj[key].strIngredient1, misura2: obj[key].strMeasure2, ingrediente2: obj[key].strIngredient2, misura3: obj[key].strMeasure3, ingrediente3: obj[key].strIngredient3, misura4: obj[key].strMeasure4, ingrediente4: obj[key].strIngredient4, misura5: obj[key].strMeasure5, ingrediente5: obj[key].strIngredient5, misura6: obj[key].strMeasure6, ingrediente6: obj[key].strIngredient6, misura7: obj[key].strMeasure7, ingrediente7: obj[key].strIngredient7, misura8: obj[key].strMeasure8, ingrediente8: obj[key].strIngredient8, misura9: obj[key].strMeasure9, ingrediente9: obj[key].strIngredient9, misura10: obj[key].strMeasure10, ingrediente10: obj[key].strIngredient10, metodo: obj[key].strInstructionsIT })
//       // }
//       // let n = 0;

//       // x++;
//       // if (lettere.length == (x + 1)) {
//       //   console.log(Cocktail);

//       //   for (let key of Object.keys(Cocktail)) {
//       //     CocktailsName.push(Cocktail[key].nome);
//       //     CocktaiImg.push(Cocktail[key].immage);
//       //     createImgList(Cocktail[key].immage, Cocktail[key].nome);
//       //   }

//       //   Cocktailsista = CocktailsName.sort();
//       //   for (ii = 0; ii < Cocktailsista.length; ii++) {
//       //     createOption(Cocktailsista[ii]);
//       //     //createImgList(CocktaiImg[ii],CocktailsName[ii]);
//       //   }
//       // };
//     });
// }
