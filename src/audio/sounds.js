import { zzfx } from "./zzfxMicro.js";

// Footstep on stone
export const stepSound = () => {
    zzfx(
        0.3,     // volume
        0.3,     // decay
        120 + Math.random() * 40,  // frequency variation for natural feel
        0,       // type (0 = sine)
        0,       // attack
        0,       // sustain
        0.05,    // release (short footstep)
        0, 0, 0, 0, 0, 0, 0, 0
    );
};

// Wall bump / hit
export const bumpSound = () => {
    zzfx(
        0.4,      // volume
        0.5,      // decay
        80,       // low frequency for thud
        1,        // type = triangle for punchy thud
        0,        // attack
        0,        // sustain
        0.1       // release
    );
};

// UI click (mystic tone)
export const uiSound = () => {
    zzfx(
        0.25,    // volume
        0.6,     // decay
        400,     // higher-pitched click
        2,       // type = sawtooth for sharper click
        0, 0, 0.05
    );
};
