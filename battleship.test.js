import createShipObject from './src/shipFactory.js';
import createGameboard from './src/gameboardFactory.js';

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
    board.receiveAttack(0, 0); // Hit the destroyer but do not sink it
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

    // Set timesHit for each ship equal to their lengths to simulate being sunk
    for (const shipName in board.fleet) {
      const ship = board.fleet[shipName];
      ship.timesHit = ship.length;
    }

    expect(board.anyShipRemains()).toBe(false);
  });
});
