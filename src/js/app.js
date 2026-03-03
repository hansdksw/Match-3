/*-------------------------------- Constants --------------------------------*/


const tileColor = ["red", "green", "blue", "yellow", "purple"];
const squares = [];

/*-------------------------------- Variables --------------------------------*/

let tileSelection = 0; //? To do: to fix tile selection
let tileCount;
let selectedTile;
let targetTile;
let selectedTileStored;
let targetTileStored;
let tileSwapState = false;
let shuffleButtonState = false;
let restartButtonState = false;
let horizontalScore = 0;
let verticalScore = 0;
let boardSize = 0;
let score = 0;
let moves = 20;
let boardSizeSelected = false;
let tileCountSelected = false;

/*------------------------ Cached Element References ------------------------*/

const boardElement = document.querySelector(".board-container");
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const victoryScreen = document.getElementById("victory-screen");
const gameOverScreen = document.getElementById("game-over-screen");
const startButtonElement = document.getElementById("start-button");
const restartButtonElement = document.querySelectorAll(".restart-button");
const shuffleButtonElement = document.querySelectorAll(".shuffle-button");
const boardSizeSelectorElement = document.getElementById("board-size-selector");
const boardSizeOptionElement = document.getElementById("board-size-selector").value;
const tileCountSelectorElement = document.getElementById("tile-count-selector");
const tileCountOptionElement = document.getElementById("tile-count-selector").value;

/*----------------------------- Event Listeners -----------------------------*/

//handle tile clicks
const handleSquareClick = (event) => {

  if (!event.target.classList.contains("sqr")) {
    return;
  }

  if (selectedTile === undefined && targetTile === undefined) {
    selectedTile = parseInt(event.target.id);
    
    highlightTile(selectedTile);
    
  } else if (selectedTile !== undefined && targetTile === undefined) { 
    targetTile = parseInt(event.target.id);
    
    highlightTile(targetTile);

    const selectedColor = window.getComputedStyle(squares[selectedTile]).backgroundColor;
    const targetColor = window.getComputedStyle(squares[targetTile]).backgroundColor;

    if (selectedColor === targetColor) {
      console.log("Invalid Move");
      resetTile(selectedTile);
      resetTile(targetTile);
      selectedTile = undefined;
      targetTile = undefined;
      return;
    } 
  
    tileSwap(selectedTile, targetTile); 
  
    //count mismatches but not invalid moves
    moveCount();    

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
    resetTile(selectedTile);
    resetTile(targetTile);
    selectedTile = undefined;
    targetTile = undefined;
  }
};

// const handleStartClick = () => {
//   if (!boardSizeSelected || !tileCountSelected) {
//     alert("Please select board size and number of tiles.")
//   } else{
//     startGame();
//   }
// }

//handle shuffle button click
const handleShuffleClick = () =>{
  if (shuffleButtonState === true) {
    shuffleButtonState = false;
  }
  randomizeTiles();
  console.log("Shuffled!");  
}

//handle restart button click
const handleRestartClick = () =>{
  if (restartButtonState === true ) {
    restartButtonState = false;
  }

  score = 0;
  moves = 20;
  resetScreen();

  console.log("Restart!");  
}

const handleSelectedBoardSize = (event) => {
  const option = event.target.value;
  const size = parseInt(option);
  drawBoard(size);
  boardSizeSelected = true;
  console.log("Board size set to:", size);
} 

const handleSelectedTileCount = (event) => {
  const option = event.target.value;
  const noOfTiles = parseInt(option);

  tileSelection = noOfTiles;
  tileCount = tileColor.slice(0, tileSelection);

  tileCountSelected = true;
  console.log("Number of tiles set to:", noOfTiles);
} 

const handleStartClick = () => {
  if (!boardSizeSelected || !tileCountSelected) {
    alert("Please select board size and number of tiles.")
  } else{
    startGame();
    randomizeTiles();
  }
}

boardElement.addEventListener("click", handleSquareClick);
startButtonElement.addEventListener("click", handleStartClick);
shuffleButtonElement.forEach((button) => button.addEventListener("click", handleShuffleClick));
restartButtonElement.forEach((button) => button.addEventListener("click", handleRestartClick));
boardSizeSelectorElement.addEventListener("change", handleSelectedBoardSize);
tileCountSelectorElement.addEventListener("change", handleSelectedTileCount);



/*-------------------------------- Functions --------------------------------*/

const checkGameState = () => {
  if (moves <= 0) {
    isGameOver();
  } else if (score >= 100) {
    isVictory();
  }
}

//function for highlighting selected tiles
const highlightTile = (tile) => {
  squares[tile].style.border = "1px solid cyan"
}

//function for resetting selected tile
const resetTile = (tile) => {
  squares[tile].style.border = "1px solid black"
}


//function for drawing dynamic game board
const drawBoard = (size) => {
  boardSize = size;

  //resets all edited states for the container and the array
  boardElement.innerHTML = "";
  squares.length = 0;

  boardElement.style.width = `${(50 + 2) * boardSize}px`;
  
  let fragment = new DocumentFragment();
  fragment = document.createDocumentFragment();
  
  for (let i = 0; i < boardSize ** 2; i++) {
    const square = document.createElement("div");
    square.classList.add("sqr");
    square.setAttribute("id", i);
    
    fragment.appendChild(square); //DocumentFragment to speed up grid generation time https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment/append
    squares.push(square);
  }
  
  boardElement.appendChild(fragment);
};
    
