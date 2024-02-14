const createShipObject = (length, name) => {
  function buildShip(number, shipName) {
    return {
      name: shipName,
      length: number,
      hits: 0,
    };
  }

  const vessel = buildShip(length, name);

  const ship = {
    name: vessel.name,
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

export default createShipObject;
