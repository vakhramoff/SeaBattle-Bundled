import { Field } from "./field.model";
import { EFieldCellType } from "../types/field-cell-type.enum";
import {
  unavailableCoordinatesForShip,
  unnecessaryToShotCoordinatesForPoint,
} from "../core/utils";
import { EShipState } from "../types/ship-state.enum";
import { TCellCoordinates } from "../types/coordinates.type";

/**
 Represents a simple abstraction of a player of the Sea Battle Game
 */
export class Player {
  public sharedField: Field;
  public name: string;
  public field: Field;

  constructor(playerName: string) {
    this.name = playerName;
    this.field = new Field();
    this.sharedField = new Field();
  }

  shareFieldWithoutAlives() {
    this.sharedField.fillEmpty();

    for (let i = 0; i <= 9; ++i) {
      for (let j = 0; j <= 9; ++j) {
        const valueToBeShared = this.field.field[i][j];

        if (valueToBeShared !== EFieldCellType.Alive)
          this.sharedField.field[i][j] = valueToBeShared;
      }
    }

    return this.sharedField.field;
  }

  isAlive() {
    for (let i = 0; i < this.field.ships.length; i++) {
      if (this.field.ships[i].state !== EShipState.Killed) {
        return true;
      }
    }

    return false;
  }

  /**
    Marks unshot places on the field
  */
  looseField() {
    for (let i = 0; i <= 9; ++i) {
      for (let j = 0; j <= 9; ++j) {
        const cell = this.field.field[i][j];

        if (cell === EFieldCellType.Empty) {
          this.field.field[i][j] = EFieldCellType.MissedAuto;
        }

        if (cell === EFieldCellType.Alive) {
          this.field.field[i][j] = EFieldCellType.KilledAuto;
        }
      }
    }
  }

  /**
    Allows to attack a specific cell at the "point"
  */
  attackCell(point: TCellCoordinates) {
    if (point === undefined) {
      return;
    }

    if (this.field.field[point.i][point.j] !== EFieldCellType.Empty) {
      for (let i = 0; i < this.field.ships.length; i++) {
        if (this.field.ships[i].containsCoordinate(point)) {
          this.field.ships[i].gotShot();

          switch (this.field.ships[i].getState()) {
            case EShipState.Injured:
              const unnecessaryCoordinates = unnecessaryToShotCoordinatesForPoint(
                point
              );

              unnecessaryCoordinates.forEach((coordinate: TCellCoordinates) => {
                if (
                  this.field.field[coordinate.i][coordinate.j] ===
                  EFieldCellType.Empty
                )
                  this.field.field[coordinate.i][coordinate.j] =
                    EFieldCellType.MissedAuto;
              });

              this.field.field[point.i][point.j] = EFieldCellType.Injured;

              break;

            case EShipState.Killed:
              const missed = unavailableCoordinatesForShip(
                this.field.ships[i].coordinates
              );

              missed.forEach((coordinate: TCellCoordinates) => {
                this.field.field[coordinate.i][coordinate.j] =
                  EFieldCellType.Missed;
              });

              this.field.ships[i].coordinates.forEach(
                (coordinate: TCellCoordinates) => {
                  this.field.field[coordinate.i][coordinate.j] =
                    EFieldCellType.Killed;
                }
              );

              break;
          }
        }
      }
    } else {
      this.field.field[point.i][point.j] = EFieldCellType.Missed;
    }

    return this.field.field[point.i][point.j];
  }
}
