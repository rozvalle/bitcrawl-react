import { stepSound, bumpSound } from "../audio/sounds";

export function setupInput({ player, map, monsters, inFight, isDead, startFight, redraw }) {
  window.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    const dir = {
      arrowup: [0, -1],
      arrowdown: [0, 1],
      arrowleft: [-1, 0],
      arrowright: [1, 0],
      w: [0, -1],
      s: [0, 1],
      a: [-1, 0],
      d: [1, 0]
    }[key];

    if (!dir || isDead.current || inFight.current) return;

    const nx = player.current.x + dir[0];
    const ny = player.current.y + dir[1];

    // Use monsters.current because monsters is a ref
    const monster = monsters.current.find(m => m.alive && m.x === nx && m.y === ny);
    if (monster) {
      startFight(monster);
      return;
    }

    if (map.current.isWalkable(nx, ny)) {
      player.current.x = nx;
      player.current.y = ny;
      redraw();
      stepSound();
    } else {
      bumpSound();
    }
  });
}
