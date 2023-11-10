//Selecting DOM Elements
const grid = document.querySelector("#game-grid");
console.log('grid', grid)

//TEMPORARY VALUES, when it's dynamic these values will be taken from a DOM element
const numOfRows = 10;
const numOfCols = 12;
const cellSize = 100;

buildGrid(numOfRows, numOfCols, cellSize);

// creates and appends grid cells to the grid based on the number of rows and columns
function buildGrid(numOfRows, numOfCols, cellSize){
  // Sets the row and column number in the grid style
  grid.style.gridTemplateRows = `repeat(${numOfRows}, ${cellSize}px)`;
  grid.style.gridTemplateColumns = `repeat(${numOfCols}, ${cellSize}px)`;

  for (let row = 0; row < numOfRows; row++){
    for (let column = 0; column < numOfCols; column++){
      const cell = document.createElement("div");
      cell.classList.add("grid-cell");
      grid.append(cell);
    }
  }
}