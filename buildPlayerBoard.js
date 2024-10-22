const printBoard = (board, debug = false) => {
  const battleArr = Array.from({length: board.length}).fill('-');
  const battleObj = {};
  const alphabet = [...Array(26)].map((_, i) => String.fromCharCode(i + 65));
  alphabet.forEach((char, index) => {
    index < battleArr.length ? battleObj[char] = [...battleArr] : battleObj;
  });  

  let index = 0;
  for (const [key, val] of Object.entries(battleObj)) {
    board[index].forEach((obj, i) => {
      if (obj.hit && obj.type !== 'empty') {
        val[i] = '💥'; // Hit
      } else if (obj.hit && obj.type === 'empty') {
        val[i] = '❗'
      } else if (debug) {
        if (obj.type === 'small') {
          val[i] = '🟠'; // Small ship
        } else if (obj.type === 'large') {
          val[i] = '🔵'; // Large ship
        } 
      } 
    });
    index++;
  }
  return battleObj;
};

const buildBoard = (length) => {
  const board = Array.from({ length: length }, () => 
    Array.from({ length: length }, () => ({
      type: 'empty',
      id: undefined, 
      hit: false
    }))
  );
  return board;
}; // function creates board with objects and their keys and values pre-made...

//picking random orientation for ships
//50% chance when comparing to 0.5.
const getRandomOrientation = () => {
  return Math.random() < 0.5 ? 'horizontal' : 'vertical';
};

 // valid if ship can be placed without over lapping other ship with by return boolean. if conditions are met...
const canPlaceShip = (board, ship, row, column, orientation) => {
  for (let i = 0; i < ship.length; i++) {
    const r = orientation === 'horizontal' ? row : row + i; 
    const c = orientation === 'horizontal' ? column + i : column;
    if (r >= board.length || c >= board.length || board[r][c].type !== 'empty') { // Check if out of bounds
      return false; 
    }
  }
  return true;
};

const placeShipRandomly = (board) => {
  const ships = [
    { length: 3, type: 'large', id: 1 },
    { length: 2, type: 'small', id: 2 },
  ];

  if (board.length > 4) ships.push({ length: 2, type: 'small', id: 3 });
  if (board.length >= 6) ships.push({ length: 3, type: 'large', id: 4 });
  if (board.length >= 10) ships.push({ length: 2, type: 'small', id: 5 }, { length: 2, type: 'small', id: 6 }, { length: 3, type: 'large', id: 7 });
  // adding for more ships if player wants biggest board for giggles...
  ships.forEach(ship => {
    let placed = false;
    while (!placed) {
      const orientation = getRandomOrientation();
      const row = Math.floor(Math.random() * board.length);
      const column = Math.floor(Math.random() * board.length);

      if (canPlaceShip(board, ship, row, column, orientation)) {
        for (let i = 0; i < ship.length; i++) {
          if (orientation === 'horizontal') {
            board[row][column + i].type = ship.type;
            board[row][column + i].id = ship.id;
          } else {
            board[row + i][column].type = ship.type;
            board[row + i][column].id = ship.id;
          } 
        }
        placed = true;
      }
    }
  });
  return board;
};

module.exports = {
  printBoard,
  buildBoard,
  getRandomOrientation,
  canPlaceShip,
  placeShipRandomly
};




