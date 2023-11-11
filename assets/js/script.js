//Selecting DOM Elements
const form = document.querySelector("form");
const menuScreen = document.querySelector("#menu-screen");
const gameScreen = document.querySelector("#game-screen");
const grid = document.querySelector("#game-grid");
const toolsSection = document.querySelector("#tools-section");
const inventorySection = document.querySelector("#inventory-section");
const homeBtn = document.querySelector("#home-btn");
const resetBtn = document.querySelector("#reset-btn");

form.addEventListener("submit", setValuesFromForm);

grid.addEventListener("click", gridEventListener);
toolsSection.addEventListener("click", updateCurrentAction);
inventorySection.addEventListener("click", updateCurrentAction);

homeBtn.addEventListener("click", e=>{
  menuScreen.classList.remove("display-none");
  gameScreen.classList.add("display-none");
});

resetBtn.addEventListener("click", e => {
  generateWorld();
})

function setValuesFromForm(event){
  event.preventDefault();

  game.numOfRows = event.target.numOfRows.value;
  game.numOfCols = event.target.numOfCols.value;
  game.cellSize = event.target.cellSize.value;
  game.currentTheme = game.themeOptions[event.target.theme.value];
  
  menuScreen.classList.add("display-none");
  console.log('menuScreen', menuScreen)
  gameScreen.classList.remove("display-none");
  generateWorld();
}

//TEMPORARY VALUES, when it's dynamic these values will be taken from a DOM element
const game = {
  //these values get set from the form
  numOfRows: 10,
  numOfCols: 15,
  cellSize: 100,

  surfaceLevel: 0, //SET THIS USING THE FOLLOWING FUNCTION
  calcSurfaceLevel: function(){
    this.surfaceLevel = Math.ceil(this.numOfRows * 0.5);
  },

  //Object with different themes
  themeOptions: {
    normal: {
      dirt: "dirt",
      grass: "grass",
      stone: "cobblestone",
      wood: "oak-log",
      leaves: "oak-leaves",
    },
    snow: {
      dirt: "dirt",
      grass: "snowy-grass",
      stone: "cobblestone",
      wood: "spruce-log",
      leaves: "spruce-leaves",
    },
    desert: {
      dirt: "sand",
      stone: "cobblestone",
      wood: "cactus",
    }
  },
  currentTheme: {},

  // current item or tool
  currentAction: "",
  checkIfBreakable: function(cell){
    const pickaxeBreaks = ["stone-item"];
    const axeBreaks = ["wood-item", "leaves-item"];
    const shovelBreaks = ["dirt-item", "grass-item"];

    if(
      (this.currentAction === "pickaxe" && pickaxeBreaks.includes(cell.getAttribute("blockType")))
    || (this.currentAction === "axe" && axeBreaks.includes(cell.getAttribute("blockType")))
    || (this.currentAction === "shovel" && shovelBreaks.includes(cell.getAttribute("blockType")))
    ){
      console.log("YES");
      return true;
    } else {
      console.log("NO");
      return false;
    }
  },

  // tree x / column locations
  treeXLocations: [],
  generateTreeXs: function(){
    this.treeXLocations.length = 0;
    const maxNumOfTrees = Math.floor(Math.random() * (Math.floor(this.numOfCols * 0.2))) + 1; 
    console.log('maxNumOfTrees', maxNumOfTrees);
    for (let i = 0; i<maxNumOfTrees; i++){
      const treeXLocation = Math.floor(Math.random() * this.numOfCols);
      if(!this.treeXLocations.includes(treeXLocation)){
        this.treeXLocations.push(treeXLocation);
      }
    }
  },

  // inventory
  inventory: {
    
  }
}

function generateWorld(){
  clearChildren(grid);
  game.calcSurfaceLevel();

  // game.currentTheme = game.themeOptions.normal;
  // game.currentTheme = game.themeOptions.snow;
  // game.currentTheme = game.themeOptions.desert;
  
  initializeInventory();
  let gridData = buildGrid(game.numOfRows, game.numOfCols, game.cellSize);
  addBlocks(gridData);
}

// puts the correct items in the inventory based on the current theme
function initializeInventory(){
  const inventoryChildren = inventorySection.children;
  let currentThemeClassList = Object.values(game.currentTheme);
  let currentThemeKeys = Object.keys(game.currentTheme);
  console.log('currentThemeClassList', currentThemeClassList)

  game.inventory = {};

  for (let i=0; i<inventoryChildren.length; i++){

    const p = inventoryChildren[i].querySelector("p");

    if(currentThemeKeys[i]){
      inventoryChildren[i].id = `${currentThemeKeys[i]}-item`
      inventoryChildren[i].classList.add(currentThemeClassList[i]);

      game.inventory[currentThemeKeys[i]] = 0

    } 
  }

  updateItemCountersUI();

}

