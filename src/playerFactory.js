import createGameboard from './gameboardFactory.js';

async function createPlayer(name = 'AI', number = 1) {
  if (name === 'AI') {
    // TODO: shouldn't aim at disabled tiles
    // TODO: if hit registered, create algorithm to play intelligently, it should first aim at either vertical or horizontal
    // shoot randomly until hit
    // if hit, shoot vertical or horizontal + generate disabled
    // if top or bottom row, prioritize horizontal
    // if left or right column, prioritize vertical
    // if hit same ship, continue line until water
    // if ship of more length still not sunk ==>
    // if water, continue other direction
  }

  const player = {
    name,
    number,
    shotTiles: [],
    disabledTiles: [],
    random: true,
    lastShot: { hit: false, coordinates: {}, direction: null, streak: 0 },
    currentStreak: [], // store current streaks coords
    unsunkShips: [5, 4, 3, 3, 2],
    checkedRight: false,
    checkedUp: false,
    checkedDown: false,
    board: createGameboard(),
    attack(xCoord, yCoord) {
      if (onAttack) {
        onAttack(number, xCoord, yCoord);
      }
    },
    generateRandomAttack() {
      // Check if AI should shoot randomly
      if (!this.random) {
        // Smart mode: calculate next attack based on last hit
        const { x, y } = this.lastShot.coordinates;
        const { direction } = this.lastShot;
        const { streak } = this.lastShot;
        let possibleCoordinates = [];

        // If only one hit so far, try surrounding tiles
        if (streak === 1) {
          possibleCoordinates = [
            { x, y: y - 1 }, // Above
            { x, y: y + 1 }, // Below
            { x: x - 1, y }, // Left
            { x: x + 1, y }, // Right
          ];
        } else {
          // Continue in the same direction or the opposite
          if (
            direction === 'horizontal' ||
            direction === 'right' ||
            direction === 'left'
          ) {
            const horizontalIncrement = direction === 'left' ? -1 : 1;
            possibleCoordinates.push({
              x,
              y: y + horizontalIncrement,
            });
            possibleCoordinates.push({
              x,
              y: y - horizontalIncrement,
            });
          } else if (
            direction === 'vertical' ||
            direction === 'up' ||
            direction === 'down'
          ) {
            const verticalIncrement = direction === 'up' ? -1 : 1;
            possibleCoordinates.push({ x: x + verticalIncrement, y });
            possibleCoordinates.push({ x: x - verticalIncrement, y });
          }
        }

        // Filter out invalid or already tried coordinates
        possibleCoordinates = possibleCoordinates.filter(
          (coord) =>
            coord.x >= 0 &&
            coord.x < 10 &&
            coord.y >= 0 &&
            coord.y < 10 &&
            !this.shotTiles.some(
              (tile) => tile.x === coord.x && tile.y === coord.y
            ) &&
            !this.disabledTiles.some(
              (tile) => tile.x === coord.x && tile.y === coord.y
            )
        );

        // If valid coordinates are found, return the first one
        if (possibleCoordinates.length > 0) {
          this.shotTiles.push(possibleCoordinates[0]);
          return possibleCoordinates[0];
        }
        // Reset to random mode if no valid smart moves
        this.random = true;
      }

      // Random mode: Generate random coordinates
      let xCoord;
      let yCoord;
      do {
        xCoord = Math.floor(Math.random() * 10);
        yCoord = Math.floor(Math.random() * 10);
      } while (
        this.shotTiles.some((tile) => tile.x === xCoord && tile.y === yCoord) ||
        this.disabledTiles.some(
          (tile) => tile.x === xCoord && tile.y === yCoord
        )
      );

      // Record shot
      this.shotTiles.push({ x: xCoord, y: yCoord });
      return { x: xCoord, y: yCoord };
    },
  };

  return player;
}

export default createPlayer;
