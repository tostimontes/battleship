import createShipObject from './src/shipFactory.js';
import createGameboard from './src/gameboardFactory.js';
import createPlayer from './src/playerFactory.js';
import gameLogic from './src/game.js';
import { mapTileToCoordinates } from './src/gameUI.js';

describe('ship factory', () => {
  let ship;

  beforeEach(() => {
    ship = createShipObject(3);
  });

  it('should correctly record hits on the ship', () => {
    ship.hit();
    expect(ship.timesHit).toBe(1);
    ship.hit();
    expect(ship.timesHit).toBe(2);
  });

  it('should not sink the ship when hits are less than its length', () => {
    ship.hit();
    expect(ship.isSunk()).toBe(false);
  });

  it('should sink the ship when hits are equal to its length', () => {
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });
});

describe('gameboard placeShip method', () => {
  let board;

  beforeEach(() => {
    board = createGameboard();
  });

  it('should not place a ship out of the 10x10 grid horizontally', () => {
    const ship = createShipObject(4, 'destroyer');
    board.placeShip(ship, 0, 7, 'horizontal');
    const isShipOutOfGrid = board.grid.some((row) =>
      row.slice(10).some((cell) => cell === ship.name)
    );
    expect(isShipOutOfGrid).toBe(false);
  });

  it('should not place a ship out of the 10x10 grid vertically', () => {
    const ship = createShipObject(4, 'destroyer');
    board.placeShip(ship, 7, 0, 'vertical');
    const isShipOutOfGrid = board.grid
      .slice(10)
      .some((row) => row.some((cell) => cell === ship.name));
    expect(isShipOutOfGrid).toBe(false);
  });

  it('should not allow placement of a new ship overlapping with other ships or their surrounding tiles horizontally', () => {
    const ship1 = createShipObject(4, 'destroyer');
    board.placeShip(ship1, 5, 5, 'horizontal');
    const ship2 = createShipObject(3, 'submarine');
    const placementAllowed = board.placeShip(ship2, 5, 4, 'horizontal');

    expect(placementAllowed).toBe(null);
  });

  it('should not allow placement of a new ship overlapping with other ships or their surrounding tiles vertically', () => {
    const ship1 = createShipObject(4, 'destroyer');
    board.placeShip(ship1, 5, 5, 'vertical');
    const ship2 = createShipObject(3, 'submarine');
    const placementAllowed = board.placeShip(ship2, 4, 5, 'vertical');

    expect(placementAllowed).toBe(null);
  });

  it('should allow placement of a ship at row 0', () => {
    const ship = createShipObject(3, 'submarine');
    const placementAllowed = board.placeShip(ship, 0, 3, 'horizontal');
    expect(placementAllowed).not.toBeNull();
  });

  it('should allow placement of a ship at row 9', () => {
    const ship = createShipObject(3, 'submarine');
    const placementAllowed = board.placeShip(ship, 9, 3, 'horizontal');
    expect(placementAllowed).not.toBeNull();
  });

  it('should allow placement of a ship at column 0', () => {
    const ship = createShipObject(3, 'submarine');
    const placementAllowed = board.placeShip(ship, 3, 0, 'vertical');
    expect(placementAllowed).not.toBeNull();
  });

  it('should allow placement of a ship at column 9', () => {
    const ship = createShipObject(3, 'submarine');
    const placementAllowed = board.placeShip(ship, 3, 9, 'vertical');
    expect(placementAllowed).not.toBeNull();
  });

  it('should be able to place whole fleet', () => {
    const placeDestroyer = board.placeShip(
      board.fleet.destroyer,
      0,
      0,
      'vertical'
    );
    const placeSubmarine = board.placeShip(
      board.fleet.submarine,
      2,
      3,
      'vertical'
    );
    const placeCruiser = board.placeShip(
      board.fleet.cruiser,
      6,
      0,
      'horizontal'
    );
    const placeBattleship = board.placeShip(
      board.fleet.battleship,
      0,
      9,
      'vertical'
    );
    const placeCarrier = board.placeShip(
      board.fleet.carrier,
      9,
      4,
      'horizontal'
    );
    expect(placeDestroyer).not.toBeNull();
    expect(placeSubmarine).not.toBeNull();
    expect(placeCruiser).not.toBeNull();
    expect(placeBattleship).not.toBeNull();
    expect(placeCarrier).not.toBeNull();
  });
});

describe('gameboard receiveAttack method', () => {
  let board;

  beforeEach(() => {
    board = createGameboard();
    board.placeShip(board.fleet.cruiser, 2, 2, 'horizontal');
  });

  it('should not register a hit when no ship is at the coordinates', () => {
    board.receiveAttack(0, 0);
    expect(board.grid[0][0]).toBe('missed');
  });

  it('should mark the cruiser as hit if the cruiser is at the coordinates', () => {
    board.receiveAttack(2, 3);
    expect(board.fleet.cruiser.timesHit).toBe(1);
  });
});

