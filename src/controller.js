import createPlayer from './playerFactory.js';
import gameLogic from './game.js';
import setGameUI from './gameUI.js';

function setController(logic, interface) {
  const controller = {
    game: logic,
    view: interface,
    handlePlayerAttack (player, xCoord, yCoord) {
        const result = this.game.handleAttack(player, xCoord, yCoord);
        this.view.updateBoard(player, xCoord, yCoord, result);
        this.game.checkWin(player);
        this.game.nextTurn();
    }
  };

  return controller;
}

async function startGame() {
  const game = gameLogic();
  const view = setGameUI();
  const controller = setController(game, view);

  const player1 = await createPlayer('Player 1', 1);
  const player2 = await createPlayer('Player 2', 2);

  // Initialize the game with players
  game.init(player1, player2);

  // Set up UI event listeners
  view.setupEventListeners(controller);
}

startGame();
