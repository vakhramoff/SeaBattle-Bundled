import { arrayContainsCoordinate } from "../core/utils";
import { EShipState } from "../types/ship-state.enum";
import { TCellCoordinates } from "../types/coordinates.type";

/**
 Represents Ship's abstraction
 */
export class Ship {
  public size: number;
  public state: EShipState;
  private hits: number;
  coordinates: TCellCoordinates[];

  constructor(size: number) {
    this.hits = 0;
    this.state = EShipState.Alive;
    this.size = size;
    this.coordinates = [];
  }

  // Returns ship's state
  getState() {
    switch (true) {
      case this.hits === 0:
        this.state = EShipState.Alive;
        break;
      case this.hits > 0 && this.hits < this.size:
        this.state = EShipState.Injured;
        break;
      case this.hits === this.size:
        this.state = EShipState.Killed;
        break;
    }

    return this.state;
  }

  containsCoordinate(point: TCellCoordinates) {
    return arrayContainsCoordinate(this.coordinates, point);
  }

  // Shot fired
  gotShot() {
    this.hits++;
    this.getState();
  }

  // Tries attack at the specific "point"
  tryAttack(point: TCellCoordinates) {
    if (this.containsCoordinate(point)) {
      this.gotShot();
      return true;
    }
    return false;
  }
}
