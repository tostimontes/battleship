function setController(logic, userInterface) {
  const controller = {
    game: logic,
    view: userInterface,
    promptShipPlacement() {
      this.view.updateMessages([
        'Player 1, place your fleet',
        'Wait for player 1 to place fleet',
      ]);
      this.view.makeShipsDraggable(1, controller).then(() => {
        this.view.updateMessages([
          'Wait for player 2 to place fleet',
          'Player 2, place your fleet',
        ]);
        this.view.makeShipsDraggable(2, controller).then(() => {
          this.view.updateMessages([
            `Player 1, it's your turn`,
            `It's player 1's turn`,
          ]);
        });
      });
    },
    processPlacement(ship, xCoord, yCoord, orientation) {
      const placementCoordinates = this.game.checkCoordinatesForPlacement(
        ship,
        xCoord,
        yCoord,
        orientation
      );
      if (placementCoordinates) {
        this.view.updateTilesWithShip(ship, placementCoordinates);
        return true;
      }
      return null;
    },
    handlePlayerAttack(player, xCoord, yCoord) {
      if (player === this.game.turn) {
        const result = this.game.handleAttack(player, xCoord, yCoord);
        this.view.updateBoard(player, xCoord, yCoord, result);
        if (this.game.checkWin(player)) {
          this.view.showWinMessage(player, controller);
          return;
        }
        this.game.nextTurn();
        this.view.updateMessages(result.message);
      }
    },

    resetGame() {
      // reset all fleet
      // Wipe UI (textContent, not listeners)
    },
  };

  return controller;
}

export default setController;
