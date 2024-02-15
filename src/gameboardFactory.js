import createShipObject from './shipFactory.js';
// Gameboards should be able to place ships at specific coordinates by calling the ship factory function.
// Gameboards should have a receiveAttack function that takes a pair of coordinates, determines whether or not the attack hit a ship and then sends the ‘hit’ function to the correct ship, or records the coordinates of the missed shot.
// Gameboards should keep track of missed attacks so they can display them properly.
// Gameboards should be able to report whether or not all of their ships have been sunk.

const createGameboard = () => {
  // 10x10 matrix with rows A-J and columns 1-10 leave letter mapping for UI
  const grid = [...Array(10).keys()].map(() => [...Array(10)]);
  const fleet = {
    carrier: createShipObject(5, 'carrier'),
    battleship: createShipObject(4, 'battleship'),
    cruiser: createShipObject(3, 'cruiser'),
    submarine: createShipObject(3, 'submarine'),
    destroyer: createShipObject(2, 'destroyer'),
  };

  const board = {
    grid,
    fleet,

    placeShip(ship, xCoord, yCoord, orientation) {
      const selectedCoords = [];
      for (let i = 0; i < ship.length; i++) {
        if (orientation === 'horizontal') {
          if (!grid[xCoord][yCoord + i] && xCoord < 9 && yCoord + i < 9) {
            selectedCoords.push(`${xCoord}${yCoord + i}`);
          } else {
            return null;
          }
        } else if (!grid[xCoord][yCoord + i] && xCoord + i < 9 && yCoord < 9) {
          selectedCoords.push(`${xCoord + i}${yCoord}`);
        } else {
          return null;
        }
      }

      selectedCoords.forEach((coords, index) => {
        const row = parseInt(coords[0]);
        const column = parseInt(coords[1]);
        grid[row][column] = ship.name;
        if (orientation === 'horizontal') {
          // Horizontal disable
          if (index === 0) {
            switch ((row, column)) {
              case row === 0 && column === 0:
                grid[row + 1][column] = 'disabled';
                break;

              case row === 9 && column === 0:
                grid[row - 1][column] = 'disabled';
                break;

              case column === 0:
                grid[row - 1][column] = 'disabled';
                grid[row + 1][column] = 'disabled';
                break;

              default:
                grid[row - 1][column] = 'disabled';
                grid[row + 1][column] = 'disabled';
                grid[row][column - 1] = 'disabled';
                grid[row - 1][column - 1] = 'disabled';
                grid[row + 1][column - 1] = 'disabled';
                break;
            }
          } else if (index === selectedCoords.length - 1) {
            switch ((row, column)) {
              case row === 0 && column === 9:
                grid[row + 1][column] = 'disabled';
                break;

              case row === 9 && column === 9:
                grid[row - 1][column] = 'disabled';
                break;

              case column === 9:
                grid[row - 1][column] = 'disabled';
                grid[row + 1][column] = 'disabled';
                break;

              default:
                grid[row - 1][column] = 'disabled';
                grid[row + 1][column] = 'disabled';
                grid[row][column + 1] = 'disabled';
                grid[row - 1][column + 1] = 'disabled';
                grid[row + 1][column + 1] = 'disabled';
                break;
            }
          } else {
            grid[row - 1][column] = 'disabled';
            grid[row + 1][column] = 'disabled';
          }
        } else {
          // Vertical disable
          if (index === 0) {
            switch ((row, column)) {
              case row === 0 && column === 0:
                grid[row][column + 1] = 'disabled';
                break;

              case column === 0:
                grid[row - 1][column] = 'disabled';
                grid[row][column + 1] = 'disabled';
                grid[row - 1][column + 1] = 'disabled';
                break;

              default:
                grid[row][column - 1] = 'disabled';
                grid[row][column + 1] = 'disabled';
                grid[row - 1][column] = 'disabled';
                grid[row - 1][column + 1] = 'disabled';
                grid[row - 1][column - 1] = 'disabled';
                break;
            }
          } else if (index === selectedCoords.length - 1) {
            switch ((row, column)) {
              case row === 9 && column === 9:
                grid[row][column - 1] = 'disabled';
                break;

              case column === 9:
                grid[row + 1][column] = 'disabled';
                grid[row][column - 1] = 'disabled';
                grid[row + 1][column - 1] = 'disabled';
                break;

              default:
                grid[row][column - 1] = 'disabled';
                grid[row][column + 1] = 'disabled';
                grid[row + 1][column] = 'disabled';
                grid[row + 1][column - 1] = 'disabled';
                grid[row + 1][column + 1] = 'disabled';
                break;
            }
          } else {
            grid[row][column - 1] = 'disabled';
            grid[row][column + 1] = 'disabled';
          }
        }
      });
    },

    receiveAttack(xCoord, yCoord) {
      if (grid[xCoord][yCoord] && grid[xCoord][yCoord] !== 'disabled') {
        const hitShipName = grid[xCoord][yCoord];
        for (const ship in this.fleet) {
          if (ship === hitShipName) {
            this.fleet[ship].hit();
            break;
          }
        }
      } else {
        grid[xCoord][yCoord] = 'missed';
      }
    },

    anyShipRemains() {
      // reports if all ships in a board have been sunk
    },
  };
  return board;
};
const player1board = createGameboard();
player1board.placeShip(player1board.fleet.battleship, 0, 7, 'horizontal');
player1board.placeShip(player1board.fleet.carrier, 4, 3, 'horizontal');
player1board.receiveAttack(4, 4);
player1board.receiveAttack(4, 5);
player1board.receiveAttack(4, 7);
player1board.receiveAttack(4, 6);
player1board.fleet.carrier.isSunk();
console.log(player1board.grid);

export default createGameboard;
