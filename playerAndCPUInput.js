const { printBoard, buildBoard, getRandomOrientation, canPlaceShip, placeShipRandomly } = require('./buildPlayerBoard');
const readlineSync = require('readline-sync');

const boardSizes = ['4x4', '5x5', '6x6', '7x7', '8x8', '9x9', '10x10'];

const startGame = () => {
  const welcome = readlineSync.keyInYNStrict('Welcome to Battleship! Would you like to play?');
  
  if (welcome) {
    console.clear()
    const choose = readlineSync.keyInSelect(boardSizes, 'Choose a Board Size');
    return boardSizes[choose];
  } else {
    console.log('Thanks for visiting! Goodbye!');
    process.exit(); 
  }
};


const playerBoardSelection = (startGame) => {
  const sizeSelection = boardSizes.indexOf(startGame) + 4; // add 4 because selection starts off at 1 and index of boardSizes starts at 0...
  const playersBoard = placeShipRandomly(buildBoard(sizeSelection));
  console.log(`Your selected Board... Don't sink!!!`);
  console.table(printBoard(playersBoard, true))
  return playersBoard;
};

const computerBoard = (selectedBoardSize) => {
  const size = selectedBoardSize.length
  console.table(printBoard(placeShipRandomly(buildBoard(size))))
  return placeShipRandomly(buildBoard(size));
}; // function to ensure CPU board is same size as players...


const attackCoordinates = (enemyBoard) => {
  console.log(`Please give coordinates to launch missile strike.`);
  const firstOptionSelect = [];
  let secondOptionSelect = [];
  Object.entries(printBoard(enemyBoard)).forEach((keyValPair, i) => {
     firstOptionSelect.push(keyValPair[0]) // first index is letter...
     secondOptionSelect.push(i)
  });
  const firstSelected = readlineSync.keyInSelect(firstOptionSelect, `Select a letter:`);
  const secondSelected = readlineSync.keyInSelect(secondOptionSelect, `Select a Number:`);
  return [firstSelected, secondSelected];
}
//
const attackedBoard = (attackCoordinates, board) => {
  const [attackRow, attackCol] = attackCoordinates; // the given coordinates are made into variable to use for board row and column...

  if (board[attackRow]) {
    const targetCell = board[attackRow][attackCol];
    
    if (targetCell) {
      if (targetCell.type === 'small' || targetCell.type === 'large') {
        targetCell.hit = true; // Mark the ship as hit
        return true; 
      } else {
        targetCell.hit = true; // Mark this cell as missed with '❗'
        return false; // return false because it missed a ship, but still marks as attempted strike...
      }
    } 
  }
  return false;
};

const playerUsedCoords = new Set();
const randomCoordsUsed = new Set();

const randomCoordinates = (board) => {
  let usedCoords;
  do {
    usedCoords = [Math.floor(Math.random() * board.length), Math.floor(Math.random() * board.length)]
  } while (randomCoordsUsed.has(`${usedCoords[0]},${usedCoords[1]}`)); //only let CPU use coordinates that have not been used...
  return usedCoords;
}; // function will loop until it chooses a coordinate that is already has picked...

const playerTurn = (targetBoard) => {
  let attackCoords;
  do {
    attackCoords = attackCoordinates(targetBoard);
    console.log(`These coordinates ${attackCoords} have already been attacked...`);
    console.table(printBoard(targetBoard)); // to show player where is available on board to attack...
  } while (playerUsedCoords.has(`${attackCoords[0]},${attackCoords[1]}`)); // Ensure it's a new coordinate
  return attackCoords;
}; // function makes player input coordinates that have not been used...


const launchAttack = (attackCoords, targetBoard, isPlayerAttack) => {
  const hit = attackedBoard(attackCoords, targetBoard); // (true) if ship is placed at coordinates
  const usedCoords = `${attackCoords[0]},${attackCoords[1]}`;
  // Check if the coordinates have already been used
  if (isPlayerAttack) {
    if (playerUsedCoords.has(usedCoords)) {
      attackCoords = playerTurn(targetBoard);
      return launchAttack(attackCoords, targetBoard, true); // return so that player has no choice but to put valid unused coordinates.
    }
    playerUsedCoords.add(usedCoords);
  } else {
    if (randomCoordsUsed.has(usedCoords)) {
      attackCoords = randomCoordinates(targetBoard);
      return launchAttack(attackCoords, targetBoard, false);
    }
    randomCoordsUsed.add(usedCoords);
  }
  
  if (hit) {
    if (isPlayerAttack) {
      console.clear()
      console.log(`That's a hit on the enemy! Fire again!!!`);
      console.table(printBoard(targetBoard)); 
    }  else {
      console.log(`Your ship has been hit!`);
      console.table(printBoard(targetBoard, true));
    } 
  } else {
    if (isPlayerAttack) {
      console.clear()
      console.log(`You missed! Prepare for Incoming attack!!!`);
      console.table(printBoard(targetBoard));
    } else {
      console.log(`The enemy missed. Ready Missiles!`);
      console.table(printBoard(targetBoard, true));
    }
  } 
  return hit;
};


module.exports = {
  playerBoardSelection,
  computerBoard,
  attackCoordinates,
  attackedBoard,
  randomCoordinates,
  playerTurn,
  launchAttack,
  startGame,
};
