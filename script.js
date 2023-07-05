const select = document.getElementById("breeds");
const container = document.getElementById("container");
let lettere = ['a', 'b', "c", "d", "e", "f", "g", "h", "i", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "z"];
let CocktailsName = [];
let Cocktailsista = [];
let x = 0;
for (i = 0; i < lettere.length; i++) {
  fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${lettere[i]}`)
    .then((response) => response.json())
    .then((data) => {
      const obj = data.drinks;
      let n = 0;
      Object.keys(obj).forEach(() => {
        CocktailsName.push(obj[n].strDrink);
        n++;
      });
      x++;
      if (lettere.length == (x + 1)) {
        Cocktailsista = CocktailsName.sort();
        for (ii = 0; ii < Cocktailsista.length; ii++) {
          createOption(Cocktailsista[ii]);
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