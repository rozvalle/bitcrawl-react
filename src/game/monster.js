export let monsters = [];

export function createMonster(type, map) {
    const { x, y } = map.getRandomFloorTile();
    return {
        type,
        x,
        y,
        hp: 10,
        maxHp: 10,
        alive: true
    };
}

export function generateMonsters(map, count = 5) {
    monsters = [];
    const types = ["goblin", "slime", "bat"];
    for (let i = 0; i < count; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        monsters.push(createMonster(types[i % types.length], map));
    }
}
