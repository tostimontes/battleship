function setController(logic, userInterface) {
  const controller = {
    game: logic,
    view: userInterface,

    placeFleetRandomly(player) {
      document
        .getElementById(`player${player}fleet`)
        .querySelectorAll('.ship')
        .forEach((ship) => {
          let placed = false;
          let placementCoordinates;
          while (!placed) {
            const xCoord = Math.floor(Math.random() * 10);
            const yCoord = Math.floor(Math.random() * 10);
            let orientation;
            if (Math.floor(Math.random() * 2) === 0) {
              orientation = 'horizontal';
              if (ship.classList.contains('vertical')) {
                ship.classList.toggle('vertical');
                ship.classList.toggle('horizontal');
              }
            } else {
              orientation = 'vertical';
              if (ship.classList.contains('horizontal')) {
                ship.classList.toggle('vertical');
                ship.classList.toggle('horizontal');
              }
            }
            placementCoordinates = this.game.checkCoordinatesForPlacement(
              ship.id,
              xCoord,
              yCoord,
              orientation
            );
            if (placementCoordinates) {
              placed = true;
              ship.classList.add('placed');
            }
          }
          this.view.updateTilesWithShip(ship.id, placementCoordinates);
        });
    },
    promptShipPlacement(playerMode) {
      this.view.updateMessages([
        'Player 1, place your fleet. Drag and drop the ships. Press R while dragging to rotate. Press SPACE to place fleet randomly',
        'Wait for player 1 to place fleet',
      ]);
      function createKeyDownHandler(player, controller) {
        return function (event) {
          if (event.code === 'Space') {
            controller.placeFleetRandomly(player);
          }
        };
      }
      const player1Handler = createKeyDownHandler(1, this);
      document.addEventListener('keydown', player1Handler);

      this.view.makeShipsDraggable(1, controller).then(() => {
        if (playerMode === 'single') {
          this.placeFleetRandomly(2);
          this.view.updateMessages([
            `Player 1, it's your turn`,
            `It's player 1's turn`,
          ]);
          document.removeEventListener('keydown', player1Handler);
          this.view.displayNextTurn(1);
        } else {
          this.view.updateMessages([
            'Wait for player 2 to place fleet',
            'Player 2, place your fleet.  Drag and drop the ships. Press R while dragging to rotate. Press SPACE to place fleet randomly',
          ]);
          document.removeEventListener('keydown', player1Handler);
          const player2Handler = createKeyDownHandler(2, this);
          document.addEventListener('keydown', player2Handler);

          this.view.makeShipsDraggable(2, controller).then(() => {
            this.view.updateMessages([
              `Player 1, it's your turn`,
              `It's player 1's turn`,
            ]);
            this.view.displayNextTurn(1);
          });
        }
      });
    },
    changeTurn() {},
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
        this.view.displayNextTurn(this.game.nextTurn());
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
