import { zzfx } from "./ZzFX.js";

const rand = (min, max) => min + Math.random() * (max - min);

// 🔊 GLOBAL VOLUME MULTIPLIER
const MASTER_VOL = 1.4; // try 1.2–1.6

// Footstep on stone
export const stepSound = () => {
    zzfx(...[, , 9220, .01, , , , 5, , , , , , 9]);
};

export const bumpSound = () => {
    zzfx(...[, .2, 1e3, .02, , .01, 2, , 18, , 475, .01, .01]);
};

export const uiSound = () => {
    zzfx(...[2, .8, 999, , , , , 1.5, , .3, -99, .1, 1.63, , , .11, .22]);
};

export const attackSound = () => {
    zzfx(...[, , 528, .01, , .48, , .6, -11.6, , , , .32, 4.2]);
};

export const monsterHitSound = () => {
    zzfx(...[, , 528, .01, , .48, , .6, -11.6, , , , .32, 4.2]);
};

export const monsterDeathSound = () => {
    zzfx(...[, , 333, .01, 0, .9, 4, 1.9, , , , , , .5, , .6]);
};

export const deathSound = () => {
    zzfx(...[, , 333, .01, 0, .9, 4, 1.9, , , , , , .5, , .6]);
};

export const gameOverSound = () => {
    zzfx(...[, , 925, .04, .3, .6, 1, .3, , 6.27, -184, .09, .17])
};
