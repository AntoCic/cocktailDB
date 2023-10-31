const select = document.getElementById("listDk");
const phList = document.getElementById("phList");
const character = document.querySelector(".character");
let lettere = ['a', 'b', "c", "d", "e", "f", "g", "h", "i", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "z"];
let Cocktail = [];
let CocktailsName = [];
let Cocktailsista = [];
let CocktaiName = [];
let CocktaiImg = [];
let x = 0;

for (i = 0; i < lettere.length; i++) {
  fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${lettere[i]}`)
    .then((response) => response.json())
    .then((data) => {
      const obj = data.drinks;
      for (let key of Object.keys(obj)) {
        // console.log(key);
        Cocktail.push({id:obj[key].idDrink, nome:obj[key].strDrink, immage:obj[key].strDrinkThumb, bicchiere:obj[key].strGlass, IBA:obj[key].strIBA, misura1:obj[key].strMeasure1, ingrediente1:obj[key].strIngredient1, misura2:obj[key].strMeasure2, ingrediente2:obj[key].strIngredient2, misura3:obj[key].strMeasure3, ingrediente3:obj[key].strIngredient3, misura4:obj[key].strMeasure4, ingrediente4:obj[key].strIngredient4, misura5:obj[key].strMeasure5, ingrediente5:obj[key].strIngredient5, misura6:obj[key].strMeasure6, ingrediente6:obj[key].strIngredient6, misura7:obj[key].strMeasure7, ingrediente7:obj[key].strIngredient7, misura8:obj[key].strMeasure8, ingrediente8:obj[key].strIngredient8, misura9:obj[key].strMeasure9, ingrediente9:obj[key].strIngredient9, misura10:obj[key].strMeasure10, ingrediente10:obj[key].strIngredient10, metodo:obj[key].strInstructionsIT})
      }
      let n = 0;
      
      x++;
      if (lettere.length == (x + 1)) {
        console.log(Cocktail);
        
        for (let key of Object.keys(Cocktail)) {
          CocktailsName.push(Cocktail[key].nome);   
          CocktaiImg.push(Cocktail[key].immage);
          createImgList(Cocktail[key].immage,Cocktail[key].nome);
        }

        Cocktailsista = CocktailsName.sort();
        for (ii = 0; ii < Cocktailsista.length; ii++) {
          createOption(Cocktailsista[ii]);
          //createImgList(CocktaiImg[ii],CocktailsName[ii]);
        }
      };
    });
}

function createOption(value) {
  const option = document.createElement("option");
  option.value = value;
  option.appendChild(document.createTextNode(value));
  select.appendChild(option);
}
function createImgList(urlImg, nameCk) {
  const div = document.createElement("div");
  div.classList.add('character');
  div.setAttribute("data-character", nameCk);
  // div.setAttribute("href", "https://www.thecocktaildb.com/api/json/v1/1/search.php?s="+nameCk);
  const img = document.createElement("img");
  img.setAttribute("src", urlImg);
  div.appendChild(img);
  phList.appendChild(div);
}

character.addEventListener("click", function(){
  console.log("ciao");
})