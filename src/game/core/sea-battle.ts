/**
  Contains basic properties of the core
  like player's data, computer's data,
  checks has anyone won the game either
  we have to continue the battle!
*/
import { getRandomInt, sleep } from "./helpers";
import { EFieldCellType } from "../types/field-cell-type.enum";
import { Game } from "../models/game.model";
import { Player } from "../models/player.model";
import {
  coordinatesToShot,
  emptyCoordinates,
  emptyEvenCoordinates,
  injuredCoordinates,
} from "./utils";

const COMPUTER_TURN_TIME: number = 500; // how much milliseconds does it take for computer to make a turn
let seaBattleGameInstance: Game;

/**
  Tells about me
*/
export const helloWorld = () => {
  console.info(
    `
    Hello! My name is Sergey Vakhramov (@vakhramoff).
    This is a Sea Battle game.

    You can play it online at: https://seabattle.vakhramoff.ru/

    This is a bundled version written in TypeScript and built with Webpack.
    
    The source code is available at GitHub: https://github.com/vakhramoff/SeaBattle-Bundled
    `
  );
};

/**
  Making-up our page
*/
export const configureApp = () => {
  const app = document.getElementById("app");
  if (!app) {
    throw new Error("#app tag is not defined in index.html");
  }

  // Configure "app" appearance
  app.className += "centered"; // Center the app on the screen
};

/**
  Shows start screen:
  To continue you've to push the "Start New Game" button
*/
export const showStartScreen = () => {
  const app = document.getElementById("app");
  if (!app) {
    throw new Error("#app tag is not defined in index.html");
  }

  const windowTitle = document.createElement("div");
  const startButton = document.createElement("button");

  app.innerHTML = "";

  windowTitle.className = "gameNameLabel";
  windowTitle.className += " centeredText";
  windowTitle.innerHTML = "Sea Battle &#9875;";

  startButton.textContent = "Start New Game";
  startButton.className += "bigButton";
  startButton.onclick = () => showInputNameScreen();

  app.appendChild(windowTitle);
  app.appendChild(startButton);
};

/**
  Starts new core
*/
const startNewGame = () => {
  if (seaBattleGameInstance !== null) {
    seaBattleGameInstance.newGame();
  }

  showShipsArrangementScreen();
};

/**
  Shows screen where player inputs his name:
  To continue you've to type your name and push the "That's my name!" button
*/
const showInputNameScreen = () => {
  const app = document.getElementById("app");
  if (!app) {
    throw new Error("#app tag is not defined in index.html");
  }

  const nameDiv = document.createElement("div");
  const nameField = document.createElement("input");
  const windowTitle = document.createElement("div");
  const confirmNameButton = document.createElement("button");

  app.innerHTML = "";

  windowTitle.className = "windowTitleLabel";
  windowTitle.className += " centeredText";
  windowTitle.innerHTML = "Who are you? Fill in your name. &#9881;";

  nameField.id = "userName";
  nameField.className = "inputField";
  nameField.className += " centeredText";
  nameField.value = "Vladimir Putin";
  nameField.setAttribute("maxlength", "20");
  nameField.setAttribute("placeholder", "Your name");

  confirmNameButton.textContent = `That's my name!`;
  confirmNameButton.className = "bigButton";
  confirmNameButton.onclick = () => {
    if (validateNameField("userName", "Name")) {
      const name = (document.getElementById("userName") as HTMLInputElement)
        ?.value;
      const player = new Player(String(name));

      if (seaBattleGameInstance === undefined) {
        seaBattleGameInstance = new Game(player.name);
      }

      showShipsArrangementScreen();
    }
  };

  app.appendChild(windowTitle);
  nameDiv.appendChild(nameField);
  app.appendChild(nameDiv);
  app.appendChild(confirmNameButton);
};

/**
  Checks whether input is empty or not
*/
const validateNameField = (fieldName: string, nameForAlert: string) => {
  const fieldText = (document.getElementById(fieldName) as HTMLInputElement)
    ?.value;

  if (fieldText !== "") {
    return true;
  } else {
    alert(nameForAlert + ` shouldn't be empty!`);
    return false;
  }
};

