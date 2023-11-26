function removeRecipe() {
    console.log("rimuovo currentDrink:", currentDrink);
    console.log("dal ", savedIdDrink);
    const index = savedIdDrink.indexOf(currentDrink);
    console.log(index);
    savedIdDrink.splice(index, 1);
    console.log("drink attuali:", savedIdDrink);

    console.log("______________________");
    updateStorage();
}
