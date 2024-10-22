const { 
  playerBoardSelection, 
  computerBoard,
  attackCoordinates,
  attackedBoard,
  randomCoordinates,
  playerTurn,
  launchAttack,
  startGame,
} = require('./playerAndCPUInput');


const isVictory = (playerBoard, enemyBoard) => {
  const allEnemyShipsSunk = enemyBoard.flat().every(cell =>
    (cell.type !== 'small' && cell.type !== 'large') || cell.hit
  ); // making type not equal a ship type means that its open water, so does not need to be hit
   // cell.hit (true) checks for hit ships since other condition is open water...
  const allPlayerShipsSunk = playerBoard.flat().every(cell =>
    (cell.type !== 'small' && cell.type !== 'large') || cell.hit
  );

  if (allEnemyShipsSunk) {
    console.log(`All enemy ships destroyed! Victory!
      ========
      __   _______ _   _   _    _ _____ _   _  
      \\ \\ / /  _  | | | | | |  | |_   _| \\ | | 
       \\ V /| | | | | | | | |  | | | | |  \\| | 
        \\ / | | | | | | | | |\\/| | | | | . ' | 
        | | \\ \\_/ / |_| | \\  /\\  /_| |_| |\\  | 
        \\_/  \\___/ \\___/   \\/  \\/ \\___/\\_| \\_/ 
      ========
      `);
    return true;
  }
  
  if (allPlayerShipsSunk) {
    console.log(`ALL YOUR SHIPS SUNK!!!`);
    return true;
  }
  return false;
};

const attacksTillVictory = (playerBoard, enemyBoard) => {
  let gameOver = false;
  let skipPlayerTurn = false;
  let skipComputerTurn = false;
  // loop until all ships are sunk
  while (!gameOver) {
    if (!skipPlayerTurn) {
      const playerAttackCoords = playerTurn(enemyBoard);
      if (!playerAttackCoords) continue; // won't let user input invalid coordinates
      const enemyHit = launchAttack(playerAttackCoords, enemyBoard, true);
      skipComputerTurn = enemyHit; //enemyHit returns boolean which controls this statement
    } else {
      skipPlayerTurn = false;
    }
    if (!skipComputerTurn) {
      let enemyAttackCoords = randomCoordinates(playerBoard);
      const playerHit = launchAttack(enemyAttackCoords, playerBoard, false);
      skipPlayerTurn = playerHit;
    } else {
      skipComputerTurn = false; 
    }
    gameOver = isVictory(playerBoard, enemyBoard);
  }
};


const playerSelectedValue = startGame();
const playerSelectedBoard = playerBoardSelection(playerSelectedValue);
const computerBoardSelection = computerBoard(playerSelectedBoard);
console.log(`Enemy Board! ATTACK!!!`);
attacksTillVictory(playerSelectedBoard, computerBoardSelection);