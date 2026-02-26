/*-------------------------------- Constants --------------------------------*/

const { collapseTextChangeRangesAcrossMultipleVersions } = require("typescript");
const tileColor = ["red", "green", "blue", "yellow", "purple"];
const squares = [];

/*-------------------------------- Variables --------------------------------*/

let tileSelection = 5; //? To do: to fix tile selection
let tileCount;
let selectedTile;
let targetTile;

/*------------------------ Cached Element References ------------------------*/

const board = document.querySelector(".board-container");
let selectedTileStored;
let targetTileStored;

/*----------------------------- Event Listeners -----------------------------*/

// const clickSquare = document.querySelectorAll(".sqr"); //select element caught a syntax error which made me realize this is a redundant line

const handleSquareClick = (event) => {
  console.log(`clicked ${event.target.id}`); //? check
  if (selectedTile === undefined && targetTile === undefined) {
    selectedTile = event.target.id;
    console.log(selectedTile);
    console.log(targetTile);
    
  } else if (selectedTile !== undefined && targetTile === undefined) {  
    targetTile = event.target.id;
    console.log(selectedTile);
    console.log(targetTile);
    
  } else {
    //reset
    selectedTile = undefined;
    targetTile = undefined;
  }
};

// if (selectedTile !== undefined && targetTile !== undefined) {
//   tileSwap(squares, selectedTile , targetTile);
//   console.log(squares);

//   //reset states
//   selectedTile = undefined;
//   targetTile = undefined;
    
// }


  
const tileSwapTest = document.querySelector(".restart-button-2");

tileSwapTest.addEventListener("click", () => {
  if (selectedTile !== undefined && targetTile !== undefined) {
    tileSwapStateTest = false;
    tileSwap(squares, selectedTile , targetTile);
  console.log(squares);

  //reset states
  selectedTile = undefined;
  targetTile = undefined;
  }  
});





console.log(selectedTile);
console.log(targetTile);

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


// const drawBoard = (boardSize) => {
  //     board.style.width = `${(50 + 2) * boardSize}px`;
  
  //     // Removed the DocumentFragment lines
  
  //     for (let i = 0; i < boardSize ** 2; i++) {
    //         const square = document.createElement("div");
    //         square.classList.add("sqr");
    //         square.setAttribute("id", i);
    
    //         // Append directly to the board instead of the fragment
    //         board.appendChild(square); 
    //         squares.push(square);
    //       }
//     };

    
drawBoard(12); //! change board size here

//randomizing the tiles on the board
const randomizeTiles = () => { //figure out how to ensure less than 3 in adjacent spots
  squares.forEach((square) => {
    const randomTile = Math.floor(Math.random() * tileCount.length);
    square.style.backgroundColor = tileColor[randomTile];
  });
};

randomizeTiles();

// //! FOR TESTING

let restartButtonState = false;
  
const restartButtonElement = document.querySelector(".restart-button-1");
  
restartButtonElement.addEventListener("click", () => {
  if (restartButtonState === true) {
    restartButtonState = false;
  }
  randomizeTiles();
  console.log("restart!");
});




//swap logic

//? input > data swap > check for matches
//function for swapping:

//! if selectedTile + 1 (horizontal) || selectedTile - 1 (horizontal) || selectedTile + ?? (vertical) || selectedTile - ?? (vertical)
const testArr = ["a","b","c","d","e","f","g","h","i"]

console.log(testArr);

const tileSwap = (squares, selectedTile, targetTile) => {
  [squares[selectedTile], squares[targetTile]] = [squares[selectedTile], squares[targetTile]];
  
};



// let tileSwapStateTest = false;
  
// const tileSwapTest = document.querySelector(".restart-button-2");
  
// tileSwapTest.addEventListener("click", () => {
//   if (tileSwapStateTest === true) {
//     tileSwapStateTest = false;
//   }
//   tileSwap(testArr, selectedTileStored , targetTileStored);
//   console.log(testArr)

// });




