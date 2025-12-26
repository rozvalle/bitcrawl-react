export function createPlayer(map) {
    const { x, y } = map.getRandomFloorTile();
    return {
        x,
        y,
        hp: 20,
        maxHp: 20,
        level: 1,
        inventory: [
            { name: "Potion", description: "Restores 10 HP", quantity: 2, type: "potion" },
        ]
    };
}
