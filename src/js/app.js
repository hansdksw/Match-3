/*-------------------------------- Constants --------------------------------*/

const tileColor = ["red", "green", "blue", "yellow", "purple"];

/*-------------------------------- Variables --------------------------------*/

let boardSize = "";
const squares = [];
let tileSelection = 5; //? temp value for testing
let tileCount;
let randomTiles;

/*------------------------ Cached Element References ------------------------*/

const board = document.querySelector(".board-container");

/*----------------------------- Event Listeners -----------------------------*/

const clickSquare = document.querySelectorAll("sqr"); //select element

const handleSquareClick = (clickSquare) => {
  console.log(`clicked ${clickSquare.target.id}`); //? check
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

drawBoard(10); //? temp

//randomizing the tiles on the board
const randomizeTiles = () => {
  squares.forEach((square) => {
    const randomTile = Math.floor(Math.random() * tileCount.length);
    square.style.backgroundColor = tileColor[randomTile];
  });
};

randomizeTiles(); //?temp
