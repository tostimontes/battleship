import './style.css';
// TODO: generate pixelated animations for water, fire/shipwreck, each ship
// * Implement 3 AI levels, random
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

function makeDraggable(ship) {
  let originalX;
  let originalY;
  let initialX;
  let initialY;
  let isDragging = false;

  ship.addEventListener('mousedown', function (e) {
    isDragging = true;
    initialX = e.clientX;
    initialY = e.clientY;

    originalX = ship.style.left;
    originalY = ship.style.top;

    ship.style.position = 'absolute';
  });

  document.addEventListener('mousemove', function (e) {
    if (isDragging) {
      ship.style.left = `${e.clientX - initialX}px`;
      ship.style.top = `${e.clientY - initialY}px`;
    }
  });

  document.addEventListener('mouseup', function (e) {
    if (isDragging) {
      isDragging = false;
      ship.style.position = 'static';
      // Check if the ship is outside the grid and move it back to original position
      // if (/* condition to check if outside the grid */) {
      ship.style.left = originalX;
      ship.style.top = originalY;
      // }
    }
  });
}

function setGameUI() {
  // * querySelector as properties + DOM manipulation as methods
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
  const player1Fleet = document.querySelector('#player1fleet');
  const player2Fleet = document.querySelector('#player2fleet');
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
    promptPlayerToPlay(player, result) {
      if (player === 1) {
        player1Message.textContent = `Player 1, it's your turn`;
        if (!result) {
          player2Message.textContent = `It's player 1's turn`;
        } else if (result.message === 'hit') {
          player2Message.textContent = `You hit a ship!`;
        } else if (result.message === 'missed') {
          player2Message.textContent = `Water...`;
        }
      } else {
        player2Message.textContent = `Player 2, it's your turn`;
        if (result.message === 'hit') {
          player1Message.textContent = `You hit a ship!`;
        } else if (result.message === 'missed') {
          player1Message.textContent = `Water...`;
        }
      }
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
      ships.forEach(makeDraggable);
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

export default setGameUI;
