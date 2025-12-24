import { stepSound, bumpSound } from "../audio/sounds";
import { monsters } from "./monster";
import { addMessage } from "../ui";
import { startFight, isDead, inFight } from "./fight";

const DIRS = {
    ArrowUp: [0, -1],
    ArrowDown: [0, 1],
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0],
    w: [0, -1],
    s: [0, 1],
    a: [-1, 0],
    d: [1, 0],
};

export function setupInput(player, redraw) {
    window.addEventListener("keydown", (e) => {
        const key = e.key.toLocaleLowerCase();
        const dir = DIRS[key];
        if (isDead) return; // ❌ ignore keys if dead
        if (inFight) return; // ❌ ignore keys while fighting
        if (!dir) return;

        const nx = player.x + dir[0];
        const ny = player.y + dir[1];

        // First, check if there's a monster at the new location
        // check for monster first
        const monster = monsters.find(m => m.alive && m.x === nx && m.y === ny);
        if (monster) {
            startFight(player, monster, redraw);
            return; // stop movement while fight is active
        }

        // If no monster, check if tile is walkable
        if (window.map.isWalkable(nx, ny)) {
            player.x = nx;
            player.y = ny;
            redraw();
            stepSound();
        } else {
            bumpSound();
        }
    });
}
