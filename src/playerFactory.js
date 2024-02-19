import createGameboard from './gameboardFactory.js';

async function createPlayer(name = 'AI', number = 1) {
  const player = {
    name,
    number,
    invalidTiles: [],
    random: true,
    lastShot: { hit: false, coordinates: {}, direction: null },
    currentStreak: {
      origin: null,
      orientation: null,
      tiles: [],
      inverseDirectionChecked: false,
    },
    unsunkShips: [5, 4, 3, 3, 2],
    score: 0,
    board: createGameboard(),
    attack(xCoord, yCoord) {
      if (onAttack) {
        onAttack(number, xCoord, yCoord);
      }
    },

    resetToRandomMode() {
      this.random = true;
      this.lastShot = {
        hit: false,
        coordinates: {},
        direction: null,
      };
      this.currentStreak = {
        origin: null,
        orientation: null,
        tiles: [],
        inverseDirectionChecked: false,
      };
    },

    updateUnsunkShips() {
      const sunkShip = this.unsunkShips.findIndex(
        (shipLength) => shipLength === this.currentStreak.tiles.length
      );
      this.unsunkShips.splice(sunkShip, 1);
    },

    generateRandomAttack() {
      if (!this.random) {
        // Smart mode: calculate next attack based on last hit
        let { x, y } = this.lastShot.coordinates;
        const { direction } = this.lastShot;
        const streak = this.currentStreak.tiles.length;
        let possibleCoordinates = [];

        if (streak === 1) {
          x = this.currentStreak.tiles[0].coordinates.x;
          y = this.currentStreak.tiles[0].coordinates.y;
          possibleCoordinates = [
            { x, y: y - 1, direction: 'left' },
            { x, y: y + 1, direction: 'right' },
            { x: x - 1, y, direction: 'up' },
            { x: x + 1, y, direction: 'down' },
          ];
          let nextCoordinates = possibleCoordinates[0];
          while (this.isInvalidTile(nextCoordinates)) {
            possibleCoordinates.shift();
            nextCoordinates = possibleCoordinates[0];
          }
          this.invalidTiles.push(nextCoordinates);
          return nextCoordinates;
        }
        if (streak > 1 && this.lastShot.hit) {
          if (direction === 'left' || direction === 'right') {
            this.currentStreak.orientation = 'horizontal';
          } else {
            this.currentStreak.orientation = 'vertical';
          }
          let nextCoordinates;
          if (direction === 'left') {
            nextCoordinates = {
              x: this.lastShot.coordinates.x,
              y: this.lastShot.coordinates.y - 1,
              direction,
            };
          } else if (direction === 'up') {
            nextCoordinates = {
              x: this.lastShot.coordinates.x - 1,
              y: this.lastShot.coordinates.y,
              direction,
            };
          } else if (direction === 'right') {
            nextCoordinates = {
              x: this.lastShot.coordinates.x,
              y: this.lastShot.coordinates.y + 1,
              direction,
            };
          } else {
            nextCoordinates = {
              x: this.lastShot.coordinates.x + 1,
              y: this.lastShot.coordinates.y,
              direction,
            };
          }
          if (nextCoordinates && !this.isInvalidTile(nextCoordinates)) {
            this.invalidTiles.push(nextCoordinates);
            return nextCoordinates;
          }
          if (nextCoordinates && this.isInvalidTile(nextCoordinates)) {
            if (direction === 'left') {
              nextCoordinates = {
                x: this.currentStreak.tiles[0].coordinates.x,
                y: this.currentStreak.tiles[0].coordinates.y + 1,
                direction: 'right',
              };
            } else if (direction === 'up') {
              nextCoordinates = {
                x: this.currentStreak.tiles[0].coordinates.x + 1,
                y: this.currentStreak.tiles[0].coordinates.y,
                direction: 'down',
              };
            }
            this.currentStreak.inverseDirectionChecked = true;
          }
          if (!this.isInvalidTile(nextCoordinates)) {
            this.invalidTiles.push(nextCoordinates);
            return nextCoordinates;
          }
          this.updateUnsunkShips();
          this.resetToRandomMode();
          this.generateRandomAttack();
        } else if (streak > 1 && !this.lastShot.hit) {
          let nextCoordinates;
          if (direction === 'left') {
            nextCoordinates = {
              x: this.currentStreak.tiles[0].coordinates.x,
              y: this.currentStreak.tiles[0].coordinates.y + 1,
              direction: 'right',
            };
          } else if (direction === 'up') {
            nextCoordinates = {
              x: this.currentStreak.tiles[0].coordinates.x + 1,
              y: this.currentStreak.tiles[0].coordinates.y,
              direction: 'down',
            };
          } else if (direction === 'right') {
            nextCoordinates = {
              x: this.lastShot.coordinates.x,
              y: this.lastShot.coordinates.y + 1,
              direction,
            };
          } else {
            nextCoordinates = {
              x: this.lastShot.coordinates.x + 1,
              y: this.lastShot.coordinates.y,
              direction,
            };
          }
          this.currentStreak.inverseDirectionChecked = true;
          if (!this.isInvalidTile(nextCoordinates)) {
            this.invalidTiles.push(nextCoordinates);
            return nextCoordinates;
          }
        } else {
          const sunkShip = this.unsunkShips.findIndex(
            (shipLength) => shipLength === this.currentStreak.tiles.length
          );
          this.unsunkShips.splice(sunkShip, 1);
          this.resetToRandomMode();

          this.generateRandomAttack();
        }
      }

      // * Random mode: Generate random coordinates
      let newCoordinates;
      do {
        newCoordinates = {
          x: Math.floor(Math.random() * 10),
          y: Math.floor(Math.random() * 10),
          direction: null,
        };
      } while (this.isInvalidTile(newCoordinates));

      this.invalidTiles.push(newCoordinates);
      return newCoordinates;
    },

    isInvalidTile(coordinates) {
      if (
        coordinates.x < 0 ||
        coordinates.x >= 10 ||
        coordinates.y < 0 ||
        coordinates.y >= 10 ||
        this.invalidTiles.some(
          (tile) => tile.x === coordinates.x && tile.y === coordinates.y
        )
      ) {
        return true;
      }
      return false;
    },
  };

  return player;
}

export default createPlayer;
