/* eslint-disable no-lonely-if */
import createShipObject from './shipFactory.js';

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
          if (!grid[xCoord][yCoord + i] && xCoord <= 9 && yCoord + i <= 9) {
            selectedCoords.push(`${xCoord}${yCoord + i}`);
          } else {
            return null;
          }
        } else if (
          !grid[xCoord + i][yCoord] &&
          xCoord + i <= 9 &&
          yCoord <= 9
        ) {
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
            if (row === 0 && column === 0) {
              grid[row + 1][column] = 'disabled';
            } else if (row === 9 && column === 0) {
              grid[row - 1][column] = 'disabled';
            } else if (column === 0) {
              grid[row - 1][column] = 'disabled';
              grid[row + 1][column] = 'disabled';
            } else if (row === 0) {
              grid[row + 1][column] = 'disabled';
              grid[row][column - 1] = 'disabled';
              grid[row + 1][column - 1] = 'disabled';
            } else if (row === 9) {
              grid[row - 1][column] = 'disabled';
              grid[row][column - 1] = 'disabled';
              grid[row - 1][column - 1] = 'disabled';
            } else {
              grid[row - 1][column] = 'disabled';
              grid[row + 1][column] = 'disabled';
              grid[row][column - 1] = 'disabled';
              grid[row - 1][column - 1] = 'disabled';
              grid[row + 1][column - 1] = 'disabled';
            }
          } else if (index === selectedCoords.length - 1) {
            if (row === 0 && column === 9) {
              grid[row + 1][column] = 'disabled';
            } else if (row === 9 && column === 9) {
              grid[row - 1][column] = 'disabled';
            } else if (column === 9) {
              grid[row - 1][column] = 'disabled';
              grid[row + 1][column] = 'disabled';
            } else if (row === 0) {
              grid[row + 1][column] = 'disabled';
              grid[row][column + 1] = 'disabled';
              grid[row + 1][column + 1] = 'disabled';
            } else if (row === 9) {
              grid[row - 1][column] = 'disabled';
              grid[row][column + 1] = 'disabled';
              grid[row - 1][column + 1] = 'disabled';
            } else {
              grid[row - 1][column] = 'disabled';
              grid[row + 1][column] = 'disabled';
              grid[row][column + 1] = 'disabled';
              grid[row - 1][column + 1] = 'disabled';
              grid[row + 1][column + 1] = 'disabled';
            }
          } else if (row === 0) {
            grid[row + 1][column] = 'disabled';
          } else if (row === 9) {
            grid[row - 1][column] = 'disabled';
          } else {
            grid[row - 1][column] = 'disabled';
            grid[row + 1][column] = 'disabled';
          }
        } else {
          // Vertical disable
          if (index === 0) {
            if (row === 0 && column === 0) {
              grid[row][column + 1] = 'disabled';
            } else if (row === 0 && column === 9) {
              grid[row][column - 1] = 'disabled';
            } else if (row === 0) {
              grid[row][column - 1] = 'disabled';
              grid[row][column + 1] = 'disabled';
            } else if (column === 0) {
              grid[row - 1][column] = 'disabled';
              grid[row][column + 1] = 'disabled';
              grid[row - 1][column + 1] = 'disabled';
            } else if (column === 9) {
              grid[row][column - 1] = 'disabled';
              grid[row - 1][column] = 'disabled';
              grid[row - 1][column - 1] = 'disabled';
            } else {
              grid[row][column - 1] = 'disabled';
              grid[row][column + 1] = 'disabled';
              grid[row - 1][column] = 'disabled';
              grid[row - 1][column + 1] = 'disabled';
              grid[row - 1][column - 1] = 'disabled';
            }
          } else if (index === selectedCoords.length - 1) {
            if (row === 9 && column === 9) {
              grid[row][column - 1] = 'disabled';
            } else if (row === 9) {
              grid[row][column - 1] = 'disabled';
              grid[row][column + 1] = 'disabled';
            } else if (column === 9) {
              grid[row + 1][column] = 'disabled';
              grid[row][column - 1] = 'disabled';
              grid[row + 1][column - 1] = 'disabled';
            } else if (row === 0) {
              grid[row + 1][column] = 'disabled';
              grid[row][column + 1] = 'disabled';
              grid[row + 1][column + 1] = 'disabled';
            } else if (column === 0) {
              grid[row][column + 1] = 'disabled';
              grid[row + 1][column] = 'disabled';
              grid[row + 1][column + 1] = 'disabled';
            } else {
              grid[row][column - 1] = 'disabled';
              grid[row][column + 1] = 'disabled';
              grid[row + 1][column] = 'disabled';
              grid[row + 1][column - 1] = 'disabled';
              grid[row + 1][column + 1] = 'disabled';
            }
          } else if (column === 0) {
            grid[row][column + 1] = 'disabled';
            grid[row + 1][column + 1] = 'disabled';
            grid[row + 1][column] = 'disabled';
          } else if (column === 9) {
            grid[row][column - 1] = 'disabled';
          } else {
            grid[row][column - 1] = 'disabled';
            grid[row][column + 1] = 'disabled';
          }
        }
      });
      return selectedCoords;
    },

    receiveAttack(xCoord, yCoord) {
      if (grid[xCoord][yCoord] && grid[xCoord][yCoord] !== 'disabled') {
        const hitShipName = grid[xCoord][yCoord];
        for (const ship in this.fleet) {
          if (ship === hitShipName) {
            this.fleet[ship].hit();
            // this.anyShipRemains();
            break;
          }
        }
        return { message: 'hit', ship: hitShipName };
      }
      grid[xCoord][yCoord] = 'missed';
      return { message: 'missed' };
    },

    anyShipRemains() {
      for (const ship in this.fleet) {
        if (!this.fleet[ship].isSunk()) {
          return true;
        }
      }
      return false;
    },
  };
  return board;
};

export default createGameboard;
