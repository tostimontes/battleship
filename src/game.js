function gameLogic() {
  const game = {
    turn: 1,
    player1: null,
    player2: null,
    init(playerOne, playerTwo) {
      this.player1 = playerOne;
      this.player2 = playerTwo;
    },
    checkCoordinatesForPlacement(shipName, xCoord, yCoord, orientation) {
      const player = parseInt(shipName.slice(shipName.length - 1));
      const draggingShip = shipName.slice(0, shipName.length - 1);
      let selectedShip;
      if (player === 1) {
        for (const ship in this.player1.board.fleet) {
          if (ship === draggingShip) {
            selectedShip = this.player1.board.fleet[ship];
            break;
          }
        }
        return this.player1.board.placeShip(
          selectedShip,
          xCoord,
          yCoord,
          orientation
        );
      }
      for (const ship in this.player2.board.fleet) {
        if (ship === draggingShip) {
          selectedShip = this.player2.board.fleet[ship];
          break;
        }
      }
      return this.player2.board.placeShip(selectedShip, xCoord, yCoord, orientation);
    },
    getAICoordinates() {
      const aiAttackCoordinates = this.player2.generateRandomAttack();
      return aiAttackCoordinates;
    },
    handleAttack(player, xCoord, yCoord) {
      if (player === 1) {
        return this.player2.board.receiveAttack(xCoord, yCoord);
      }
      return this.player1.board.receiveAttack(xCoord, yCoord);
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
        if (!this.player2.board.anyShipRemains()) {
          return true;
        }
      } else if (!this.player1.board.anyShipRemains()) {
        return true;
      }
      return false;
    },
  };
  return game;
}

export default gameLogic;
