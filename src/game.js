function gameLogic() {
  let player1;
  let player2;
  const game = {
    turn: 1,
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
      if (this.turn === 1) {
        this.turn = 2;
        return this.turn;
      }
      this.turn = 1;
      return this.turn;
    },
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
    placeShipsForTesting() {
      player1.board.placeShip(player1.board.fleet.cruiser, 0, 0, 'vertical');
      player1.board.placeShip(player1.board.fleet.carrier, 0, 2, 'vertical');
      player1.board.placeShip(player1.board.fleet.battleship, 0, 4, 'vertical');
      player1.board.placeShip(player1.board.fleet.submarine, 0, 6, 'vertical');
      player1.board.placeShip(player1.board.fleet.destroyer, 9, 5, 'vertical');

      player2.board.placeShip(player2.board.fleet.cruiser, 0, 0, 'vertical');
      player2.board.placeShip(player2.board.fleet.carrier, 0, 2, 'vertical');
      player2.board.placeShip(player2.board.fleet.battleship, 0, 4, 'vertical');
      player2.board.placeShip(player2.board.fleet.submarine, 0, 6, 'vertical');
      player2.board.placeShip(player2.board.fleet.destroyer, 9, 5, 'vertical');
    },
  };
  return game;
}

export default gameLogic;
