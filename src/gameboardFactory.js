import createShipObject from './shipFactory.js';
// Gameboards should be able to place ships at specific coordinates by calling the ship factory function.
// Gameboards should have a receiveAttack function that takes a pair of coordinates, determines whether or not the attack hit a ship and then sends the ‘hit’ function to the correct ship, or records the coordinates of the missed shot.
// Gameboards should keep track of missed attacks so they can display them properly.
// Gameboards should be able to report whether or not all of their ships have been sunk.

const createGameboard = () => {
  // 10x10 matrix with rows A-J and columns 1-10 leave letter mapping for UI
  const grid = [...Array(10).keys()].map(() => [...Array(10)]);
  const carrier = createShipObject(5, 'carrier');
  const battleship = createShipObject(4, 'battleship');
  const cruiser = createShipObject(3, 'cruiser');
  const submarine = createShipObject(3, 'submarine');
  const destroyer = createShipObject(2, 'destroyer');

  const board = {
    grid,
    carrier,
    battleship,
    cruiser,
    submarine,
    destroyer,

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
        const coordPair = [parseInt(coords[0]), parseInt(coords[1])];
        grid[coordPair[0]][coordPair[1]] = ship.name;
        if (orientation === 'horizontal') {
          // Horizontal disable
          if (index === 0) {
            switch (coordPair) {
              case coordPair[0] === 0 && coordPair[1] === 0:
                grid[coordPair[0] + 1][coordPair[1]] = 'disabled';
                break;

              case coordPair[0] === 9 && coordPair[1] === 0:
                grid[coordPair[0] - 1][coordPair[1]] = 'disabled';
                break;

              case coordPair[1] === 0:
                grid[coordPair[0] - 1][coordPair[1]] = 'disabled';
                grid[coordPair[0] + 1][coordPair[1]] = 'disabled';
                break;

              default:
                grid[coordPair[0] - 1][coordPair[1]] = 'disabled';
                grid[coordPair[0] + 1][coordPair[1]] = 'disabled';
                grid[coordPair[0]][coordPair[1] - 1] = 'disabled';
                grid[coordPair[0] - 1][coordPair[1] - 1] = 'disabled';
                grid[coordPair[0] + 1][coordPair[1] - 1] = 'disabled';
                break;
            }
          } else if (index === selectedCoords.length - 1) {
            switch (coordPair) {
              case coordPair[0] === 0 && coordPair[1] === 9:
                grid[coordPair[0] + 1][coordPair[1]] = 'disabled';
                break;

              case coordPair[0] === 9 && coordPair[1] === 9:
                grid[coordPair[0] - 1][coordPair[1]] = 'disabled';
                break;

              case coordPair[1] === 9:
                grid[coordPair[0] - 1][coordPair[1]] = 'disabled';
                grid[coordPair[0] + 1][coordPair[1]] = 'disabled';
                break;

              default:
                grid[coordPair[0] - 1][coordPair[1]] = 'disabled';
                grid[coordPair[0] + 1][coordPair[1]] = 'disabled';
                grid[coordPair[0]][coordPair[1] + 1] = 'disabled';
                grid[coordPair[0] - 1][coordPair[1] + 1] = 'disabled';
                grid[coordPair[0] + 1][coordPair[1] + 1] = 'disabled';
                break;
            }
          } else {
            grid[coordPair[0] - 1][coordPair[1]] = 'disabled';
            grid[coordPair[0] + 1][coordPair[1]] = 'disabled';
          }
        } else {
          // Vertical disable
          if (index === 0) {
            switch (coordPair) {
              case coordPair[0] === 0 && coordPair[1] === 0:
                grid[coordPair[0]][coordPair[1] + 1] = 'disabled';
                break;

              case coordPair[1] === 0:
                grid[coordPair[0] - 1][coordPair[1]] = 'disabled';
                grid[coordPair[0]][coordPair[1] + 1] = 'disabled';
                grid[coordPair[0] - 1][coordPair[1] + 1] = 'disabled';
                break;

              default:
                grid[coordPair[0]][coordPair[1] - 1] = 'disabled';
                grid[coordPair[0]][coordPair[1] + 1] = 'disabled';
                grid[coordPair[0] - 1][coordPair[1]] = 'disabled';
                grid[coordPair[0] - 1][coordPair[1] + 1] = 'disabled';
                grid[coordPair[0] - 1][coordPair[1] - 1] = 'disabled';
                break;
            }
          } else if (index === selectedCoords.length - 1) {
            switch (coordPair) {
              case coordPair[0] === 9 && coordPair[1] === 9:
                grid[coordPair[0]][coordPair[1] - 1] = 'disabled';
                break;

              case coordPair[1] === 9:
                grid[coordPair[0] + 1][coordPair[1]] = 'disabled';
                grid[coordPair[0]][coordPair[1] - 1] = 'disabled';
                grid[coordPair[0] + 1][coordPair[1] - 1] = 'disabled';
                break;

              default:
                grid[coordPair[0]][coordPair[1] - 1] = 'disabled';
                grid[coordPair[0]][coordPair[1] + 1] = 'disabled';
                grid[coordPair[0] + 1][coordPair[1]] = 'disabled';
                grid[coordPair[0] + 1][coordPair[1] - 1] = 'disabled';
                grid[coordPair[0] + 1][coordPair[1] + 1] = 'disabled';
                break;
            }
          } else {
            grid[coordPair[0]][coordPair[1] - 1] = 'disabled';
            grid[coordPair[0]][coordPair[1] + 1] = 'disabled';
          }
        }
      });
    },

    receiveAttack(xCoord, yCoord) {
      // check hit;
      // send hit function to correct ship || record missed shot coords
    },

    anyShipRemains() {
      // reports if all ships in a board have been sunk
    },
  };
  return board;
};
const player1board = createGameboard();
player1board.placeShip(player1board.battleship, 0, 7, 'horizontal');
player1board.placeShip(player1board.carrier, 4, 3, 'horizontal');
console.log(player1board.grid);

export default createGameboard;
