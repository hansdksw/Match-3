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
let restartButtonState = false;
  
let boardSize = 0;



/*------------------------ Cached Element References ------------------------*/

const board = document.querySelector(".board-container");

/*----------------------------- Event Listeners -----------------------------*/

//tile clicks
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
    
    const match1 = isMatch(selectedTile);
    const match2 = isMatch(targetTile); 

    if (!match1 && !match2) {
      tileSwap(selectedTile, targetTile);
    }

    //reset
    selectedTile = undefined;
    targetTile = undefined;
  }
};

board.addEventListener("click", handleSquareClick);

/*-------------------------------- Functions --------------------------------*/

tileCount = tileColor.slice(0, tileSelection);

//function for drawing dynamic game board
const drawBoard = (size) => {
  boardSize = size;

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
    
drawBoard(6); //! change board size here

//function for randomizing the tiles on the board
const randomizeTiles = () => { //! figure out how to ensure less than 3 in adjacent spots
  squares.forEach((square) => {
    const randomTile = Math.floor(Math.random() * tileCount.length);
    square.style.backgroundColor = tileColor[randomTile];
  });
};

const restartButtonElement = document.querySelector(".restart-button-1");
  
//restart
restartButtonElement.addEventListener("click", () => {
  if (restartButtonState === true) {
    restartButtonState = false;
  }
  randomizeTiles();
  console.log("restart!");
});

//function for swapping
const tileSwap = (id1, id2) => {
  const selectedElement = squares[id1];
  const targetElement = squares[id2];
  
  if (!selectedElement || !targetElement) return;

   if (bounds(id1,id2,boardSize)) {
    const tempColor = selectedElement.style.backgroundColor;
    selectedElement.style.backgroundColor = targetElement.style.backgroundColor;
    targetElement.style.backgroundColor = tempColor;
    
    console.log(`Swapped colors ${id1} with ${id2}`);
  } else {
    console.log("Invalid Move")
  }
}

//axis & boundary check
const bounds = (id1,id2,boardSize) => {  //! separated boundary checks from swap function for reusability

  const row1 = Math.floor(id1 / boardSize);
  const row2 = Math.floor(id2 / boardSize);
  const col1 = id1 % boardSize;
  const col2 = id2 % boardSize;
  
  const isVerticallyAdjacent = col1 === col2 && Math.abs(row1 - row2) === 1;
  const isHorizontallyAdjacent = row1 === row2 && Math.abs(col1 - col2) === 1;
  return isVerticallyAdjacent || isHorizontallyAdjacent;
}

//function for checking match condition
const isMatch = (id) => {
  const selectedElement = squares[id];
  const referenceTile = window.getComputedStyle(selectedElement).backgroundColor; // window.getComputedStyle() to get a value that will be used later for comparison.
  
  console.log(`the color tile selected is ${referenceTile}`); //check
  
  const direction = (step) => {
    let currentTile = id + step;
    let previousTile = id;
    let matchedId = [];
 
    while (squares[currentTile]) {
      
      if (!bounds(previousTile, currentTile, boardSize)) 
        break;

      const currentColor = window.getComputedStyle(squares[currentTile]).backgroundColor;
      if (currentColor !== referenceTile) 
        break;
      
      matchedId.push(currentTile);
      previousTile = currentTile;
      currentTile += step;
    }
    return matchedId;
  };

  // direction check
  const leftId = direction(-1);
  const rightId = direction(1);
  const upId = direction(-boardSize);
  const downId = direction(boardSize);

  //combine horizontal and vertical matched into horizontal and vertical arrays
  const horizontalMatch = [id , ...leftId , ...rightId];
  const verticalMatch = [id , ...upId , ...downId];

 
  //to receive id of matched tiles
  let clear = []; 

  //clear horizontally matched tiles
  if (horizontalMatch.length >= 3) {
    clear = [ ...clear, ...horizontalMatch];
  } 
    
  //clear vertically matched tiles
  else if (verticalMatch.length >= 3) {
    clear = [ ...clear, ...verticalMatch];
  }

  //filter to remove repeats
  const uniqueTilesToClear = clear.filter((value, index) => {
    return clear.indexOf(value) === index;
  });
    
  //clear tiles
  uniqueTilesToClear.forEach(tileId => {
    squares[tileId].style.backgroundColor = "transparent"; 
  });
  return uniqueTilesToClear.length > 0; //truthy if tiles are cleared
}
  
//initializes board
randomizeTiles();

// ```TO DO:
//     1. gravity, new random tiles
//     2. randomize without >3 in rows or columns
//     3. DOM
//     4. clean up css
//     5. animation of swapping and swapping back if match fails

//     stretch goals:
//     1. manual hints - player initiated
// ```