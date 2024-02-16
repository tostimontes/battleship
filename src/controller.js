import createPlayer from './playerFactory.js';
import gameLogic from './game.js';
import setGameUI from './gameUI.js';

function setController(logic, userInterface) {
  const controller = {
    game: logic,
    view: userInterface,
    handlePlayerAttack(player, xCoord, yCoord) {
      const result = this.game.handleAttack(player, xCoord, yCoord);
      this.view.updateBoard(player, xCoord, yCoord, result);
      this.game.checkWin(player);
      if (this.game.nextTurn() === 1) {
        this.view.promptPlayerToPlay(player);
      }
    },
    setPlayerMode(mode) {
      this.view.displayPlayerSelection(mode);
    },
  };

  return controller;
}

async function startGame() {
  const game = gameLogic();
  const view = setGameUI();
  const controller = setController(game, view);

  // Set player mode
  const playerMode = await view.displayModeSelection();

  // Get and Set players
  const player1Name = await view.displayPlayer1Selection(playerMode);
  let player2Name;
  if (playerMode === 'two') {
    player2Name = await view.displayPlayer2Selection();
  } else {
    player2Name = 'AI';
  }
  const player1 = await createPlayer(player1Name, 1);
  const player2 = await createPlayer(player2Name, 2);
  // * update board with names and fleet to init

  // Initialize the game with players
  game.init(player1, player2);

  // Set up UI event listeners
  view.setupEventListeners(controller);
}

startGame();
