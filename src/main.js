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

  // 'Player 1, place your ships' (disable p2)
  // Then: if AI random place
  // If p2 'Player 2, place your ships'
  
  // Set up UI event listeners
  view.setUpEventListeners(controller);
  controller.promptShipPlacement();
  // TODO: generate random placement function

  // Prompt player 1 to place ships
  // TODO 4) Random ship placement button + function
  // TODO 5) make AI smart (if hit > check vertical and horizontal)
  // TODO 6) style (pixel title, pixel generated background)

  // ! Link gameboard to coords to place ships
  // ! Calculate ships position and over which tiles it is and then trigger placeShip() with those coords

  // * Position fleets (this should wait for user input)
  // await for fleet to be positioned, then begin game
}

startGame();
