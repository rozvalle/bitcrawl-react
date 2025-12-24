export function createPlayer(map) {
    const { x, y } = map.getRandomFloorTile();
    return {
        x,
        y,
        hp: 20,
        maxHp: 20
    };
}
