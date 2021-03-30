import { EFieldCellType } from "../types/field-cell-type.enum";
import { TField } from "../types/field.type";
import {
  arrayContainsCoordinate,
  emptyCoordinates,
  filterCoordinates,
  unavailableCoordinatesForShip,
} from "../core/utils";
import { TCellCoordinates } from "../types/coordinates.type";
import { Ship } from "./ship.model";
import { getRandomInt } from "../core/helpers";

/**
 Represents Field's abstraction (a sea batlle field)
 */
export class Field {
  field: TField;
  ships: Ship[];

  constructor() {
    this.field = [];
    this.ships = [];

    this.fillEmpty();
  }

  fillEmpty() {
    this.field = new Array(10)
      .fill(EFieldCellType.Empty)
      .map((_) => new Array(10).fill(EFieldCellType.Empty));
  }

  /**
    Arranges ships from longest to shortest
    It's mathematically proved that arrangement exists
    when the field size is 10*10 and there are
    4*1, 3*2, 2*3, 1*4 ships on it!
  */
  generateShipsArrangement() {
    const temporaryField = Array(10)
      .fill(EFieldCellType.Empty)
      .map((_) => Array(10).fill(EFieldCellType.Empty));

    let count = 1;

    this.fillEmpty();

    this.ships = [];

    for (let size = 4; size >= 1; --size) {
      for (let index = 1; index <= count; ++index) {
        const ship = new Ship(size);

        let loop = true;

        while (loop) {
          const emptyPoints = emptyCoordinates(temporaryField);
          const randomPointIndex = getRandomInt(0, emptyPoints.length - 1);
          const randomPoint = emptyPoints[randomPointIndex];

          const x = randomPoint.i;
          const y = randomPoint.j;

          const direction = getRandomInt(1, 4);

          let temporaryCoordinates = [];

          switch (direction) {
            case 1:
              for (let i = x; i < x + ship.size; ++i) {
                let point = { i: i, j: y };
                if (arrayContainsCoordinate(emptyPoints, point))
                  temporaryCoordinates.push(point);
              }
              break;
            case 2:
              for (let i = x; i > x - ship.size; --i) {
                let point = { i: i, j: y };
                if (arrayContainsCoordinate(emptyPoints, point))
                  temporaryCoordinates.push(point);
              }
              break;
            case 3:
              for (let j = y; j < y + ship.size; ++j) {
                let point = { i: x, j: j };
                if (arrayContainsCoordinate(emptyPoints, point))
                  temporaryCoordinates.push(point);
              }
              break;
            case 4:
              for (let j = y; j > y - ship.size; --j) {
                let point = { i: x, j: j };
                if (arrayContainsCoordinate(emptyPoints, point))
                  temporaryCoordinates.push(point);
              }
              break;
          }

          temporaryCoordinates = filterCoordinates(temporaryCoordinates);

          if (temporaryCoordinates.length === ship.size) {
            ship.coordinates = temporaryCoordinates;
            loop = false;
          }
        }

        ship.coordinates.forEach((coordinate: TCellCoordinates) => {
          this.field[coordinate.i][coordinate.j] = EFieldCellType.Alive;
          const takenCoordinates = unavailableCoordinatesForShip(
            ship.coordinates
          );

          takenCoordinates.forEach((takenCoordinate: TCellCoordinates) => {
            temporaryField[takenCoordinate.i][takenCoordinate.j] = 1;
          });
        });

        this.ships.push(ship);
      }
      ++count;
    }

    return this.field;
  }
}
