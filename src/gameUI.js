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
  return `${row + 1}${numberToLetter[column]}`;
}

function setGameUI() {
  // * querySelector as properties + DOM manipulation as methods
  const player1Div = document.querySelector('#player1div');
  const player2Div = document.querySelector('#player2div');
  const player1grid = document
    .querySelector('#player1grid')
    .querySelectorAll('.tile');
  const player2grid = document
    .querySelector('#player2grid')
    .querySelectorAll('.tile');
  const playerModeDialog = document.querySelector('#player-mode-dialog');
  const player1Selection = document.querySelector('#player1-name-dialog');
  const player2Selection = document.querySelector('#player2-name-dialog');
  const player1Fleet = document.querySelector('#player1fleet');
  const player2Fleet = document.querySelector('#player2fleet');

  const gameUI = {
    updateBoard(player, xCoord, yCoord, result) {
      if (player === 1) {
        player2grid
          .querySelector(`.${mapCoordinatesToTile(xCoord, yCoord)}`)
          .classList.add(result);
      } else {
        player1grid
          .querySelector(`.${mapCoordinatesToTile(xCoord, yCoord)}`)
          .classList.add(result);
      }
    },
    promptPlayerToPlay(player) {
      if (player === 1) {
        player1message.textContent = `Player 1, it's your turn`;
      } else {
        player2message.textContent = `Player 2, it's your turn`;
      }
    },
    getPlayerMode(mode) {},
    getPlayerName(player, name) {},
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
              } else {
                playerMode = 'two';
              }
              playerModeDialog.close();
              resolve(playerMode);
            });
        });
      });
    },

    displayPlayer1Selection(mode) {
      return new Promise((resolve) => {
        player1Selection.showModal();
        player1Selection
          .querySelector('button')
          .addEventListener('click', () => {
            const player1Name = player1Selection.querySelector('input').value;
            player1Div.querySelector('h2').textContent = player1Name;
            // Add attack listeners to player 2 board

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
            player2Selection.close();
            resolve(player2Name);
          });
      });
    },

    setUpEventListeners() {
      player2tiles.forEach((tile) => {
        const gridCoords = mapTileToCoordinates(tile);
        tile.addEventListener('click', () => {
          player1.attack(gridCoords[0], gridCoords[1]);
        });
      });
      player1tiles.forEach((tile) => {
        const gridCoords = mapTileToCoordinates(tile);
        tile.addEventListener('click', () => {
          player2.attack(gridCoords[0], gridCoords[1]);
        });
      });
    },
  };
  return gameUI;
}
// * Player selection on page load
// Create player 1

// * Main loop
document.addEventListener('playersSet', () => {
  function nextTurn(params) {}
});

export default setGameUI;