// drawBoard(6); //! change board size here

//function for randomizing the tiles on the board
const randomizeTiles = () => { //! figure out how to ensure less than 3 in adjacent spots
  squares.forEach((square) => {
    const randomTile = Math.floor(Math.random() * tileCount.length);
    square.style.backgroundColor = tileColor[randomTile];
  });
};

  

//function for swapping
const tileSwap = (id1, id2) => {
  const selectedElement = squares[id1];
  const targetElement = squares[id2];
  
  if (!selectedElement || !targetElement) return;

  //counts moves down to 0
  if (moves <= 0) return;

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
//adaptation of the manhattan distance to check for matches in the same axis and that the swaps are made with orthogonally adjacent tiles.
const bounds = (id1,id2,boardSize) => { 

  const row1 = Math.floor(id1 / boardSize);
  const row2 = Math.floor(id2 / boardSize);
  const col1 = id1 % boardSize;
  const col2 = id2 % boardSize;
  
  const isVerticallyAdjacent = col1 === col2 && Math.abs(row1 - row2) === 1;
  const isHorizontallyAdjacent = row1 === row2 && Math.abs(col1 - col2) === 1;
  return isVerticallyAdjacent || isHorizontallyAdjacent;
}

//! to fix generating more than 2 same color tiles in a row/column and tileSwap Bug, consider removing tile clearing from isMatch and making it a separate function.
//function for checking match condition
const isMatch = (id) => {
  const selectedElement = squares[id];

  //stops isMatch from counting cleared tiles
  if (selectedElement.style.backgroundColor === "transparent" || selectedElement.style.backgroundColor === "") {
    return false;
  }

  const referenceTile = window.getComputedStyle(selectedElement).backgroundColor; // window.getComputedStyle() to get a value that will be used later for comparison.

  checkGameState();

  //stops isMatch from counting cleared tiles
  if (selectedElement.style.backgroundColor === "transparent" || selectedElement.style.backgroundColor === "") {
    return false;
  }
  
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

  //combine horizontal and vertical matched tiles into horizontal and vertical arrays
  const horizontalMatch = [id , ...leftId , ...rightId];
  const verticalMatch = [id , ...upId , ...downId];
  

  //to receive id of matched tiles
  let clear = []; 

  //clear horizontally matched tiles
  if (horizontalMatch.length >= 3) {
    clear = [ ...clear, ...horizontalMatch];
  } 
    
  //clear vertically matched tiles
  if (verticalMatch.length >= 3) { 
    clear = [ ...clear, ...verticalMatch];
  }


  //filter to remove repeats
  const uniqueTilesToClear = clear.filter((value, index) => {
    return clear.indexOf(value) === index;
  });

  //score counter
  if (uniqueTilesToClear.length > 0) {
    score += uniqueTilesToClear.length;
    console.log(`Score: ${score}`); //check
    
    //clear tiles
    uniqueTilesToClear.forEach(tileId => {
      squares[tileId].style.backgroundColor = "transparent"; 
    });
    return uniqueTilesToClear.length > 0; 
  }
  return false;
}

//UPDATE: function for transparency check in gravity to be more reliable
const isHole = (element) => {
  const color = element.style.backgroundColor;
  return color === "transparent" || color === "rgba(0, 0, 0, 0)" || color === "";
}

//function for gravity
const applyGravity = () => {
  let cascade = true;

  //keeps running till no empty tiles are found
  while (cascade) {
    cascade = false;

    //need to run the for loop in reverse to scan the board from the bottom up to implement 'gravity'
    for (let i = squares.length - 1 ; i >= 0 ; i--) {
      const currentTile = squares[i];

      //check for cleared tiles
      
        
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

//another global match check created to deal with applyGravity
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
  applyGravity();
  
  const newMatches = matchCheck();

  if (newMatches) {
    setTimeout(processBoard, 300); //delay for cascading effect
  }
}

//counter for moves/turns left
const moveCount = () => {

  if (moves <=0) {
    console.log("out of moves")
    return;
  }

  moves -= 1
  console.log(`You have ${moves} left.`);
}

//victory condition
const isVictory = (score) => {
  // if (score >= 200) {
    startScreen.style.display = "none";
    gameScreen.style.display = "none";
    victoryScreen.style.display = "flex";
    gameOverScreen.style.display = "none";
  // }
}

//game over condition
const isGameOver = () => {
  // if (moves <= 0) {
    startScreen.style.display = "none";
    gameScreen.style.display = "none";
    victoryScreen.style.display = "none";
    gameOverScreen.style.display = "flex";
  // }
}

//game screen from start screen
const startGame = () => {
  startScreen.style.display = "none";
  gameScreen.style.display = "flex";
  victoryScreen.style.display = "none";
  gameOverScreen.style.display = "none";
}

const resetScreen = () => {
  startScreen.style.display = "flex";  
  gameScreen.style.display = "none";
  victoryScreen.style.display = "none";
  gameOverScreen.style.display = "none";
}

// startGame();
// isVictory();
// isGameOver();
// resetScreen();

//initializes board
randomizeTiles();



//  TO DO:
////  1. scoring and turns left for MVP
//    1. player initiated shuffle for a bricked board
//    3. DOM for start screen, victory and game over screens.
//    4. clean up css styling 

//  stretch goals:
//    2. randomize without >3 in rows or columns during initialization
//    5. animation of swapping and swapping back if match fails
//    6. manual hints - player initiated
//    7. auto shuffle when out of possible moves