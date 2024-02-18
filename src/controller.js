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
      function determineDirection(currentCoords, previousCoords) {
        // Logic to determine the direction based on current and previous coordinates
        if (currentCoords.x === previousCoords.x) {
          return currentCoords.y > previousCoords.y ? 'right' : 'left';
        }
        return currentCoords.x > previousCoords.x ? 'down' : 'up';
      }
      function updateDisabledTiles(x, y, player) {
        // Array of relative positions for diagonal tiles
        const diagonalOffsets = [
          { dx: -1, dy: -1 },
          { dx: -1, dy: 1 },
          { dx: 1, dy: -1 },
          { dx: 1, dy: 1 },
        ];

        diagonalOffsets.forEach((offset) => {
          const newX = x + offset.dx;
          const newY = y + offset.dy;

          // Check if the diagonal tile is within bounds
          if (newX >= 0 && newX < 10 && newY >= 0 && newY < 10) {
            const diagonalCoord = { x: newX, y: newY };
            if (
              !player.disabledTiles.some(
                (coord) =>
                  coord.x === diagonalCoord.x && coord.y === diagonalCoord.y
              )
            ) {
              player.disabledTiles.push(diagonalCoord);
            }
          }
        });
      }

      function shouldContinueInCurrentDirectionOrOrientation(aiPlayer) {
        let {
          coordinates: { x, y },
          direction,
          streak,
        } = aiPlayer.lastShot;

        // If there's no direction set but there's a streak, we should still check other directions
        if (aiPlayer.random || (streak > 1 && !direction)) {
          return false;
        }

        if (streak === 1) {
          x = aiPlayer.lastShot.previousCoordinates.x;
          y = aiPlayer.lastShot.previousCoordinates.y;
          // If streak is 1, check if adjacent tiles in all directions are valid targets
          const adjacentTiles = [
            { x, y: y - 1 }, // Above
            { x, y: y + 1 }, // Below
            { x: x - 1, y }, // Left
            { x: x + 1, y }, // Right
          ];

          return adjacentTiles.some((tile) => isValidTarget(tile, aiPlayer));
        }
        // For streaks greater than 1, check the next tile in both directions
        const nextTileInDirection = getNextTileInDirection(
          x,
          y,
          direction,
          streak
        );
        const nextTileInOppositeDirection = getNextTileInDirection(
          x,
          y,
          direction,
          -streak
        );

        return (
          isValidTarget(nextTileInDirection, aiPlayer) ||
          isValidTarget(nextTileInOppositeDirection, aiPlayer)
        );
      }

      function changeDirectionForNextShot(aiPlayer) {
        const { direction, coordinates, streak } = aiPlayer.lastShot;

        if (!direction && streak === 1) {
          // If first hit followed by a miss, check right, up, down in sequence
          if (!aiPlayer.checkedRight) {
            aiPlayer.lastShot.direction = 'right';
            aiPlayer.checkedRight = true;
          } else if (!aiPlayer.checkedUp) {
            aiPlayer.lastShot.direction = 'up';
            aiPlayer.checkedUp = true;
          } else if (!aiPlayer.checkedDown) {
            aiPlayer.lastShot.direction = 'down';
            aiPlayer.checkedDown = true;
          }
        } else if (
          direction === 'horizontal' ||
          direction === 'left' ||
          direction === 'right'
        ) {
          aiPlayer.lastShot.direction = 'vertical';
        } else if (
          direction === 'vertical' ||
          direction === 'up' ||
          direction === 'down'
        ) {
          aiPlayer.lastShot.direction = 'horizontal';
        }

        // Reset to original hit coordinate and streak
        aiPlayer.lastShot.coordinates = { x: coordinates.x, y: coordinates.y };
        // TODO: watch streak resets
        aiPlayer.lastShot.streak = 1;
      }

      function isValidTarget(tile, aiPlayer) {
        return (
          tile.x >= 0 &&
          tile.x < 10 &&
          tile.y >= 0 &&
          tile.y < 10 &&
          !aiPlayer.disabledTiles.some(
            (disabledTile) =>
              disabledTile.x === tile.x && disabledTile.y === tile.y
          ) &&
          !aiPlayer.shotTiles.some(
            (shotTile) => shotTile.x === tile.x && shotTile.y === tile.y
          )
        );
      }

      function getNextTileInDirection(x, y, direction, increment) {
        switch (direction) {
          case 'right':
            return { x, y: y + increment };
          case 'left':
            return { x, y: y - increment };
          case 'down':
            return { x: x + increment, y };
          case 'up':
            return { x: x - increment, y };
          default:
            // If direction is not explicitly set, assume horizontal and vertical based on existing logic
            return direction === 'horizontal'
              ? { x, y: y + increment }
              : { x: x + increment, y };
        }
      }

      function updateUnsunkShips(aiPlayer, sunkShipLength) {
        aiPlayer.unsunkShips = aiPlayer.unsunkShips.filter(
          (length) => length !== sunkShipLength
        );
      }

      function resetDirectionChecks(aiPlayer) {
        aiPlayer.checkedRight = false;
        aiPlayer.checkedUp = false;
        aiPlayer.checkedDown = false;
      }

      function checkIfShipIsSunk(aiPlayer) {
        const { direction, coordinates, streak } = aiPlayer.lastShot;

        if (streak > 1) {
          // Calculate the positions of the tip and tail of the streak
          const tip = getNextTileInDirection(
            coordinates.x,
            coordinates.y,
            direction,
            -streak
          );
          const tail = getNextTileInDirection(
            coordinates.x,
            coordinates.y,
            direction,
            streak
          );

          // Check if both tip and tail are surrounded by disabled or shot tiles
          const tipCheck = isTileDisabledOrShot(tip, aiPlayer);
          const tailCheck = isTileDisabledOrShot(tail, aiPlayer);

          if (tipCheck && tailCheck) {
            // Update unsunkShips and reset AI to random mode
            updateUnsunkShips(aiPlayer, streak);
            aiPlayer.random = true;
          }
        }
      }

      function isTileDisabledOrShot(tile, aiPlayer) {
        return (
          aiPlayer.disabledTiles.some(
            (disabledTile) =>
              disabledTile.x === tile.x && disabledTile.y === tile.y
          ) ||
          aiPlayer.shotTiles.some(
            (shotTile) => shotTile.x === tile.x && shotTile.y === tile.y
          )
        );
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
      // if single, each player 1 attack should end with a setTimeout that triggers AI attack ---SET THIS BELOW AT THE END OF ATTACK 1 ---
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

          // Update AI's last shot memory
          const aiPlayer = this.game.player2;
          aiPlayer.lastShot.coordinates = {
            x: attackCoordinates.x,
            y: attackCoordinates.y,
          };
          aiPlayer.lastShot.hit = result.message === 'hit';

          if (result.message === 'hit') {
            aiPlayer.random = false;
            updateDisabledTiles(
              attackCoordinates.x,
              attackCoordinates.y,
              aiPlayer
            );
            aiPlayer.lastShot.streak += 1;
            // Check if streak already equal to longest ship
            if (
              aiPlayer.lastShot.streak === Math.max(...aiPlayer.unsunkShips)
            ) {
              // Additional logic if needed, such as switching back to random mode
              aiPlayer.lastShot.streak = 0;
              aiPlayer.lastShot.direction = null;
              checkIfShipIsSunk(aiPlayer);
              resetDirectionChecks(aiPlayer);
            }
            // Determine the direction based on previous shot if streak is greater than 1
            if (aiPlayer.lastShot.streak > 1) {
              aiPlayer.lastShot.direction = determineDirection(
                aiPlayer.lastShot.coordinates,
                aiPlayer.lastShot.previousCoordinates
              );
            }
          } else {
            aiPlayer.disabledTiles.push({
              x: attackCoordinates.x,
              y: attackCoordinates.y,
            });
            if (!shouldContinueInCurrentDirectionOrOrientation(aiPlayer)) {
              aiPlayer.lastShot.streak = 0;
              aiPlayer.lastShot.direction = null;
              checkIfShipIsSunk(aiPlayer);
              resetDirectionChecks(aiPlayer);
            } else {
              // Change direction for the next shot
              aiPlayer.lastShot.coordinates =
                aiPlayer.lastShot.previousCoordinates;
              changeDirectionForNextShot(aiPlayer);
            }
          }
          // Update the previous coordinates for the next turn
          aiPlayer.lastShot.previousCoordinates = aiPlayer.lastShot.coordinates;
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