/**
  Shows screen where user generates ships' arrangement:
  To continue you've to push the "Let's go!" button
*/
const showShipsArrangementScreen = () => {
  const app = document.getElementById("app");
  if (!app) {
    throw new Error("#app tag is not defined in index.html");
  }

  const windowTitle = document.createElement("div");
  const fields = document.createElement("div");
  const leftField = document.createElement("div");
  const playerName = document.createElement("div");
  const playerField = document.createElement("table");
  const rightField = document.createElement("div");
  const rearrangeShipsButton = document.createElement("button");

  app.innerHTML = "";

  windowTitle.className = "windowTitleLabel";
  windowTitle.className += " centeredText";
  windowTitle.innerHTML = "Arrange your ships &#128755;"; //&#9752;

  fields.id = "fields";

  leftField.id = "leftField";
  playerName.id = "playerNameLabel";
  playerName.className = "userNameLabel";
  playerName.className += " centeredText";
  playerName.innerHTML = String(seaBattleGameInstance.player.name);
  playerField.id = "playerField";
  playerField.innerHTML = generateFieldTable("player");

  rightField.id = "rightField";
  rightField.innerHTML = "";

  rearrangeShipsButton.textContent = "Rearrange Ships";
  rearrangeShipsButton.className = "smallButton";
  rearrangeShipsButton.onclick = () => {
    seaBattleGameInstance.player.field.generateShipsArrangement();
    seaBattleGameInstance.computer.field.generateShipsArrangement();
    drawCells(true);
  };

  const startGameButton = document.createElement("button");
  startGameButton.textContent = `Let's go!`;
  startGameButton.className = "smallButton";
  startGameButton.onclick = () => {
    showGameScreen();
  };

  app.appendChild(windowTitle);
  leftField.appendChild(playerName);
  leftField.appendChild(playerField);
  fields.appendChild(leftField);
  fields.appendChild(rightField);
  app.appendChild(fields);
  leftField.appendChild(rearrangeShipsButton);
  leftField.appendChild(startGameButton);

  // Generating first arrangement of the ships
  rearrangeShipsButton.onclick(new MouseEvent("RearrangeShipsButtonClick"));
};

/**
  Shows core screen itself:
  the left field is a field with player's ships
  the right field is a field with computer's ships
*/
const showGameScreen = () => {
  const app = document.getElementById("app");
  if (!app) {
    throw new Error("#app tag is not defined in index.html");
  }

  const windowTitle = document.createElement("div");
  const fields = document.createElement("div");
  const leftField = document.createElement("div");
  const playerName = document.createElement("div");
  const playerField = document.createElement("table");
  const rightField = document.createElement("div");
  const computerName = document.createElement("div");
  const computerField = document.createElement("table");
  const gameStatusTitle = document.createElement("div");
  const startButton = document.createElement("button");

  app.innerHTML = "";

  windowTitle.id = "gameTitle";
  windowTitle.className = "windowTitleLabel";
  windowTitle.className += " centeredText";
  windowTitle.innerHTML = "Have a good luck! &#9752;";

  fields.id = "fields";

  leftField.id = "leftField";
  playerName.id = "playerNameLabel";
  playerName.className = "userNameLabel";
  playerName.className += " centeredText";
  playerName.innerHTML = String(seaBattleGameInstance.player.name);
  playerField.id = "playerField";
  playerField.innerHTML = generateFieldTable("player");

  rightField.id = "rightField";
  computerName.id = "computerNameLabel";
  computerName.className = "userNameLabel";
  computerName.className += " centeredText";
  computerName.innerHTML = String(seaBattleGameInstance.computer.name);
  computerField.id = "computerField";
  computerField.innerHTML = generateFieldTable("computer", false);

  gameStatusTitle.id = "gameStatus";
  gameStatusTitle.className = "gameStatusLabel";
  gameStatusTitle.className += " centeredText";
  gameStatusTitle.innerHTML = "Developer's turn! &#128069;";

  startButton.textContent = "Start New Game";
  startButton.className += "smallButton";
  startButton.onclick = () => {
    startNewGame();
    showShipsArrangementScreen();
  };

  app.appendChild(windowTitle);
  leftField.appendChild(playerName);
  leftField.appendChild(playerField);
  rightField.appendChild(computerName);
  rightField.appendChild(computerField);
  fields.appendChild(leftField);
  fields.appendChild(rightField);
  app.appendChild(fields);
  app.appendChild(gameStatusTitle);
  app.appendChild(startButton);

  drawCells();
  assignComputerFieldClickHandlers();
  renderGameStatus();

  if (seaBattleGameInstance.whoTurns === 1) {
    makeArtificialIntelligenceTurn().then();
  }
};

