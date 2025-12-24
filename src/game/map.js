import * as ROT from "rot-js";

export function createMap(width, height) {
    const tiles = new Map();

    const digger = new ROT.Map.Digger(width, height);
    digger.create((x, y, value) => {
        tiles.set(`${x},${y}`, {
            walkable: value === 0,
            type: value === 0 ? "floor" : "wall",
        });
    });

    return {
        width,
        height,
        tiles,
        monsters: [], // attach monsters here

        get(keyOrX, y) {
            if (typeof keyOrX === "string") return tiles.get(keyOrX);
            return tiles.get(`${keyOrX},${y}`);
        },

        isWalkable(x, y) {
            const tile = this.get(x, y);
            return tile ? tile.walkable : false;
        },

        getRandomFloorTile() {
            let x, y;
            do {
                x = Math.floor(Math.random() * width);
                y = Math.floor(Math.random() * height);
            } while (!this.isWalkable(x, y));
            return { x, y };
        },
    };
}
