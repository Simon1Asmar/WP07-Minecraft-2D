//Selecting DOM Elements
const grid = document.querySelector("#game-grid");
const toolsSection = document.querySelector("#tools-section");

grid.addEventListener("click", e=>{
 
  console.log(e.target.id);
})

toolsSection.addEventListener("click", e=>{
  console.log(e.target.id);
})

//TEMPORARY VALUES, when it's dynamic these values will be taken from a DOM element
const numOfRows = 10;
const numOfCols = 15;
const cellSize = 100;

const game = {
  surfaceLevel: Math.ceil(numOfRows * 0.5),
}

const gridData = buildGrid(numOfRows, numOfCols, cellSize);
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
  gridData.forEach(cell => {
    let [row, column] = cell.getAttribute("id").split("-");

    if(row >= game.surfaceLevel){
      cell.classList.add("dirt");
    }
  });
}
