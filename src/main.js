import setController from './controller.js';
import gameLogic from './game.js';
import { setGameUI } from './gameUI.js';
import createPlayer from './playerFactory.js';

async function startGame() {
  const game = gameLogic();
  const view = setGameUI();
  const controller = setController(game, view);

  // Set player mode
  const playerMode = await view.displayModeSelection();

  // Get and Set players
  const player1Name = await view.displayPlayer1Selection();
  let player2Name;
  if (playerMode === 'two') {
    player2Name = await view.displayPlayer2Selection();
  } else {
    player2Name = 'AI';
  }
  const player1 = await createPlayer(player1Name, 1);
  const player2 = await createPlayer(player2Name, 2);

  // Initialize the game with players
  game.init(player1, player2);

  // * Hard code fleet to test all else
  // game.placeShipsForTesting();
  
  // Set up UI event listeners
  
  controller.promptShipPlacement(playerMode);
  
  // make this async or something so that no tiles trigger anything before placement
  view.setUpEventListeners(controller);

  // Prompt player 1 to place ships
  // TODO 4) Random ship placement button + function
  // TODO 5) make AI smart (if hit > check vertical and horizontal)
  // TODO 6) style (pixel title, pixel generated background)

}

startGame();
