/*-------------------------------- Constants --------------------------------*/

const tileColor = ["red", "green", "blue", "yellow", "purple"];
const squares = [];

/*-------------------------------- Variables --------------------------------*/

let tileSelection = 5; //? To do: to fix tile selection
let tileCount;
let selectedTile;
let targetTile;
let selectedTileStored;
let targetTileStored;
let tileSwapStateTest = false;



/*------------------------ Cached Element References ------------------------*/

const board = document.querySelector(".board-container");

/*----------------------------- Event Listeners -----------------------------*/

const handleSquareClick = (event) => {

  //Safety Check
  if (!event.target.classList.contains("sqr")) {
    return;
  }

  console.log(`clicked ${event.target.id}`); 

  if (selectedTile === undefined && targetTile === undefined) {
    selectedTile = parseInt(event.target.id);
    console.log(selectedTile);
    console.log(targetTile);
    
  } else if (selectedTile !== undefined && targetTile === undefined) {  
    targetTile = parseInt(event.target.id);
    console.log(selectedTile);
    console.log(targetTile); 
    
    tileSwap(selectedTile, targetTile);
    // console.log(squares);

    //reset
    selectedTile = undefined;
    targetTile = undefined;
  }
};

board.addEventListener("click", handleSquareClick);

/*-------------------------------- Functions --------------------------------*/

tileCount = tileColor.slice(0, tileSelection);

// drawing dynamic game board
const drawBoard = (boardSize) => {
  board.style.width = `${(50 + 2) * boardSize}px`;
  
  let fragment = new DocumentFragment();
  fragment = document.createDocumentFragment();
  
  for (let i = 0; i < boardSize ** 2; i++) {
    const square = document.createElement("div");
    square.classList.add("sqr");
    square.setAttribute("id", i);
    
    fragment.appendChild(square); //DocumentFragment to speed up grid generation time https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment/append
    squares.push(square);
  }
  board.appendChild(fragment);
};
    
drawBoard(4); //! change board size here

// randomizing the tiles on the board
const randomizeTiles = () => { //! figure out how to ensure less than 3 in adjacent spots
  squares.forEach((square) => {
    const randomTile = Math.floor(Math.random() * tileCount.length);
    square.style.backgroundColor = tileColor[randomTile];
  });
};

console.log(squares[1].dataset.value)



let restartButtonState = false;
  
const restartButtonElement = document.querySelector(".restart-button-1");
  
restartButtonElement.addEventListener("click", () => {
  if (restartButtonState === true) {
    restartButtonState = false;
  }
  randomizeTiles();
  console.log("restart!");
});




//? input > data swap > check for matches

//! if selectedTile + 1 (horizontal) || selectedTile - 1 (horizontal) || selectedTile + ?? (vertical) || selectedTile - ?? (vertical)

//function for swapping:

const tileSwap = (id1, id2) => {
  const selectedElement = squares[id1];
  const targetElement = squares[id2];

  if (!selectedElement || !targetElement) {
    console.error(`Could not find tiles at indices ${id1} or ${id2}`);
    return;
  }

  if (selectedElement && targetElement) {
    // [squares[selectedTile], squares[targetTile]] = [squares[selectedTile], squares[targetTile]]; //! this only swaps the elements in the array but does not update the backgroundColor
    const tempColor = selectedElement.style.backgroundColor;

    selectedElement.style.backgroundColor = targetElement.style.backgroundColor;
    targetElement.style.backgroundColor = tempColor;

    console.log(`Swapped colors ${id1} with ${id2}`);
  }
}




