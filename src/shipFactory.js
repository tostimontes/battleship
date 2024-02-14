// Your ‘ships’ will be objects that include their length, the number of times they’ve been hit and whether or not they’ve been sunk.
// REMEMBER you only have to test your object’s public interface. Only methods or properties that are used outside of your ‘ship’ object need unit tests.
// Ships should have a hit() function that increases the number of ‘hits’ in your ship.
// isSunk() should be a function that calculates whether a ship is considered sunk based on its length and the number of hits it has received.
const createShipObject = (length) => {
  function buildShip(number) {
    return {
      length: number,
      hits: 0,
    };
  }

  const vessel = buildShip(length);

  const ship = {
    length: vessel.length,

    timesHit: vessel.hits,

    hit() {
      this.timesHit += 1;
    },

    isSunk() {
      return this.timesHit >= this.length;
    },
  };

  return ship;
};

const carrier = createShipObject(5);
const battleship = createShipObject(4);
const cruiser = createShipObject(3);
const submarine = createShipObject(3);
const destroyer = createShipObject(2);

carrier.hit();
carrier.hit();
carrier.hit();
carrier.hit();
carrier.hit();

console.log(carrier);
console.log(carrier.isSunk());

export const createShipObject;
