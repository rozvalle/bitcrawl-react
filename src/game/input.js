import { stepSound, bumpSound } from "../audio/sounds";

const DIRS = {
  arrowup: [0, -1],
  arrowdown: [0, 1],
  arrowleft: [-1, 0],
  arrowright: [1, 0],
  w: [0, -1],
  s: [0, 1],
  a: [-1, 0],
  d: [1, 0],
};

export function setupInput({
  player,
  map,
  monsters,
  inFight,
  isDead,
  startFight,
  redraw,
  inputLocked,
}) {
  const onKeyDown = (e) => {
    const key = e.key.toLowerCase();
    const dir = DIRS[key];

    if (!dir) return;
    if (isDead.current) return;
    if (inFight.current) return;
    if (inputLocked && inputLocked()) return;

    const p = player.current;
    const m = map.current;
    const ms = monsters.current;

    if (!p || !m || !ms) return;

    const nx = p.x + dir[0];
    const ny = p.y + dir[1];

    const monster = ms.find(
      (mon) => mon.alive && mon.x === nx && mon.y === ny
    );

    if (monster) {
      startFight(monster);
      return;
    }

    if (m.isWalkable(nx, ny)) {
      p.x = nx;
      p.y = ny;
      redraw();
      stepSound();
    } else {
      bumpSound();
    }
  };

  window.addEventListener("keydown", onKeyDown);

  // 🔥 VERY IMPORTANT CLEANUP
  return () => {
    window.removeEventListener("keydown", onKeyDown);
  };
}