// creates and appends grid cells to the grid based on the number of rows and columns
function buildGrid(numOfRows, numOfCols, cellSize){
  // Sets the row and column number in the grid style
  grid.style.gridTemplateRows = `repeat(${numOfRows}, ${cellSize}px)`;
  grid.style.gridTemplateColumns = `repeat(${numOfCols}, ${cellSize}px)`;

  const gridData = [];

  for (let row = 0; row < numOfRows; row++){
    for (let column = 0; column < numOfCols; column++){
      const cell = document.createElement("div");
      cell.classList.add("grid-cell");
      cell.id = `${row}-${column}`;
      grid.append(cell);
      gridData.push(cell);
    }
  }

  return gridData;
}

// Goes over each cell and sets it's time
function addBlocks(gridData){
  
  game.generateTreeXs();

  gridData.forEach(cell => {
    let [row, column] = cell.getAttribute("id").split("-");

    checkTypeAndDraw(Number(row), Number(column), cell);
    
  });
}

// draws blocks based on their location in the grid
function checkTypeAndDraw(row, column, cell){
  if(row === game.surfaceLevel){
    // Draws grass at surface level
    if(game.currentTheme.grass){
      cell.classList.add(game.currentTheme.grass);
      cell.setAttribute("blockType", "grass-item");
      console.log('cell', cell)
      // cell.setAttribue("block-type", `grass-item`);
    } else {
      // in themes such as desert we have sand for surface and below surface level
      cell.classList.add(game.currentTheme.dirt);
      cell.setAttribute("blockType", "dirt-item");
    }
  } else if (row > game.surfaceLevel){
    // Draws random elements below surface level
    const randomNum = Math.floor(Math.random() * 10);
    if(randomNum>=7){
      cell.classList.add(game.currentTheme.stone);
      cell.setAttribute("blockType", "stone-item");
    } else {
      cell.classList.add(game.currentTheme.dirt)
      cell.setAttribute("blockType", "dirt-item");
    }
  } else if(game.treeXLocations.includes(column) && (row < game.surfaceLevel && row > game.surfaceLevel - 4)){
    // draws wood and leaves on the x location of a tree
    if(row === game.surfaceLevel - 3){
      cell.classList.add(game.currentTheme.leaves)
      cell.setAttribute("blockType", "leaves-item");
    } else {
      cell.classList.add(game.currentTheme.wood)
      cell.setAttribute("blockType", "wood-item");
    }
  }
  else if((row === game.surfaceLevel - 2 || row === game.surfaceLevel - 3) && (game.treeXLocations.includes(column-1) || game.treeXLocations.includes(column+1)) && game.currentTheme.leaves != null){
    //draws leaves on the sides of trees
    cell.classList.add(game.currentTheme.leaves)
    cell.setAttribute("blockType", "leaves-item");
  }
}

// removes the selected styling class from all items and inventory elements
function resetSelectedStyling(){
  [...inventorySection.children].forEach(child => {
      child.classList.remove("selected");
  });

  [...toolsSection.children].forEach(child => {
    child.classList.remove("selected");
  });
}

// updates game's current action
function updateCurrentAction(event){
  if(event.target.classList[0] === "tool" || (event.target.classList[0] === "item" && event.target.id)){
    resetSelectedStyling();
    event.target.classList.add("selected");
    game.currentAction = event.target.id;
    console.log('game.currentAction = event.target.id;', game.currentAction = event.target.id)
  }
}

function gridEventListener(event){
  
  if(event.target.classList.contains("grid-cell") && !event.target.classList.contains("cloud")){
    
    const cell = event.target;

    if(game.currentAction==="pickaxe" || game.currentAction==="axe" || game.currentAction==="shovel"){
      if(event.target.classList.length > 1 && game.checkIfBreakable(cell)){
        console.log(`removing ${cell.getAttribute("blockType")} from ${cell.classList}`);
        cell.classList.remove(cell.classList[1]);
        const blockType = cell.getAttribute("blockType");
        cell.setAttribute("blockType", "");
        game.inventory[blockType.substring(0, blockType.lastIndexOf("-"))]++;
      } 
    } else {
      if (event.target.classList.length === 1){
        const blockType = game.currentAction;
        if(game.inventory[blockType.substring(0, blockType.lastIndexOf("-"))] > 0){
          const classStyleName = game.currentTheme[game.currentAction.substring(0, game.currentAction.lastIndexOf("-"))];
          cell.classList.add(classStyleName);
          cell.setAttribute("blockType", blockType)
          game.inventory[blockType.substring(0, blockType.lastIndexOf("-"))]--;
        }
     }
    }
   
  }

  updateItemCountersUI();

}

// updates the amount of items in the inventory
function updateItemCountersUI(){
  const keys = Object.keys(game.inventory);
  const values = Object.values(game.inventory);

  for (let i = 0; i < keys.length; i++) {
    const p = inventorySection.querySelector(`#${keys[i]}-item>p`);
    p.textContent = game.inventory[keys[i]];
  }
}

function clearChildren(element){
  while(element.children.length > 0){
    element.children[0].remove();
  }
  console.log("done");
}