import { EFieldCellType } from "../types/field-cell-type.enum";
import { TCellCoordinates } from "../types/coordinates.type";
import { TField } from "../types/field.type";

export const emptyCoordinates = (field: EFieldCellType[][]) => {
  return specifiedCoordinates(field, EFieldCellType.Empty);
};

export const injuredCoordinates = (field: EFieldCellType[][]) => {
  return specifiedCoordinates(field, EFieldCellType.Injured);
};

export const emptyEvenCoordinates = (field: EFieldCellType[][]) => {
  const result = [];

  for (let i = 0; i < 10; i += 2) {
    for (let j = 0; j < 10; j += 2) {
      if (field[i][j] === EFieldCellType.Empty) result.push({ i: i, j: j });
    }
  }

  return result;
};

export const specifiedCoordinates = (
  field: EFieldCellType[][],
  cellType: EFieldCellType
) => {
  const result = [];

  for (let i = 0; i < 10; ++i) {
    for (let j = 0; j < 10; ++j) {
      if (field[i][j] === cellType) result.push({ i: i, j: j });
    }
  }

  return result;
};

export const filterCoordinates = (coordinatesArray: TCellCoordinates[]) => {
  return coordinatesArray.filter(
    (coordinate: TCellCoordinates) =>
      Number(coordinate.i) >= 0 &&
      Number(coordinate.i) <= 9 &&
      Number(coordinate.j) >= 0 &&
      Number(coordinate.j) <= 9
  );
};

export const arrayContainsCoordinate = (
  array: TCellCoordinates[],
  coordinate: TCellCoordinates
) => {
  return (
    array.filter(
      (element) => element.i === coordinate.i && element.j === coordinate.j
    ).length > 0
  );
};

export const isEvenPoint = (point: TCellCoordinates) => {
  return point.i % 2 === 0 && point.j % 2 === 0;
};

export const unavailableCoordinatesForShip = (
  coordinatesArray: TCellCoordinates[]
): TCellCoordinates[] => {
  let result: TCellCoordinates[] = [];

  if (coordinatesArray.length === 0) return result;

  coordinatesArray.forEach((coordinate: TCellCoordinates) => {
    result.push(
      { i: coordinate.i - 1, j: coordinate.j - 1 },
      { i: coordinate.i - 1, j: coordinate.j },
      { i: coordinate.i - 1, j: coordinate.j + 1 },
      { i: coordinate.i, j: coordinate.j - 1 },
      { i: coordinate.i, j: coordinate.j },
      { i: coordinate.i, j: coordinate.j + 1 },
      { i: coordinate.i + 1, j: coordinate.j - 1 },
      { i: coordinate.i + 1, j: coordinate.j },
      { i: coordinate.i + 1, j: coordinate.j + 1 }
    );
  });

  result = filterCoordinates(result);

  return result;
};

export const unnecessaryToShotCoordinatesForPoint = (
  point: TCellCoordinates
) => {
  let result = [];

  result.push(
    { i: point.i - 1, j: point.j - 1 },
    { i: point.i - 1, j: point.j + 1 },
    { i: point.i + 1, j: point.j - 1 },
    { i: point.i + 1, j: point.j + 1 }
  );

  result = filterCoordinates(result);

  return result;
};

export const toBeShotCoordinatesForPoint = (point: TCellCoordinates) => {
  let result = [];

  result.push(
    { i: point.i - 1, j: point.j },
    { i: point.i + 1, j: point.j },
    { i: point.i, j: point.j - 1 },
    { i: point.i, j: point.j + 1 }
  );

  result = filterCoordinates(result);

  return result;
};

export const coordinatesToShot = (
  playerField: TField,
  injuredPoints: TCellCoordinates[]
) => {
  const result = [];

  let possibleCoordinates = [];

  for (let i = 0; i < injuredPoints.length; ++i) {
    const toBeShot = toBeShotCoordinatesForPoint(injuredPoints[i]);

    for (let j = 0; j < toBeShot.length; ++j) {
      possibleCoordinates.push(toBeShot[j]);
    }
  }

  possibleCoordinates = filterCoordinates(possibleCoordinates);

  for (let i = 0; i < possibleCoordinates.length; ++i) {
    if (
      playerField[possibleCoordinates[i].i][possibleCoordinates[i].j] ===
      EFieldCellType.Empty
    )
      result.push(possibleCoordinates[i]);
  }

  return result;
};
