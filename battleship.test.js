import createShipObject from './src/shipFactory';

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

