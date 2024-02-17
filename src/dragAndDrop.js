import { mapTileToCoordinates } from './gameUI.js';

const player1Tiles = Array.from(
  document.querySelector('#player1grid').querySelectorAll('.tile')
);
const player2Tiles = Array.from(
  document.querySelector('#player2grid').querySelectorAll('.tile')
);

function findClosestTile(ship, tiles) {
  let minDistance = Infinity;
  let closestTile = null;
  const shipTopLeft = getTopLeft(ship);

  tiles.forEach((tile) => {
    const tileTopLeft = getTopLeft(tile);
    const distance = getDistance(shipTopLeft, tileTopLeft);

    if (distance < minDistance) {
      minDistance = distance;
      closestTile = tile;
    }
  });

  if (minDistance < closestTile.clientWidth) {
    return mapTileToCoordinates(closestTile);
  }
  return null;
}
function getDistance(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}
function getTopLeft(element) {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left,
    y: rect.top,
  };
}

function toggleRotation(ship) {
  ship.classList.toggle('vertical');
  ship.classList.toggle('horizontal');
}

function makeDraggable(ship, controller) {
  let originalX;
  let originalY;
  let initialX;
  let initialY;
  let isDragging = false;

  ship.addEventListener('mousedown', function (e) {
    if (ship.classList.contains('placed')) {
      return;
    }
    isDragging = true;
    initialX = e.clientX;
    initialY = e.clientY;

    originalX = ship.style.left;
    originalY = ship.style.top;

    ship.style.position = 'absolute';
    ship.classList.add('dragging');
  });

  document.addEventListener('mousemove', function (e) {
    if (ship.classList.contains('placed')) {
      return;
    }
    if (isDragging) {
      ship.style.left = `${e.clientX - initialX}px`;
      ship.style.top = `${e.clientY - initialY}px`;

      document.addEventListener('keydown', function (e) {
        if (
          (e.key === 'r' || e.key === 'R') &&
          document.querySelector('.dragging')
        ) {
          const draggingShip = document.querySelector('.dragging');
          toggleRotation(draggingShip);
        }
      });
    }
  });

  document.addEventListener('mouseup', function (e) {
    if (ship.classList.contains('placed')) {
      return;
    }
    if (isDragging) {
      isDragging = false;
      let orientation;
      if (ship.classList.contains('horizontal')) {
        orientation = 'horizontal';
      } else {
        orientation = 'vertical';
      }
      ship.classList.remove('dragging');
      const player = parseInt(ship.id.slice(ship.id.length - 1));
      let grid;
      player === 1 ? (grid = player1Tiles) : (grid = player2Tiles);

      const closestTileCoords = findClosestTile(ship, grid);
      if (!closestTileCoords) {
        ship.style.position = 'static';
        if (ship.classList.contains('horizontal')) {
          ship.classList.toggle('horizontal');
          ship.classList.toggle('vertical');
        }
        ship.style.left = originalX;
        ship.style.top = originalY;
        return;
      }
      const shipPlaced = controller.processPlacement(
        ship.id,
        closestTileCoords[0],
        closestTileCoords[1],
        orientation
      );
      if (!shipPlaced) {
        ship.style.position = 'static';
        if (ship.classList.contains('horizontal')) {
          ship.classList.toggle('horizontal');
          ship.classList.toggle('vertical');
        }
        ship.style.left = originalX;
        ship.style.top = originalY;
      } else {
        ship.classList.add('placed');
      }
    }
  });
}

export default makeDraggable;
