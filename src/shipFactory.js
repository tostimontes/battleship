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

export default createShipObject;