/**
  Fires the cell with ID like "playerID_I_J"
  fireCell("player_1_1") eans that shot is applied to player's field at (1, 1) coordinate
*/
export const fireCell = (cellId: string) => {
  if (
    seaBattleGameInstance.gameIsOver ||
    seaBattleGameInstance.whoTurns === 1
  ) {
    if (seaBattleGameInstance.gameIsOver) {
      drawCells();
      seaBattleGameInstance.player.looseField();
      seaBattleGameInstance.computer.looseField();
      renderWinnerStatus();
    }

    return;
  }

  const values = cellId.split("_");
  const coordinateI = parseInt(values[1], 10);
  const coordinateJ = parseInt(values[2], 10);

  let isEnd;

  let playerId = values[0];
  let isGoodShot = EFieldCellType.Missed;

  if (playerId === "computer") {
    isGoodShot =
      seaBattleGameInstance.computer.attackCell({
        i: coordinateI,
        j: coordinateJ,
      }) || EFieldCellType.Empty;

    document.getElementById(cellId)!.onclick = null;
  }

  isEnd = seaBattleGameInstance.checkEnd();

  if (!isEnd) {
    if (
      isGoodShot !== EFieldCellType.Injured &&
      isGoodShot !== EFieldCellType.Killed
    ) {
      changeTurn();
      makeArtificialIntelligenceTurn().then();
    }
  } else {
    seaBattleGameInstance.player.looseField();
    seaBattleGameInstance.computer.looseField();
    renderWinnerStatus();
  }

  drawCells();
};

/**
  Stupid AI turn
*/
const makeArtificialIntelligenceTurn = async () => {
  if (seaBattleGameInstance.gameIsOver) {
    drawCells();

    return;
  }

  let isGoodShot = EFieldCellType.Missed;

  while (true) {
    await sleep(COMPUTER_TURN_TIME);

    const pointToShot = artificialIntelligenceCalculateBestPointToShot();
    isGoodShot =
      seaBattleGameInstance.player.attackCell(pointToShot) ||
      EFieldCellType.Empty;

    let isEnd = seaBattleGameInstance.checkEnd();

    if (!isEnd) {
      if (
        isGoodShot !== EFieldCellType.Injured &&
        isGoodShot !== EFieldCellType.Killed
      ) {
        drawCells();
        changeTurn();
        break;
      }
    } else {
      seaBattleGameInstance.player.looseField();
      seaBattleGameInstance.computer.looseField();
      renderWinnerStatus();
    }

    drawCells();
  }
};

/**
  Another function which supplies our stupid AI
  with choosing a coordinate where to apply their rockets
*/
const artificialIntelligenceCalculateBestPointToShot = () => {
  const playerField = seaBattleGameInstance.player.shareFieldWithoutAlives();
  const injuredPoints = injuredCoordinates(playerField);
  const emptyEvenPoints = emptyEvenCoordinates(playerField);

  let emptyPoints = emptyCoordinates(playerField);
  let pointsToShot;

  if (emptyEvenPoints.length > 0) emptyPoints = emptyEvenPoints;

  if (injuredPoints.length > 0) {
    pointsToShot = coordinatesToShot(playerField, injuredPoints);
  } else {
    pointsToShot = emptyPoints;
  }

  return pointsToShot[getRandomInt(0, pointsToShot.length - 1)];
};

/**
  Changes who turns now and renders the status label
*/
const changeTurn = () => {
  seaBattleGameInstance.changeTurn();
  renderGameStatus();
};

/**
  Renders the status label (shows who turns)
*/
const renderGameStatus = () => {
  const gameStatusTitle = document.getElementById("gameStatus");

  if (!gameStatusTitle) {
    return;
  }

  let playerName = "";

  switch (seaBattleGameInstance.whoTurns) {
    case 0:
      playerName = seaBattleGameInstance.player.name;
      break;
    case 1:
      playerName = seaBattleGameInstance.computer.name;
      break;
  }

  gameStatusTitle.innerHTML = playerName + "'s turn! &#128163;";
};

