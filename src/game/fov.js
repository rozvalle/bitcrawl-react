import * as ROT from "rot-js";

export function computeFOV(player, map) {
    const visible = new Set();

    const fov = new ROT.FOV.PreciseShadowcasting((x, y) => map.isWalkable(x, y));

    fov.compute(player.x, player.y, 10, (x, y, r, visibility) => {
        visible.add(`${x},${y}`);
    });

    return visible;
}
