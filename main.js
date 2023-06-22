import Game from "./public/assets/scenes/game.js";
import Preload from "./public/assets/scenes/preloader.js";

// Create a new Phaser config object
const config = {
  type: Phaser.AUTO,
  width: 480,
  height: 240,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 480,
      height: 240,
    },
    max: {
      width: 2400,
      height: 1500,
    },
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 100 },
      debug: true,
    },
  },
  // List of scenes to load
  // Only the first scene will be shown
  // Remember to import the scene before adding it to the list
  scene: [Preload, Game],
  zoom: 2
};

// Create a new Phaser game instance
window.game = new Phaser.Game(config);

