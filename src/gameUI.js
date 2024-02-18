import './style.css';
import makeDraggable from './dragAndDrop.js';
// TODO: add rejects and error handling to Promises

function mapTileToCoordinates(tile) {
  const letterToNumber = {
    a: 0,
    b: 1,
    c: 2,
    d: 3,
    e: 4,
    f: 5,
    g: 6,
    h: 7,
    i: 8,
    j: 9,
  };
  const tileCoord = tile.classList[1];
  const x = parseInt(tileCoord.slice(1)) - 1;
  const y = letterToNumber[tileCoord.slice(0, 1)];
  return [x, y];
}

function mapCoordinatesToTile(row, column) {
  const numberToLetter = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
  return `${numberToLetter[column]}${row + 1}`;
}

function setGameUI() {
  const player1Div = document.querySelector('#player1div');
  const player2Div = document.querySelector('#player2div');
  const player1grid = document.querySelector('#player1grid');
  const player2grid = document.querySelector('#player2grid');
  const player1Tiles = Array.from(
    document.querySelector('#player1grid').querySelectorAll('.tile')
  );
  const player2Tiles = Array.from(
    document.querySelector('#player2grid').querySelectorAll('.tile')
  );
  const playerModeDialog = document.querySelector('#player-mode-dialog');
  const player1Selection = document.querySelector('#player1-name-dialog');
  const player2Selection = document.querySelector('#player2-name-dialog');
  const player1Fleet = document
    .querySelector('#player1fleet')
    .querySelectorAll('.ship');
  const player2Fleet = document
    .querySelector('#player2fleet')
    .querySelectorAll('.ship');
  const player1Message = player1Div.querySelector('.message-box');
  const player2Message = player2Div.querySelector('.message-box');
  const gameOverDialog = document.querySelector('#game-over-dialog');
  const winMessage = gameOverDialog.querySelector('p');
  const playAgainButton = gameOverDialog.querySelector('button');
  const ships = document.querySelectorAll('.ship');

  const gameUI = {
    updateBoard(player, xCoord, yCoord, result) {
      if (player === 1) {
        const target = player2grid.querySelector(
          `.${mapCoordinatesToTile(xCoord, yCoord)}`
        );
        if (result.message === 'hit') {
          target.classList.add('hit');
        } else {
          target.classList.add('missed');
        }
      } else {
        const target = player1grid.querySelector(
          `.${mapCoordinatesToTile(xCoord, yCoord)}`
        );
        if (result.message === 'hit') {
          target.classList.add('hit');
        } else {
          target.classList.add('missed');
        }
      }
    },
    updateMessages(message) {
      player1Message.textContent = message[0];
      player2Message.textContent = message[1];
    },

    displayModeSelection() {
      return new Promise((resolve) => {
        document.addEventListener('DOMContentLoaded', () => {
          let playerMode;
          playerModeDialog.showModal();
          playerModeDialog
            .querySelector('button')
            .addEventListener('click', () => {
              if (
                playerModeDialog.querySelector('input[value="single"]').checked
              ) {
                playerMode = 'single';
                player2Div.querySelector('h2').textContent = 'AI';
              } else {
                playerMode = 'two';
              }
              playerModeDialog.close();
              resolve(playerMode);
            });
        });
      });
    },

    displayPlayer1Selection() {
      return new Promise((resolve) => {
        player1Selection.showModal();
        player1Selection
          .querySelector('button')
          .addEventListener('click', () => {
            if (player1Selection.querySelector('input').value !== '') {
              const player1Name = player1Selection.querySelector('input').value;
              player1Div.querySelector('h2').textContent = player1Name;
              player1Selection.close();
              resolve(player1Name);
            }
          });
      });
    },

    displayPlayer2Selection() {
      return new Promise((resolve) => {
        player2Selection.showModal();
        player2Selection
          .querySelector('button')
          .addEventListener('click', () => {
            if (player2Selection.querySelector('input').value !== '') {
              const player2Name = player2Selection.querySelector('input').value;
              player2Div.querySelector('h2').textContent = player2Name;
              player2Selection.close();
              resolve(player2Name);
            }
          });
      });
    },

    setUpEventListeners(controller) {
      // Tile listeners
      // TODO: disable already clicked tiles from being clicked again
      player2Tiles.forEach((tile) => {
        const gridCoords = mapTileToCoordinates(tile);
        tile.addEventListener('click', () => {
          controller.handlePlayerAttack(1, gridCoords[0], gridCoords[1]);
        });
      });
      player1Tiles.forEach((tile) => {
        const gridCoords = mapTileToCoordinates(tile);
        tile.addEventListener('click', () => {
          controller.handlePlayerAttack(2, gridCoords[0], gridCoords[1]);
        });
      });
    },

    makeShipsDraggable(player, controller) {
      if (player === 1) {
        player1Fleet.forEach((ship) => {
          makeDraggable(ship, controller);
        });
        return new Promise((resolve) => {
          const fleet = player === 1 ? player1Fleet : player2Fleet;
          const placedShips = new Set();

          function checkAllShipsPlaced() {
            if (placedShips.size === fleet.length) {
              player1Fleet.forEach((ship) => {
                ship.style.zIndex = -1;
              });
              player1grid.classList.toggle('alternate-color');
              resolve();
            }
          }

          fleet.forEach((ship) => {
            const observer = new MutationObserver((mutations) => {
              mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                  const { target } = mutation;
                  if (
                    target.classList.contains('placed') &&
                    !placedShips.has(target)
                  ) {
                    placedShips.add(target);
                    checkAllShipsPlaced();
                  }
                }
              });
            });

            observer.observe(ship, { attributes: true });
          });
        });
      }
      player2Fleet.forEach((ship) => {
        makeDraggable(ship, controller);
      });
      return new Promise((resolve) => {
        const fleet = player === 1 ? player1Fleet : player2Fleet;
        const placedShips = new Set();

        function checkAllShipsPlaced() {
          if (placedShips.size === fleet.length) {
            resolve();
          }
        }

        fleet.forEach((ship) => {
          const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              if (mutation.attributeName === 'class') {
                const { target } = mutation;
                if (
                  target.classList.contains('placed') &&
                  !placedShips.has(target)
                ) {
                  placedShips.add(target);
                  checkAllShipsPlaced();
                }
              }
            });
          });

          observer.observe(ship, { attributes: true });
        });
      });
    },

    updateTilesWithShip(shipName, coordinates) {
      const tiles = coordinates.map((coordinate) => {
        const row = parseInt(coordinate[0]);
        const column = parseInt(coordinate[1]);
        return mapCoordinatesToTile(row, column);
      });
      const player = parseInt(shipName.slice(shipName.length - 1));
      let firstTile;
      let lastTile;
      let shipImage;
      if (player === 1) {
        firstTile = player1grid.querySelector(`.${tiles[0]}`);
        lastTile = player1grid.querySelector(`.${tiles[tiles.length - 1]}`);
        shipImage = document.querySelector(`#${shipName}`);
      } else {
        firstTile = player2grid.querySelector(`.${tiles[0]}`);
        lastTile = player2grid.querySelector(`.${tiles[tiles.length - 1]}`);
        shipImage = document.querySelector(`#${shipName}`);
      }
      const { top } = firstTile.getBoundingClientRect();
      const { left } = firstTile.getBoundingClientRect();
      const { bottom } = lastTile.getBoundingClientRect();
      const { right } = lastTile.getBoundingClientRect();
      if (shipImage.classList[2] === 'vertical') {
        shipImage.style.position = 'fixed';
        shipImage.style.zIndex = 3;
        shipImage.style.top = `${top}px`;
        shipImage.style.left = `${left}px`;
        shipImage.style.width = `${right - left}px`;
        shipImage.style.height = `${bottom - top}px`;
        shipImage.style.backgroundSize = 'cover';
      } else {
        shipImage.style.position = 'fixed';
        shipImage.style.zIndex = 3;
        shipImage.style.top = `${top}px`;
        shipImage.style.left = `${lastTile.getBoundingClientRect().right}px`;
        shipImage.style.width = `${bottom - top}px`;
        shipImage.style.height = `${right - left}px`;
        shipImage.style.backgroundSize = 'cover';
        shipImage.style.transformOrigin = 'top left';
      }
    },

    displayNextTurn(turn) {
      if (turn === 1) {
        player2Fleet.forEach((ship) => {
          ship.style.zIndex = -1;
        });
        player1Fleet.forEach((ship) => {
          ship.style.zIndex = 3;
        });
      } else {
        player1Fleet.forEach((ship) => {
          ship.style.zIndex = -1;
        });
        player2Fleet.forEach((ship) => {
          ship.style.zIndex = 3;
        });
      }
      player1grid.classList.toggle('alternate-color');
      player2grid.classList.toggle('alternate-color');
    },

    showWinMessage(player, controller) {
      gameOverDialog.showModal();
      if (player === 1) {
        winMessage.textContent = 'Player 1 won!';
      } else {
        winMessage.textContent = 'Player 2 won!';
      }
      playAgainButton.addEventListener('click', () => {
        controller.resetGame();
      });
    },
  };
  return gameUI;
}

export { setGameUI, mapCoordinatesToTile, mapTileToCoordinates };
