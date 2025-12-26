export function placeItems(type, map) {
    const { x, y } = map.getRandomFloorTile();
    return {
        type,
        x,
        y,
        picked: false,
    };
}

/**
 * Generate items for a given map
 */
export function generateItems(map, count = Math.floor(Math.random() * 2) + 1) {
    const items = [];
    const types = ["potion"];

    for (let i = 0; i < count; i++) {
        const type = types[i % types.length];
        items.push(placeItems(type, map));
    }

    console.log("Generated items:", items);
    return items;
}
