// @ts-ignore
import("../src/styles/style.css");

import {
  configureApp,
  helloWorld,
  showStartScreen,
} from "./game/core/sea-battle";

(() => {
  helloWorld();
  configureApp();
  showStartScreen();
})();
