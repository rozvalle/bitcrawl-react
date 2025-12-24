// src/game/monster.js

export function createMonster(type, map) {
    const { x, y } = map.getRandomFloorTile();
    return {
        type,
        x,
        y,
        hp: 10,
        maxHp: 10,
        alive: true,
    };
}

/**
 * Generate monsters for a given map
 */
export function generateMonsters(map, count = 5) {
    const monsters = [];
    const types = ["goblin", "slime", "bat"];

    for (let i = 0; i < count; i++) {
        const type = types[i % types.length];
        monsters.push(createMonster(type, map));
    }

    return monsters;
}
