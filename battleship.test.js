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
