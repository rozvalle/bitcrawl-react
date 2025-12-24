import * as ROT from "rot-js";

export function createMap(width, height) {
    const tiles = new Map();

    // Generate dungeon
    const digger = new ROT.Map.Digger(width, height);
    digger.create((x, y, value) => {
        tiles.set(`${x},${y}`, {
            walkable: value === 0,
            type: value === 0 ? "floor" : "wall"
        });
    });

    return {
        width,
        height,
        tiles,

        // Get a tile by coordinates
        get(keyOrX, y) {
            if (typeof keyOrX === "string") {
                return tiles.get(keyOrX);
            }
            const key = `${keyOrX},${y}`;
            return tiles.get(key);
        },

        // Check if tile is walkable
        isWalkable(x, y) {
            const tile = this.get(x, y);
            return tile ? tile.walkable : false;
        },

        // Pick a random floor tile
        getRandomFloorTile() {
            let x, y;
            do {
                x = Math.floor(Math.random() * width);
                y = Math.floor(Math.random() * height);
            } while (!this.isWalkable(x, y));
            return { x, y };
        }
    };
}
