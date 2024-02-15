// TODO: generate pixelated animations for water, fire/shipwreck, each ship
import createPlayer from './playerFactory.js';
import './style.css';
// * Implement 3 AI levels, random

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
  };
  return gameUI;
}
const playerModeDialog = document.querySelector('#player-mode-dialog');
const player1Selection = document.querySelector('#player1-name-dialog');
const player2Selection = document.querySelector('#player2-name-dialog');
let playerMode;
let player1;
let player2;
const turn = 1;

// * Player selection on page load
document.addEventListener('DOMContentLoaded', () => {
  // Player creation
  // TODO: add form validation

  playerModeDialog.showModal();
  playerModeDialog.querySelector('button').addEventListener('click', () => {
    if (playerModeDialog.querySelector('input[value="single"]').checked) {
      playerMode = 'single';
    } else {
      playerMode = 'two';
    }
    playerModeDialog.close();
    player1Selection.showModal();
  });

  // Create player 1
  player1Selection.querySelector('button').addEventListener('click', () => {
    const player1Name = player1Selection.querySelector('input').value;
    player1 = createPlayer(player1Name, 1);
    const player1Div = document.querySelector('#player1div');
    player1Div.querySelector('h2').textContent = player1.name;
    const player2tiles = Array.from(
      document.querySelector('#player2grid').querySelectorAll('.tile')
    );
    // Add attack listeners to player 2 board
    player2tiles.forEach((tile) => {
      const gridCoords = mapTileToCoordinates(tile);
      tile.addEventListener('click', () => {
        player1.attack(gridCoords[0], gridCoords[1]);
      });
    });

    player1Selection.close();
    // Create AI if single player
    if (playerMode === 'single') {
      player2 = createPlayer('AI', 2);
    } else {
      player2Selection.showModal();
    }
    // Create player 2 if two players
    if (player2Selection.open) {
      player2Selection.querySelector('button').addEventListener('click', () => {
        const player2Name = player2Selection.querySelector('input').value;
        player2 = createPlayer(player2Name, 2);
        player2Selection.close();
      });
    }
    if (player2) {
      const player2Div = document.querySelector('#player2div');
      player2Div.querySelector('h2').textContent = player2.name;
      const player1tiles = Array.from(
        document.querySelector('#player1grid').querySelectorAll('.tile')
      );
      // Add attack listeners to player 1 board
      player1tiles.forEach((tile) => {
        const gridCoords = mapTileToCoordinates(tile);
        tile.addEventListener('click', () => {
          player2.attack(gridCoords[0], gridCoords[1]);
        });
      });
      document.dispatchEvent(new Event('playersSet'));
    }
  });
});

// * Main loop
document.addEventListener('playersSet', () => {
  function nextTurn(params) {}
});

export default setGameUI;
