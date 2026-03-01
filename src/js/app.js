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
  // console.log(`clicked ${event.target.id}`); 
  
  
  
  
  if (selectedTile === undefined && targetTile === undefined) {
    selectedTile = parseInt(event.target.id);
    // console.log(selectedTile);
    // console.log(targetTile);
    
  } else if (selectedTile !== undefined && targetTile === undefined) { 
    targetTile = parseInt(event.target.id);
    // console.log(selectedTile);
    // console.log(targetTile); 
    
    const selectedColor = window.getComputedStyle(squares[selectedTile]).backgroundColor;
    const targetColor = window.getComputedStyle(squares[targetTile]).backgroundColor;

    if (selectedColor === targetColor) {
      console.log("Invalid Move");
      selectedTile = undefined;
      targetTile = undefined;
      return;
    } 
  
    tileSwap(selectedTile, targetTile); 
  
    const match1 = isMatch(selectedTile);
    const match2 = isMatch(targetTile); 
  
    if (!match1 && !match2) {
      console.log("No matches found");
      tileSwap(selectedTile, targetTile);
    } else {
      //for chaining
      setTimeout(processBoard, 300); //delay for cascading effect
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
  
//function for restarting the game
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
    
    // console.log(`Swapped colors ${id1} with ${id2}`);
  } else {
    console.log("Invalid Move")
  }
}

//axis & boundary check - separated boundary checks from swap function for reusability
const bounds = (id1,id2,boardSize) => { 

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
  
  // console.log(`the color tile selected is ${referenceTile}`); //check
  
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
 if (verticalMatch.length >= 3) { //else was breaking the vertical match check by stopping the function if a horizontal match was detected.
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

//UPDATE: function for transparency check in gravity to be more reliable
const isHole = (element) => {
  const color = element.style.backgroundColor;
  return color === "transparent" || color === "rgba(0, 0, 0, 0)" || color === "";
}

//function for gravity
const gravity = () => {
  let cascade = true;

  //keeps running till no empty tiles are found
  while (cascade) {
    cascade = false;

    //need to run the for loop in reverse to scan the board from the bottom up to implement 'gravity'
    for (let i = squares.length - 1 ; i >= 0 ; i--) {
      const currentTile = squares[i];

      //check for cleared tiles
      if (currentTile.style.backgroundColor === "transparent"){
        
        if (isHole(currentTile)) {
          
          //for 'tiles' that come before the start of the array (all spaces above the board)
          if (i < boardSize) {
            const randomTile = tileColor[Math.floor(Math.random() * tileColor.length)]
            currentTile.style.backgroundColor = randomTile;
            cascade = true;
          }
  
          else {
            const tileAbove = squares[i - boardSize];
            
            //check for transparent tiles and cascade
            if (tileAbove.style.backgroundColor !== "transparent") {
              currentTile.style.backgroundColor =  tileAbove.style.backgroundColor;
              tileAbove.style.backgroundColor = "transparent";
              cascade = true;
            }
          }
        }
      }
    }
  }
}

//another global match check created to deal with gravity
const matchCheck = () => {
  let hasMatches = false;

  for (let i = 0 ; i < squares.length; i++) {
    if (isMatch(i)) {
      hasMatches = true;
    }
  }
  return hasMatches;
}

//scan and process game board using gravity and match check.
const processBoard = () => {
  gravity();
  
  const newMatches = matchCheck();

  if (newMatches) {
    setTimeout(processBoard, 300); //delay for cascading effect
  }
}

  
//initializes board
randomizeTiles();

//  TO DO:
//    1. scoring and turns left for MVP
//    2. randomize without >3 in rows or columns during initialization
//    3. DOM for start screen, victory and game over screens.
//    4. clean up css styling 
//    5. animation of swapping and swapping back if match fails
//    6. manual hints - player initiated

//  stretch goals:
//    7. auto shuffle when out of possible moves