describe('gameboard anyShipRemains method', () => {
  it('should return true if any ship has not been sunk', () => {
    const board = createGameboard();
    board.placeShip(board.fleet.destroyer, 0, 0, 'horizontal');
    board.receiveAttack(0, 0);
    expect(board.anyShipRemains()).toBe(true);
  });

  it('should return false if all ships have been sunk', () => {
    const board = createGameboard();
    // Mock a fleet with all ships sunk
    board.fleet = {
      destroyer: createShipObject(2, 'destroyer'),
      submarine: createShipObject(3, 'submarine'),
      cruiser: createShipObject(3, 'cruiser'),
      battleship: createShipObject(4, 'battleship'),
      carrier: createShipObject(5, 'carrier'),
    };

    for (const shipName in board.fleet) {
      const ship = board.fleet[shipName];
      ship.timesHit = ship.length;
    }

    expect(board.anyShipRemains()).toBe(false);
  });
});

describe('gameLogic handleAttack method', () => {
  let game;
  let playerOne;
  let playerTwo;

  beforeEach(() => {
    game = gameLogic();
    playerOne = createPlayer('Player 1', 1);
    playerTwo = createPlayer('Player 2', 2);
    game.init(playerOne, playerTwo);
    playerOne.board.placeShip(
      playerOne.board.fleet.cruiser,
      2,
      2,
      'horizontal'
    );
    playerTwo.board.placeShip(
      playerTwo.board.fleet.destroyer,
      5,
      5,
      'vertical'
    );
  });

  it("should register an attack on player 2's board when player 1 attacks", () => {
    const xCoord = 2;
    const yCoord = 3;
    const player = 1;
    const result = game.handleAttack(player, xCoord, yCoord);
    expect(result).toBe('hit');
    expect(playerTwo.board.grid[xCoord][yCoord]).toBe('hit');
  });

  it("should register an attack on player 1's board when player 2 attacks", () => {
    const xCoord = 5;
    const yCoord = 6;
    const player = 2;
    const result = game.handleAttack(player, xCoord, yCoord);
    expect(result).toBe('hit');
    expect(playerOne.board.grid[xCoord][yCoord]).toBe('hit');
  });

  it('should return "miss" when the attack hits an empty coordinate on player 2\'s board', () => {
    const xCoord = 0;
    const yCoord = 0;
    const player = 1;
    const result = game.handleAttack(player, xCoord, yCoord);
    expect(result).toBe('miss');
    expect(playerTwo.board.grid[xCoord][yCoord]).toBe('missed');
  });

  it('should return "miss" when the attack hits an empty coordinate on player 1\'s board', () => {
    const xCoord = 0;
    const yCoord = 0;
    const player = 2;
    const result = game.handleAttack(player, xCoord, yCoord);
    expect(result).toBe('miss');
    expect(playerOne.board.grid[xCoord][yCoord]).toBe('missed');
  });
});

describe('mapTileToCoordinates function', () => {
  it('should correctly map the tile class to grid coordinates', () => {
    const tile = { classList: ['tile', 'a1'] };
    const expectedCoordinates = [0, 0];
    const coordinates = mapTileToCoordinates(tile);

    expect(coordinates).toEqual(expectedCoordinates);
  });
  it('should correctly map the tile class to grid coordinates for a tile not on the border', () => {
    const tile = { classList: ['tile', 'e5'] };
    const expectedCoordinates = [4, 4];
    const coordinates = mapTileToCoordinates(tile);

    expect(coordinates).toEqual(expectedCoordinates);
  });

  it('should correctly map the tile class to grid coordinates for a tile in the bottom row', () => {
    const tile = { classList: ['tile', 'e10'] };
    const expectedCoordinates = [9, 4];
    const coordinates = mapTileToCoordinates(tile);

    expect(coordinates).toEqual(expectedCoordinates);
  });

  it('should correctly map the tile class to grid coordinates for a tile in the top row', () => {
    const tile = { classList: ['tile', 'e1'] };
    const expectedCoordinates = [0, 4];
    const coordinates = mapTileToCoordinates(tile);

    expect(coordinates).toEqual(expectedCoordinates);
  });

  it('should correctly map the tile class to grid coordinates for a tile in the leftmost column', () => {
    const tile = { classList: ['tile', 'a5'] };
    const expectedCoordinates = [4, 0];
    const coordinates = mapTileToCoordinates(tile);

    expect(coordinates).toEqual(expectedCoordinates);
  });

  it('should correctly map the tile class to grid coordinates for a tile in the rightmost column', () => {
    const tile = { classList: ['tile', 'j5'] };
    const expectedCoordinates = [4, 9];
    const coordinates = mapTileToCoordinates(tile);

    expect(coordinates).toEqual(expectedCoordinates);
  });
  it('should correctly map the tile class to grid coordinates for a different tile', () => {
    const tile = { classList: ['tile', 'j10'] };
    const expectedCoordinates = [9, 9];
    const coordinates = mapTileToCoordinates(tile);

    expect(coordinates).toEqual(expectedCoordinates);
  });
});
