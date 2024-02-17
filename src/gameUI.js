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
      // TODO: change result.message. Maybe this method should only take one argument message, which should always be an object with two properties, one for each player
      player1Message.textContent = message[0];
      player2Message.textContent = message[1];
    },

    displayModeSelection() {
      return new Promise((resolve) => {
        document.addEventListener('DOMContentLoaded', () => {
          // Player creation
          // TODO: add form validation
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
            const player1Name = player1Selection.querySelector('input').value;
            player1Div.querySelector('h2').textContent = player1Name;
            player1Selection.close();
            resolve(player1Name);
          });
      });
    },

    displayPlayer2Selection() {
      return new Promise((resolve) => {
        player2Selection.showModal();
        player2Selection
          .querySelector('button')
          .addEventListener('click', () => {
            const player2Name = player2Selection.querySelector('input').value;
            player2Div.querySelector('h2').textContent = player2Name;
            player2Selection.close();
            resolve(player2Name);
          });
      });
    },

    setUpEventListeners(controller) {
      // Tile listeners
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
      // Ships draggable + placement listeners
      // ships.forEach((ship) => {
      //   makeDraggable(ship, controller);
      // });
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

    updateTilesWithShip(ship, coordinates) {
      const tiles = coordinates.map((coordinate) => {
        const row = parseInt(coordinate[0]);
        const column = parseInt(coordinate[1]);
        return mapCoordinatesToTile(row, column);
      });
      const player = parseInt(ship.slice(ship.length - 1));
      let firstTile;
      let lastTile;
      let shipImage;
      if (player === 1) {
        firstTile = player1grid.querySelector(`.${tiles[0]}`);
        lastTile = player1grid.querySelector(`.${tiles[tiles.length - 1]}`);
        shipImage = document.querySelector(`#${ship}`);
      } else {
        firstTile = player2grid.querySelector(`.${tiles[0]}`);
        lastTile = player2grid.querySelector(`.${tiles[tiles.length - 1]}`);
        shipImage = document.querySelector(`#${ship}`);
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
        shipImage.style.left = `${right}px`;
        shipImage.style.width = `${bottom - top}px`;
        shipImage.style.height = `${right - left}px`;
        shipImage.style.backgroundSize = 'cover';
        shipImage.style.transformOrigin = 'top left';
      }
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
