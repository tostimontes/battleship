function setController(logic, userInterface) {
  const controller = {
    game: logic,
    view: userInterface,
    launchTurnOne() {
      // view.promptPlayerToPlay(player)
      this.view.promptPlayerToPlay(1);
    },
    handlePlayerAttack(player, xCoord, yCoord) {
      if (player === this.game.turn) {
        const result = this.game.handleAttack(player, xCoord, yCoord);
        this.view.updateBoard(player, xCoord, yCoord, result);
        this.game.checkWin(player);
        this.view.promptPlayerToPlay(this.game.nextTurn());
      }
    },
  };

  return controller;
}

export default setController;
