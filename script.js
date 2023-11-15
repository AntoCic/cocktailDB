
const select = document.getElementById("listDk");
const phList = document.getElementById("phList");
const loadingBar = document.querySelector(".loadingBar")
// , "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"
let lettere = ['a', 'b'];
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
    progresLoadingBar(lettere.length);
  }
  usaLista();
}

// funzione che sia avvia dopo aver creato l'oggetto CocktailList
function usaLista() {
  console.log(CocktailList);
  for (let key in Object.keys(CocktailList)) {
    createImgList(CocktailList[key].immageUrl, CocktailList[key].nome, CocktailList[key].id);
    createOption(CocktailList[key].nome);
  }
  //cambia schermata
  setAppState('drinkList');

  drinkBtn();

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

function drinkSection(id) {
  setAppState('drink');
  console.log(id);

  const drinkName = document.getElementById("drinkName");

  drinkName.innerText = CocktailList[id].nome;

}
// inserisce i nomi dei drink nel menu a tendina in basso a destra
function createOption(value) {
  const option = document.createElement("option");
  option.value = value;
  option.appendChild(document.createTextNode(value));
  select.appendChild(option);
}

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
}

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