/**
  Renders the status label (shows who has won)
*/
const renderWinnerStatus = () => {
  const gameStatusTitle = document.getElementById("gameStatus");

  if (!gameStatusTitle) {
    return;
  }

  gameStatusTitle.innerHTML =
    seaBattleGameInstance.winner + "'s won the game! &#128165;";
};

/**
  Generates HTML to show the field
*/
const generateFieldTable = (fieldId: string, isUserField: boolean = true) => {
  const alphabets = "ABCDEFGHIJ";
  let header = '<th class="hiddenBorder"></th>';

  for (let i = 0, n = alphabets.length; i < n; ++i) {
    header += '<th class="hiddenBorder">' + alphabets.charAt(i) + "</th>";
  }

  let result = "<tr>" + header + "</tr>";
  for (let i = 0; i < 10; i++) {
    result += '<tr><th class="hiddenBorder">' + (i + 1) + "</th>";
    for (let j = 0; j < 10; j++) {
      result +=
        '<th class="cell ' +
        fieldId +
        '" id="' +
        fieldId +
        "_" +
        i +
        "_" +
        j +
        '"></th>';
    }
    result += "</tr>";
  }

  return result;
};

const assignComputerFieldClickHandlers = () => {
  for (let i = 0; i < 10; ++i) {
    for (let j = 0; j < 10; ++j) {
      const cellId = `computer_${i}_${j}`;

      document.getElementById(cellId)!.onclick = () => fireCell(cellId);
    }
  }
};

/**
  Draws the cell at the field with ID like "playerID_I_J"
  drawCell("player_1_1", EFieldCellType.injured) draw an injured cell at (1, 1) coordinate on the player's field

  "EFieldCellType" is described at ../models/Field.js
*/
const drawCell = (fieldId: string, newCellState: EFieldCellType) => {
  const fieldDOM = document.getElementById(fieldId);

  if (!fieldDOM) {
    return;
  }

  switch (newCellState) {
    case EFieldCellType.Empty:
      fieldDOM.innerHTML = "";
      fieldDOM.className = "empty";
      break;

    case EFieldCellType.Missed:
      fieldDOM.innerHTML = "&#9679;";
      fieldDOM.className = "missed";
      break;

    case EFieldCellType.MissedAuto:
      fieldDOM.innerHTML = "&#9728;";
      fieldDOM.className = "missedAuto";
      break;

    case EFieldCellType.Injured:
      fieldDOM.innerHTML = "&#9587;";
      fieldDOM.className = "ship";
      fieldDOM.className += " injured";
      break;

    case EFieldCellType.Killed:
      fieldDOM.innerHTML = "&#9587;";
      fieldDOM.className = "ship";
      fieldDOM.className += " killed";
      break;

    case EFieldCellType.KilledAuto:
      fieldDOM.innerHTML = "&#9587;";
      fieldDOM.className = "ship";
      fieldDOM.className += " killedAuto";
      break;

    case EFieldCellType.Alive:
      fieldDOM.innerHTML = "";
      fieldDOM.className = "ship";
      fieldDOM.className += " alive";
      break;
  }
};

/**
  Draws all cells at once (like updates all the fields)

  onlyPlayer: if true, updates only player's field
*/
const drawCells = (onlyPlayer: boolean = false) => {
  const playerCells = seaBattleGameInstance.player.field.field;
  const computerCells = seaBattleGameInstance.computer.field.field;

  for (let i = 0; i <= 9; ++i) {
    for (let j = 0; j <= 9; ++j) {
      const playerCellType = playerCells[i][j];
      drawCellByCoordinates("player", i, j, playerCellType);

      if (!onlyPlayer) {
        const computerCellType = computerCells[i][j];

        if (computerCellType !== EFieldCellType.Alive) {
          drawCellByCoordinates("computer", i, j, computerCellType);
        }

        if (
          computerCellType === EFieldCellType.Missed ||
          computerCellType === EFieldCellType.MissedAuto
        ) {
          const cellId = `computer_${i}_${j}`;

          document.getElementById(cellId)!.onclick = null;
        }
      }
    }
  }
};

/**
  Draws a cell at specific (i, j) coordinates on the "fieldName" field with "newCellState"
*/
const drawCellByCoordinates = (
  fieldName: string,
  i: number,
  j: number,
  newCellState: EFieldCellType
) => {
  let fieldId = fieldName + "_" + i + "_" + j;

  drawCell(fieldId, newCellState);
};
