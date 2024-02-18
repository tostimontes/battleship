function setController(logic, userInterface) {
  const controller = {
    game: logic,
    view: userInterface,
    mode: '',

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
      this.mode = playerMode;
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

      return new Promise((resolve) => {
        this.view.makeShipsDraggable(1, controller).then(() => {
          if (playerMode === 'single') {
            this.placeFleetRandomly(2);
            this.view.updateMessages([
              `Player 1, it's your turn`,
              `It's player 1's turn`,
            ]);
            document.removeEventListener('keydown', player1Handler);
            resolve();
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
              resolve();
              this.view.displayNextTurn(1);
            });
          }
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
      // * Helpers
      function updateInvalidTiles(x, y, player) {
        const diagonalOffsets = [
          { dx: -1, dy: -1 },
          { dx: -1, dy: 1 },
          { dx: 1, dy: -1 },
          { dx: 1, dy: 1 },
        ];

        diagonalOffsets.forEach((offset) => {
          const newX = x + offset.dx;
          const newY = y + offset.dy;

          if (newX >= 0 && newX < 10 && newY >= 0 && newY < 10) {
            const diagonalCoord = { x: newX, y: newY };
            if (
              !player.invalidTiles.some(
                (coord) =>
                  coord.x === diagonalCoord.x && coord.y === diagonalCoord.y
              )
            ) {
              player.invalidTiles.push(diagonalCoord);
            }
          }
        });
      }

      function updateUnsunkShips(aiPlayer, sunkShipLength) {
        const sunkShip = aiPlayer.unsunkShips.findIndex(
          (shipLength) => shipLength === sunkShipLength
        );
        aiPlayer.unsunkShips.splice(sunkShip, 1);
      }

      if (player === this.game.turn) {
        const result = this.game.handleAttack(player, xCoord, yCoord);
        this.view.updateBoard(player, xCoord, yCoord, result);
        if (this.game.checkWin(player)) {
          this.view.showWinMessage(player, controller);
          return;
        }
        this.view.displayNextTurn(this.game.nextTurn());
        if (result.message === 'hit') {
          if (player === 1) {
            this.view.updateMessages([
              `It's a hit!`,
              `Player 2, it's your turn`,
            ]);
          } else {
            this.view.updateMessages([
              `Player 1, it's your turn`,
              `It's a hit!`,
            ]);
          }
        } else if (player === 1) {
          this.view.updateMessages([`Water...`, `Player 2, it's your turn`]);
        } else {
          this.view.updateMessages([`Player 1, it's your turn`, `Water...`]);
        }
      }

      if (this.mode === 'single' && this.game.turn === 2) {
        const attackCoordinates = this.game.getAICoordinates();
        const { x: row, y: column } = attackCoordinates;
        setTimeout(() => {
          const result = this.game.handleAttack(2, row, column);
          this.view.updateBoard(2, row, column, result);
          if (this.game.checkWin(2)) {
            this.view.showWinMessage(2, controller);
            return;
          }
          this.view.displayNextTurn(this.game.nextTurn());
          if (result.message === 'hit') {
            this.view.updateMessages([
              `Player 1, it's your turn`,
              `It's a hit!`,
            ]);
          } else {
            this.view.updateMessages([`Player 1, it's your turn`, `Water...`]);
          }

          // ! Update AI's last shot memory
          const aiPlayer = this.game.player2;
          aiPlayer.lastShot.coordinates = {
            x: attackCoordinates.x,
            y: attackCoordinates.y,
          };
          aiPlayer.lastShot.direction = attackCoordinates.direction;
          aiPlayer.lastShot.hit = result.message === 'hit';

          // * HIT
          if (result.message === 'hit') {
            aiPlayer.random = false;
            updateInvalidTiles(
              attackCoordinates.x,
              attackCoordinates.y,
              aiPlayer
            );
            aiPlayer.currentStreak.tiles.push({
              coordinates: aiPlayer.lastShot.coordinates,
            });
            // Check if streak already equal to longest ship
            if (
              aiPlayer.currentStreak.tiles.length ===
              Math.max(...aiPlayer.unsunkShips)
            ) {
              updateUnsunkShips(aiPlayer, aiPlayer.currentStreak.tiles.length);
              aiPlayer.random = true;
              aiPlayer.lastShot = {
                hit: false,
                coordinates: {},
                direction: null,
              };
              aiPlayer.currentStreak = {
                origin: null,
                orientation: null,
                tiles: [],
                inverseDirectionChecked: false,
              };
            }
            // * MISS
          } else {
            if (aiPlayer.currentStreak.inverseDirectionChecked) {
              updateUnsunkShips(aiPlayer, aiPlayer.currentStreak.tiles.length);
              aiPlayer.random = true;
              aiPlayer.lastShot = {
                hit: false,
                coordinates: {},
                direction: null,
              };
              aiPlayer.currentStreak = {
                origin: null,
                orientation: null,
                tiles: [],
                inverseDirectionChecked: false,
              };
            }
            aiPlayer.invalidTiles.push({
              x: attackCoordinates.x,
              y: attackCoordinates.y,
            });
          }
        }, 1500);
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
