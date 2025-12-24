import { ctx, TILE_SIZE, WIDTH, HEIGHT } from "../main";
import { sprites } from "./sprites";
import { monsters } from "./monster";

export function render(map, player, visible, explored) {
    ctx.clearRect(0, 0, WIDTH * TILE_SIZE, HEIGHT * TILE_SIZE);

    // --------------------
    // Draw tiles
    // --------------------
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            const key = `${x},${y}`;
            const tile = map.get(x, y);
            if (!tile) continue;

            if (visible.has(key)) {
                explored.add(key);
                ctx.globalAlpha = 1;
            } else if (explored.has(key)) {
                ctx.globalAlpha = 0.35;
            } else {
                continue;
            }

            ctx.drawImage(
                tile.type === "wall" ? sprites.wall : sprites.floor,
                x * TILE_SIZE,
                y * TILE_SIZE,
                TILE_SIZE,
                TILE_SIZE
            );

            ctx.globalAlpha = 1;
        }
    }

    // --------------------
    // Draw monsters
    // --------------------
    monsters.forEach(m => {
        const key = `${m.x},${m.y}`;
        if (m.alive && visible.has(key)) {
            ctx.drawImage(
                sprites[m.type],   // must match sprite key
                m.x * TILE_SIZE,
                m.y * TILE_SIZE,
                TILE_SIZE,
                TILE_SIZE
            );
        }
    });

    // --------------------
    // Draw player
    // --------------------
    ctx.drawImage(
        sprites.player,
        player.x * TILE_SIZE,
        player.y * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE
    );
}
