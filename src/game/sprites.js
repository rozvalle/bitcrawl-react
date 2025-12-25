// Import the images using Vite/Webpack
import floorImg from "/sprites/floor1.png";
import wallImg from "/sprites/wall1.png";
import playerImg from "/sprites/player1.png";
import goblinImg from "/sprites/goblin.png";
import slimeImg from "/sprites/slime.png";
import batImg from "/sprites/bat.png";

export const sprites = {
    floor: new Image(),
    wall: new Image(),
    player: new Image(),
    goblin: new Image(),
    slime: new Image(),
    bat: new Image()
};

// Assign the imported URLs to the images
sprites.floor.src = floorImg;
sprites.wall.src = wallImg;
sprites.player.src = playerImg;
sprites.goblin.src = goblinImg;
sprites.slime.src = slimeImg;
sprites.bat.src = batImg;

// Helper to wait for all images to load
export function loadSprites(onReady) {
    const images = Object.values(sprites);
    let loaded = 0;

    images.forEach(img => {
        img.onload = () => {
            loaded++;
            if (loaded === images.length) onReady();
        };
    });
}
