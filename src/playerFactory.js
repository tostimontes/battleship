import createGameboard from './gameboardFactory.js';

async function createPlayer(name = 'AI', number = 1) {
  if (name === 'AI') {
    // TODO: shouldn't aim at disabled tiles
    // TODO: if hit registered, create algorithm to play intelligently, it should first aim at either vertical or horizontal
  }

  const player = {
    name,
    number,
    board: createGameboard(),
    attack(xCoord, yCoord) {
      if (onAttack) {
        onAttack(number, xCoord, yCoord);
      }
    },
  };

  return player;
}

export default createPlayer;
