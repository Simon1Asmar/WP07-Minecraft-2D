//Selecting DOM Elements
const grid = document.querySelector("#game-grid");
const toolsSection = document.querySelector("#tools-section");
const inventorySection = document.querySelector("#inventory-section")

grid.addEventListener("click", e=>{
 
  console.log(e.target.id);
})

toolsSection.addEventListener("click", e=>{
  console.log(e.target.id);
  e.target.classList.add("selected")
})

inventorySection.addEventListener("click", e=> {
  console.log(e.target.id);
  // console.log(e.target.classList[1]);
  if(e.target.id){
    e.target.classList.add("selected")
  }
})

//TEMPORARY VALUES, when it's dynamic these values will be taken from a DOM element
const game = {
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

  // tree x / column locations
  treeXLocations: [],
  generateTreeXs: function(){
    const maxNumOfTrees = Math.floor(Math.random() * (Math.floor(this.numOfCols * 0.2))) + 1; 
    console.log('maxNumOfTrees', maxNumOfTrees);
    for (let i = 0; i<maxNumOfTrees; i++){
      const treeXLocation = Math.floor(Math.random() * this.numOfCols);
      if(!this.treeXLocations.includes(treeXLocation)){
        this.treeXLocations.push(treeXLocation);
      }
    }
  },
}

game.calcSurfaceLevel();
// game.currentTheme = game.themeOptions.normal;
// game.currentTheme = game.themeOptions.snow;
game.currentTheme = game.themeOptions.desert;

initializeInventory();

// puts the correct items in the inventory based on the current theme
function initializeInventory(){
  const inventoryChildren = inventorySection.children;
  let currentThemeClassList = Object.values(game.currentTheme);
  let currentThemeKeys = Object.keys(game.currentTheme);
  console.log('currentThemeClassList', currentThemeClassList)

  for (let i=0; i<inventoryChildren.length; i++){

    const p = inventoryChildren[i].querySelector("p");

    if(currentThemeKeys[i]){
      inventoryChildren[i].id = `${currentThemeKeys[i]}-item`
      inventoryChildren[i].classList.add(currentThemeClassList[i]);

      p.textContent = "0";
    } else {
      
      p.textContent = "";
    }
  }

}

const gridData = buildGrid(game.numOfRows, game.numOfCols, game.cellSize);
addBlocks(gridData);

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
function addBlocks(){
  
  game.generateTreeXs();

  gridData.forEach(cell => {
    let [row, column] = cell.getAttribute("id").split("-");

    checkTypeAndDraw(Number(row), Number(column), cell);
    
  });
}

function checkTypeAndDraw(row, column, cell){
  if(row === game.surfaceLevel){
    // Draws grass at surface level
    if(game.currentTheme.grass){
      cell.classList.add(game.currentTheme.grass);
    } else {
      // in themes such as desert we have sand for surface and below surface level
      cell.classList.add(game.currentTheme.dirt);
    }
  } else if (row > game.surfaceLevel){
    // Draws random elements below surface level
    const randomNum = Math.floor(Math.random() * 10);
    if(randomNum>=7){
      cell.classList.add(game.currentTheme.stone);
    } else {
      cell.classList.add(game.currentTheme.dirt)
    }
  } else if(game.treeXLocations.includes(column) && (row < game.surfaceLevel && row > game.surfaceLevel - 4)){
    // draws wood and leaves on the x location of a tree
    if(row === game.surfaceLevel - 3){
      cell.classList.add(game.currentTheme.leaves)
    } else {
      cell.classList.add(game.currentTheme.wood)
    }
  }
  else if((row === game.surfaceLevel - 2 || row === game.surfaceLevel - 3) && (game.treeXLocations.includes(column-1) || game.treeXLocations.includes(column+1)) && game.currentTheme.leaves != null){
    //draws leaves on the sides of trees
    cell.classList.add(game.currentTheme.leaves)
  }
}
