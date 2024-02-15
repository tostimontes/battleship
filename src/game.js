import createPlayer from './playerFactory.js';

function gameLogic() {
  let turn = 1;
  let player1;
  let player2;
  const game = {
    turn,
    player1,
    player2,
    init(playerOne, playerTwo) {
      player1 = playerOne;
      player2 = playerTwo;
    },
    handleAttack(player, xCoord, yCoord) {
      if (player === 1) {
        return player2.board.receiveAttack(xCoord, yCoord);
      }
      return player1.board.receiveAttack(xCoord, yCoord);
    },
    nextTurn() {
      if (turn === 1) {
        turn = 2;
      } else {
        turn = 1;
      }
    },

    // TODO: method that after a hit checks if ship is sunk to return sunk and update the UI

    checkWin(player) {
      if (player === 1) {
        if (!player2.board.anyShipRemains()) {
          return true;
        }
      } else if (!player1.board.anyShipRemains()) {
        return true;
      }
      return false;
    },
  };
  return game;
}

export default gameLogic;
